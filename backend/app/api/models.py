from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from app.schemas.model import ModelVersionResponse, RetrainRequest, RetrainResponse
from app.services.model_service import ModelService
from app.core.security import get_current_user_payload, require_roles

router = APIRouter(prefix="/models", tags=["Model Registry & Continuous Learning"])

@router.get("", response_model=List[Dict[str, Any]])
def list_model_versions():
    return ModelService.get_models()

@router.get("/active", response_model=Dict[str, Any])
def get_active_model_info():
    model = ModelService.get_active_model()
    if not model:
        raise HTTPException(status_code=404, detail="No active model version registered")
    return model

@router.post("/retrain", response_model=RetrainResponse)
def trigger_model_retraining(
    request: RetrainRequest,
    user_payload: Optional[dict] = Depends(require_roles(["ADMIN", "ENGINEER"]))
):
    try:
        res = ModelService.retrain_models(request.model_dump(), user_payload)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining execution error: {str(e)}")
