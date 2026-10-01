from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DashboardSummaryResponse(BaseModel):
    total_samples: int
    predictions_generated: int
    high_confidence_predictions: int
    verification_required_predictions: int
    pending_laboratory_verifications: int
    completed_laboratory_verifications: int
    average_gcv: float
    average_ash: float
    average_moisture: float
    active_model_version: str
    active_model_r2_gcv: float
    optimization_runs: int
    successful_blends: int
    stability_score: float
    operational_drift: float
    active_edge_nodes: int
    telemetry_status: str

class MonthlyTrendItem(BaseModel):
    month: str
    gcv: float
    ash: float
    moisture: float

class AccuracyDistributionItem(BaseModel):
    range: str
    count: int

class GradeDistributionItem(BaseModel):
    grade: str
    count: int

class MineComparisonItem(BaseModel):
    mine: str
    avgGcv: float
    avgAsh: float
    avgMoisture: float

class ConfidenceDistributionItem(BaseModel):
    bucket: str
    count: int

class RecentPredictionItem(BaseModel):
    sampleId: str
    mineName: str
    coalfield: str
    state: str
    gcv: float
    ash: float
    grade: str
    confidence: float
    timestamp: str
    status: str
    verification_required: bool

class DashboardTrendsResponse(BaseModel):
    monthly_trends: List[MonthlyTrendItem]
    accuracy_distribution: List[AccuracyDistributionItem]
    grade_distribution: List[GradeDistributionItem]
    mine_comparison: List[MineComparisonItem]
    confidence_distribution: List[ConfidenceDistributionItem]
    recent_predictions: List[RecentPredictionItem]
