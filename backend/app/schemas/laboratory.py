from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class VerificationRequestCreate(BaseModel):
    prediction_id: str
    sample_id: str
    reason: Optional[str] = "Confidence below threshold"
    priority: str = "HIGH"

class VerificationRequestResponse(BaseModel):
    request_id: str
    prediction_id: str
    sample_id: str
    sample_code: str
    mine_name: str
    predicted_gcv: float
    predicted_ash: float
    confidence: float
    status: str  # PENDING, IN_PROGRESS, COMPLETED, REJECTED
    reason: str
    priority: str
    created_at: datetime
    completed_at: Optional[datetime] = None

class LabResultSubmit(BaseModel):
    request_id: Optional[str] = None
    prediction_id: Optional[str] = None
    sample_id: str
    actual_gcv: float
    actual_ash: float
    actual_moisture: float
    actual_vm: float
    actual_fixed_carbon: float
    technician_notes: Optional[str] = None
    lab_id: Optional[str] = "Central-Lab-01"

class ErrorMetric(BaseModel):
    parameter: str
    predicted: float
    actual: float
    absolute_error: float
    percentage_error: float

class LabResultResponse(BaseModel):
    result_id: str
    request_id: Optional[str] = None
    prediction_id: Optional[str] = None
    sample_id: str
    sample_code: str
    mine_name: str
    actual_values: Dict[str, float]
    predicted_values: Dict[str, float]
    errors: List[ErrorMetric]
    gcv_absolute_error: float
    gcv_percentage_error: float
    verified_by: str
    feedback_registered_for_retraining: bool
    created_at: datetime
