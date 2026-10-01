from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.db.mongodb import (
    get_predictions_col,
    get_laboratory_results_col,
    get_blend_results_col,
    get_scenario_runs_col,
    get_model_versions_col,
    get_coal_samples_col
)
from app.ml.model_registry import ModelRegistry

class ReportService:
    @staticmethod
    def generate_report(report_type: str, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        filters = filters or {}
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        if report_type == "COAL_QUALITY":
            col = get_predictions_col()
            docs = list(col.find().sort("created_at", -1).limit(50))
            for d in docs:
                d["id"] = d.get("prediction_id", str(d["_id"]))
                d.pop("_id", None)
            return {
                "title": "Coal Quality Assessment Executive Report",
                "report_type": report_type,
                "generated_at": now_str,
                "record_count": len(docs),
                "summary": f"Aggregated {len(docs)} quality evaluation records from operational mines.",
                "data": docs
            }

        elif report_type == "PREDICTION":
            col = get_predictions_col()
            docs = list(col.find().sort("created_at", -1).limit(100))
            for d in docs:
                d["id"] = d.get("prediction_id", str(d["_id"]))
                d.pop("_id", None)
            return {
                "title": "Machine Learning Predictive Valuation Audit",
                "report_type": report_type,
                "generated_at": now_str,
                "record_count": len(docs),
                "summary": "Log of XGBoost inferences with ATDIF confidence classifications.",
                "data": docs
            }

        elif report_type == "LABORATORY":
            col = get_laboratory_results_col()
            docs = list(col.find().sort("created_at", -1).limit(50))
            for d in docs:
                d["id"] = d.get("result_id", str(d["_id"]))
                d.pop("_id", None)
            return {
                "title": "Laboratory Verification & Prediction Error Reconciliation",
                "report_type": report_type,
                "generated_at": now_str,
                "record_count": len(docs),
                "summary": "Benchmarking physical laboratory bomb calorimetry against AI predictions.",
                "data": docs
            }

        elif report_type == "BLEND_OPTIMIZATION":
            col = get_blend_results_col()
            docs = list(col.find().sort("created_at", -1).limit(25))
            for d in docs:
                d["id"] = d.get("blend_id", str(d["_id"]))
                d.pop("_id", None)
            return {
                "title": "OR-Tools Coal Blending Optimization Ledger",
                "report_type": report_type,
                "generated_at": now_str,
                "record_count": len(docs),
                "summary": "Mathematical programming allocations for minimal cost and target heating values.",
                "data": docs
            }

        elif report_type == "MODEL_PERFORMANCE":
            models = ModelRegistry.list_versions()
            return {
                "title": "Model Registry & Continuous Learning Performance Benchmark",
                "report_type": report_type,
                "generated_at": now_str,
                "record_count": len(models),
                "summary": "Validation metrics (MAE, RMSE, R²) across production and candidate XGBoost versions.",
                "data": models
            }

        elif report_type == "SCENARIO":
            col = get_scenario_runs_col()
            docs = list(col.find().sort("created_at", -1).limit(20))
            for d in docs:
                d["id"] = d.get("scenario_id", str(d["_id"]))
                d.pop("_id", None)
            return {
                "title": "Strategic What-If Scenario Comparison Report",
                "report_type": report_type,
                "generated_at": now_str,
                "record_count": len(docs),
                "summary": "Comparative differential analysis between baseline parameters and simulated scenarios.",
                "data": docs
            }

        else:
            return {
                "title": "General System Report",
                "report_type": report_type,
                "generated_at": now_str,
                "summary": "No specific report type matched.",
                "data": []
            }
