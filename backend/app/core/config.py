import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CarbonCortex AI Coal Quality & Decision Intelligence Platform"
    VERSION: str = "4.2.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    
    # MongoDB settings
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "carboncortex"
    
    # JWT & Auth
    JWT_SECRET: str = "carboncortex-super-secret-jwt-key-2026-cil-imin"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Machine Learning & ATDIF
    CONFIDENCE_THRESHOLD: float = 0.85
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models", "trained")
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
    CONFIG_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "config")
    
    # CORS
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        return ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()
