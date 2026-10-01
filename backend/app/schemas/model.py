from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class RegressionMetrics(BaseModel):
    mae: float
    rmse: float
    r2: float
    mape: Optional[float] = None

class TargetMetrics(BaseModel):
    gcv: RegressionMetrics
    ash: RegressionMetrics
    moisture: RegressionMetrics
    volatile_matter: RegressionMetrics
    fixed_carbon: Optional[RegressionMetrics] = None

class ModelVersionResponse(BaseModel):
    version: str
    status: str  # ACTIVE, CANDIDATE, RETIRED
    model_type: str = "XGBoost Multi-Target Regressor"
    dataset_version: str
    training_samples: int
    verified_samples: int
    metrics: TargetMetrics
    created_at: datetime
    is_active: bool

class RetrainRequest(BaseModel):
    include_verified_lab_samples: bool = True
    min_evaluation_r2: float = 0.85
    notes: Optional[str] = "Automated continuous learning triggered from verified lab feedback"

class RetrainResponse(BaseModel):
    candidate_version: str
    prior_active_version: str
    promoted_to_active: bool
    training_samples_count: int
    verified_samples_incorporated: int
    metrics: TargetMetrics
    comparison_summary: str
    message: str
