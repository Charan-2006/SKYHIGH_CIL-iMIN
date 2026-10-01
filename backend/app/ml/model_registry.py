import os
import joblib
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.core.logging import logger
from app.db.mongodb import get_model_versions_col

class ModelRegistry:
    @staticmethod
    def get_active_model_version() -> Optional[Dict[str, Any]]:
        try:
            col = get_model_versions_col()
            active = col.find_one({"status": "ACTIVE"})
            if active:
                active["id"] = str(active["_id"])
                active.pop("_id", None)
                return active
        except Exception as e:
            logger.warning(f"Error reading active model from DB: {e}")
        return None

    @staticmethod
    def register_version(
        version: str,
        status: str,
        dataset_version: str,
        training_samples: int,
        verified_samples: int,
        metrics: Dict[str, Any],
        model_paths: Dict[str, str],
        preprocessing_path: str
    ):
        try:
            col = get_model_versions_col()
            # If activating, demote any currently active version to RETIRED
            if status == "ACTIVE":
                col.update_many({"status": "ACTIVE"}, {"$set": {"status": "RETIRED"}})
                
            doc = {
                "version": version,
                "status": status,
                "dataset_version": dataset_version,
                "training_samples": training_samples,
                "verified_samples": verified_samples,
                "metrics": metrics,
                "model_paths": model_paths,
                "preprocessing_path": preprocessing_path,
                "created_at": datetime.now(timezone.utc)
            }
            col.update_one({"version": version}, {"$set": doc}, upsert=True)
            logger.info(f"Model version {version} registered with status: {status}")
            return doc
        except Exception as e:
            logger.error(f"Error registering model version {version}: {e}")
            return None

    @staticmethod
    def list_versions() -> List[Dict[str, Any]]:
        try:
            col = get_model_versions_col()
            docs = list(col.find().sort("created_at", -1))
            for d in docs:
                d["id"] = str(d["_id"])
                d.pop("_id", None)
            return docs
        except Exception as e:
            logger.warning(f"Error fetching model versions: {e}")
            return []
