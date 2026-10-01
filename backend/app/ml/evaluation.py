import numpy as np
from typing import Dict, Any
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score, mean_absolute_percentage_error

def compute_regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Computes standard actual evaluation metrics: MAE, RMSE, R2, and MAPE."""
    mae = float(mean_absolute_error(y_true, y_pred))
    try:
        rmse = float(root_mean_squared_error(y_true, y_pred))
    except Exception:
        rmse = float(np.sqrt(np.mean((y_true - y_pred) ** 2)))
        
    r2 = float(r2_score(y_true, y_pred))
    try:
        mape = float(mean_absolute_percentage_error(y_true, y_pred)) * 100.0
    except Exception:
        mape = 0.0

    return {
        "mae": round(mae, 3),
        "rmse": round(rmse, 3),
        "r2": round(r2, 4),
        "mape": round(mape, 2)
    }
