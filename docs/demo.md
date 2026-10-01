# CarbonCortex End-to-End Walkthrough

## 1. Demo Credentials & Enterprise Roles

CarbonCortex comes pre-seeded with 4 enterprise personas accessible directly on the Login page:

| Role | Username | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | Complete platform governance, model activation, history purge |
| **ENGINEER** | `engineer` | `engineer123` | Predictions, blend optimization, scenario simulation, reports |
| **LAB_TECHNICIAN** | `labtech` | `labtech123` | Verification queue, bomb calorimeter feedback entry |
| **VIEWER** | `viewer` | `viewer123` | Read-only dashboards, prediction inspection, compliance reports |

---

## 2. Recommended End-to-End Evaluation Workflow

### Step 1: Sign In
- Navigate to `/login`.
- Click **"Quick Fill: Lead Engineer"** and sign in.

### Step 2: Overview Dashboard
- Navigate to `/dashboard`.
- Notice live KPI summary cards, CIL Grade Distribution, GCV vs Ash trends, and recent predictions pulled directly from MongoDB.

### Step 3: Run XGBoost Prediction
- Navigate to `/laboratory` (or click **"New Sample"** on `/prediction`).
- Select preset: **"Gevra Mega Project"**.
- Click **"Submit Sample for Model Inference"**.
- Real-time XGBoost models calculate GCV, Ash, Moisture, VM, Fixed Carbon, CIL Grade, and ATDIF Confidence.

### Step 4: Low-Confidence & Verification Queue
- In `/laboratory`, input an outlier sample with extreme moisture (>15%) or abnormal depth.
- The prediction displays a prominent red warning card: **"ATDIF Gating: Laboratory Verification Required"** with confidence below 85%.
- Switch to the **"Laboratory Verification Queue"** tab.
- Click **"Submit Certified Test"** on a pending sample.
- Enter certified bomb calorimeter readings (e.g. 5,120 kcal/kg).
- The system stores actual values, computes absolute and percentage prediction error, and registers the sample for model retraining feedback.

### Step 5: Explainability (SHAP TreeExplainer)
- Navigate to `/explainability`.
- View the dynamic SHAP waterfall chart breaking down positive and negative feature contributions toward final GCV.

### Step 6: Google OR-Tools Blend Optimizer
- Navigate to `/blend`.
- Adjust target GCV, maximum ash limit, target tonnage, and optimization goal.
- Click **"Execute OR-Tools GLOP"**.
- View continuous solver allocations, total consignment valuation, and solver status (`OPTIMAL`).

### Step 7: Scenario Simulator
- Navigate to `/scenarios`.
- Adjust Baseline vs What-If sliders (e.g. Monsoon moisture surge).
- Click **"Run Comparative Simulation"**.
- Inspect side-by-side cost, GCV, and feasibility variance.

### Step 8: Model Governance & Continuous Retraining
- Navigate to `/models`.
- Review active model version (`xgb-v1.0`), training samples, and test set MAE/RMSE/R² metrics.
- Click **"Trigger Retraining with Verified Feedback"** to ingest verified lab results into a candidate model version.

### Step 9: Executive Reports
- Navigate to `/report`.
- Switch tabs between Active Consignment Certificate, Coal Quality Inventory, Predictions, Lab Verifications, and Blending runs.
- Click **"Print Report (PDF)"**.
