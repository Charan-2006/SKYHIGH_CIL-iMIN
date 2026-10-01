from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.schemas.blending import BlendOptimizeRequest, BlendOptimizeResponse
from app.services.blending_service import BlendingService
from app.core.security import get_current_user_payload, require_roles

router = APIRouter(prefix="/blending", tags=["Blend Optimization"])

@router.post("/optimize", response_model=BlendOptimizeResponse)
def optimize_coal_blend(
    request: BlendOptimizeRequest,
    user_payload: Optional[dict] = Depends(require_roles(["ADMIN", "ENGINEER", "VIEWER"]))
):
    try:
        res = BlendingService.optimize_blend(request.model_dump(), user_payload)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blend optimization error: {str(e)}")

@router.get("/history", response_model=List[BlendOptimizeResponse])
def get_blend_history(limit: int = 30):
    return BlendingService.get_history(limit)
