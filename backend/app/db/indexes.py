from pymongo import ASCENDING, DESCENDING
from app.db.mongodb import (
    get_users_col,
    get_mines_col,
    get_coal_samples_col,
    get_predictions_col,
    get_verification_requests_col,
    get_laboratory_results_col,
    get_blend_results_col,
    get_scenario_runs_col,
    get_model_versions_col,
    get_audit_logs_col,
    db_manager
)
from app.core.logging import logger

def create_mongodb_indexes():
    """Creates recommended indexes across all MongoDB collections."""
    try:
        # Users
        users_col = get_users_col()
        users_col.create_index([("email", ASCENDING)], unique=True)
        users_col.create_index([("username", ASCENDING)], unique=True)
        
        # Mines
        mines_col = get_mines_col()
        mines_col.create_index([("code", ASCENDING)], unique=True)
        mines_col.create_index([("subsidiary", ASCENDING)])
        
        # Coal Samples
        samples_col = get_coal_samples_col()
        samples_col.create_index([("sample_code", ASCENDING)], unique=True)
        samples_col.create_index([("mine_id", ASCENDING)])
        samples_col.create_index([("created_at", DESCENDING)])
        
        # Predictions
        pred_col = get_predictions_col()
        pred_col.create_index([("prediction_id", ASCENDING)], unique=True)
        pred_col.create_index([("sample_id", ASCENDING)])
        pred_col.create_index([("model_version", ASCENDING)])
        pred_col.create_index([("created_at", DESCENDING)])
        pred_col.create_index([("confidence", ASCENDING)])
        
        # Verification Requests
        vr_col = get_verification_requests_col()
        vr_col.create_index([("request_id", ASCENDING)], unique=True)
        vr_col.create_index([("prediction_id", ASCENDING)])
        vr_col.create_index([("status", ASCENDING)])
        vr_col.create_index([("created_at", DESCENDING)])
        
        # Laboratory Results
        lab_col = get_laboratory_results_col()
        lab_col.create_index([("sample_id", ASCENDING)])
        lab_col.create_index([("verification_request_id", ASCENDING)])
        lab_col.create_index([("created_at", DESCENDING)])
        
        # Blend Results
        blend_col = get_blend_results_col()
        blend_col.create_index([("blend_id", ASCENDING)], unique=True)
        blend_col.create_index([("created_at", DESCENDING)])
        
        # Scenario Runs
        scen_col = get_scenario_runs_col()
        scen_col.create_index([("scenario_id", ASCENDING)], unique=True)
        scen_col.create_index([("created_at", DESCENDING)])
        
        # Model Versions
        mv_col = get_model_versions_col()
        mv_col.create_index([("version", ASCENDING)], unique=True)
        mv_col.create_index([("status", ASCENDING)])
        
        # Audit Logs
        audit_col = get_audit_logs_col()
        audit_col.create_index([("timestamp", DESCENDING)])
        audit_col.create_index([("user_id", ASCENDING)])
        audit_col.create_index([("action", ASCENDING)])
        
        logger.info("All MongoDB indexes established successfully.")
    except Exception as e:
        logger.warning(f"Note on creating indexes: {e}")
