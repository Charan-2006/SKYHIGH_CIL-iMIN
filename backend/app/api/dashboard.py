from fastapi import APIRouter, Depends
from app.schemas.dashboard import DashboardSummaryResponse, DashboardTrendsResponse
from app.services.dashboard_service import DashboardService
from app.core.security import get_current_user_payload
from app.constants.subsidiaries import CIL_SUBSIDIARIES

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary():
    return DashboardService.get_summary()

@router.get("/trends", response_model=DashboardTrendsResponse)
def get_dashboard_trends():
    return DashboardService.get_trends()

@router.get("/subsidiaries")
def get_subsidiaries():
    return CIL_SUBSIDIARIES
