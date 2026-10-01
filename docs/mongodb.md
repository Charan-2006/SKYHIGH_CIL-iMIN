# CarbonCortex MongoDB Database Architecture

CarbonCortex exclusively uses **MongoDB** as its primary operational ledger and analytical store. Relational databases like PostgreSQL are not used.

---

## 1. Collections & Schemas

### `users`
- Stores system personnel with bcrypt password hashes and role-based permissions (`ADMIN`, `ENGINEER`, `LAB_TECHNICIAN`, `VIEWER`).
- Index: `{"username": 1}` (unique), `{"email": 1}` (unique).

### `mines`
- Geo-referenced metadata for Coal India open-cast and underground mines (Gevra, Kusmunda, Dipka, Jayant, Samaleswari).
- Index: `{"name": 1}`, `{"coalfield": 1}`.

### `coal_samples`
- Raw geoscientific telemetry, stratigraphic depths, borehole physical proxies, and location coordinates.
- Index: `{"sample_code": 1}` (unique), `{"mine_id": 1}`, `{"created_at": -1}`.

### `predictions`
- XGBoost multi-target regression results (`gcv`, `ash`, `moisture`, `volatile_matter`, `fixed_carbon`), computed CIL grade, quality score, confidence value, and ATDIF routing decision.
- Index: `{"sample_id": 1}`, `{"created_at": -1}`, `{"confidence": 1}`, `{"verification_required": 1}`.

### `verification_requests`
- Work-orders for samples falling below the ATDIF confidence threshold (0.85).
- Statuses: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `REJECTED`.
- Index: `{"status": 1}`, `{"sample_id": 1}`, `{"created_at": -1}`.

### `laboratory_results`
- ISO/IS 1350 certified bomb calorimetry laboratory readings submitted by certified lab technicians. Includes calculated absolute and percentage error relative to initial ML prediction.
- Index: `{"request_id": 1}`, `{"sample_id": 1}`, `{"created_at": -1}`.

### `model_versions`
- Registry of trained ML pipelines with version identifiers, validation metrics (MAE, RMSE, R²), dataset versions, and operational statuses (`ACTIVE`, `CANDIDATE`, `RETIRED`).
- Index: `{"version": 1}` (unique), `{"status": 1}`.

### `blend_scenarios` & `blend_results`
- Google OR-Tools inputs and allocations (source allocations, total tonnage, blended proximate values, total consignment cost, savings, solver status).
- Index: `{"created_at": -1}`.

### `scenario_runs`
- Baseline vs What-If parameter comparison logs.
- Index: `{"created_at": -1}`.

### `audit_logs`
- Immutably records security and operational actions (`LOGIN`, `PREDICTION_CREATED`, `VERIFICATION_REQUESTED`, `LAB_RESULT_SUBMITTED`, `BLEND_OPTIMIZED`, `MODEL_RETRAINED`, `MODEL_ACTIVATED`).
- Index: `{"timestamp": -1}`, `{"action": 1}`, `{"user_id": 1}`.
