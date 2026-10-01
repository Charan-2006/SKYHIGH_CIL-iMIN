import os
import joblib
import numpy as np
import pandas as pd
from typing import List, Tuple, Dict, Any
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from app.core.config import settings
from app.core.logging import logger

FEATURE_COLUMNS = [
    "depth",
    "seam_thickness",
    "overburden_thickness",
    "geological_strata_density",
    "core_recovery_rate",
    "sandstone_shale_ratio",
    "drilling_rate_index",
    "cutting_resistance_index",
    "spectral_gamma_ray",
    "spectral_resistivity",
    "optical_reflectance",
    "density_bulk",
    "seam_num",
    "subsidiary_num"
]

TARGET_COLUMNS = ["gcv", "ash", "moisture", "volatile_matter", "fixed_carbon"]

class PreprocessingPipeline:
    def __init__(self):
        self.imputer = SimpleImputer(strategy="median")
        self.scaler = StandardScaler()
        self.feature_columns = FEATURE_COLUMNS
        self.is_fitted = False
        self.training_feature_means: Dict[str, float] = {}
        self.training_feature_stds: Dict[str, float] = {}
        self.training_feature_mins: Dict[str, float] = {}
        self.training_feature_maxs: Dict[str, float] = {}

    def fit(self, df: pd.DataFrame):
        X = df[self.feature_columns].copy()
        X_imp = self.imputer.fit_transform(X)
        self.scaler.fit(X_imp)
        self.is_fitted = True
        
        # Save training statistics for confidence calculation & drift detection
        for col in self.feature_columns:
            vals = df[col].dropna()
            self.training_feature_means[col] = float(vals.mean())
            self.training_feature_stds[col] = float(vals.std()) if vals.std() > 0 else 1.0
            self.training_feature_mins[col] = float(vals.min())
            self.training_feature_maxs[col] = float(vals.max())
        
        logger.info(f"Preprocessing pipeline fitted with {len(self.feature_columns)} features.")
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise ValueError("PreprocessingPipeline is not fitted yet.")
        X = df[self.feature_columns].copy()
        X_imp = self.imputer.transform(X)
        return self.scaler.transform(X_imp)

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        self.fit(df)
        return self.transform(df)

    def save(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self, filepath)
        logger.info(f"Preprocessing pipeline saved to {filepath}")

    @classmethod
    def load(cls, filepath: str) -> "PreprocessingPipeline":
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Preprocessing file not found at {filepath}")
        pipeline = joblib.load(filepath)
        return pipeline
