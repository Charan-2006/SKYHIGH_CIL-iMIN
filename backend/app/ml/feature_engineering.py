import pandas as pd
import numpy as np
from typing import Dict, Any, List
from app.ml.preprocessing import FEATURE_COLUMNS

SEAM_MAP = {
    "SEAM-I": 1, "SEAM-II": 2, "SEAM-III": 3, "SEAM-IV": 4, 
    "SEAM-V": 5, "SEAM-VI": 6, "SEAM-VII": 7, "SEAM-VIII": 8,
    "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6,
    "BOTTOM": 1, "MIDDLE": 2, "TOP": 3
}

SUBSIDIARY_MAP = {
    "BCCL": 1, "ECL": 2, "CCL": 3, "NCL": 4,
    "WCL": 5, "SECL": 6, "MCL": 7, "NEC": 8,
    "CIL": 3
}

def extract_features_from_sample(sample_data: Dict[str, Any]) -> pd.DataFrame:
    """
    Standardizes input sample dictionary into a 1-row DataFrame matching FEATURE_COLUMNS.
    Extracts nested geological_features, production_features, sensor_features if present.
    """
    geo = sample_data.get("geological_features") or {}
    prod = sample_data.get("production_features") or {}
    sensor = sample_data.get("sensor_features") or {}

    # Decode seam
    raw_seam = str(sample_data.get("seam", "SEAM-IV")).upper()
    seam_num = SEAM_MAP.get(raw_seam, 4)

    # Decode subsidiary/mine
    mine_name = str(sample_data.get("mine_name", "SECL")).upper()
    sub_num = 6 # Default SECL
    for sub, val in SUBSIDIARY_MAP.items():
        if sub in mine_name or sub in str(sample_data.get("coalfield", "")).upper():
            sub_num = val
            break

    depth = float(sample_data.get("depth") if sample_data.get("depth") is not None else 120.0)
    
    # Geological features
    seam_thickness = float(geo.get("seam_thickness") if geo.get("seam_thickness") is not None else 6.5)
    overburden_thickness = float(geo.get("overburden_thickness") if geo.get("overburden_thickness") is not None else depth * 0.75)
    geological_strata_density = float(geo.get("geological_strata_density") if geo.get("geological_strata_density") is not None else 2.35)
    core_recovery_rate = float(geo.get("core_recovery_rate") if geo.get("core_recovery_rate") is not None else 92.5)
    sandstone_shale_ratio = float(geo.get("sandstone_shale_ratio") if geo.get("sandstone_shale_ratio") is not None else 1.8)

    # Production & Drilling features
    drilling_rate_index = float(prod.get("drilling_rate_index") if prod.get("drilling_rate_index") is not None else 28.5)
    cutting_resistance_index = float(prod.get("cutting_resistance_index") if prod.get("cutting_resistance_index") is not None else 45.0)

    # Sensor features
    spectral_gamma_ray = float(sensor.get("spectral_gamma_ray") if sensor.get("spectral_gamma_ray") is not None else 78.0)
    spectral_resistivity = float(sensor.get("spectral_resistivity") if sensor.get("spectral_resistivity") is not None else 145.0)
    optical_reflectance = float(sensor.get("optical_reflectance") if sensor.get("optical_reflectance") is not None else 0.95)
    density_bulk = float(sensor.get("density_bulk") if sensor.get("density_bulk") is not None else 1.48)

    row = {
        "depth": depth,
        "seam_thickness": seam_thickness,
        "overburden_thickness": overburden_thickness,
        "geological_strata_density": geological_strata_density,
        "core_recovery_rate": core_recovery_rate,
        "sandstone_shale_ratio": sandstone_shale_ratio,
        "drilling_rate_index": drilling_rate_index,
        "cutting_resistance_index": cutting_resistance_index,
        "spectral_gamma_ray": spectral_gamma_ray,
        "spectral_resistivity": spectral_resistivity,
        "optical_reflectance": optical_reflectance,
        "density_bulk": density_bulk,
        "seam_num": seam_num,
        "subsidiary_num": sub_num
    }

    return pd.DataFrame([row])[FEATURE_COLUMNS]
