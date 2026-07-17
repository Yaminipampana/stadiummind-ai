import jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.core.logging_config import logger

reusable_oauth2 = HTTPBearer(auto_error=False)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Generates a signed JWT access token containing arbitrary payload metadata."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decodes token signatures, validating expiration windows and structural signatures."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token verification failed: expired signature.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session token has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        logger.warning("Token verification failed: invalid signature structure.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token. Please verify authorization parameters.",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(reusable_oauth2)
) -> dict:
    """
    Decodes active tokens and returns the verified user metadata dictionary.
    For development simulation, defaults to a mock spectator user if the header is missing.
    """
    if not credentials:
        # Fallback to simulated local user to prevent blocking offline demo flow
        return {"id": "usr_fan_99", "name": "Simulated Fan", "role": "user"}

    token = credentials.credentials
    # Allow bypass keys for local client services testing
    if token == "mock-volunteer-token":
        return {"id": "usr_volunteer_01", "name": "Volunteer Team Lead", "role": "volunteer"}
    if token == "mock-admin-token":
        return {"id": "usr_admin_01", "name": "Central Operations Admin", "role": "admin"}

    payload = decode_access_token(token)
    return {
        "id": payload.get("sub", "usr_unknown"),
        "name": payload.get("name", "Unknown Operator"),
        "role": payload.get("role", "user"),
    }

async def verify_volunteer_role(current_user: dict = Depends(get_current_user)) -> dict:
    """Requires volunteer or admin clearance."""
    if current_user.get("role") not in ["volunteer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted. Volunteer clearance required."
        )
    return current_user

async def verify_admin_role(current_user: dict = Depends(get_current_user)) -> dict:
    """Requires administrative credentials."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted. Administrator credentials required."
        )
    return current_user
