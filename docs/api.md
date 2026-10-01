# CarbonCortex REST API Reference

The backend provides OpenAPI / Swagger documentation at `/docs` and ReDoc at `/redoc`.

Base URL: `http://localhost:8000/api`

---

## 1. Authentication (`/api/auth`)
- `POST /api/auth/login`: Form-encoded username & password; returns JWT access token, user role, and session expiration.
- `GET /api/auth/me`: Retrieves current authenticated user profile.
- `PUT /api/auth/me`: Updates user credentials (full name, email, subsidiary, password).

## 2. Predictions & XAI (`/api/predictions`)
- `POST /api/predictions`: Accepts borehole depth, mine ID, and geoscientific sensor readings; executes XGBoost regression; runs ATDIF confidence evaluation; auto-enqueues low-confidence samples to laboratory queue.
- `GET /api/predictions/{id}`: Retrieves cached prediction and prox-score record.
- `GET /api/predictions/{id}/explanation`: Computes SHAP TreeExplainer feature attributions and narrative explanation.
- `GET /api/predictions/history`: Retrieves chronological prediction records.
- `DELETE /api/predictions/history`: Clears prediction log records (requires ADMIN role).
- `GET /api/predictions/confidence/metrics`: Returns aggregated system veracity score, stability timeline, and drift indicators.
- `GET /api/predictions/confidence/logs`: Audit log of ATDIF stability decisions.

## 3. Laboratory Verification (`/api/laboratory`)
- `POST /api/laboratory/verification`: Explicitly queues a sample for laboratory bomb calorimetry.
- `GET /api/laboratory/pending`: Lists pending laboratory verification requests.
- `POST /api/laboratory/results`: Submits certified bomb calorimeter test results; computes absolute and percentage prediction error; flags sample for retraining feedback.
- `GET /api/laboratory/history`: Retrieves history of verified samples and prediction error delta.

## 4. Blend Optimization (`/api/blending`)
- `POST /api/blending/optimize`: Google OR-Tools continuous linear optimization minimizing cost or deviation subject to GCV, Ash, Moisture, and stock limits.
- `GET /api/blending/history`: Retrieves logged blend optimization runs.

## 5. Scenario Simulation (`/api/scenarios`)
- `POST /api/scenarios/simulate`: Compares baseline target constraints against what-if scenario parameter shifts; outputs delta in feasibility, cost, GCV, Ash, and Moisture.
- `GET /api/scenarios/history`: Historical scenario simulation runs.

## 6. Model Governance (`/api/models`)
- `GET /api/models`: Lists model versions in the registry (`ACTIVE`, `CANDIDATE`, `RETIRED`).
- `GET /api/models/active`: Returns metadata and metrics of current production model.
- `POST /api/models/retrain`: Gathers verified laboratory feedback; trains candidate model; evaluates against active baseline; promotes candidate only if validation thresholds are met.
- `POST /api/models/{version}/activate`: Manually promotes a candidate model version to active status.

## 7. Decision Intelligence Dashboard (`/api/dashboard`)
- `GET /api/dashboard/summary`: High-level enterprise KPIs (total samples, high-confidence counts, pending lab requests, average GCV/Ash, model R²).
- `GET /api/dashboard/trends`: Aggregated monthly trends, CIL grade distributions, error histograms, and subsidiary benchmarks.
- `GET /api/dashboard/subsidiaries`: Geo-coordinates, capacities, and active mines across CIL subsidiaries (SECL, BCCL, ECL, CCL, MCL, NCL, WCL).

## 8. Compliance Reports (`/api/reports`)
- `GET /api/reports/{type}`: Live database reports (`coal_quality`, `predictions`, `laboratory`, `blending`, `models`, `scenarios`).
- `POST /api/reports/generate`: Generates customized compliance report filter.
