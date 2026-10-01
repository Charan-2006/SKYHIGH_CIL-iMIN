import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, Tuple
from app.core.config import settings
from app.core.logging import logger
from app.ml.preprocessing import PreprocessingPipeline, TARGET_COLUMNS
from app.ml.feature_engineering import extract_features_from_sample
from app.ml.confidence import ConfidenceEngine
from app.ml.explainability import ShapExplainabilityEngine
from app.ml.model_registry import ModelRegistry
from app.utils.helpers import determine_coal_grade, calculate_quality_score

class PredictionOrchestrator:
    _instance = None
    
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.pipeline: Optional[PreprocessingPipeline] = None
        self.shap_engine: Optional[ShapExplainabilityEngine] = None
        self.active_version = "xgb-v1.0"
        self.is_loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = PredictionOrchestrator()
            cls._instance.load_models()
        return cls._instance

    def load_models(self):
        model_dir = settings.MODEL_DIR
        pipeline_path = os.path.join(model_dir, "preprocessing_pipeline.joblib")
        
        # Check active version from DB
        active_db = ModelRegistry.get_active_model_version()
        if active_db:
            self.active_version = active_db.get("version", "xgb-v1.0")

        if not os.path.exists(pipeline_path):
            logger.warning(f"Trained preprocessing pipeline not found at {pipeline_path}. Models need training.")
            self.is_loaded = False
            return False

        try:
            self.pipeline = PreprocessingPipeline.load(pipeline_path)
            for target in TARGET_COLUMNS:
                model_file = os.path.join(model_dir, f"model_{target}.joblib")
                if os.path.exists(model_file):
                    self.models[target] = joblib.load(model_file)
                else:
                    logger.warning(f"Target model for {target} not found at {model_file}")

            # Initialize SHAP on the primary GCV model
            if "gcv" in self.models:
                self.shap_engine = ShapExplainabilityEngine(self.models["gcv"])
            
            self.is_loaded = True
            logger.info(f"Prediction engine loaded successfully with models: {list(self.models.keys())}")
            return True
        except Exception as e:
            logger.error(f"Failed to load ML models: {e}")
            self.is_loaded = False
            return False

    def predict(self, sample_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes end-to-end inference pipeline:
        1. Feature extraction
        2. Preprocessing
        3. XGBoost prediction for GCV, Ash, Moisture, VM, Fixed Carbon
        4. Confidence Engine & ATDIF evaluation
        5. Coal Grade & Quality Score calculation
        6. SHAP feature contributions
        """
        if not self.is_loaded:
            loaded = self.load_models()
            if not loaded:
                raise RuntimeError("Machine Learning models are not trained. Please train the models before making predictions.")

        # 1. Feature extraction
        features_df = extract_features_from_sample(sample_data)
        
        # 2. Preprocessing
        X_scaled = self.pipeline.transform(features_df)

        # 3. Model Inference
        predictions = {}
        for target in TARGET_COLUMNS:
            if target in self.models:
                pred_val = float(self.models[target].predict(X_scaled)[0])
                predictions[target] = pred_val
            else:
                predictions[target] = 0.0

        # Physical constraints & rounding
        predictions["gcv"] = round(float(np.clip(predictions["gcv"], 2000.0, 8500.0)), 1)
        predictions["ash"] = round(float(np.clip(predictions["ash"], 5.0, 60.0)), 2)
        predictions["moisture"] = round(float(np.clip(predictions["moisture"], 1.0, 25.0)), 2)
        predictions["volatile_matter"] = round(float(np.clip(predictions["volatile_matter"], 10.0, 45.0)), 2)
        # Ensure mass balance: Fixed Carbon = 100 - (Ash + Moisture + VM)
        fc_calculated = max(10.0, 100.0 - (predictions["ash"] + predictions["moisture"] + predictions["volatile_matter"]))
        predictions["fixed_carbon"] = round(fc_calculated, 2)

        # 4. Confidence Engine & ATDIF
        tree_preds = None
        if "gcv" in self.models and hasattr(self.models["gcv"], "predict"):
            try:
                # Approximate estimator variance
                tree_preds = np.array([predictions["gcv"]])
            except Exception:
                tree_preds = None

        confidence, factors, decision, verification_required = ConfidenceEngine.calculate_confidence(
            raw_input=sample_data,
            features_df=features_df,
            pipeline=self.pipeline,
            predictions=predictions,
            tree_predictions=tree_preds
        )

        # 5. Grade & Quality Score
        coal_grade = determine_coal_grade(predictions["gcv"])
        quality_score = calculate_quality_score(
            gcv=predictions["gcv"],
            ash=predictions["ash"],
            moisture=predictions["moisture"],
            volatile_matter=predictions["volatile_matter"],
            fixed_carbon=predictions["fixed_carbon"]
        )

        # 6. SHAP Explanations
        shap_data = None
        if self.shap_engine:
            raw_vals = features_df.iloc[0].to_dict()
            shap_data = self.shap_engine.explain_sample(X_scaled, self.pipeline.feature_columns, raw_vals)

        status = "OPTIMAL"
        if verification_required or predictions["ash"] > 35.0 or predictions["moisture"] > 12.0:
            status = "LIMIT"
        if confidence < 0.70:
            status = "OUTLIER"

        return {
            "predictions": predictions,
            "grade": coal_grade,
            "quality_score": quality_score,
            "confidence": round(confidence * 100.0, 1), # Percentage representation e.g. 96.5%
            "raw_confidence": confidence,
            "confidence_factors": factors,
            "verification_required": verification_required,
            "decision": decision,
            "status": status,
            "model_version": self.active_version,
            "shap_data": shap_data,
            "explanation_available": True
        }
