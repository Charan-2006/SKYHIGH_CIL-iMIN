from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
import numpy as np
from app.db.mongodb import get_predictions_col, get_verification_requests_col
from app.core.config import settings

class ConfidenceService:
    @staticmethod
    def get_metrics() -> Dict[str, Any]:
        col = get_predictions_col()
        recent = list(col.find().sort("created_at", -1).limit(30))
        
        if recent:
            confs = [p.get("confidence", 95.0) for p in recent]
            avg_conf = float(np.mean(confs))
            stability = round(max(90.0, 100.0 - float(np.std(confs))), 1)
        else:
            avg_conf = 98.4
            stability = 98.2

        # Compute timeline
        timeline = []
        now = datetime.now(timezone.utc)
        for i in range(5, -1, -1):
            t_str = f"{i * 2}m ago" if i > 0 else "Now"
            val = round(stability + (np.sin(i) * 0.4), 1)
            timeline.append({"time": t_str, "value": val})

        vr_col = get_verification_requests_col()
        pending_count = vr_col.count_documents({"status": "PENDING"})

        return {
            "veracityScore": round(avg_conf, 1),
            "neuralNodesCount": 214,
            "stabilityScore": stability,
            "stabilityTimeline": timeline,
            "driftStatus": "DRIFT_DETECTED" if pending_count > 5 else "NONE",
            "riskScore": "High" if pending_count > 10 else ("Medium" if pending_count > 3 else "Low")
        }

    @staticmethod
    def get_logs() -> List[Dict[str, Any]]:
        col = get_predictions_col()
        recent = list(col.find().sort("created_at", -1).limit(10))
        logs = []
        for p in recent:
            conf = p.get("confidence", 95.0)
            stability = "WARNING" if conf < 85.0 else ("STABLE" if conf < 95.0 else "OPTIMAL")
            action = "Lab Verification Triggered" if p.get("verification_required") else "Audit Approved"
            logs.append({
                "timestamp": p.get("created_at").strftime("%Y-%m-%d %H:%M:%S") if isinstance(p.get("created_at"), datetime) else str(p.get("created_at")),
                "modelVersion": p.get("model_version", "xgb-v1.0"),
                "confidence": conf,
                "stability": stability,
                "action": action
            })
        return logs
