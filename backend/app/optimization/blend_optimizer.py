import time
from typing import Dict, Any, List, Optional
from ortools.linear_solver import pywraplp
from app.core.logging import logger

class BlendOptimizer:
    """
    Industrial Coal Blending Optimizer using Google OR-Tools Linear Solver (GLOP).
    Computes exact cost-optimal or quality-optimal allocation ratios across multiple coal sources.
    """

    @staticmethod
    def optimize(
        sources: List[Dict[str, Any]],
        target_quantity: float,
        target_gcv: float,
        max_ash: Optional[float] = None,
        max_moisture: Optional[float] = None,
        max_cost: Optional[float] = None,
        objective: str = "MINIMIZE_COST"
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        # Initialize Google OR-Tools Linear Solver
        solver = pywraplp.Solver.CreateSolver("GLOP")
        if not solver:
            raise RuntimeError("Google OR-Tools GLOP solver could not be initialized.")

        n_sources = len(sources)
        if n_sources == 0:
            return {
                "feasibility": False,
                "solver_status": "NO_SOURCES_PROVIDED",
                "allocations": [],
                "blended_gcv": 0.0,
                "blended_ash": 0.0,
                "blended_moisture": 0.0,
                "blended_vm": 0.0,
                "total_quantity": 0.0,
                "total_cost": 0.0,
                "cost_per_ton": 0.0,
                "savings": 0.0,
                "solver_time_ms": 0.0,
                "recommendation_summary": "No coal sources supplied to optimization matrix."
            }

        # Decision Variables: x[i] = tons to take from source i
        x = {}
        for i, src in enumerate(sources):
            avail = float(src.get("available_quantity", target_quantity))
            x[i] = solver.NumVar(0.0, avail, f"x_{i}_{src.get('source_id', i)}")

        # Constraint 1: Total blend quantity == target_quantity
        quantity_constraint = solver.RowConstraint(target_quantity, target_quantity, "TotalQuantity")
        for i in range(n_sources):
            quantity_constraint.SetCoefficient(x[i], 1.0)

        # Constraint 2: Blended GCV >= target_gcv (sum(gcv_i * x_i) >= target_gcv * target_quantity)
        gcv_constraint = solver.RowConstraint(target_gcv * target_quantity, solver.infinity(), "MinGCV")
        for i, src in enumerate(sources):
            gcv_constraint.SetCoefficient(x[i], float(src.get("gcv", 0.0)))

        # Constraint 3: Blended Ash <= max_ash (if specified)
        if max_ash is not None and max_ash > 0:
            ash_constraint = solver.RowConstraint(-solver.infinity(), max_ash * target_quantity, "MaxAsh")
            for i, src in enumerate(sources):
                ash_constraint.SetCoefficient(x[i], float(src.get("ash", 0.0)))

        # Constraint 4: Blended Moisture <= max_moisture (if specified)
        if max_moisture is not None and max_moisture > 0:
            moist_constraint = solver.RowConstraint(-solver.infinity(), max_moisture * target_quantity, "MaxMoisture")
            for i, src in enumerate(sources):
                moist_constraint.SetCoefficient(x[i], float(src.get("moisture", 0.0)))

        # Constraint 5: Budget limit (if specified)
        if max_cost is not None and max_cost > 0:
            cost_constraint = solver.RowConstraint(-solver.infinity(), max_cost, "BudgetCap")
            for i, src in enumerate(sources):
                cost_constraint.SetCoefficient(x[i], float(src.get("cost_per_ton", 0.0)))

        # Objective Function Setup
        solver_objective = solver.Objective()
        if objective == "MAXIMIZE_QUALITY":
            for i, src in enumerate(sources):
                solver_objective.SetCoefficient(x[i], float(src.get("gcv", 0.0)))
            solver_objective.SetMaximization()
        else: # Default MINIMIZE_COST
            for i, src in enumerate(sources):
                solver_objective.SetCoefficient(x[i], float(src.get("cost_per_ton", 0.0)))
            solver_objective.SetMinimization()

        # Solve
        status = solver.Solve()
        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        if status == pywraplp.Solver.OPTIMAL or status == pywraplp.Solver.FEASIBLE:
            allocations = []
            total_cost = 0.0
            weighted_gcv_sum = 0.0
            weighted_ash_sum = 0.0
            weighted_moist_sum = 0.0
            weighted_vm_sum = 0.0

            for i, src in enumerate(sources):
                qty = float(x[i].solution_value())
                ratio = round((qty / target_quantity) * 100.0, 2) if target_quantity > 0 else 0.0
                unit_cost = float(src.get("cost_per_ton", 0.0))
                subtotal = qty * unit_cost
                total_cost += subtotal
                
                weighted_gcv_sum += qty * float(src.get("gcv", 0.0))
                weighted_ash_sum += qty * float(src.get("ash", 0.0))
                weighted_moist_sum += qty * float(src.get("moisture", 0.0))
                weighted_vm_sum += qty * float(src.get("volatile_matter", 0.0))

                allocations.append({
                    "source_id": str(src.get("source_id", f"src_{i}")),
                    "mine_name": str(src.get("mine_name", f"Mine {i+1}")),
                    "allocated_quantity": round(qty, 2),
                    "ratio_percentage": ratio,
                    "gcv": float(src.get("gcv", 0.0)),
                    "ash": float(src.get("ash", 0.0)),
                    "moisture": float(src.get("moisture", 0.0)),
                    "cost_per_ton": unit_cost,
                    "subtotal_cost": round(subtotal, 2)
                })

            blended_gcv = round(weighted_gcv_sum / target_quantity, 1)
            blended_ash = round(weighted_ash_sum / target_quantity, 2)
            blended_moisture = round(weighted_moist_sum / target_quantity, 2)
            blended_vm = round(weighted_vm_sum / target_quantity, 2)
            cost_per_ton = round(total_cost / target_quantity, 2)

            # Benchmark savings vs highest quality/highest cost single source
            highest_unit_cost = max([float(s.get("cost_per_ton", cost_per_ton)) for s in sources])
            unoptimized_cost = highest_unit_cost * target_quantity
            savings = round(max(0.0, unoptimized_cost - total_cost), 2)

            summary = (
                f"Optimal blend compiled successfully using Google OR-Tools. "
                f"Delivers {blended_gcv} kcal/kg at ${cost_per_ton}/ton (${savings:,.0f} cost optimization)."
            )

            return {
                "feasibility": True,
                "solver_status": "OPTIMAL" if status == pywraplp.Solver.OPTIMAL else "FEASIBLE",
                "allocations": allocations,
                "blended_gcv": blended_gcv,
                "blended_ash": blended_ash,
                "blended_moisture": blended_moisture,
                "blended_vm": blended_vm,
                "total_quantity": target_quantity,
                "total_cost": round(total_cost, 2),
                "cost_per_ton": cost_per_ton,
                "savings": savings,
                "solver_time_ms": elapsed_ms,
                "recommendation_summary": summary
            }
        else:
            return {
                "feasibility": False,
                "solver_status": "INFEASIBLE",
                "allocations": [],
                "blended_gcv": 0.0,
                "blended_ash": 0.0,
                "blended_moisture": 0.0,
                "blended_vm": 0.0,
                "total_quantity": 0.0,
                "total_cost": 0.0,
                "cost_per_ton": 0.0,
                "savings": 0.0,
                "solver_time_ms": elapsed_ms,
                "recommendation_summary": (
                    "No feasible blend found satisfying the combined GCV, Ash, Moisture, and Budget constraints "
                    "with currently available inventory."
                )
            }
