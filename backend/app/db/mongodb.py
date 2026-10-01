import os
from typing import Optional
from pymongo import MongoClient
import mongomock
from app.core.config import settings
from app.core.logging import logger

class MongoDBManager:
    client: Optional[MongoClient] = None
    db = None
    is_mock: bool = False

    def connect(self):
        """Initializes connection to MongoDB (Atlas or local), with in-memory fallback if unreachable."""
        if self.client is not None:
            return self.db
        
        uri = settings.MONGODB_URI
        db_name = settings.DATABASE_NAME
        
        try:
            logger.info(f"Connecting to MongoDB at: {uri} (Database: {db_name})")
            # Set short serverSelectionTimeoutMS so we fail fast to fallback if no local server
            real_client = MongoClient(uri, serverSelectionTimeoutMS=2000)
            # Verify connection with ping
            real_client.admin.command('ping')
            self.client = real_client
            self.db = self.client[db_name]
            self.is_mock = False
            logger.info("Successfully connected to live MongoDB server!")
        except Exception as e:
            logger.warning(f"Could not connect to live MongoDB ({e}). Activating internal MongoDB storage engine (mongomock).")
            self.client = mongomock.MongoClient()
            self.db = self.client[db_name]
            self.is_mock = True
            logger.info("Internal MongoDB engine initialized and ready for all operations.")
        
        return self.db

    def close(self):
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            logger.info("MongoDB connection closed.")

    def get_collection(self, name: str):
        if self.db is None:
            self.connect()
        return self.db[name]

db_manager = MongoDBManager()

def get_database():
    if db_manager.db is None:
        db_manager.connect()
    return db_manager.db

# Named collection getters
def get_users_col(): return db_manager.get_collection("users")
def get_mines_col(): return db_manager.get_collection("mines")
def get_coal_samples_col(): return db_manager.get_collection("coal_samples")
def get_geological_records_col(): return db_manager.get_collection("geological_records")
def get_production_records_col(): return db_manager.get_collection("production_records")
def get_sensor_readings_col(): return db_manager.get_collection("sensor_readings")
def get_laboratory_results_col(): return db_manager.get_collection("laboratory_results")
def get_predictions_col(): return db_manager.get_collection("predictions")
def get_confidence_assessments_col(): return db_manager.get_collection("confidence_assessments")
def get_verification_requests_col(): return db_manager.get_collection("verification_requests")
def get_blend_scenarios_col(): return db_manager.get_collection("blend_scenarios")
def get_blend_results_col(): return db_manager.get_collection("blend_results")
def get_dispatch_recommendations_col(): return db_manager.get_collection("dispatch_recommendations")
def get_scenario_runs_col(): return db_manager.get_collection("scenario_runs")
def get_model_versions_col(): return db_manager.get_collection("model_versions")
def get_model_metrics_col(): return db_manager.get_collection("model_metrics")
def get_audit_logs_col(): return db_manager.get_collection("audit_logs")
