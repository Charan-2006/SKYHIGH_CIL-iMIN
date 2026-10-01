from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class LocationSchema(BaseModel):
    latitude: float
    longitude: float

class MineResponse(BaseModel):
    id: str
    name: str
    code: str
    subsidiary: str
    coalfield: str
    state: str
    location: LocationSchema
    active: bool = True
    capacity_mtpa: float = 10.0

class CoalSampleCreate(BaseModel):
    sample_code: Optional[str] = None
    mine_id: Optional[str] = None
    mine_name: str
    seam: str = "Seam-IV"
    coalfield: str
    state: str
    depth: float = 120.0
    location: Optional[LocationSchema] = None
    geological_features: Optional[Dict[str, Any]] = None
    production_features: Optional[Dict[str, Any]] = None
    sensor_features: Optional[Dict[str, Any]] = None
    moisture: Optional[float] = None
    ash: Optional[float] = None
    volatile_matter: Optional[float] = None
    fixed_carbon: Optional[float] = None
    sulphur: Optional[float] = None

class CoalSampleResponse(BaseModel):
    id: str
    sample_code: str
    mine_id: Optional[str] = None
    mine_name: str
    seam: str
    coalfield: str
    state: str
    depth: float
    location: Optional[LocationSchema] = None
    created_at: datetime
