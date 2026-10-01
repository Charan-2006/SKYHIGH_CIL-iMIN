# CarbonCortex Frontend Architecture

## 1. Structure & Tech Stack

The frontend is constructed using:
- **Core**: React 18, TypeScript, Vite
- **Styling**: Vanilla Tailwind CSS using custom CIL mining tokens (`gold-500`, `cortex-dark`, `cortex-bg`)
- **State & Context**: `src/contexts/AppContext.tsx` providing real-time authenticated user state, active sample, last prediction, system status, and toast notifications.
- **API Communication**: Centralized Axios client (`src/api/client.ts`) with automatic JWT interceptors and base URL configuration.

---

## 2. Page Directory

1. **Landing Page** (`/`): High-definition overview with live technology matrix (MongoDB, OR-Tools, XGBoost, SHAP).
2. **Login / IAM Portal** (`/login`): Form-based JWT authentication with role preset buttons (`ADMIN`, `ENGINEER`, `LAB_TECHNICIAN`, `VIEWER`).
3. **Overview Dashboard** (`/dashboard`): Dynamic KPIs, CIL grade distributions, proximate trend charts, and quick-dispatch actions.
4. **Coal Quality AI** (`/prediction`): Multi-target XGBoost prediction scorecard, CIL Grade classification, quality score index, and prominent low-confidence warning card.
5. **Lab Verification & Feedback** (`/laboratory`): Tabbed workspace supporting new sample input and live verification work-order queue with bomb calorimeter reconciliation modal.
6. **Blend Optimizer** (`/blend`): Real-time parameter sliders triggering Google OR-Tools continuous linear optimization.
7. **Scenario Simulator** (`/scenarios`): Baseline vs What-If parameter sliders with live delta indicators.
8. **Model Governance** (`/models`): Active model registry, MAE/RMSE/R² metrics, and candidate retraining trigger.
9. **Mine Analytics** (`/analytics`): Deep historical telemetry, error histograms, and subsidiary benchmarks.
10. **India Mine Map** (`/map`): Interactive Leaflet map displaying active CIL subsidiaries, mines, and coordinates.
11. **Prediction History** (`/history`): Searchable, filterable audit log with CSV export capability.
12. **Executive Reports** (`/report`): Multi-report suite backed by live MongoDB queries (`coal_quality`, `predictions`, `laboratory`, `blending`, `models`, `scenarios`).
13. **User Profile** (`/profile`): Personal credentials and role management.
14. **Settings** (`/settings`): System-wide threshold and endpoint configurations.
