from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReportRequest(BaseModel):
    report_type: str = "COAL_QUALITY"  # COAL_QUALITY, PREDICTION, LABORATORY, BLEND_OPTIMIZATION, MODEL_PERFORMANCE, SCENARIO
    mine_id: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    format: str = "JSON"  # JSON, PDF

class AuditLogItem(BaseModel):
    id: str
    user_id: str
    username: str
    action: str
    resource_id: Optional[str] = None
    timestamp: datetime
    metadata: Dict[str, Any] = {}
