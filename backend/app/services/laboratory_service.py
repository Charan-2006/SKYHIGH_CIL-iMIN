import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.db.mongodb import (
    get_verification_requests_col,
    get_laboratory_results_col,
    get_predictions_col,
    get_coal_samples_col
)
from app.utils.helpers import log_audit
from app.core.logging import logger

class LaboratoryService:
    @staticmethod
    def create_verification_request(data: Dict[str, Any], user_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        pred_col = get_predictions_col()
        pred = pred_col.find_one({"prediction_id": data["prediction_id"]})
        
        sample_code = pred.get("sample_code", "UNKNOWN") if pred else "UNKNOWN"
        mine_name = pred.get("mine_name", "UNKNOWN") if pred else "UNKNOWN"
        predicted_gcv = pred.get("predictions", {}).get("gcv", 5000.0) if pred else 5000.0
        predicted_ash = pred.get("predictions", {}).get("ash", 25.0) if pred else 25.0
        confidence = pred.get("confidence", 80.0) if pred else 80.0

        vr_col = get_verification_requests_col()
        req_id = f"VR-{uuid.uuid4().hex[:8].upper()}"
        doc = {
            "request_id": req_id,
            "prediction_id": data["prediction_id"],
            "sample_id": data.get("sample_id") or (pred.get("sample_id") if pred else str(uuid.uuid4())),
            "sample_code": sample_code,
            "mine_name": mine_name,
            "predicted_gcv": predicted_gcv,
            "predicted_ash": predicted_ash,
            "confidence": confidence,
            "status": "PENDING",
            "priority": data.get("priority", "HIGH"),
            "reason": data.get("reason", "Manual or automated lab verification requested."),
            "created_at": datetime.now(timezone.utc),
            "completed_at": None
        }
        vr_col.insert_one(doc)

        user_id = user_payload.get("sub", "system") if user_payload else "system"
        username = user_payload.get("username", "technician") if user_payload else "technician"
        log_audit(user_id=user_id, username=username, action="VERIFICATION_REQUESTED", resource_id=req_id)
        
        doc["id"] = req_id
        doc.pop("_id", None)
        return doc

    @staticmethod
    def get_pending_requests() -> List[Dict[str, Any]]:
        vr_col = get_verification_requests_col()
        docs = list(vr_col.find({"status": "PENDING"}).sort("created_at", -1))
        for d in docs:
            d["id"] = d.get("request_id", str(d["_id"]))
            d.pop("_id", None)
        return docs

    @staticmethod
    def submit_lab_results(data: Dict[str, Any], user_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Submits physical laboratory test results, calculates errors against predictions,
        and saves into feedback dataset for continuous learning.
        """
        lab_col = get_laboratory_results_col()
        vr_col = get_verification_requests_col()
        pred_col = get_predictions_col()

        # Find matching prediction
        pred = None
        if data.get("prediction_id"):
            pred = pred_col.find_one({"prediction_id": data["prediction_id"]})
        elif data.get("request_id"):
            req = vr_col.find_one({"request_id": data["request_id"]})
            if req and req.get("prediction_id"):
                pred = pred_col.find_one({"prediction_id": req["prediction_id"]})

        predicted_vals = pred.get("predictions", {}) if pred else {
            "gcv": 5000.0, "ash": 25.0, "moisture": 6.0, "volatile_matter": 24.0, "fixed_carbon": 45.0
        }

        actual_vals = {
            "gcv": float(data["actual_gcv"]),
            "ash": float(data["actual_ash"]),
            "moisture": float(data["actual_moisture"]),
            "volatile_matter": float(data["actual_vm"]),
            "fixed_carbon": float(data["actual_fixed_carbon"])
        }

        # Calculate exact parameter errors
        errors = []
        for param in ["gcv", "ash", "moisture", "volatile_matter", "fixed_carbon"]:
            p_val = float(predicted_vals.get(param, 0.0))
            a_val = float(actual_vals.get(param, 0.0))
            abs_err = abs(a_val - p_val)
            pct_err = (abs_err / a_val * 100.0) if a_val > 0 else 0.0
            errors.append({
                "parameter": param.upper().replace("_", " "),
                "predicted": round(p_val, 2),
                "actual": round(a_val, 2),
                "absolute_error": round(abs_err, 2),
                "percentage_error": round(pct_err, 2)
            })

        gcv_abs_err = round(abs(actual_vals["gcv"] - predicted_vals.get("gcv", 5000.0)), 1)
        gcv_pct_err = round((gcv_abs_err / actual_vals["gcv"] * 100.0), 2) if actual_vals["gcv"] > 0 else 0.0

        user_id = user_payload.get("sub", "system") if user_payload else "system"
        username = user_payload.get("username", "technician") if user_payload else "technician"

        result_id = f"LAB-{uuid.uuid4().hex[:8].upper()}"
        doc = {
            "result_id": result_id,
            "request_id": data.get("request_id"),
            "prediction_id": data.get("prediction_id"),
            "sample_id": data.get("sample_id", pred.get("sample_id", "UNKNOWN") if pred else "UNKNOWN"),
            "sample_code": pred.get("sample_code", "UNKNOWN") if pred else "UNKNOWN",
            "mine_name": pred.get("mine_name", "UNKNOWN") if pred else "UNKNOWN",
            "actual_values": actual_vals,
            "predicted_values": predicted_vals,
            "errors": errors,
            "gcv_absolute_error": gcv_abs_err,
            "gcv_percentage_error": gcv_pct_err,
            "verified_by": username,
            "technician_notes": data.get("technician_notes", ""),
            "lab_id": data.get("lab_id", "Central-Lab-01"),
            "feedback_registered_for_retraining": True,
            "created_at": datetime.now(timezone.utc)
        }
        lab_col.insert_one(doc)

        # Update verification request status to COMPLETED
        if data.get("request_id"):
            vr_col.update_one(
                {"request_id": data["request_id"]},
                {"$set": {"status": "COMPLETED", "completed_at": datetime.now(timezone.utc)}}
            )

        log_audit(
            user_id=user_id,
            username=username,
            action="LAB_RESULT_SUBMITTED",
            resource_id=result_id,
            metadata={"gcv_error": gcv_abs_err, "percentage_error": gcv_pct_err}
        )

        doc["id"] = result_id
        doc.pop("_id", None)
        return doc

    @staticmethod
    def get_history() -> List[Dict[str, Any]]:
        lab_col = get_laboratory_results_col()
        docs = list(lab_col.find().sort("created_at", -1).limit(50))
        for d in docs:
            d["id"] = d.get("result_id", str(d["_id"]))
            d.pop("_id", None)
        return docs
