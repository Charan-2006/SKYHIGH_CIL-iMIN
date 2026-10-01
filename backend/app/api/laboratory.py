from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.schemas.laboratory import (
    VerificationRequestCreate,
    VerificationRequestResponse,
    LabResultSubmit,
    LabResultResponse
)
from app.services.laboratory_service import LaboratoryService
from app.core.security import get_current_user_payload, require_roles

router = APIRouter(prefix="/laboratory", tags=["Laboratory Verification"])

@router.post("/verification", response_model=VerificationRequestResponse)
def create_verification_request(
    request: VerificationRequestCreate,
    user_payload: Optional[dict] = Depends(get_current_user_payload)
):
    try:
        res = LaboratoryService.create_verification_request(request.model_dump(), user_payload)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pending", response_model=List[VerificationRequestResponse])
def get_pending_verifications():
    return LaboratoryService.get_pending_requests()

@router.post("/results", response_model=LabResultResponse)
def submit_lab_results(
    request: LabResultSubmit,
    user_payload: Optional[dict] = Depends(require_roles(["ADMIN", "LAB_TECHNICIAN", "ENGINEER"]))
):
    try:
        res = LaboratoryService.submit_lab_results(request.model_dump(), user_payload)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[LabResultResponse])
def get_verification_history():
    return LaboratoryService.get_history()
