import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from app.ml.preprocessing import PreprocessingPipeline
from app.core.config import settings

class ConfidenceEngine:
    """
    Adaptive Trust Decision Intelligence Framework (ATDIF) Confidence Engine.
    Evaluates real confidence using 5 distinct quantitative criteria:
    1. Distance from training distribution (z-score Euclidean norm from training centroid)
    2. Feature drift & domain boundary checks (out-of-bounds features)
    3. Input completeness & telemetry telemetry density
    4. Prediction consistency (Proximate sum Ash + Moisture + VM + FC close to 100%)
    5. Model tree variance / variance estimate across estimators
    """

    @staticmethod
    def calculate_confidence(
        raw_input: Dict[str, Any],
        features_df: pd.DataFrame,
        pipeline: PreprocessingPipeline,
        predictions: Dict[str, float],
        tree_predictions: np.ndarray = None
    ) -> Tuple[float, Dict[str, Any], str, bool]:
        """
        Calculates composite confidence score [0.0 - 1.0], factors breakdown,
        ATDIF decision string, and verification_required boolean.
        """
        scores = {}
        
        # 1. Distance from Training Distribution (Centroid Z-Score)
        if pipeline and pipeline.is_fitted and pipeline.training_feature_means:
            z_scores = []
            for col in pipeline.feature_columns:
                val = float(features_df[col].iloc[0])
                mean = pipeline.training_feature_means.get(col, val)
                std = pipeline.training_feature_stds.get(col, 1.0)
                z = abs(val - mean) / (std if std > 0 else 1.0)
                z_scores.append(z)
            avg_z = float(np.mean(z_scores))
            # Sigmoid decay: 0 distance -> 1.0, 3 stds distance -> ~0.70, >6 stds -> <0.4
            dist_score = float(np.exp(-0.25 * avg_z))
        else:
            dist_score = 0.90
        scores["distribution_fit"] = round(dist_score, 4)

        # 2. Domain Bounds & Feature Drift Check
        out_of_bounds_count = 0
        if pipeline and pipeline.training_feature_mins:
            for col in pipeline.feature_columns:
                val = float(features_df[col].iloc[0])
                c_min = pipeline.training_feature_mins.get(col, -np.inf)
                c_max = pipeline.training_feature_maxs.get(col, np.inf)
                if val < c_min * 0.8 or val > c_max * 1.2:
                    out_of_bounds_count += 1
        drift_penalty = max(0.0, 1.0 - (out_of_bounds_count * 0.15))
        scores["boundary_compliance"] = round(drift_penalty, 4)

        # 3. Input Completeness
        # Check presence of specific sub-objects (geological, production, sensor)
        geo_keys = len(raw_input.get("geological_features") or {})
        prod_keys = len(raw_input.get("production_features") or {})
        sensor_keys = len(raw_input.get("sensor_features") or {})
        total_keys = geo_keys + prod_keys + sensor_keys
        completeness = min(1.0, 0.70 + (total_keys * 0.05)) if total_keys > 0 else 0.75
        scores["input_completeness"] = round(completeness, 4)

        # 4. Physical Prediction Consistency Check
        # Proximate sum = Ash + Moisture + Volatile Matter + Fixed Carbon should sum to 100% (+- 3%)
        ash = predictions.get("ash", 25.0)
        moist = predictions.get("moisture", 5.0)
        vm = predictions.get("volatile_matter", 25.0)
        fc = predictions.get("fixed_carbon", 45.0)
        prox_sum = ash + moist + vm + fc
        sum_deviation = abs(prox_sum - 100.0)
        if sum_deviation <= 2.0:
            consistency = 1.0
        elif sum_deviation <= 5.0:
            consistency = 0.90
        elif sum_deviation <= 10.0:
            consistency = 0.75
        else:
            consistency = max(0.40, 1.0 - (sum_deviation * 0.04))
        scores["physical_consistency"] = round(consistency, 4)

        # 5. Model Uncertainty (Tree variance if available)
        if tree_predictions is not None and len(tree_predictions) > 1:
            var = float(np.var(tree_predictions))
            model_uncertainty = max(0.5, 1.0 - (var / 50000.0))
        else:
            model_uncertainty = 0.95
        scores["model_uncertainty"] = round(model_uncertainty, 4)

        # Composite Confidence Formula:
        # 30% Distribution Fit + 25% Physical Consistency + 20% Model Uncertainty + 15% Domain Compliance + 10% Completeness
        composite = (
            0.30 * dist_score +
            0.25 * consistency +
            0.20 * model_uncertainty +
            0.15 * drift_penalty +
            0.10 * completeness
        )
        composite_confidence = round(float(np.clip(composite, 0.10, 0.99)), 4)

        # ATDIF Threshold Evaluation
        threshold = settings.CONFIDENCE_THRESHOLD
        verification_required = composite_confidence < threshold

        if composite_confidence >= threshold:
            atdif_decision = "HIGH CONFIDENCE: AUTOMATED DISPATCH APPROVED"
        elif composite_confidence >= 0.75:
            atdif_decision = "MODERATE CONFIDENCE: CONDITIONAL DISPATCH / LAB VERIFICATION RECOMMENDED"
        else:
            atdif_decision = "LOW CONFIDENCE: CRITICAL ANOMALY / LAB VERIFICATION MANDATORY"

        return composite_confidence, scores, atdif_decision, verification_required
