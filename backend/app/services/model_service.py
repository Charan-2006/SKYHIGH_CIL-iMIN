import os
import joblib
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from app.db.mongodb import (
    get_model_versions_col,
    get_laboratory_results_col,
    get_coal_samples_col
)
from app.core.config import settings
from app.core.logging import logger
from app.ml.preprocessing import PreprocessingPipeline, FEATURE_COLUMNS, TARGET_COLUMNS
from app.ml.evaluation import compute_regression_metrics
from app.ml.model_registry import ModelRegistry
from app.ml.predict import PredictionOrchestrator
from app.utils.helpers import log_audit

class ModelService:
    @staticmethod
    def get_models() -> List[Dict[str, Any]]:
        return ModelRegistry.list_versions()

    @staticmethod
    def get_active_model() -> Optional[Dict[str, Any]]:
        return ModelRegistry.get_active_model_version()

    @staticmethod
    def retrain_models(data: Dict[str, Any], user_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Executes continuous learning pipeline:
        1. Reads synthetic baseline dataset
        2. Ingests verified laboratory results from MongoDB
        3. Preprocesses merged data
        4. Trains candidate XGBoost models
        5. Evaluates candidate metrics (MAE, RMSE, R2)
        6. Compares candidate R2 against active model
        7. Promotes candidate to ACTIVE only if criteria met, otherwise keeps as CANDIDATE.
        """
        logger.info("Initiating continuous learning / retraining workflow...")
        dataset_csv = os.path.join(settings.DATA_DIR, "synthetic", "coal_samples_synthetic.csv")
        
        if not os.path.exists(dataset_csv):
            raise FileNotFoundError("Baseline synthetic training dataset not found. Please run seed script first.")

        df_base = pd.read_csv(dataset_csv)
        initial_samples_count = len(df_base)

        # 1. Fetch verified lab results
        lab_col = get_laboratory_results_col()
        verified_docs = list(lab_col.find({"feedback_registered_for_retraining": True}))
        verified_count = len(verified_docs)

        # Combine verified lab feedback with baseline dataset
        new_rows = []
        sample_col = get_coal_samples_col()
        for doc in verified_docs:
            sample = sample_col.find_one({"sample_id": doc.get("sample_id")}) or {}
            actuals = doc.get("actual_values", {})
            if actuals.get("gcv") and actuals.get("ash"):
                row = {
                    "depth": float(sample.get("depth", 120.0)),
                    "seam_thickness": 6.5,
                    "overburden_thickness": float(sample.get("depth", 120.0)) * 0.75,
                    "geological_strata_density": 2.35,
                    "core_recovery_rate": 93.0,
                    "sandstone_shale_ratio": 1.8,
                    "drilling_rate_index": 28.0,
                    "cutting_resistance_index": 45.0,
                    "spectral_gamma_ray": 78.0,
                    "spectral_resistivity": 145.0,
                    "optical_reflectance": 0.95,
                    "density_bulk": 1.48,
                    "seam_num": 4,
                    "subsidiary_num": 6,
                    "gcv": float(actuals["gcv"]),
                    "ash": float(actuals["ash"]),
                    "moisture": float(actuals["moisture"]),
                    "volatile_matter": float(actuals["volatile_matter"]),
                    "fixed_carbon": float(actuals["fixed_carbon"])
                }
                new_rows.append(row)

        if new_rows:
            df_merged = pd.concat([df_base, pd.DataFrame(new_rows)], ignore_index=True)
            logger.info(f"Incorporated {len(new_rows)} verified laboratory samples into training set.")
        else:
            df_merged = df_base

        total_training_samples = len(df_merged)

        # 2. Train/Test Split
        train_df, test_df = train_test_split(df_merged, test_size=0.2, random_state=42)

        # 3. Fit new preprocessing pipeline
        candidate_version = f"xgb-v{datetime.now().strftime('%m%d.%H%M')}"
        temp_pipeline = PreprocessingPipeline()
        X_train_scaled = temp_pipeline.fit_transform(train_df)
        X_test_scaled = temp_pipeline.transform(test_df)

        candidate_models = {}
        candidate_metrics = {}

        # 4. Train candidate models for each target
        for target in TARGET_COLUMNS:
            y_train = train_df[target].values
            y_test = test_df[target].values

            model = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=5,
                learning_rate=0.08,
                random_state=42,
                n_jobs=-1
            )
            model.fit(X_train_scaled, y_train)
            candidate_models[target] = model

            y_pred = model.predict(X_test_scaled)
            metrics = compute_regression_metrics(y_test, y_pred)
            candidate_metrics[target] = metrics

        # 5. Compare candidate against active model
        active_model = ModelRegistry.get_active_model_version()
        prior_active_version = active_model.get("version", "xgb-v1.0") if active_model else "none"
        prior_r2 = float(active_model.get("metrics", {}).get("gcv", {}).get("r2", 0.80)) if active_model else 0.80

        candidate_gcv_r2 = candidate_metrics["gcv"]["r2"]
        min_required_r2 = float(data.get("min_evaluation_r2", 0.85))

        # Promotion gate: must meet minimum R2 and not severely degrade prior active R2
        promoted = (candidate_gcv_r2 >= min_required_r2) and (candidate_gcv_r2 >= (prior_r2 - 0.03))

        model_dir = settings.MODEL_DIR
        os.makedirs(model_dir, exist_ok=True)
        model_paths = {}

        if promoted:
            # Save as active models
            pipeline_save_path = os.path.join(model_dir, "preprocessing_pipeline.joblib")
            temp_pipeline.save(pipeline_save_path)
            for target, model in candidate_models.items():
                m_path = os.path.join(model_dir, f"model_{target}.joblib")
                joblib.dump(model, m_path)
                model_paths[target] = m_path

            status = "ACTIVE"
            summary = (
                f"Candidate model {candidate_version} validated successfully with GCV R²={candidate_gcv_r2:.4f} "
                f"(MAE: {candidate_metrics['gcv']['mae']:.2f} kcal/kg). Promoted to ACTIVE production model."
            )
            # Reload orchestrator
            PredictionOrchestrator.get_instance().load_models()
        else:
            status = "CANDIDATE"
            summary = (
                f"Candidate model {candidate_version} produced GCV R²={candidate_gcv_r2:.4f}, which does not "
                f"surpass active threshold ({min_required_r2}). Stored as CANDIDATE; prior version retained."
            )

        ModelRegistry.register_version(
            version=candidate_version,
            status=status,
            dataset_version=f"ds-synth-v{len(df_merged)}",
            training_samples=total_training_samples,
            verified_samples=verified_count,
            metrics=candidate_metrics,
            model_paths=model_paths,
            preprocessing_path=os.path.join(model_dir, "preprocessing_pipeline.joblib")
        )

        user_id = user_payload.get("sub", "system") if user_payload else "system"
        username = user_payload.get("username", "admin") if user_payload else "admin"
        log_audit(
            user_id=user_id,
            username=username,
            action="MODEL_RETRAINED",
            resource_id=candidate_version,
            metadata={"status": status, "gcv_r2": candidate_gcv_r2, "promoted": promoted}
        )

        return {
            "candidate_version": candidate_version,
            "prior_active_version": prior_active_version,
            "promoted_to_active": promoted,
            "training_samples_count": total_training_samples,
            "verified_samples_incorporated": verified_count,
            "metrics": candidate_metrics,
            "comparison_summary": summary,
            "message": "Continuous learning cycle completed."
        }
