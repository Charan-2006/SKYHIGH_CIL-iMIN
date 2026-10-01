import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.db.mongodb import get_scenario_runs_col
from app.optimization.blend_optimizer import BlendOptimizer
from app.utils.helpers import calculate_quality_score, log_audit

class ScenarioService:
    @staticmethod
    def simulate_scenario(data: Dict[str, Any], user_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        scenario_name = data.get("scenario_name", "Coal Blend What-If Scenario")
        base_p = data.get("baseline", {})
        what_p = data.get("what_if", {})

        # Run solver for baseline
        base_res = BlendOptimizer.optimize(
            sources=base_p.get("sources", []),
            target_quantity=float(base_p.get("target_quantity", 10000)),
            target_gcv=float(base_p.get("target_gcv", 4800)),
            max_ash=base_p.get("max_ash"),
            max_moisture=base_p.get("max_moisture"),
            max_cost=base_p.get("budget")
        )

        # Run solver for what-if
        what_res = BlendOptimizer.optimize(
            sources=what_p.get("sources", []),
            target_quantity=float(what_p.get("target_quantity", 10000)),
            target_gcv=float(what_p.get("target_gcv", 4800)),
            max_ash=what_p.get("max_ash"),
            max_moisture=what_p.get("max_moisture"),
            max_cost=what_p.get("budget")
        )

        # Quality score calculations
        base_qs = calculate_quality_score(
            gcv=base_res.get("blended_gcv", 0.0),
            ash=base_res.get("blended_ash", 0.0),
            moisture=base_res.get("blended_moisture", 0.0),
            volatile_matter=base_res.get("blended_vm", 0.0),
            fixed_carbon=max(0.0, 100.0 - (base_res.get("blended_ash", 0) + base_res.get("blended_moisture", 0) + base_res.get("blended_vm", 0)))
        )

        what_qs = calculate_quality_score(
            gcv=what_res.get("blended_gcv", 0.0),
            ash=what_res.get("blended_ash", 0.0),
            moisture=what_res.get("blended_moisture", 0.0),
            volatile_matter=what_res.get("blended_vm", 0.0),
            fixed_carbon=max(0.0, 100.0 - (what_res.get("blended_ash", 0) + what_res.get("blended_moisture", 0) + what_res.get("blended_vm", 0)))
        )

        base_metrics = {
            "gcv": base_res.get("blended_gcv", 0.0),
            "ash": base_res.get("blended_ash", 0.0),
            "moisture": base_res.get("blended_moisture", 0.0),
            "volatile_matter": base_res.get("blended_vm", 0.0),
            "total_cost": base_res.get("total_cost", 0.0),
            "cost_per_ton": base_res.get("cost_per_ton", 0.0),
            "quality_score": base_qs,
            "feasibility": base_res.get("feasibility", False)
        }

        what_metrics = {
            "gcv": what_res.get("blended_gcv", 0.0),
            "ash": what_res.get("blended_ash", 0.0),
            "moisture": what_res.get("blended_moisture", 0.0),
            "volatile_matter": what_res.get("blended_vm", 0.0),
            "total_cost": what_res.get("total_cost", 0.0),
            "cost_per_ton": what_res.get("cost_per_ton", 0.0),
            "quality_score": what_qs,
            "feasibility": what_res.get("feasibility", False)
        }

        # Calculate exact differences
        deltas = {
            "gcv_delta": round(what_metrics["gcv"] - base_metrics["gcv"], 1),
            "ash_delta": round(what_metrics["ash"] - base_metrics["ash"], 2),
            "moisture_delta": round(what_metrics["moisture"] - base_metrics["moisture"], 2),
            "vm_delta": round(what_metrics["volatile_matter"] - base_metrics["volatile_matter"], 2),
            "cost_delta": round(what_metrics["total_cost"] - base_metrics["total_cost"], 2),
            "cost_per_ton_delta": round(what_metrics["cost_per_ton"] - base_metrics["cost_per_ton"], 2),
            "quality_score_delta": round(what_qs - base_qs, 2),
            "feasibility_improved": what_metrics["feasibility"] and not base_metrics["feasibility"]
        }

        summary = (
            f"What-If scenario yields {deltas['gcv_delta']:+.1f} kcal/kg in energy content, "
            f"{deltas['ash_delta']:+.2f}% ash differential, and a unit cost variation of "
            f"${deltas['cost_per_ton_delta']:+.2f}/ton."
        )

        advice = (
            "Recommended to adopt What-If parameters: lowers overall cost while sustaining compliance."
            if deltas["cost_delta"] < 0 and deltas["gcv_delta"] >= -50
            else "Caution: What-If adjustments elevate expenditure or reduce calorific value beyond optimal limits."
        )

        scenario_id = f"SCEN-{uuid.uuid4().hex[:8].upper()}"
        doc = {
            "scenario_id": scenario_id,
            "scenario_name": scenario_name,
            "baseline_metrics": base_metrics,
            "what_if_metrics": what_metrics,
            "deltas": deltas,
            "summary": summary,
            "strategic_advice": advice,
            "created_at": datetime.now(timezone.utc)
        }

        col = get_scenario_runs_col()
        col.insert_one(doc.copy())

        user_id = user_payload.get("sub", "system") if user_payload else "system"
        username = user_payload.get("username", "analyst") if user_payload else "analyst"
        log_audit(
            user_id=user_id,
            username=username,
            action="SCENARIO_SIMULATED",
            resource_id=scenario_id,
            metadata={"scenario_name": scenario_name, "cost_delta": deltas["cost_delta"]}
        )

        doc["id"] = scenario_id
        doc.pop("_id", None)
        return doc

    @staticmethod
    def get_history(limit: int = 20) -> List[Dict[str, Any]]:
        col = get_scenario_runs_col()
        docs = list(col.find().sort("created_at", -1).limit(limit))
        for d in docs:
            d["id"] = d.get("scenario_id", str(d["_id"]))
            d.pop("_id", None)
        return docs
