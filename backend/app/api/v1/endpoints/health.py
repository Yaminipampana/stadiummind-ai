import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

START_TIME = time.time()

@router.get("/health", tags=["health"])
async def health_check(db: Session = Depends(get_db)):
    """Tests the integrity of the API container and PostgreSQL connection."""
    db_status = "healthy"
    try:
        # Perform light execution query to test DB driver health
        db.execute("SELECT 1")
    except Exception:
        db_status = "unreachable"

    return {
        "status": "online" if db_status == "healthy" else "degraded",
        "version": "1.0.0",
        "uptime_seconds": int(time.time() - START_TIME),
        "database": db_status
    }
