import datetime
import uuid
from fastapi import APIRouter, Body
from app.schemas.stadium import SOSRequestPayload, SOSRequestResponse, StadiumRouteResponse, RouteSegmentSchema

router = APIRouter()

@router.post("/emergency/sos", response_model=SOSRequestResponse)
async def trigger_sos(payload: SOSRequestPayload = Body(...)):
  """Logs and triggers security/medical beacons."""
  return SOSRequestResponse(
    id="sos_" + str(uuid.uuid4())[:8],
    type=payload.type,
    locationDescription=payload.locationDescription,
    status="active",
    createdAt=datetime.datetime.utcnow()
  )

@router.get("/emergency/evacuate/{current_zone}")
async def get_evacuation_instructions(current_zone: str):
  """Returns exit paths for fans during structural or fire emergencies."""
  return {
    "sourceZone": current_zone,
    "exitGateId": "g1",
    "exitGateName": "North Gate 1",
    "recommendedPathInstructions": [
      "Leave seats immediately. Leave bulky items behind.",
      "Follow green floor illumination strips towards the Gate 1 corridor.",
      "Assemble in the outer North Car Park area."
    ]
  }
