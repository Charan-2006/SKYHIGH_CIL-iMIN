# CarbonCortex
### AI-Powered Coal Quality & Decision Intelligence Platform

> **Official Repository**: [Charan-2006/SKYHIGH_CIL-iMIN](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN.git)  
> **Environment**: Enterprise Mining Decision Support  
> **Status**: Full-Stack Operational (FastAPI + React TypeScript + MongoDB + XGBoost + SHAP + Google OR-Tools)

---

## 1. System Vision

**CarbonCortex** is an enterprise AI decision intelligence platform purpose-built for **Coal India Limited (CIL)** open-cast and underground mining operations, washeries, thermal utility power stations, and metallurgical coking facilities.

The platform bridges real-time geoscientific sensor telemetry with mission-critical dispatch and valuation decisions:
1. **Rapid Coal Quality Prediction**: Real-time multi-target regression predicting Gross Calorific Value (GCV), Ash, Moisture, Volatile Matter, and Fixed Carbon.
2. **Standardized CIL Grading**: Automated assignment into standard Coal India thermal grades (G1–G17).
3. **ATDIF Confidence Framework**: 5-factor quantitative confidence gating (0.85 threshold) guarding downstream operational decisions.
4. **Autonomous Laboratory Verification**: Low-confidence predictions are automatically enqueued for certified ISO bomb calorimetry.
5. **Continuous Learning Loop**: Certified laboratory findings are stored in MongoDB as ground truth to periodically retrain and benchmark candidate models.
6. **Explainable AI (XAI)**: Game-theoretic SHAP TreeExplainer local feature attributions and narrative insights.
7. **Mathematical Blend Optimization**: Google OR-Tools continuous linear programming (GLOP) solver allocating cost-optimal mixing ratios.
8. **What-If Scenario Simulation**: Compares baseline operational parameters against scenario variations (e.g. monsoon moisture surges).
9. **Decision Intelligence**: Unified KPI analytics, compliance ledger, and audit trails.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Vanilla Tailwind CSS, Recharts, Lucide React, Axios, React Hook Form |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, PyMongo, Motor, Jose (JWT), Bcrypt, Uvicorn |
| **Machine Learning** | Scikit-Learn, XGBoost, SHAP (TreeExplainer), NumPy, Pandas, Joblib |
| **Optimization** | Google OR-Tools (Continuous Linear Programming / GLOP) |
| **Database** | MongoDB (Primary & Exclusive database; Atlas and local support) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 3. Architecture & Data Flow

```
                      USER / SENSOR TELEMETRY
                                 │
                                 ▼
                     FASTAPI VALIDATION LAYER
                                 │
                                 ▼
                    XGBOOST REGRESSION ENSEMBLE
            (GCV, Ash, Moisture, Volatile Matter, Fixed Carbon)
                                 │
                                 ▼
             ATDIF CONFIDENCE ENGINE (Threshold = 0.85)
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        [High Confidence ≥ 0.85]       [Low Confidence < 0.85]
                 │                               │
                 ▼                               ▼
       COMMERCIAL DISPATCH &           LABORATORY VERIFICATION
        GOOGLE OR-TOOLS BLEND                     │
                 │                               ▼
                 │                    ISO BOMB CALORIMETRY
                 │                               │
                 │                               ▼
                 │                   ERROR RECONCILIATION &
                 │                     RETRAINING FEEDBACK
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                     MONGODB AUDIT & DASHBOARDS
```

---

## 4. Quickstart: Running Locally

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+
- MongoDB running on `localhost:27017` (or MongoDB Atlas URI). If local MongoDB is not running, the platform seamlessly activates an in-memory `mongomock` engine ensuring 100% test and application availability.

### 1. Start the FastAPI Backend
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# 1. Generate 6,000 realistic synthetic samples
python scripts/generate_demo_data.py

# 2. Train XGBoost models (GCV R²=0.886, Ash R²=0.961)
python scripts/train_models.py

# 3. Seed MongoDB with mines, users, and baseline records
python scripts/seed_database.py

# 4. Start backend server
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger API: `http://localhost:8000/docs`
- ReDoc API Documentation: `http://localhost:8000/redoc`

### 2. Start the React Frontend
```bash
# In project root
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 5. Docker Orchestration

To run the entire full-stack application inside containerized microservices:

```bash
docker-compose up --build -d
```

- **Frontend**: `http://localhost:80` (or `http://localhost:5173`)
- **Backend API**: `http://localhost:8000/docs`
- **MongoDB**: `localhost:27017`

---

## 6. Enterprise Roles & Pre-Seeded Logins

| Persona | Username | Password | Permitted Modules |
| :--- | :--- | :--- | :--- |
| **Chief Administrator** | `admin` | `admin123` | Complete platform governance, model registry activation, history deletion |
| **Mining Engineer** | `engineer` | `engineer123` | Predictions, blend optimization, scenario simulation, reports |
| **Lab Technician** | `labtech` | `labtech123` | Verification queue, bomb calorimeter feedback entry |
| **Executive Viewer** | `viewer` | `viewer123` | Read-only dashboards, prediction inspection, compliance reports |

---

## 7. Automated Test Suite

Run backend test validation:
```bash
cd backend
pytest tests/ -v
```
**Test Coverage (14/14 tests passing)**:
- Authentication & JWT issuance
- Multi-target XGBoost prediction
- ATDIF confidence evaluation & low-confidence routing
- SHAP TreeExplainer calculation
- Laboratory verification queue & reconciliation error math
- Google OR-Tools blend optimization
- What-if scenario simulator
- Model registry and candidate promotion
- Dashboard trend aggregations
- Live database compliance reports

---

## 8. Detailed Documentation

- [Architecture Reference](docs/architecture.md)
- [REST API Reference](docs/api.md)
- [MongoDB Collections & Indexes](docs/mongodb.md)
- [Machine Learning Pipeline](docs/ml_pipeline.md)
- [ATDIF Confidence Framework](docs/confidence_framework.md)
- [Google OR-Tools Optimization](docs/optimization.md)
- [Frontend Architecture](docs/frontend.md)
- [Deployment Guide](docs/deployment.md)
- [End-to-End Walkthrough](docs/demo.md)

---

## 9. Team & Credits

**Team Lead**
- **Charan Annamalai** ([@Charan-2006](https://github.com/Charan-2006))

**Team Members**
- Magesh K
- Sivaprian M
- Vijaysaran S

---

## 10. License

This project is licensed under the **MIT License**.

