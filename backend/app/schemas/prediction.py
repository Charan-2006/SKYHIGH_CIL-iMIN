from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class PredictionInput(BaseModel):
    sample_code: Optional[str] = None
    mine_id: Optional[str] = None
    mine_name: Optional[str] = "Gevra Mega Project"
    seam: Optional[str] = "Seam-IV"
    depth: float = 120.0
    coalfield: Optional[str] = "Korba"
    state: Optional[str] = "Chhattisgarh"
    geological_features: Optional[Dict[str, Any]] = Field(default_factory=dict)
    production_features: Optional[Dict[str, Any]] = Field(default_factory=dict)
    sensor_features: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    # Optional direct proximate/ultimate values if available from sensor telemetry
    moisture: Optional[float] = None
    ash: Optional[float] = None
    volatile_matter: Optional[float] = None
    fixed_carbon: Optional[float] = None
    sulphur: Optional[float] = None
    carbon: Optional[float] = None
    hydrogen: Optional[float] = None
    nitrogen: Optional[float] = None
    oxygen: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class QualityValues(BaseModel):
    gcv: float = Field(..., description="Gross Calorific Value in kcal/kg")
    ash: float = Field(..., description="Ash content percentage")
    moisture: float = Field(..., description="Moisture percentage")
    volatile_matter: float = Field(..., description="Volatile matter percentage")
    fixed_carbon: float = Field(..., description="Fixed carbon percentage")

class ShapContribution(BaseModel):
    feature: str
    value: float
    impact: str  # 'positive' or 'negative'
    actual_value: Any

class PredictionResponse(BaseModel):
    prediction_id: str
    sample_id: str
    sample_code: str
    mine_name: str
    coalfield: str
    state: str
    predictions: QualityValues
    grade: str
    quality_score: float
    confidence: float
    verification_required: bool
    decision: str  # ATDIF decision: e.g. "HIGH CONFIDENCE: AUTOMATED DISPATCH APPROVED" or "LOW CONFIDENCE: LAB VERIFICATION MANDATORY"
    model_version: str
    explanation_available: bool = True
    shap_values: Optional[List[ShapContribution]] = None
    narrative: Optional[str] = None
    created_at: datetime
    status: str = "OPTIMAL"

class PredictionExplanationResponse(BaseModel):
    prediction_id: str
    sample_id: str
    base_value: float
    predicted_gcv: float
    shap_contributions: List[ShapContribution]
    top_positive_features: List[ShapContribution]
    top_negative_features: List[ShapContribution]
    disclaimer: str = "Model Feature Contributions based on SHAP TreeExplainer. These reflect statistical associations and not causal claims."
    narrative: str
