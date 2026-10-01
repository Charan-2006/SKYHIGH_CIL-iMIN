import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserResponse, ProfileUpdateRequest
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user_payload, require_roles
from app.db.mongodb import get_users_col
from app.utils.helpers import log_audit

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    users_col = get_users_col()
    user = users_col.find_one({
        "$or": [
            {"username": request.username},
            {"email": request.username}
        ]
    })
    
    if not user or not verify_password(request.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = str(user.get("_id", user.get("id", uuid.uuid4().hex)))
    token = create_access_token(
        subject=user_id,
        role=user.get("role", "VIEWER")
    )

    log_audit(user_id=user_id, username=user.get("username", "user"), action="USER_LOGIN")

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user_id,
        username=user.get("username", ""),
        email=user.get("email", ""),
        full_name=user.get("full_name", user.get("username", "")),
        role=user.get("role", "VIEWER")
    )

@router.post("/register", response_model=UserResponse)
def register(request: UserCreate, current_user: dict = Depends(require_roles(["ADMIN"]))):
    users_col = get_users_col()
    if users_col.find_one({"$or": [{"username": request.username}, {"email": request.email}]}):
        raise HTTPException(status_code=400, detail="Username or email already exists.")

    user_id = uuid.uuid4().hex
    user_doc = {
        "id": user_id,
        "username": request.username,
        "email": request.email,
        "full_name": request.full_name,
        "role": request.role.upper(),
        "subsidiary": request.subsidiary,
        "password_hash": get_password_hash(request.password),
        "created_at": datetime.now(timezone.utc)
    }
    users_col.insert_one(user_doc)

    return UserResponse(
        id=user_id,
        username=user_doc["username"],
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        role=user_doc["role"],
        subsidiary=user_doc["subsidiary"],
        created_at=user_doc["created_at"]
    )

@router.get("/me", response_model=UserResponse)
def get_me(payload: dict = Depends(get_current_user_payload)):
    user_id = payload.get("sub")
    users_col = get_users_col()
    user = users_col.find_one({"$or": [{"id": user_id}, {"username": user_id}]})
    if not user:
        # Fallback to payload representation
        return UserResponse(
            id=str(user_id),
            username=payload.get("username", "current_user"),
            email="user@carboncortex.cil",
            full_name="CarbonCortex Operator",
            role=payload.get("role", "VIEWER")
        )
    return UserResponse(
        id=str(user.get("id", user.get("_id"))),
        username=user.get("username", ""),
        email=user.get("email", ""),
        full_name=user.get("full_name", ""),
        role=user.get("role", "VIEWER"),
        subsidiary=user.get("subsidiary", "CIL"),
        created_at=user.get("created_at")
    )

@router.put("/profile", response_model=UserResponse)
def update_profile(request: ProfileUpdateRequest, payload: dict = Depends(get_current_user_payload)):
    user_id = payload.get("sub")
    users_col = get_users_col()
    update_data = {}
    if request.full_name: update_data["full_name"] = request.full_name
    if request.email: update_data["email"] = request.email
    if request.subsidiary: update_data["subsidiary"] = request.subsidiary
    
    if request.new_password:
        user = users_col.find_one({"$or": [{"id": user_id}, {"username": user_id}]})
        if user and request.current_password:
            if not verify_password(request.current_password, user.get("password_hash", "")):
                raise HTTPException(status_code=400, detail="Current password incorrect.")
        update_data["password_hash"] = get_password_hash(request.new_password)

    if update_data:
        users_col.update_one({"$or": [{"id": user_id}, {"username": user_id}]}, {"$set": update_data})

    return get_me(payload)

@router.get("/users", response_model=list[UserResponse])
def list_users(current_user: dict = Depends(require_roles(["ADMIN"]))):
    users_col = get_users_col()
    users = list(users_col.find())
    res = []
    for u in users:
        res.append(UserResponse(
            id=str(u.get("id", u.get("_id"))),
            username=u.get("username", ""),
            email=u.get("email", ""),
            full_name=u.get("full_name", ""),
            role=u.get("role", "VIEWER"),
            subsidiary=u.get("subsidiary", "CIL"),
            created_at=u.get("created_at")
        ))
    return res
