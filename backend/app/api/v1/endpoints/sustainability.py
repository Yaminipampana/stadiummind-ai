from fastapi import APIRouter, Body
from app.schemas.stadium import SustainabilityReportResponse, WasteBinSchema, TransitAlternativeSchema, RecyclePayload

router = APIRouter()

@router.get("/sustainability/report", response_model=SustainabilityReportResponse)
async def get_sustainability_report():
  """Returns aggregate metrics on clean energy, transit, and fill levels of trash bins."""
  waste_bins = [
    WasteBinSchema(binId="b1", type="recycling", fillPercentage=42, locationDescription="Section 102 Concourse"),
    WasteBinSchema(binId="b2", type="compost", fillPercentage=88, locationDescription="Food Court Level 1"),
    WasteBinSchema(binId="b3", type="landfill", fillPercentage=15, locationDescription="Section 114 Concourse"),
    WasteBinSchema(binId="b4", type="recycling", fillPercentage=67, locationDescription="Gate 3 Entrance Lobby"),
  ]
  
  transit = [
    TransitAlternativeSchema(routeNumber="Metro Red Line", destination="Downtown LA Hub", type="subway", nextDepartureMinutes=6, status="on-time"),
    TransitAlternativeSchema(routeNumber="Shuttle 401", destination="East Car Park", type="shuttle", nextDepartureMinutes=3, status="crowded"),
    TransitAlternativeSchema(routeNumber="Bus 102", destination="Union Station", type="bus", nextDepartureMinutes=12, status="delayed"),
  ]

  return SustainabilityReportResponse(
    co2SavedKg=452.4,
    cleanEnergyPercentage=85,
    recycledTons=3.4,
    greenTransitUsageRate=72,
    wasteBins=waste_bins,
    transit=transit
  )

@router.post("/sustainability/recycle")
async def log_recycle_action(payload: RecyclePayload = Body(...)):
  """Logs trash recycling and credits rewards points to user account."""
  reward_scale = {"bottle": 10, "can": 15, "cardboard": 5}
  points_per_item = reward_scale.get(payload.itemType.lower(), 5)
  total_points = points_per_item * payload.count
  return {"success": True, "rewardPoints": total_points}
