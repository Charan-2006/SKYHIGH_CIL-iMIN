from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class LoginRequest(BaseModel):
    username: str = Field(..., description="Username or email")
    password: str = Field(..., min_length=4)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
    email: str
    full_name: str
    role: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: str = "VIEWER"  # ADMIN, ENGINEER, LAB_TECHNICIAN, VIEWER
    subsidiary: Optional[str] = "CIL"

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    subsidiary: Optional[str] = None
    created_at: Optional[datetime] = None

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    subsidiary: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None
