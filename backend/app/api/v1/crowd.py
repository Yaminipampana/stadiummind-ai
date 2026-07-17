// backend/app/api/v1/crowd.py
from fastapi import APIRouter
from pydantic import BaseModel
import random
import datetime

router = APIRouter()

class CrowdPoint(BaseModel):
    lat: float
    lng: float
    intensity: float  # 0-1 scale

class CrowdResponse(BaseModel):
    timestamp: str
    points: list[CrowdPoint]

def generate_mock_points(num: int = 50) -> list[CrowdPoint]:
    # Generate random points around world center
    points = []
    for _ in range(num):
        lat = random.uniform(-60, 80)
        lng = random.uniform(-180, 180)
        intensity = random.uniform(0.1, 1.0)
        points.append(CrowdPoint(lat=lat, lng=lng, intensity=intensity))
    return points

@router.get("/crowd", response_model=CrowdResponse)
async def get_crowd_data():
    """Return simulated crowd density points with a timestamp."""
    timestamp = datetime.datetime.utcnow().isoformat() + "Z"
    points = generate_mock_points(100)
    return CrowdResponse(timestamp=timestamp, points=points)
