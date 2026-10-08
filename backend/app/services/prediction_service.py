import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.db.mongodb import (
    get_predictions_col,
    get_coal_samples_col,
    get_verification_requests_col
)
from app.ml.predict import PredictionOrchestrator
from app.utils.helpers import log_audit
from app.core.logging import logger

class PredictionService:
    @staticmethod
    def create_prediction(sample_data: Dict[str, Any], user_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        # Generate sample code if missing
        sample_code = sample_data.get("sample_code") or f"CCX-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
        
        # 1. Run ML inference pipeline
        orchestrator = PredictionOrchestrator.get_instance()
        ml_result = orchestrator.predict(sample_data)

        # 2. Store sample record in MongoDB
        sample_col = get_coal_samples_col()
        sample_doc = {
            "sample_code": sample_code,
            "mine_id": sample_data.get("mine_id"),
            "mine_name": sample_data.get("mine_name") or "Gevra Mega Project",
            "seam": sample_data.get("seam") or "Seam-IV",
            "coalfield": sample_data.get("coalfield") or "Korba",
            "state": sample_data.get("state") or "Chhattisgarh",
            "depth": float(sample_data.get("depth") if sample_data.get("depth") is not None else 120.0),
            "location": {
                "latitude": float(sample_data.get("latitude") if sample_data.get("latitude") is not None else 22.35),
                "longitude": float(sample_data.get("longitude") if sample_data.get("longitude") is not None else 82.60)
            },
            "geological_features": sample_data.get("geological_features") or {},
            "production_features": sample_data.get("production_features") or {},
            "sensor_features": sample_data.get("sensor_features") or {},
            "created_at": datetime.now(timezone.utc)
        }
        sample_res = sample_col.insert_one(sample_doc)
        sample_id = str(sample_res.inserted_id)

        # 3. Store prediction record in MongoDB
        prediction_id = f"PRED-{uuid.uuid4().hex[:8].upper()}"
        pred_col = get_predictions_col()
        
        pred_doc = {
            "prediction_id": prediction_id,
            "sample_id": sample_id,
            "sample_code": sample_code,
            "mine_name": sample_doc["mine_name"],
            "coalfield": sample_doc["coalfield"],
            "state": sample_doc["state"],
            "predictions": ml_result["predictions"],
            "grade": ml_result["grade"],
            "quality_score": ml_result["quality_score"],
            "confidence": ml_result["confidence"],
            "confidence_factors": ml_result["confidence_factors"],
            "verification_required": ml_result["verification_required"],
            "decision": ml_result["decision"],
            "status": ml_result["status"],
            "model_version": ml_result["model_version"],
            "explanation_available": ml_result["explanation_available"],
            "shap_values": ml_result["shap_data"]["shap_contributions"] if ml_result.get("shap_data") else [],
            "base_value": ml_result["shap_data"]["base_value"] if ml_result.get("shap_data") else 5872.54,
            "narrative": ml_result["shap_data"]["narrative"] if ml_result.get("shap_data") else "",
            "created_at": datetime.now(timezone.utc)
        }
        pred_col.insert_one(pred_doc)

        # 4. If confidence is below threshold, automatically create verification request in MongoDB
        if ml_result["verification_required"]:
            vr_col = get_verification_requests_col()
            vr_doc = {
                "request_id": f"VR-{uuid.uuid4().hex[:8].upper()}",
                "prediction_id": prediction_id,
                "sample_id": sample_id,
                "sample_code": sample_code,
                "mine_name": sample_doc["mine_name"],
                "predicted_gcv": ml_result["predictions"]["gcv"],
                "predicted_ash": ml_result["predictions"]["ash"],
                "confidence": ml_result["confidence"],
                "status": "PENDING",
                "priority": "HIGH" if ml_result["confidence"] < 75.0 else "MEDIUM",
                "reason": f"Confidence score ({ml_result['confidence']}%) is below enterprise threshold (85.0%). Lab verification required.",
                "created_at": datetime.now(timezone.utc),
                "completed_at": None
            }
            vr_col.insert_one(vr_doc)
            logger.info(f"Verification request {vr_doc['request_id']} triggered for prediction {prediction_id}")

        # 5. Audit Log
        user_id = user_payload.get("sub", "system") if user_payload else "system"
        username = user_payload.get("username", "anonymous") if user_payload else "anonymous"
        log_audit(
            user_id=user_id,
            username=username,
            action="PREDICTION_CREATED",
            resource_id=prediction_id,
            metadata={"sample_code": sample_code, "confidence": ml_result["confidence"], "grade": ml_result["grade"]}
        )

        pred_doc["id"] = prediction_id
        pred_doc.pop("_id", None)
        return pred_doc

    @staticmethod
    def get_prediction(prediction_id: str) -> Optional[Dict[str, Any]]:
        col = get_predictions_col()
        doc = col.find_one({"prediction_id": prediction_id})
        if doc:
            doc["id"] = doc["prediction_id"]
            doc.pop("_id", None)
            return doc
        return None

    @staticmethod
    def get_history(limit: int = 50) -> List[Dict[str, Any]]:
        col = get_predictions_col()
        docs = list(col.find().sort("created_at", -1).limit(limit))
        results = []
        for d in docs:
            d["id"] = d.get("prediction_id", str(d["_id"]))
            d.pop("_id", None)
            results.append(d)
        return results

    @staticmethod
    def clear_history():
        col = get_predictions_col()
        col.delete_many({})
