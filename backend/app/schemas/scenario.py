from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.blending import BlendSource

class ScenarioParameters(BaseModel):
    sources: List[BlendSource]
    target_quantity: float
    target_gcv: float
    max_ash: float
    max_moisture: float
    budget: Optional[float] = None

class ScenarioMetric(BaseModel):
    gcv: float
    ash: float
    moisture: float
    volatile_matter: float
    total_cost: float
    cost_per_ton: float
    quality_score: float
    feasibility: bool

class ScenarioDelta(BaseModel):
    gcv_delta: float
    ash_delta: float
    moisture_delta: float
    vm_delta: float
    cost_delta: float
    cost_per_ton_delta: float
    quality_score_delta: float
    feasibility_improved: bool

class ScenarioSimulateRequest(BaseModel):
    scenario_name: str = "Monsoon Low-Ash Compensation"
    baseline: ScenarioParameters
    what_if: ScenarioParameters

class ScenarioSimulationResponse(BaseModel):
    scenario_id: str
    scenario_name: str
    baseline_metrics: ScenarioMetric
    what_if_metrics: ScenarioMetric
    deltas: ScenarioDelta
    summary: str
    strategic_advice: str
    created_at: datetime
