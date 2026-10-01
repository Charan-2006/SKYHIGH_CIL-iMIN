from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class BlendSource(BaseModel):
    source_id: str
    mine_name: str
    available_quantity: float = Field(..., gt=0, description="Available quantity in metric tons")
    gcv: float = Field(..., gt=0, description="Gross Calorific Value in kcal/kg")
    ash: float = Field(..., ge=0, le=100, description="Ash %")
    moisture: float = Field(..., ge=0, le=100, description="Moisture %")
    volatile_matter: float = Field(..., ge=0, le=100, description="Volatile Matter %")
    cost_per_ton: float = Field(..., gt=0, description="Cost in USD or INR per metric ton")

class BlendOptimizeRequest(BaseModel):
    sources: List[BlendSource]
    target_quantity: float = Field(..., gt=0, description="Target blend quantity in tons")
    target_gcv: float = Field(..., gt=0, description="Target minimum or required GCV")
    max_ash: Optional[float] = Field(None, description="Maximum allowable ash percentage")
    max_moisture: Optional[float] = Field(None, description="Maximum allowable moisture percentage")
    max_cost: Optional[float] = Field(None, description="Budget cap")
    objective: str = "MINIMIZE_COST"  # MINIMIZE_COST, MAXIMIZE_QUALITY, MINIMIZE_DEVIATION

class BlendAllocationItem(BaseModel):
    source_id: str
    mine_name: str
    allocated_quantity: float
    ratio_percentage: float
    gcv: float
    ash: float
    moisture: float
    cost_per_ton: float
    subtotal_cost: float

class BlendOptimizeResponse(BaseModel):
    blend_id: str
    allocations: List[BlendAllocationItem]
    blended_gcv: float
    blended_ash: float
    blended_moisture: float
    blended_vm: float
    total_quantity: float
    total_cost: float
    cost_per_ton: float
    savings: float
    feasibility: bool
    solver_status: str
    solver_time_ms: float
    recommendation_summary: str
    created_at: datetime
