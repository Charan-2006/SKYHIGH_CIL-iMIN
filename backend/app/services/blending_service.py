import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.db.mongodb import get_blend_results_col
from app.optimization.blend_optimizer import BlendOptimizer
from app.utils.helpers import log_audit

class BlendingService:
    @staticmethod
    def optimize_blend(data: Dict[str, Any], user_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        sources = data.get("sources", [])
        target_quantity = float(data.get("target_quantity", 10000.0))
        target_gcv = float(data.get("target_gcv", 5000.0))
        max_ash = float(data["max_ash"]) if data.get("max_ash") is not None else None
        max_moisture = float(data["max_moisture"]) if data.get("max_moisture") is not None else None
        max_cost = float(data["max_cost"]) if data.get("max_cost") is not None else None
        objective = data.get("objective", "MINIMIZE_COST")

        # Run Google OR-Tools GLOP solver
        result = BlendOptimizer.optimize(
            sources=sources,
            target_quantity=target_quantity,
            target_gcv=target_gcv,
            max_ash=max_ash,
            max_moisture=max_moisture,
            max_cost=max_cost,
            objective=objective
        )

        blend_id = f"BLEND-{uuid.uuid4().hex[:8].upper()}"
        result["blend_id"] = blend_id
        result["created_at"] = datetime.now(timezone.utc)
        result["target_gcv"] = target_gcv
        result["objective"] = objective

        # Save to MongoDB
        col = get_blend_results_col()
        col.insert_one(result.copy())

        user_id = user_payload.get("sub", "system") if user_payload else "system"
        username = user_payload.get("username", "engineer") if user_payload else "engineer"
        log_audit(
            user_id=user_id,
            username=username,
            action="BLEND_OPTIMIZATION_RUN",
            resource_id=blend_id,
            metadata={"feasibility": result["feasibility"], "savings": result["savings"]}
        )

        result["id"] = blend_id
        result.pop("_id", None)
        return result

    @staticmethod
    def get_history(limit: int = 30) -> List[Dict[str, Any]]:
        col = get_blend_results_col()
        docs = list(col.find().sort("created_at", -1).limit(limit))
        for d in docs:
            d["id"] = d.get("blend_id", str(d["_id"]))
            d.pop("_id", None)
        return docs
