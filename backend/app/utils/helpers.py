import os
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.db.mongodb import get_audit_logs_col

_COAL_GRADES_CACHE = None

def load_coal_grades():
    global _COAL_GRADES_CACHE
    if _COAL_GRADES_CACHE is not None:
        return _COAL_GRADES_CACHE
    
    file_path = os.path.join(settings.CONFIG_DIR, "coal_grades.json")
    if os.path.exists(file_path):
        try:
            with open(file_path, "r") as f:
                _COAL_GRADES_CACHE = json.load(f)
                return _COAL_GRADES_CACHE
        except Exception as e:
            logger.error(f"Error loading coal_grades.json: {e}")
            
    # Default fallback CIL grading
    _COAL_GRADES_CACHE = [
        { "grade": "G1", "min_gcv": 7001, "max_gcv": 10000 },
        { "grade": "G2", "min_gcv": 6701, "max_gcv": 7000 },
        { "grade": "G3", "min_gcv": 6401, "max_gcv": 6700 },
        { "grade": "G4", "min_gcv": 6101, "max_gcv": 6400 },
        { "grade": "G5", "min_gcv": 5801, "max_gcv": 6100 },
        { "grade": "G6", "min_gcv": 5501, "max_gcv": 5800 },
        { "grade": "G7", "min_gcv": 5201, "max_gcv": 5500 },
        { "grade": "G8", "min_gcv": 4901, "max_gcv": 5200 },
        { "grade": "G9", "min_gcv": 4601, "max_gcv": 4900 },
        { "grade": "G10", "min_gcv": 4301, "max_gcv": 4600 },
        { "grade": "G11", "min_gcv": 4001, "max_gcv": 4300 },
        { "grade": "G12", "min_gcv": 3701, "max_gcv": 4000 },
        { "grade": "G13", "min_gcv": 3401, "max_gcv": 3700 },
        { "grade": "G14", "min_gcv": 3101, "max_gcv": 3400 },
        { "grade": "G15", "min_gcv": 2801, "max_gcv": 3100 },
        { "grade": "G16", "min_gcv": 2501, "max_gcv": 2800 },
        { "grade": "G17", "min_gcv": 2201, "max_gcv": 2500 }
    ]
    return _COAL_GRADES_CACHE

def determine_coal_grade(gcv: float) -> str:
    """Determines CIL coal grade according to backend configuration rules."""
    grades = load_coal_grades()
    for item in grades:
        if gcv >= item.get("min_gcv", 0) and gcv <= item.get("max_gcv", 100000):
            return item.get("grade", "G17")
    if gcv > 7000:
        return "G1"
    return "G17"

def calculate_quality_score(gcv: float, ash: float, moisture: float, volatile_matter: float, fixed_carbon: float) -> float:
    """
    Transparent quality score formula:
    - 50% GCV relative to high quality benchmark (7000 kcal/kg)
    - 25% Ash penalty factor (100 - Ash*2.5, higher ash lowers score)
    - 15% Moisture penalty factor (100 - Moisture*5.0)
    - 10% Fixed Carbon contribution factor (FC / 60 * 100)
    Clamped strictly between 0 and 100.
    """
    gcv_score = min(100.0, max(0.0, (gcv / 7000.0) * 100.0))
    ash_score = min(100.0, max(0.0, 100.0 - (ash * 2.2)))
    moist_score = min(100.0, max(0.0, 100.0 - (moisture * 4.5)))
    fc_score = min(100.0, max(0.0, (fixed_carbon / 60.0) * 100.0))
    
    total = (0.50 * gcv_score) + (0.25 * ash_score) + (0.15 * moist_score) + (0.10 * fc_score)
    return round(float(min(100.0, max(0.0, total))), 2)

def log_audit(user_id: str, username: str, action: str, resource_id: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None):
    """Asynchronously logs critical actions to the MongoDB audit_logs collection."""
    try:
        col = get_audit_logs_col()
        doc = {
            "user_id": user_id,
            "username": username,
            "action": action,
            "resource_id": resource_id,
            "timestamp": datetime.now(timezone.utc),
            "metadata": metadata or {}
        }
        col.insert_one(doc)
    except Exception as e:
        logger.warning(f"Audit log insertion failed: {e}")
