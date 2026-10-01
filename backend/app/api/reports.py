from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, Dict, Any
from app.schemas.reports import ReportRequest
from app.services.report_service import ReportService
from app.core.security import get_current_user_payload

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/{report_type}")
def get_report_by_type(report_type: str):
    valid_types = [
        "COAL_QUALITY", "PREDICTION", "LABORATORY", 
        "BLEND_OPTIMIZATION", "MODEL_PERFORMANCE", "SCENARIO"
    ]
    u_type = report_type.upper()
    if u_type not in valid_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid report type '{report_type}'. Valid types: {valid_types}"
        )
    return ReportService.generate_report(u_type)

@router.post("/generate")
def generate_custom_report(request: ReportRequest):
    return ReportService.generate_report(request.report_type.upper(), request.model_dump())
