from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class DispatchRequirement(BaseModel):
    customer_name: str
    target_grade: str = "G8"
    min_gcv: float = 4800.0
    max_ash: float = 30.0
    required_quantity: float = 5000.0
    application_type: str = "THERMAL_UTILITY"  # THERMAL_UTILITY, METALLURGICAL_STEEL, CEMENT_KILN
    max_budget_per_ton: Optional[float] = None
    destination_plant: Optional[str] = "NTPC Thermal Super Plant"

class DispatchRecommendationResponse(BaseModel):
    recommendation_id: str
    customer_name: str
    recommended_source: str
    subsidiary: str
    allocated_quantity: float
    matched_gcv: float
    matched_grade: str
    quality_match_score: float  # 0 to 100%
    estimated_cost: float
    cost_per_ton: float
    rationale: str
    priority: str
    boiler_suitability: str
    created_at: datetime
