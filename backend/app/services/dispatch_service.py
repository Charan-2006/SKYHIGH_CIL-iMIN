import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.db.mongodb import get_dispatch_recommendations_col
from app.optimization.dispatch_optimizer import DispatchOptimizer
from app.utils.helpers import log_audit

class DispatchService:
    @staticmethod
    def get_recommendation(data: Dict[str, Any], user_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        result = DispatchOptimizer.recommend_dispatch(
            customer_name=data.get("customer_name", "Thermal Power Complex"),
            target_grade=data.get("target_grade", "G8"),
            min_gcv=float(data.get("min_gcv", 4800.0)),
            max_ash=float(data.get("max_ash", 30.0)),
            required_quantity=float(data.get("required_quantity", 5000.0)),
            application_type=data.get("application_type", "THERMAL_UTILITY"),
            max_budget_per_ton=data.get("max_budget_per_ton")
        )

        col = get_dispatch_recommendations_col()
        col.insert_one(result.copy())

        user_id = user_payload.get("sub", "system") if user_payload else "system"
        username = user_payload.get("username", "logistics") if user_payload else "logistics"
        log_audit(
            user_id=user_id,
            username=username,
            action="DISPATCH_RECOMMENDED",
            resource_id=result["recommendation_id"],
            metadata={"customer": result["customer_name"], "source": result["recommended_source"]}
        )

        result["id"] = result["recommendation_id"]
        result.pop("_id", None)
        return result

    @staticmethod
    def list_recommendations(limit: int = 30) -> List[Dict[str, Any]]:
        col = get_dispatch_recommendations_col()
        docs = list(col.find().sort("created_at", -1).limit(limit))
        for d in docs:
            d["id"] = d.get("recommendation_id", str(d["_id"]))
            d.pop("_id", None)
        return docs
