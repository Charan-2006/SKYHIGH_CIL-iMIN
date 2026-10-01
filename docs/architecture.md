# CarbonCortex Platform Architecture

## Executive Overview

CarbonCortex is an industrial AI-powered Coal Quality & Decision Intelligence Platform engineered specifically for Coal India Limited (CIL) mining operations, washeries, thermal utility grids, and metallurgical dispatch terminals.

The platform closes the gap between raw geoscientific sensor streams and mission-critical dispatch decisions through a closed-loop intelligence architecture:

```
[Geophysical & Sensor Telemetry]
              │
              ▼
    [XGBoost Multi-Target Regressors]
              │
              ▼
   [ATDIF Confidence Sentinel (0.85 Threshold)]
         │                          │
  (High Confidence)          (Low Confidence)
         │                          │
         ▼                          ▼
[Google OR-Tools Optimizer]   [Lab Verification Queue]
         │                          │
         ▼                          ▼
[Commercial Dispatch Engine]  [ISO Bomb Calorimeter Feedback]
         │                          │
         ▼                          ▼
[Decision Intelligence Dash]  [Candidate Continuous Retraining]
```

---

## 1. System Topology

### Frontend Layer
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Vanilla Tailwind CSS with CIL dark-gold corporate theme
- **Visualization**: Recharts SVG charting and interactive Leaflet geospatial maps
- **Communication**: Centralized Axios client (`src/api/client.ts`) with automatic JWT bearer token interceptors and response error normalization.

### API & Service Layer
- **Framework**: FastAPI (Python 3.11+) with Pydantic v2 schemas
- **Architecture**: Domain-driven modular service pattern:
  - `PredictionService`: Model inference orchestration and quality indexing
  - `ConfidenceService`: ATDIF quantitative stability and drift assessment
  - `LaboratoryService`: Verification queue and reconciliation error calculation
  - `BlendingService`: Google OR-Tools continuous linear optimization
  - `ScenarioService`: Baseline vs what-if parameter delta analysis
  - `ModelService`: Model version registry and continuous retraining candidate promotion
  - `DashboardService`: High-performance MongoDB aggregations
  - `ReportService`: Compliance ledger compilation

### Intelligence Core
- **Gradient Boosted Trees**: Scikit-Learn + XGBoost multi-target regression pipeline
- **Explainability**: SHAP (SHapley Additive exPlanations) `TreeExplainer` calculating local feature attributions
- **Mathematical Optimization**: Google OR-Tools GLOP continuous linear programming solver
- **Confidence Engine**: ATDIF (Adaptive Trust Decision Intelligence Framework) computing 5-factor confidence scores.

### Database Layer
- **Primary Database**: MongoDB (Atlas and local instance support)
- **Indexing**: 17 collections optimized with unique indexes on `sample_code`, `username`, `version`, and compound indexes on `(status, created_at)`.
- **Resilience**: Integrated in-memory `mongomock` engine fallback ensuring uninterrupted local test execution and development workflows.
