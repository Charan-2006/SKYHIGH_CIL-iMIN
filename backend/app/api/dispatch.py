from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.schemas.dispatch import DispatchRequirement, DispatchRecommendationResponse
from app.services.dispatch_service import DispatchService
from app.core.security import get_current_user_payload, require_roles

router = APIRouter(prefix="/dispatch", tags=["Dispatch Recommendations"])

@router.post("/recommend", response_model=DispatchRecommendationResponse)
def get_dispatch_recommendation(
    request: DispatchRequirement,
    user_payload: Optional[dict] = Depends(require_roles(["ADMIN", "ENGINEER", "VIEWER"]))
):
    try:
        res = DispatchService.get_recommendation(request.model_dump(), user_payload)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[DispatchRecommendationResponse])
def list_dispatch_recommendations(limit: int = 30):
    return DispatchService.list_recommendations(limit)
