import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.utils.helpers import determine_coal_grade

class DispatchOptimizer:
    """
    Dispatch decision support optimizer.
    Matches customer plant requirements (thermal boiler, steel coking, cement kiln)
    against available mine production and quality parameters.
    """

    @staticmethod
    def recommend_dispatch(
        customer_name: str,
        target_grade: str,
        min_gcv: float,
        max_ash: float,
        required_quantity: float,
        application_type: str = "THERMAL_UTILITY",
        max_budget_per_ton: Optional[float] = None,
        available_sources: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        
        # Standard inventory sources across Coal India subsidiaries
        default_sources = [
            {"name": "Moonidih Underground", "subsidiary": "BCCL", "gcv": 6450, "ash": 12.8, "cost": 84.50, "avail": 18000},
            {"name": "Sonalpur Open Cast", "subsidiary": "ECL", "gcv": 6120, "ash": 14.9, "cost": 72.00, "avail": 25000},
            {"name": "Jayant Mega OCP", "subsidiary": "NCL", "gcv": 5380, "ash": 22.4, "cost": 54.00, "avail": 60000},
            {"name": "Gevra Mega Project", "subsidiary": "SECL", "gcv": 4920, "ash": 28.2, "cost": 42.50, "avail": 85000},
            {"name": "Lakhanpur Open Cast", "subsidiary": "MCL", "gcv": 4720, "ash": 31.6, "cost": 36.80, "avail": 70000},
            {"name": "Padmapur OCP", "subsidiary": "WCL", "gcv": 4550, "ash": 34.0, "cost": 34.20, "avail": 30000}
        ]
        
        sources = available_sources or default_sources
        
        # Filter and score candidates
        best_candidate = None
        best_score = -1.0
        
        for src in sources:
            gcv = src["gcv"]
            ash = src["ash"]
            cost = src["cost"]
            
            # Budget check
            if max_budget_per_ton and cost > max_budget_per_ton:
                continue

            # Quality matching score calculation
            # 1. GCV fit (prefer meeting or exceeding min_gcv with minimal over-specification)
            gcv_diff = gcv - min_gcv
            if gcv_diff >= 0:
                gcv_score = max(0.0, 100.0 - (gcv_diff / 50.0))
            else:
                gcv_score = max(0.0, 100.0 - abs(gcv_diff) * 0.5)

            # 2. Ash limit compliance
            ash_diff = max_ash - ash
            if ash_diff >= 0:
                ash_score = 100.0
            else:
                ash_score = max(0.0, 100.0 - abs(ash_diff) * 5.0)

            # 3. Application suitability
            app_bonus = 0.0
            if application_type == "METALLURGICAL_STEEL" and gcv >= 6200 and ash <= 15.0:
                app_bonus = 20.0
            elif application_type == "THERMAL_UTILITY" and 4500 <= gcv <= 5800:
                app_bonus = 15.0
            elif application_type == "CEMENT_KILN" and gcv >= 4000:
                app_bonus = 10.0

            total_score = (0.50 * gcv_score) + (0.35 * ash_score) + app_bonus
            
            if total_score > best_score:
                best_score = total_score
                best_candidate = src

        if not best_candidate:
            best_candidate = sources[3] # Fallback to SECL Gevra
            best_score = 75.0

        matched_grade = determine_coal_grade(best_candidate["gcv"])
        total_estimated_cost = round(best_candidate["cost"] * required_quantity, 2)

        # Build application and boiler suitability text
        if application_type == "METALLURGICAL_STEEL":
            suitability = "Optimal for coke-oven blends and steel blast furnaces. Low ash coking fraction."
            priority = "CRITICAL HIGH"
        elif application_type == "THERMAL_UTILITY":
            suitability = "Certified for supercritical and pulverized coal power station boilers (NTPC grid standards)."
            priority = "STANDARD UTILITY"
        else:
            suitability = "Recommended for rotary cement kiln firing and localized industrial calcination grids."
            priority = "INDUSTRIAL PRIORITY"

        rationale = (
            f"Consignment allocated from {best_candidate['name']} ({best_candidate['subsidiary']}). "
            f"Achieves {best_candidate['gcv']} kcal/kg (Grade {matched_grade}) with {best_candidate['ash']}% ash content, "
            f"satisfying target constraints with a {round(best_score, 1)}% quality concordance index."
        )

        return {
            "recommendation_id": f"DISP-{uuid.uuid4().hex[:8].upper()}",
            "customer_name": customer_name,
            "recommended_source": best_candidate["name"],
            "subsidiary": best_candidate["subsidiary"],
            "allocated_quantity": required_quantity,
            "matched_gcv": best_candidate["gcv"],
            "matched_grade": matched_grade,
            "quality_match_score": round(min(100.0, best_score), 1),
            "estimated_cost": total_estimated_cost,
            "cost_per_ton": best_candidate["cost"],
            "rationale": rationale,
            "priority": priority,
            "boiler_suitability": suitability,
            "created_at": datetime.now(timezone.utc)
        }
