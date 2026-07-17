from fastapi import APIRouter, Body
from app.schemas.stadium import AdminConfigUpdate, AdminStatsResponse

router = APIRouter()

# Static in-memory configurations
SYSTEM_CONFIG = {
  "stadiumName": "StadiumMind Stadium, LA",
  "currentEvent": "USA vs England (Group B)",
  "totalCapacity": 65000,
  "aiMode": "autonomous",
  "activeGates": ["Gate 1", "Gate 2", "Gate 3", "Gate 4"]
}

@router.get("/admin/config")
async def get_system_config():
  """Returns current active stadium metadata parameters."""
  return SYSTEM_CONFIG

@router.put("/admin/config")
async def update_system_config(payload: AdminConfigUpdate = Body(...)):
  """Modifies general parameters including AI logic settings."""
  global SYSTEM_CONFIG
  if payload.stadiumName is not None:
    SYSTEM_CONFIG["stadiumName"] = payload.stadiumName
  if payload.currentEvent is not None:
    SYSTEM_CONFIG["currentEvent"] = payload.currentEvent
  if payload.totalCapacity is not None:
    SYSTEM_CONFIG["totalCapacity"] = payload.totalCapacity
  if payload.aiMode is not None:
    SYSTEM_CONFIG["aiMode"] = payload.aiMode
  if payload.activeGates is not None:
    SYSTEM_CONFIG["activeGates"] = payload.activeGates
  return SYSTEM_CONFIG

@router.get("/admin/stats", response_model=AdminStatsResponse)
async def get_admin_stats():
  """Fetches aggregate monitoring data across systems."""
  return AdminStatsResponse(
    activeVolunteers=42,
    openTasks=18,
    activeIncidents=3,
    sustainabilityIndex=88,
    gateThroughputRate=185
  )

@router.post("/admin/broadcast")
async def broadcast_alert(payload: dict = Body(...)):
  """Sends push warnings or weather updates to all fans."""
  return {"success": True, "alertId": "alt_104"}
