from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import logger
from app.db.mongodb import db_manager
from app.db.indexes import create_mongodb_indexes
from app.ml.predict import PredictionOrchestrator

from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.predictions import router as predictions_router
from app.api.laboratory import router as laboratory_router
from app.api.blending import router as blending_router
from app.api.dispatch import router as dispatch_router
from app.api.scenarios import router as scenarios_router
from app.api.models import router as models_router
from app.api.reports import router as reports_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing CarbonCortex backend application...")
    # 1. Connect MongoDB
    db_manager.connect()
    # 2. Ensure indexes
    create_mongodb_indexes()
    # 3. Auto-seed if empty
    from app.db.mongodb import get_users_col
    if get_users_col().count_documents({}) == 0:
        logger.info("Database is empty on startup. Triggering initial seeding...")
        from scripts.seed_database import seed_database
        seed_database()
    # 4. Load ML models and preprocessing pipeline into memory
    PredictionOrchestrator.get_instance().load_models()
    logger.info("CarbonCortex startup complete. Ready for enterprise inference.")
    yield
    # Shutdown sequence
    logger.info("Shutting down CarbonCortex backend...")
    db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "CarbonCortex: AI Powered Coal Quality & Decision Intelligence Platform.\n\n"
        "Features real XGBoost regression inference for GCV, Ash, Moisture, VM, and Fixed Carbon, "
        "quantitative confidence estimation via ATDIF (Adaptive Trust Decision Intelligence Framework), "
        "SHAP TreeExplainer game-theoretic attributions, Google OR-Tools GLOP blending optimization, "
        "laboratory feedback continuous learning, and what-if scenario simulations."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception during {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred while processing telemetry data."}
    )

# System Health Endpoint
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "CarbonCortex AI Backend",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": "connected" if db_manager.db is not None else "disconnected",
        "database_mode": "mock_fallback" if db_manager.is_mock else "mongodb_live",
        "ml_engine": "loaded" if PredictionOrchestrator.get_instance().is_loaded else "unloaded",
        "active_model": PredictionOrchestrator.get_instance().active_version
    }

# Register all API routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(predictions_router, prefix=settings.API_V1_STR)
app.include_router(laboratory_router, prefix=settings.API_V1_STR)
app.include_router(blending_router, prefix=settings.API_V1_STR)
app.include_router(dispatch_router, prefix=settings.API_V1_STR)
app.include_router(scenarios_router, prefix=settings.API_V1_STR)
app.include_router(models_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
