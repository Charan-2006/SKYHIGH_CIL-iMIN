import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ml_engine" in data

def test_auth_login_success(client):
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "ADMIN"
    assert data["username"] == "admin"

def test_auth_login_invalid(client):
    response = client.post("/api/auth/login", json={"username": "admin", "password": "wrongpassword"})
    assert response.status_code == 401

def test_user_profile(client):
    login_res = client.post("/api/auth/login", json={"username": "engineer", "password": "engineer123"})
    token = login_res.json()["access_token"]

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["role"] == "ENGINEER"

def test_coal_quality_prediction(client):
    login_res = client.post("/api/auth/login", json={"username": "engineer", "password": "engineer123"})
    token = login_res.json()["access_token"]

    payload = {
        "mine_name": "Gevra Mega Project",
        "coalfield": "Korba",
        "state": "Chhattisgarh",
        "seam": "Seam-IV",
        "depth": 135.0,
        "geological_features": {
            "seam_thickness": 8.2,
            "overburden_thickness": 95.0,
            "geological_strata_density": 2.38,
            "core_recovery_rate": 94.0,
            "sandstone_shale_ratio": 1.7
        },
        "production_features": {
            "drilling_rate_index": 26.5,
            "cutting_resistance_index": 48.0
        },
        "sensor_features": {
            "spectral_gamma_ray": 82.0,
            "spectral_resistivity": 138.0,
            "optical_reflectance": 0.92,
            "density_bulk": 1.51
        }
    }

    response = client.post("/api/predictions", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()

    assert "prediction_id" in data
    assert "predictions" in data
    preds = data["predictions"]
    assert 2000 <= preds["gcv"] <= 8500
    assert 5 <= preds["ash"] <= 60
    assert 1 <= preds["moisture"] <= 25
    assert 10 <= preds["volatile_matter"] <= 45
    assert 10 <= preds["fixed_carbon"] <= 75
    assert "grade" in data
    assert "quality_score" in data
    assert "confidence" in data
    assert "decision" in data
    assert data["explanation_available"] is True

def test_shap_explanation(client):
    hist = client.get("/api/predictions/history?limit=1").json()
    assert len(hist) > 0
    pred_id = hist[0]["prediction_id"]

    response = client.get(f"/api/predictions/{pred_id}/explanation")
    assert response.status_code == 200
    data = response.json()
    assert "shap_contributions" in data
    assert len(data["shap_contributions"]) > 0
    assert "disclaimer" in data
    assert "narrative" in data

def test_confidence_and_verification_trigger(client):
    login_res = client.post("/api/auth/login", json={"username": "engineer", "password": "engineer123"})
    token = login_res.json()["access_token"]

    payload = {
        "mine_name": "Deep Exploratory Borehole",
        "coalfield": "Raniganj",
        "depth": 850.0,
        "geological_features": {"geological_strata_density": 4.5},
        "sensor_features": {"spectral_gamma_ray": 250.0, "density_bulk": 2.8}
    }
    response = client.post("/api/predictions", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["verification_required"] is True
    assert "LAB VERIFICATION" in data["decision"]

def test_laboratory_verification_workflow(client):
    pending = client.get("/api/laboratory/pending").json()
    assert len(pending) > 0
    req = pending[0]

    login_res = client.post("/api/auth/login", json={"username": "labtech", "password": "lab123"})
    token = login_res.json()["access_token"]

    lab_submit = {
        "request_id": req["request_id"],
        "sample_id": req["sample_id"],
        "actual_gcv": 3980.0,
        "actual_ash": 37.8,
        "actual_moisture": 8.2,
        "actual_vm": 22.5,
        "actual_fixed_carbon": 31.5,
        "technician_notes": "Bomb calorimetry tested and confirmed in duplicate."
    }
    response = client.post("/api/laboratory/results", json=lab_submit, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()

    assert "result_id" in data
    assert "errors" in data
    assert len(data["errors"]) > 0
    assert "gcv_absolute_error" in data
    assert "gcv_percentage_error" in data
    assert data["feedback_registered_for_retraining"] is True

def test_blend_optimization_ortools(client):
    login_res = client.post("/api/auth/login", json={"username": "engineer", "password": "engineer123"})
    token = login_res.json()["access_token"]

    payload = {
        "sources": [
            {"source_id": "MINE-A", "mine_name": "Mine A (Superior)", "available_quantity": 8000, "gcv": 6200, "ash": 14.0, "moisture": 3.0, "volatile_matter": 28.0, "cost_per_ton": 78.0},
            {"source_id": "MINE-B", "mine_name": "Mine B (Mid-Tier)", "available_quantity": 10000, "gcv": 5000, "ash": 24.0, "moisture": 6.0, "volatile_matter": 25.0, "cost_per_ton": 48.0},
            {"source_id": "MINE-C", "mine_name": "Mine C (Utility)", "available_quantity": 12000, "gcv": 3800, "ash": 36.0, "moisture": 8.0, "volatile_matter": 20.0, "cost_per_ton": 32.0}
        ],
        "target_quantity": 12000,
        "target_gcv": 4900,
        "max_ash": 26.0,
        "max_moisture": 7.0,
        "objective": "MINIMIZE_COST"
    }

    response = client.post("/api/blending/optimize", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["feasibility"] is True
    assert data["solver_status"] in ["OPTIMAL", "FEASIBLE"]
    assert data["total_quantity"] == 12000
    assert data["blended_gcv"] >= 4899.0
    assert data["blended_ash"] <= 26.01
    assert data["total_cost"] > 0
    assert len(data["allocations"]) == 3

def test_scenario_simulator(client):
    login_res = client.post("/api/auth/login", json={"username": "engineer", "password": "engineer123"})
    token = login_res.json()["access_token"]

    sources = [
        {"source_id": "SRC-1", "mine_name": "Mine 1", "available_quantity": 10000, "gcv": 5800, "ash": 18, "moisture": 4, "volatile_matter": 28, "cost_per_ton": 65},
        {"source_id": "SRC-2", "mine_name": "Mine 2", "available_quantity": 10000, "gcv": 4200, "ash": 32, "moisture": 7, "volatile_matter": 22, "cost_per_ton": 38}
    ]

    payload = {
        "scenario_name": "Tariff Surge Compensation",
        "baseline": {
            "sources": sources,
            "target_quantity": 8000,
            "target_gcv": 5000,
            "max_ash": 25.0,
            "max_moisture": 6.0
        },
        "what_if": {
            "sources": sources,
            "target_quantity": 8000,
            "target_gcv": 4800,
            "max_ash": 28.0,
            "max_moisture": 6.5
        }
    }

    response = client.post("/api/scenarios/simulate", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert "deltas" in data
    assert "cost_delta" in data["deltas"]
    assert "gcv_delta" in data["deltas"]
    assert "summary" in data

def test_dispatch_recommendation(client):
    payload = {
        "customer_name": "Bokaro Steel Complex",
        "target_grade": "G3",
        "min_gcv": 6200.0,
        "max_ash": 16.0,
        "required_quantity": 10000.0,
        "application_type": "METALLURGICAL_STEEL"
    }
    response = client.post("/api/dispatch/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["matched_gcv"] >= 6000.0
    assert data["priority"] == "CRITICAL HIGH"

def test_dashboard_apis(client):
    summary_res = client.get("/api/dashboard/summary")
    assert summary_res.status_code == 200
    s_data = summary_res.json()
    assert s_data["total_samples"] >= 0
    assert s_data["predictions_generated"] >= 0
    assert "active_model_version" in s_data

    trends_res = client.get("/api/dashboard/trends")
    assert trends_res.status_code == 200
    t_data = trends_res.json()
    assert "monthly_trends" in t_data
    assert "recent_predictions" in t_data

def test_reports_api(client):
    for r_type in ["COAL_QUALITY", "PREDICTION", "LABORATORY", "BLEND_OPTIMIZATION", "MODEL_PERFORMANCE", "SCENARIO"]:
        res = client.get(f"/api/reports/{r_type}")
        assert res.status_code == 200
        assert res.json()["report_type"] == r_type

def test_model_registry_and_continuous_learning(client):
    login_res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = login_res.json()["access_token"]

    models_res = client.get("/api/models")
    assert models_res.status_code == 200
    models = models_res.json()
    assert len(models) > 0

    active_res = client.get("/api/models/active")
    assert active_res.status_code == 200
    assert active_res.json()["status"] == "ACTIVE"

    retrain_res = client.post("/api/models/retrain", json={"min_evaluation_r2": 0.80}, headers={"Authorization": f"Bearer {token}"})
    assert retrain_res.status_code == 200
    r_data = retrain_res.json()
    assert "candidate_version" in r_data
    assert "metrics" in r_data
