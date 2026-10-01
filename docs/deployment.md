# CarbonCortex Deployment Guide

## 1. Local Development Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- MongoDB (local on `localhost:27017` or MongoDB Atlas URI; fallback in-memory mock engine is supported out-of-the-box).

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Generate synthetic training data (6,000 samples)
python scripts/generate_demo_data.py

# Train XGBoost multi-target regression models
python scripts/train_models.py

# Seed initial MongoDB collections (users, mines, baseline samples)
python scripts/seed_database.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

### Step 2: Frontend Setup
```bash
# In project root
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 2. Docker & Containerized Orchestration

To run the full stack (Frontend + FastAPI Backend + MongoDB) in Docker containers:

```bash
docker-compose up --build -d
```

- Frontend: `http://localhost:80` (or `http://localhost:5173`)
- Backend API & Swagger: `http://localhost:8000/docs`
- MongoDB: `localhost:27017`
