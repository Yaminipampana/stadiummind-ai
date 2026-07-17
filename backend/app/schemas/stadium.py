from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any

# Chat Assistant
class ChatRequest(BaseModel):
  message: str
  session_id: Optional[str] = None

class ChatResponse(BaseModel):
  reply: str
  session_id: str
  timestamp: datetime

# Crowd Monitoring
class CrowdPoint(BaseModel):
  lat: float
  lng: float
  intensity: float
  section: str

class GateThroughputSchema(BaseModel):
  gateId: str
  gateName: str
  currentFlow: int
  capacity: int
  status: str

class CrowdStatsResponse(BaseModel):
  timestamp: datetime
  totalAttendance: int
  overallDensityIndex: int
  heatpoints: list[CrowdPoint]
  gates: list[GateThroughputSchema]

# Navigation
class POISchema(BaseModel):
  id: str
  name: str
  type: str
  lat: float
  lng: float
  level: int
  isAccessible: bool
  status: str

  class Config:
    from_attributes = True

class RouteRequest(BaseModel):
  source_id: str
  dest_id: str
  accessible_only: bool = False

class RouteSegmentSchema(BaseModel):
  lat: float
  lng: float

class StadiumRouteResponse(BaseModel):
  sourceId: str
  destId: str
  points: list[RouteSegmentSchema]
  distanceMeters: float
  estimatedSeconds: int
  isAccessibleRoute: bool
  instructions: list[str]

# Queue Predictions
class AlternativeStand(BaseModel):
  poiId: str
  poiName: str
  waitMinutes: int
  distanceMeters: float

class QueuePredictionResponse(BaseModel):
  poiId: str
  poiName: str
  poiType: str
  currentWaitMinutes: int
  predictedWait15Min: int
  predictedWait30Min: int
  trend: str
  queueLengthCount: int
  alternatives: list[AlternativeStand]

# Volunteers
class VolunteerTaskResponse(BaseModel):
  id: str
  title: str
  description: str
  locationName: str
  priority: str
  status: str
  assignedToId: Optional[str] = None
  createdAt: datetime
  updatedAt: datetime

class TaskClaimRequest(BaseModel):
  volunteer_id: str

class TaskStatusUpdatePayload(BaseModel):
  status: str
  notes: Optional[str] = None

# Admin Cockpit
class AdminConfigUpdate(BaseModel):
  stadiumName: Optional[str] = None
  currentEvent: Optional[str] = None
  totalCapacity: Optional[int] = None
  aiMode: Optional[str] = None
  activeGates: Optional[list[str]] = None

class AdminStatsResponse(BaseModel):
  activeVolunteers: int
  openTasks: int
  activeIncidents: int
  sustainabilityIndex: int
  gateThroughputRate: int

# Accessibility
class WheelchairRequestPayload(BaseModel):
  locationName: str
  contactPhone: str
  specialNotes: Optional[str] = None

class WheelchairRequestResponse(BaseModel):
  id: str
  userLocation: str = Field(..., serialization_alias="userLocation")
  userPhone: str
  status: str
  assignedVolunteerId: Optional[str] = None
  createdAt: datetime

  class Config:
    populate_by_name = True

class AccessibilityFacility(BaseModel):
  id: str
  facilityName: str
  type: str
  status: str
  alternativeRouteInstructions: Optional[str] = None

# Sustainability
class WasteBinSchema(BaseModel):
  binId: str
  type: str
  fillPercentage: int
  locationDescription: str

class TransitAlternativeSchema(BaseModel):
  routeNumber: str
  destination: str
  type: str
  nextDepartureMinutes: int
  status: str

class SustainabilityReportResponse(BaseModel):
  co2SavedKg: float
  cleanEnergyPercentage: int
  recycledTons: float
  greenTransitUsageRate: int
  wasteBins: list[WasteBinSchema]
  transit: list[TransitAlternativeSchema]

class RecyclePayload(BaseModel):
  userId: str
  itemType: str
  count: int

# Emergency
class SOSRequestPayload(BaseModel):
  type: str
  locationDescription: str
  contactPhone: Optional[str] = None
  lat: Optional[float] = None
  lng: Optional[float] = None

class SOSRequestResponse(BaseModel):
  id: str
  type: str
  locationDescription: str
  status: str
  createdAt: datetime

# Crowd Insights
class CrowdInsightSchema(BaseModel):
  id: str
  type: str # "warning" | "info" | "success" | "recommendation"
  title: str
  message: str
  timestamp: datetime

class CrowdInsightsResponse(BaseModel):
  insights: list[CrowdInsightSchema]

# Crowd Simulation
class SimulationZoneSchema(BaseModel):
  id: str
  name: str
  category: str
  density: int
  people: int
  lastUpdated: datetime
  xPos: str
  yPos: str

class CrowdSimulationResponse(BaseModel):
  totalAttendance: int
  overallDensityIndex: int
  criticalCount: int
  zones: list[SimulationZoneSchema]

# AI Operations Insights
class OperationalInsightSchema(BaseModel):
  id: str
  title: str
  recommendation: str
  category: str  # "gate" | "volunteer" | "redirection" | "congestion" | "security" | "route"
  priority: str  # "low" | "medium" | "high" | "critical"
  confidenceScore: float
  timestamp: datetime

class OperationalInsightsResponse(BaseModel):
  insights: list[OperationalInsightSchema]
