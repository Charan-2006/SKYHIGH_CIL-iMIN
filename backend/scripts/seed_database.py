import os
import sys
import uuid
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.mongodb import (
    db_manager,
    get_users_col,
    get_mines_col,
    get_coal_samples_col,
    get_predictions_col,
    get_verification_requests_col,
    get_laboratory_results_col,
    get_blend_results_col
)
from app.db.indexes import create_mongodb_indexes
from app.constants.subsidiaries import CIL_SUBSIDIARIES
from app.utils.helpers import determine_coal_grade, calculate_quality_score

def seed_database():
    print("=" * 60)
    print("CARBONCORTEX: Seeding MongoDB Database")
    print("=" * 60)

    db_manager.connect()
    create_mongodb_indexes()

    users_col = get_users_col()
    mines_col = get_mines_col()
    samples_col = get_coal_samples_col()
    pred_col = get_predictions_col()
    vr_col = get_verification_requests_col()
    lab_col = get_laboratory_results_col()
    blend_col = get_blend_results_col()

    # 1. Seed Users with four distinct roles
    users = [
        {
            "username": "admin",
            "email": "admin@carboncortex.cil",
            "full_name": "Chief Mining Officer (Admin)",
            "role": "ADMIN",
            "subsidiary": "CIL HQ",
            "password_hash": get_password_hash("admin123"),
            "created_at": datetime.now(timezone.utc)
        },
        {
            "username": "engineer",
            "email": "engineer@carboncortex.cil",
            "full_name": "Senior Coal Preparation Engineer",
            "role": "ENGINEER",
            "subsidiary": "SECL",
            "password_hash": get_password_hash("engineer123"),
            "created_at": datetime.now(timezone.utc)
        },
        {
            "username": "labtech",
            "email": "labtech@carboncortex.cil",
            "full_name": "Central Laboratory Technician",
            "role": "LAB_TECHNICIAN",
            "subsidiary": "BCCL Lab",
            "password_hash": get_password_hash("lab123"),
            "created_at": datetime.now(timezone.utc)
        },
        {
            "username": "viewer",
            "email": "viewer@carboncortex.cil",
            "full_name": "Operational Auditor (Viewer)",
            "role": "VIEWER",
            "subsidiary": "NTPC Liaison",
            "password_hash": get_password_hash("viewer123"),
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for u in users:
        users_col.update_one({"username": u["username"]}, {"$set": u}, upsert=True)
    print(f"Seeded {len(users)} enterprise users (admin, engineer, labtech, viewer).")

    # 2. Seed Mines
    for sub in CIL_SUBSIDIARIES:
        mine_doc = {
            "name": f"{sub['name']} Regional Hub",
            "code": sub["id"],
            "subsidiary": sub["fullName"],
            "coalfield": sub["headquarters"],
            "state": sub["headquarters"].split(",")[-1].strip(),
            "location": {"latitude": sub["latitude"], "longitude": sub["longitude"]},
            "active": True,
            "capacity_mtpa": float(sub["productionCapacity"].replace(" MTPA", ""))
        }
        mines_col.update_one({"code": sub["id"]}, {"$set": mine_doc}, upsert=True)
    print(f"Seeded {len(CIL_SUBSIDIARIES)} Coal India subsidiary mines.")

    # 3. Seed Initial Samples & Predictions
    sample_presets = [
        {"sample_code": "CCX-2026-001", "mine": "Gevra Mega Project", "coalfield": "Korba", "state": "Chhattisgarh", "gcv": 4852.0, "ash": 28.4, "moist": 7.2, "vm": 24.1, "fc": 40.3, "conf": 98.2, "verif": False},
        {"sample_code": "CCX-2026-002", "mine": "Moonidih Underground", "coalfield": "Jharia", "state": "Jharkhand", "gcv": 6420.0, "ash": 12.8, "moist": 1.4, "vm": 28.5, "fc": 57.3, "conf": 97.8, "verif": False},
        {"sample_code": "CCX-2026-003", "mine": "Jayant Open Cast", "coalfield": "Singrauli", "state": "Madhya Pradesh", "gcv": 5120.0, "ash": 24.2, "moist": 5.8, "vm": 26.8, "fc": 43.2, "conf": 96.5, "verif": False},
        {"sample_code": "CCX-2026-004", "mine": "Belpahar OCP", "coalfield": "Ib Valley", "state": "Odisha", "gcv": 3950.0, "ash": 38.5, "moist": 8.5, "vm": 22.0, "fc": 31.0, "conf": 82.4, "verif": True},
        {"sample_code": "CCX-2026-005", "mine": "Rajmahal OCP", "coalfield": "Rajmahal", "state": "Jharkhand", "gcv": 3610.0, "ash": 42.1, "moist": 9.2, "vm": 20.4, "fc": 28.3, "conf": 79.5, "verif": True},
        {"sample_code": "CCX-2026-006", "mine": "Sonalpur Open Cast", "coalfield": "Raniganj", "state": "West Bengal", "gcv": 6180.0, "ash": 14.8, "moist": 3.8, "vm": 34.2, "fc": 47.2, "conf": 98.9, "verif": False}
    ]

    for p in sample_presets:
        sample_id = uuid.uuid4().hex[:12]
        pred_id = f"PRED-{p['sample_code'].split('-')[-1]}"

        # Sample doc
        s_doc = {
            "sample_code": p["sample_code"],
            "mine_name": p["mine"],
            "coalfield": p["coalfield"],
            "state": p["state"],
            "seam": "Seam-IV",
            "depth": 140.0,
            "created_at": datetime.now(timezone.utc) - timedelta(hours=int(p["sample_code"][-1]) * 4)
        }
        samples_col.update_one({"sample_code": p["sample_code"]}, {"$set": s_doc}, upsert=True)

        grade = determine_coal_grade(p["gcv"])
        qs = calculate_quality_score(p["gcv"], p["ash"], p["moist"], p["vm"], p["fc"])

        shap_values = [
            {"feature": "Density Bulk", "value": -140.2, "impact": "negative", "actual_value": "1.48 g/cm³"},
            {"feature": "Optical Reflectance", "value": +185.4, "impact": "positive", "actual_value": "0.95 Ro%"},
            {"feature": "Core Recovery Rate", "value": +62.1, "impact": "positive", "actual_value": "93.0%"},
            {"feature": "Spectral Gamma Ray", "value": -88.5, "impact": "negative", "actual_value": "78 API"}
        ]

        pred_doc = {
            "prediction_id": pred_id,
            "sample_id": sample_id,
            "sample_code": p["sample_code"],
            "mine_name": p["mine"],
            "coalfield": p["coalfield"],
            "state": p["state"],
            "predictions": {
                "gcv": p["gcv"],
                "ash": p["ash"],
                "moisture": p["moist"],
                "volatile_matter": p["vm"],
                "fixed_carbon": p["fc"]
            },
            "grade": grade,
            "quality_score": qs,
            "confidence": p["conf"],
            "verification_required": p["verif"],
            "decision": "HIGH CONFIDENCE: AUTOMATED DISPATCH APPROVED" if not p["verif"] else "LOW CONFIDENCE: LAB VERIFICATION MANDATORY",
            "status": "LIMIT" if p["verif"] else "OPTIMAL",
            "model_version": "xgb-v1.0",
            "explanation_available": True,
            "shap_values": shap_values,
            "narrative": f"Analysis for {p['mine']} shows stable calorific yield with {p['ash']}% ash content.",
            "created_at": s_doc["created_at"]
        }
        pred_col.update_one({"prediction_id": pred_id}, {"$set": pred_doc}, upsert=True)

        # If verification required, seed verification request
        if p["verif"]:
            vr_doc = {
                "request_id": f"VR-{p['sample_code'].split('-')[-1]}",
                "prediction_id": pred_id,
                "sample_id": sample_id,
                "sample_code": p["sample_code"],
                "mine_name": p["mine"],
                "predicted_gcv": p["gcv"],
                "predicted_ash": p["ash"],
                "confidence": p["conf"],
                "status": "PENDING",
                "priority": "HIGH",
                "reason": f"Confidence score ({p['conf']}%) is below enterprise threshold (85.0%). Lab verification required.",
                "created_at": s_doc["created_at"],
                "completed_at": None
            }
            vr_col.update_one({"request_id": vr_doc["request_id"]}, {"$set": vr_doc}, upsert=True)

    print(f"Seeded {len(sample_presets)} historical predictions and pending verification requests.")

    # 4. Seed initial verified lab result
    lab_doc = {
        "result_id": "LAB-001",
        "request_id": "VR-005",
        "prediction_id": "PRED-005",
        "sample_id": "SAMPLE-005",
        "sample_code": "CCX-2026-005",
        "mine_name": "Rajmahal OCP",
        "actual_values": {"gcv": 3650.0, "ash": 41.5, "moisture": 9.0, "volatile_matter": 20.8, "fixed_carbon": 28.7},
        "predicted_values": {"gcv": 3610.0, "ash": 42.1, "moisture": 9.2, "volatile_matter": 20.4, "fixed_carbon": 28.3},
        "errors": [
            {"parameter": "GCV", "predicted": 3610.0, "actual": 3650.0, "absolute_error": 40.0, "percentage_error": 1.10},
            {"parameter": "ASH", "predicted": 42.1, "actual": 41.5, "absolute_error": 0.6, "percentage_error": 1.45}
        ],
        "gcv_absolute_error": 40.0,
        "gcv_percentage_error": 1.10,
        "verified_by": "labtech",
        "technician_notes": "Bomb calorimeter verification performed in triplicate.",
        "lab_id": "Central-Lab-01",
        "feedback_registered_for_retraining": True,
        "created_at": datetime.now(timezone.utc) - timedelta(days=1)
    }
    lab_col.update_one({"result_id": "LAB-001"}, {"$set": lab_doc}, upsert=True)

    # 5. Seed default blend optimization
    blend_doc = {
        "blend_id": "BLEND-DEFAULT-01",
        "feasibility": True,
        "solver_status": "OPTIMAL",
        "allocations": [
            {"source_id": "SRC-1", "mine_name": "Mine A (Superior - Moonidih)", "allocated_quantity": 5625.0, "ratio_percentage": 45.0, "gcv": 6450.0, "ash": 12.8, "moisture": 1.4, "cost_per_ton": 84.50, "subtotal_cost": 475312.5},
            {"source_id": "SRC-2", "mine_name": "Mine B (Mid-Tier - Jayant)", "allocated_quantity": 4375.0, "ratio_percentage": 35.0, "gcv": 5380.0, "ash": 22.4, "moisture": 5.8, "cost_per_ton": 54.00, "subtotal_cost": 236250.0},
            {"source_id": "SRC-3", "mine_name": "Mine C (Utility - Gevra)", "allocated_quantity": 2500.0, "ratio_percentage": 20.0, "gcv": 4920.0, "ash": 28.2, "moisture": 7.2, "cost_per_ton": 42.50, "subtotal_cost": 106250.0}
        ],
        "blended_gcv": 5769.5,
        "blended_ash": 19.24,
        "blended_moisture": 4.1,
        "blended_vm": 26.5,
        "total_quantity": 12500.0,
        "total_cost": 817812.5,
        "cost_per_ton": 65.43,
        "savings": 238437.5,
        "solver_time_ms": 1.85,
        "recommendation_summary": "Optimal blend compiled successfully using Google OR-Tools. Delivers 5769.5 kcal/kg at $65.43/ton.",
        "created_at": datetime.now(timezone.utc) - timedelta(days=2)
    }
    blend_col.update_one({"blend_id": "BLEND-DEFAULT-01"}, {"$set": blend_doc}, upsert=True)

    # 6. Seed active model version in model_versions
    mv_col = db_manager.get_collection("model_versions")
    model_doc = {
        "version": "xgb-v1.0",
        "status": "ACTIVE",
        "dataset_version": "synthetic-v1.0-6000",
        "training_samples": 4800,
        "verified_samples": 0,
        "metrics": {
            "gcv": {"mae": 201.0, "rmse": 249.8, "r2": 0.8862, "mape": 3.42},
            "ash": {"mae": 1.20, "rmse": 1.51, "r2": 0.9606, "mape": 4.10},
            "moisture": {"mae": 1.99, "rmse": 2.39, "r2": 0.8120, "mape": 5.25},
            "volatile_matter": {"mae": 2.03, "rmse": 2.58, "r2": 0.8540, "mape": 4.80},
            "fixed_carbon": {"mae": 2.95, "rmse": 3.71, "r2": 0.8930, "mape": 4.15}
        },
        "model_paths": {},
        "preprocessing_path": "",
        "created_at": datetime.now(timezone.utc)
    }
    mv_col.update_one({"version": "xgb-v1.0"}, {"$set": model_doc}, upsert=True)

    print("\n" + "=" * 60)
    print("SUCCESS: MongoDB database seeded completely!")
    print("=" * 60)

if __name__ == "__main__":
    seed_database()
