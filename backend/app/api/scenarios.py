from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.schemas.scenario import ScenarioSimulateRequest, ScenarioSimulationResponse
from app.services.scenario_service import ScenarioService
from app.core.security import get_current_user_payload, require_roles

router = APIRouter(prefix="/scenarios", tags=["Scenario Simulator"])

@router.post("/simulate", response_model=ScenarioSimulationResponse)
def simulate_scenario(
    request: ScenarioSimulateRequest,
    user_payload: Optional[dict] = Depends(require_roles(["ADMIN", "ENGINEER", "VIEWER"]))
):
    try:
        res = ScenarioService.simulate_scenario(request.model_dump(), user_payload)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@router.get("/history", response_model=List[ScenarioSimulationResponse])
def get_scenario_history(limit: int = 20):
    return ScenarioService.get_history(limit)
