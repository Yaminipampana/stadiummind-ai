import datetime
import uuid
from fastapi import APIRouter, Body
from app.schemas.stadium import AccessibilityFacility, WheelchairRequestPayload, WheelchairRequestResponse

router = APIRouter()

MOCK_FACILITIES = [
  AccessibilityFacility(id="ac1", facilityName="Main Elevator East (Gate 2)", type="elevator", status="operational"),
  AccessibilityFacility(id="ac2", facilityName="Elevator West (Gate 4)", type="elevator", status="operational"),
  AccessibilityFacility(id="ac3", facilityName="Access Ramp Gate 1 Entrance", type="ramp", status="operational"),
  AccessibilityFacility(id="ac4", facilityName="Sensory Quite Room A (Level 2)", type="sensory-room", status="operational"),
  AccessibilityFacility(id="ac5", facilityName="Sensory Quite Room B (Level 3)", type="sensory-room", status="maintenance", alternativeRouteInstructions="Please utilize Sensory Quiet Room A on Level 2."),
]

@router.get("/accessibility/facilities", response_model=list[AccessibilityFacility])
async def get_facilities():
  """Returns the health status of elevator lift services and quiet rooms."""
  return MOCK_FACILITIES

@router.post("/accessibility/wheelchair-request", response_model=WheelchairRequestResponse)
async def request_wheelchair_assistance(payload: WheelchairRequestPayload = Body(...)):
  """Submits requests for standard wheelchairs or mobility guidance."""
  return WheelchairRequestResponse(
    id="req_" + str(uuid.uuid4())[:8],
    userLocation=payload.locationName,
    userPhone=payload.contactPhone,
    status="requested",
    assignedVolunteerId=None,
    createdAt=datetime.datetime.utcnow()
  )

@router.get("/accessibility/wheelchair-request/{request_id}", response_model=WheelchairRequestResponse)
async def get_wheelchair_status(request_id: str):
  """Checks dispatch status for a mobility aid request."""
  return WheelchairRequestResponse(
    id=request_id,
    userLocation="Gate 4 Concourse",
    userPhone="+15551234",
    status="dispatched",
    assignedVolunteerId="usr_volunteer_12",
    createdAt=datetime.datetime.utcnow()
  )
