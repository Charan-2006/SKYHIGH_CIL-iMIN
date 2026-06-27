<div align="center">

# ⛰️ CarbonCortex

### AI-Powered Coal Quality & Decision Intelligence Platform

**Predict • Optimize • Decide**

<br />

<img src="./public/favicon.svg" alt="CarbonCortex Logo" width="96" height="96" />

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![AI](https://img.shields.io/badge/AI-ML%20Powered-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge)](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN)
[![Hackathon](https://img.shields.io/badge/Hackathon-2026-7C3AED?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN)
[![Mining 4.0](https://img.shields.io/badge/Mining-4.0-0369A1?style=for-the-badge)](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN)

<br />

[Live Demo](#) · [Documentation](#installation) · [Report Bug](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN/issues) · [Request Feature](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN/issues)

</div>

---

## 📖 About

**CarbonCortex** is an enterprise-grade intelligence platform built for modern coal mining operations. Traditional coal quality assessment depends on laboratory testing — a process that is accurate but slow, creating bottlenecks across blending, pricing, dispatch, and operational planning.

CarbonCortex addresses this gap by predicting coal quality using **AI models trained on historical laboratory data**, geological information, mine characteristics, production records, and simulated sensor values. Operators receive actionable insights in minutes instead of days, enabling faster and more confident decisions across the value chain.

> **Current repository status:** This hackathon MVP ships a production-quality **React dashboard** with mock-integrated AI workflows. Backend ML services and live data pipelines are architected and documented below for full-stack deployment.

| Capability | Impact |
|------------|--------|
| ⚡ **Real-time quality prediction** | Reduce decision latency from days to minutes |
| 🎯 **Confidence-aware routing** | Automate high-trust decisions; escalate low-confidence cases to lab |
| 🔀 **Blend optimization** | Maximize calorific value while meeting contract constraints |
| 📊 **Executive analytics** | Unified view across 352+ mines and 7 subsidiary operations |

---

## 🚨 Problem Statement

Coal India Limited and similar operators manage hundreds of active mines with heterogeneous geology, production variability, and strict contractual quality specifications. The prevailing workflow creates a structural delay between extraction and informed action.

### Current Industry Workflow

```mermaid
flowchart TD
    A[🏔️ Mine Operations] --> B[🧪 Field Sampling]
    B --> C[🔬 Laboratory Testing]
    C --> D[⏳ Waiting Period<br/>24–72 hours]
    D --> E[📋 Manual Decision]
    E --> F[🚛 Dispatch / Blending / Pricing]

    style D fill:#FEE2E2,stroke:#DC2626,color:#991B1B
    style E fill:#FEF3C7,stroke:#D97706,color:#92400E
```

| Pain Point | Business Impact |
|------------|-----------------|
| **Lab turnaround time** | Delayed blending and dispatch decisions |
| **Reactive quality control** | Contract penalties and customer disputes |
| **Siloed data** | Geology, production, and lab results rarely unified |
| **Manual interpretation** | Inconsistent decisions across sites and shifts |
| **No confidence scoring** | Every prediction treated with equal trust |

These delays compound across subsidiaries, resulting in suboptimal blends, revenue leakage, and missed operational windows during peak demand.

---

## 💡 Our Solution

**CarbonCortex** introduces an AI-native decision layer that sits alongside — not instead of — established laboratory workflows. Predictions are scored, explained, and routed through the **Adaptive Trust Decision Intelligence Framework (ATDIF)**.

### Adaptive Trust Decision Intelligence Framework (ATDIF)

ATDIF is the core governance model of CarbonCortex. It ensures that AI predictions are never applied blindly. Instead, every output carries a **confidence score** and **explainability metadata** that determines the appropriate next action.

```mermaid
flowchart TD
    P[🤖 AI Quality Prediction] --> C{Confidence Score}
    C -->|High ≥ threshold| D[✅ Direct Decision<br/>Blend · Price · Dispatch]
    C -->|Low < threshold| L[🔬 Laboratory Verification]
    L --> F[📥 Feedback Loop]
    F --> M[🧠 Model Retraining]
    M --> P
    D --> F

    style D fill:#D1FAE5,stroke:#059669,color:#065F46
    style L fill:#DBEAFE,stroke:#0369A1,color:#1E3A8A
```

> ⚠️ **Important:** Laboratory testing is **not replaced**. CarbonCortex augments lab workflows by handling high-confidence cases autonomously and intelligently prioritizing lab resources for uncertain predictions.

| ATDIF Layer | Responsibility |
|-------------|----------------|
| **Prediction Engine** | GCV, ash, moisture, volatile matter forecasting |
| **Confidence Analyzer** | Statistical and model-uncertainty scoring |
| **Trust Router** | Auto-approve vs. lab-escalation decision tree |
| **Explainability (SHAP)** | Feature attribution for every prediction |
| **Feedback Ingestor** | Lab results feed continuous model improvement |

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 AI Coal Quality Prediction
Multi-parameter forecasting for GCV, ash content, moisture, and volatile matter using ensemble ML models trained on historical lab records.

### 🛡️ Adaptive Trust Decision Intelligence Framework
Confidence-scored routing that automates high-trust decisions and escalates uncertain predictions for laboratory verification.

### 🔬 Confidence-based Lab Verification
Smart lab queue prioritization — only samples below the confidence threshold require full wet-chemistry analysis.

### 🔀 Blend Optimization
OR-Tools powered constraint optimization to meet contract specifications while minimizing cost and maximizing calorific value.

</td>
<td width="50%">

### 🔍 Explainable AI (SHAP)
Per-prediction feature importance charts so geologists and plant managers understand *why* the model made each recommendation.

### 📊 Interactive Dashboard
Executive KPIs, mine-level drill-downs, quality trend charts, and real-time alert panels across all subsidiaries.

### 📈 Quality Trend Analysis
Time-series analytics with Prophet-based forecasting for proactive quality management.

### 🔄 Continuous Learning
Automated model retraining pipeline triggered by new lab results and production data ingestion.

### 📄 Automated Reports
Scheduled PDF/Excel report generation for compliance, dispatch, and executive review.

### ⛏️ Mining Analytics
Production throughput, seam-level performance, and cross-mine comparative benchmarking.

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Sources["📡 Data Sources"]
        DS1[Historical Lab Data]
        DS2[Geological Surveys]
        DS3[Mine Production Records]
        DS4[Simulated Sensor Streams]
        DS5[SAP / ERP Feeds]
    end

    subgraph Processing["⚙️ Data Processing Layer"]
        DP1[ETL Pipelines]
        DP2[Feature Engineering]
        DP3[Data Validation]
    end

    subgraph ML["🧠 AI Prediction Engine"]
        ML1[Ensemble Models<br/>XGBoost · Scikit-Learn]
        ML2[SHAP Explainability]
        ML3[Confidence Scoring]
    end

    subgraph ATDIF["🛡️ ATDIF Trust Router"]
        AT1{Confidence<br/>Threshold}
    end

    subgraph Opt["🔀 Blend Optimization"]
        OP1[Google OR-Tools<br/>Constraint Solver]
    end

    subgraph DI["🎯 Decision Intelligence"]
        DI1[Recommendations Engine]
        DI2[Scenario Simulation]
        DI3[Alert & Escalation]
    end

    subgraph UI["📊 Dashboard & API"]
        UI1[React Frontend]
        UI2[FastAPI Gateway]
        UI3[WebSocket Streams]
    end

    subgraph CL["🔄 Continuous Learning"]
        CL1[Feedback Collector]
        CL2[Model Registry]
        CL3[Automated Retraining]
    end

    Sources --> Processing
    Processing --> ML
    ML --> ATDIF
    ATDIF -->|High Confidence| Opt
    ATDIF -->|Low Confidence| DI
    Opt --> DI
    DI --> UI
    UI --> CL
    CL --> ML

    style ATDIF fill:#EFF6FF,stroke:#0369A1
    style ML fill:#F0FDF4,stroke:#059669
    style UI fill:#FAFAFA,stroke:#64748B
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | Component-based UI framework |
| **TypeScript** | Type-safe application logic |
| **TailwindCSS v4** | Utility-first styling system |
| **Radix UI / Shadcn** | Accessible, composable UI primitives |
| **Recharts** | Interactive data visualization |
| **Framer Motion** | Motion and transition design |
| **React Router v7** | Client-side routing |
| **Vite** | Build tooling and dev server |

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance async REST API |
| **Python 3.11+** | ML pipeline and service runtime |
| **SQLAlchemy** | ORM and database abstraction |
| **Pydantic** | Request/response validation |
| **Celery** | Async task queue for ML jobs |

### Database

| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary relational datastore |
| **Redis** | Caching, sessions, and job queue broker |

### Machine Learning

| Technology | Purpose |
|------------|---------|
| **Scikit-Learn** | Baseline models and preprocessing |
| **XGBoost** | Gradient boosting for quality prediction |
| **SHAP** | Model explainability and feature attribution |
| **Prophet** | Time-series quality trend forecasting |

### Optimization

| Technology | Purpose |
|------------|---------|
| **Google OR-Tools** | Constraint programming for blend optimization |

### Deployment

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerized services |
| **Railway** | Backend and database hosting |
| **Vercel** | Frontend CDN deployment |

---

## 📁 Folder Structure

<details>
<summary><strong>📂 Current Frontend Repository (Implemented)</strong></summary>

```
SKYHIGH_CIL-iMIN/
├── public/
│   ├── favicon.svg                 # Brand icon
│   └── icons.svg
├── src/
│   ├── App.tsx                     # Route definitions
│   ├── main.tsx                    # Application entry
│   ├── index.css                   # Global theme & Tailwind
│   ├── assets/                     # Static media
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx  # Session guard
│   │   ├── charts/
│   │   │   └── ChartComponents.tsx # Recharts wrappers
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── PageShell.tsx       # Layout primitives
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   └── ui/                     # Shadcn-style primitives
│   ├── data/
│   │   └── mockData.ts             # Demo datasets
│   ├── lib/
│   │   ├── auth.ts                 # Session management
│   │   └── utils.ts
│   └── pages/
│       ├── LandingPage.tsx
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── CoalQualityPredictionPage.tsx
│       ├── BlendOptimizationPage.tsx
│       ├── DecisionIntelligencePage.tsx
│       ├── ScenarioSimulatorPage.tsx
│       ├── ReportsPage.tsx
│       └── SettingsPage.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

</details>

<details>
<summary><strong>📂 Target Full-Stack Monorepo (Planned)</strong></summary>

```
carboncortex/
├── frontend/                       # React SPA (this repository)
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── predictions.py
│   │   │   │   ├── blends.py
│   │   │   │   ├── decisions.py
│   │   │   │   └── reports.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   │       ├── atdif/              # Trust routing engine
│   │       ├── ml/                 # Prediction pipelines
│   │       └── optimization/       # OR-Tools blend solver
│   ├── ml/
│   │   ├── training/
│   │   ├── inference/
│   │   ├── explainability/
│   │   └── registry/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── infra/
│   ├── docker-compose.yml
│   ├── postgres/
│   └── redis/
├── docs/
│   └── architecture/
└── README.md
```

</details>

---

## 🚀 Installation

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| Python | 3.11+ *(backend)* |
| Docker | 24+ *(optional)* |
| PostgreSQL | 15+ *(backend)* |
| Redis | 7+ *(backend)* |

---

### 🖥️ Frontend (Available Now)

```bash
# Clone the repository
git clone https://github.com/Charan-2006/SKYHIGH_CIL-iMIN.git
cd SKYHIGH_CIL-iMIN

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

```bash
# Production build
npm run build
npm run preview
```

| Route | Module |
|-------|--------|
| `/` | Landing page |
| `/login` | Authentication (email + Google OAuth mock) |
| `/dashboard` | Executive dashboard |
| `/prediction` | Coal quality prediction |
| `/blend` | Blend optimization |
| `/decisions` | Decision intelligence |
| `/simulator` | Scenario simulator |
| `/reports` | Reports & exports |
| `/settings` | Users, roles, AI configuration |

---

### 🐍 Backend (Planned)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
# .venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run API server
uvicorn app.main:app --reload --port 8000
```

API documentation will be available at **`http://localhost:8000/docs`**.

---

### 🗄️ Database

```bash
# Start PostgreSQL and Redis via Docker
docker compose -f infra/docker-compose.yml up -d postgres redis

# Run migrations
cd backend
alembic upgrade head
```

**Environment variables:**

```env
DATABASE_URL=postgresql://carboncortex:password@localhost:5432/carboncortex
REDIS_URL=redis://localhost:6379/0
ML_MODEL_PATH=./ml/registry/latest
ATDIF_CONFIDENCE_THRESHOLD=0.85
```

---

### 🐳 Docker (Full Stack)

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

| Service | Port |
|---------|------|
| Frontend | `5173` |
| FastAPI | `8000` |
| PostgreSQL | `5432` |
| Redis | `6379` |

---

## 🧠 AI Pipeline

```mermaid
flowchart LR
    A[📚 Historical Data<br/>Lab · Geology · Production] --> B[🔧 Preprocessing<br/>Clean · Encode · Feature Engineering]
    B --> C[🤖 Prediction<br/>XGBoost Ensemble]
    C --> D[📊 Confidence Analysis<br/>Uncertainty · Calibration]
    D --> E{ATDIF<br/>Decision Router}
    E -->|High| F[✅ Operational Decision]
    E -->|Low| G[🔬 Lab Verification]
    G --> H[📥 Ground Truth Feedback]
    F --> H
    H --> I[🔄 Continuous Learning<br/>Retrain · Validate · Deploy]
    I --> B

    style E fill:#EFF6FF,stroke:#0369A1
    style I fill:#F0FDF4,stroke:#059669
```

| Stage | Input | Output |
|-------|-------|--------|
| **Preprocessing** | Raw lab, geology, production records | Normalized feature matrix |
| **Prediction** | Feature matrix | GCV, ash, moisture, VM estimates |
| **Confidence Analysis** | Model uncertainty + data drift score | Trust score (0–1) |
| **Decision** | Trust score + business rules | Auto-approve or lab escalation |
| **Continuous Learning** | Verified lab results | Updated model weights |

---

## 🔭 Future Scope

<table>
<tr>
<td align="center" width="33%">

### 📡 Real Sensor Integration
Live feed from on-belt analyzers, NIR spectrometers, and plant instrumentation for real-time quality monitoring.

</td>
<td align="center" width="33%">

### 🌐 IoT Edge Pipeline
Edge-compute nodes at mine sites for low-latency inference with intermittent connectivity support.

</td>
<td align="center" width="33%">

### 🏭 Digital Twin
Virtual mine replicas for simulation-driven planning, what-if analysis, and production forecasting.

</td>
</tr>
<tr>
<td align="center" width="33%">

### 🔧 Predictive Maintenance
Equipment health scoring linked to production quality variance and downtime prevention.

</td>
<td align="center" width="33%">

### 🌱 Carbon Footprint Analytics
Emissions tracking, scope reporting, and sustainability KPI dashboards for ESG compliance.

</td>
<td align="center" width="33%">

### 🏢 Enterprise ERP Integration
Native SAP, Oracle, and SCADA connectors for seamless operational data flow.

</td>
</tr>
</table>

---

## 👥 Team

**Team Lead**

<table>
<tr>
<td align="center">
<img src="https://github.com/Charan-2006.png" width="100" style="border-radius:50%" alt="Charan Annamalai" />
<br /><br />
<strong>Charan Annamalai</strong>
<br /><br />
<a href="https://github.com/Charan-2006">GitHub</a>
</td>
</tr>
</table>

**Team Members**

- Magesh K
- Sivaprian M
- Vijaysaran S

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 CarbonCortex / SKYHIGH Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with precision for India's coal future**

⛏️ **CarbonCortex** — *Predict • Optimize • Decide*

<br />

[![Star this repo](https://img.shields.io/github/stars/Charan-2006/SKYHIGH_CIL-iMIN?style=social)](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN/stargazers)
[![Fork this repo](https://img.shields.io/github/forks/Charan-2006/SKYHIGH_CIL-iMIN?style=social)](https://github.com/Charan-2006/SKYHIGH_CIL-iMIN/network/members)

</div>
