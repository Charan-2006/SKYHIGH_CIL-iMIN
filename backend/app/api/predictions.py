from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.schemas.prediction import PredictionInput, PredictionResponse, PredictionExplanationResponse
from app.services.prediction_service import PredictionService
from app.services.confidence_service import ConfidenceService
from app.core.security import get_current_user_payload

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("", response_model=PredictionResponse)
def create_prediction(input_data: PredictionInput, user_payload: Optional[dict] = Depends(get_current_user_payload)):
    try:
        result = PredictionService.create_prediction(input_data.model_dump(), user_payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.get("/history", response_model=List[PredictionResponse])
def get_prediction_history(limit: int = 50):
    return PredictionService.get_history(limit)

@router.delete("/history")
def clear_prediction_history(user_payload: Optional[dict] = Depends(get_current_user_payload)):
    PredictionService.clear_history()
    return {"message": "Prediction history cleared successfully"}

@router.get("/confidence/metrics")
def get_confidence_metrics():
    return ConfidenceService.get_metrics()

@router.get("/confidence/logs")
def get_confidence_logs():
    return ConfidenceService.get_logs()

@router.get("/{prediction_id}", response_model=PredictionResponse)
def get_prediction_by_id(prediction_id: str):
    pred = PredictionService.get_prediction(prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return pred

@router.get("/{prediction_id}/explanation", response_model=PredictionExplanationResponse)
def get_prediction_explanation(prediction_id: str):
    pred = PredictionService.get_prediction(prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    shap_vals = pred.get("shap_values", [])
    predicted_gcv = pred.get("predictions", {}).get("gcv", 5200.0)
    
    top_pos = [c for c in shap_vals if c.get("impact") == "positive"][:3]
    top_neg = [c for c in shap_vals if c.get("impact") == "negative"][:3]

    return PredictionExplanationResponse(
        prediction_id=prediction_id,
        sample_id=pred.get("sample_id", ""),
        base_value=pred.get("base_value", 5872.54),
        predicted_gcv=predicted_gcv,
        shap_contributions=shap_vals,
        top_positive_features=top_pos,
        top_negative_features=top_neg,
        narrative=pred.get("narrative") or "SHAP feature contribution analysis."
    )
