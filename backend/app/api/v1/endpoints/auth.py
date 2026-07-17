from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.core.security import create_access_token, get_current_user

router = APIRouter()

# 1. Pydantic schemas for request validation
class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# 2. Hardcoded mock users data for development simulation
MOCK_USERS_DB = {
    "admin@stadiummind.ai": {
        "id": "usr_admin_01",
        "name": "Central Operations Admin",
        "password": "password123",
        "role": "admin"
    },
    "volunteer@stadiummind.ai": {
        "id": "usr_volunteer_01",
        "name": "Volunteer Team Lead",
        "password": "password123",
        "role": "volunteer"
    },
    "fan@stadiummind.ai": {
        "id": "usr_fan_99",
        "name": "Simulated Fan",
        "password": "password123",
        "role": "user"
    }
}

@router.post("/login", response_model=TokenResponseSchema, tags=["authentication"])
async def login(credentials: UserLoginSchema):
    """
    Simulates database verification and signs a JWT access token.
    Mock Accounts:
    - Admin: admin@stadiummind.ai / password123
    - Volunteer: volunteer@stadiummind.ai / password123
    - Fan: fan@stadiummind.ai / password123
    """
    email = credentials.email.lower()
    user_record = MOCK_USERS_DB.get(email)
    
    if not user_record or user_record["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password. Check your credentials."
        )

    # Issue JWT access token
    token_payload = {
        "sub": user_record["id"],
        "name": user_record["name"],
        "role": user_record["role"],
        "email": email
    }
    access_token = create_access_token(data=token_payload)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_record["id"],
            "name": user_record["name"],
            "role": user_record["role"],
            "email": email
        }
    }

@router.post("/register", tags=["authentication"])
async def register(profile: UserRegisterSchema):
    """Placeholder endpoint for registering new stadium users."""
    email = profile.email.lower()
    
    if email in MOCK_USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An operator ticket with this email address already exists."
        )

    return {
        "success": True,
        "message": "Operator ticket registered successfully. Access granted for simulations.",
        "user": {
            "name": profile.name,
            "email": email,
            "role": "user"
        }
    }

@router.get("/me", tags=["authentication"])
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Retrieves session profile attributes using the parsed authorization token."""
    return {
        "success": True,
        "user": current_user
    }
