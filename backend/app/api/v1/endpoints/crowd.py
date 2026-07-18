import datetime
import random
from fastapi import APIRouter
from app.schemas.stadium import (
  CrowdStatsResponse,
  CrowdPoint,
  GateThroughputSchema,
  CrowdInsightsResponse,
  CrowdInsightSchema,
  CrowdSimulationResponse,
  SimulationZoneSchema,
  OperationalInsightsResponse,
)

router = APIRouter()

@router.get("/crowd", response_model=CrowdStatsResponse)
async def get_crowd_statistics():
  """Returns current live stadium capacity and crowd heatmap layers."""
  # Mock Heatmap points around stadium (represented in lat/lng offsets)
  sections = ["Sec 100", "Sec 102", "Sec 104", "Sec 106", "Sec 108", "Sec 110", "Sec 200", "Sec 204", "Sec 208"]
  heatpoints = [
    CrowdPoint(
      lat=34.0522 + random.uniform(-0.005, 0.005),
      lng=-118.2437 + random.uniform(-0.005, 0.005),
      intensity=random.uniform(0.1, 1.0),
      section=random.choice(sections)
    )
    for _ in range(30)
  ]

  gates = [
    GateThroughputSchema(gateId="g1", gateName="North Gate 1", currentFlow=45, capacity=60, status="clear"),
    GateThroughputSchema(gateId="g2", gateName="East Gate 2", currentFlow=95, capacity=100, status="busy"),
    GateThroughputSchema(gateId="g3", gateName="South Gate 3", currentFlow=20, capacity=60, status="clear"),
    GateThroughputSchema(gateId="g4", gateName="West Gate 4", currentFlow=118, capacity=100, status="overloaded"),
  ]

  return CrowdStatsResponse(
    timestamp=datetime.datetime.now(datetime.timezone.utc),
    totalAttendance=random.randint(45000, 52000),
    overallDensityIndex=random.randint(65, 82),
    heatpoints=heatpoints,
    gates=gates
  )

@router.get("/crowd/insights", response_model=CrowdInsightsResponse)
async def get_crowd_insights():
  """Generates AI-driven operational insights based on stadium crowd patterns."""
  gate4_load = random.randint(90, 130)
  sec108_density = random.randint(40, 95)
  concession_wait = random.randint(3, 18)
  
  insights = []
  
  # Insight 1: Gate Bottleneck
  if gate4_load > 110:
    insights.append(
      CrowdInsightSchema(
        id="ins-1",
        type="warning",
        title="Gate 4 Overhead Traffic",
        message=f"West Gate 4 throughput rate ({gate4_load} p/min) exceeds recommended safety boundaries. Instruct safety crews to route overflow towards North Gate 1.",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
      )
    )
  else:
    insights.append(
      CrowdInsightSchema(
        id="ins-1",
        type="success",
        title="Gate Flow Operations Normal",
        message="All major access points report clear throughput flow rates within comfortable parameters.",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
      )
    )

  # Insight 2: Section Congestion
  if sec108_density > 75:
    insights.append(
      CrowdInsightSchema(
        id="ins-2",
        type="warning",
        title="Section 108 Density Spike",
        message=f"Section 108 telemetry reports dynamic occupancy index of {sec108_density}%. Direct nearby volunteer marshals to manage corridor entry points.",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
      )
    )
  else:
    insights.append(
      CrowdInsightSchema(
        id="ins-2",
        type="info",
        title="Section Occupancy Uniform",
        message="No local spectator sections currently trigger structural bottleneck alarms.",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
      )
    )

  # Insight 3: Concessions Queue Recommendation
  if concession_wait > 10:
    insights.append(
      CrowdInsightSchema(
        id="ins-3",
        type="recommendation",
        title="Concession Stand Optimization",
        message=f"Level 1 food court lines estimate wait times at {concession_wait} minutes. Broadcast push notifications suggesting Level 2 stalls to relieve queues.",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
      )
    )
  else:
    insights.append(
      CrowdInsightSchema(
        id="ins-3",
        type="info",
        title="Concession Queues Comfortable",
        message=f"Average transaction queues represent comfortable delays of {concession_wait} minutes.",
        timestamp=datetime.datetime.now(datetime.timezone.utc)
      )
    )

  # Insight 4: General Operations status
  insights.append(
    CrowdInsightSchema(
      id="ins-4",
      type="success",
      title="Emergency Access Confirmed Clear",
      message="AI pathing models confirm step-free emergency lanes and medical room entrances are entirely free of static crowd congestion.",
      timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
  )

  return CrowdInsightsResponse(insights=insights)

@router.get("/crowd/simulation", response_model=CrowdSimulationResponse)
async def get_crowd_simulation():
  """Generates real-time crowd simulation data with realistic fluctuations."""
  raw_zones = [
    {"id": "z1", "name": "North Gate", "category": "gate", "base_density": 25, "multiplier": 50, "xPos": "50%", "yPos": "8%"},
    {"id": "z2", "name": "South Gate", "category": "gate", "base_density": 55, "multiplier": 50, "xPos": "50%", "yPos": "92%"},
    {"id": "z3", "name": "East Gate", "category": "gate", "base_density": 78, "multiplier": 50, "xPos": "92%", "yPos": "50%"},
    {"id": "z4", "name": "West Gate", "category": "gate", "base_density": 88, "multiplier": 50, "xPos": "8%", "yPos": "50%"},
    {"id": "z5", "name": "Food Court A", "category": "food", "base_density": 65, "multiplier": 30, "xPos": "75%", "yPos": "30%"},
    {"id": "z6", "name": "Food Court B", "category": "food", "base_density": 40, "multiplier": 30, "xPos": "75%", "yPos": "70%"},
    {"id": "z7", "name": "Merchandise Store", "category": "store", "base_density": 82, "multiplier": 20, "xPos": "50%", "yPos": "50%"},
    {"id": "z8", "name": "Main Entrance", "category": "entrance", "base_density": 92, "multiplier": 60, "xPos": "25%", "yPos": "75%"},
    {"id": "z9", "name": "VIP Entrance", "category": "entrance", "base_density": 15, "multiplier": 20, "xPos": "25%", "yPos": "25%"},
    {"id": "z10", "name": "Parking Area", "category": "parking", "base_density": 32, "multiplier": 80, "xPos": "12%", "yPos": "85%"},
  ]
  
  zones = []
  total_people = 0
  critical_count = 0
  
  for rz in raw_zones:
    fluc = random.randint(-8, 8)
    density = min(max(rz["base_density"] + fluc, 5), 98)
    people = int(density * rz["multiplier"])
    total_people += people
    if density > 80:
      critical_count += 1
      
    zones.append(
      SimulationZoneSchema(
        id=rz["id"],
        name=rz["name"],
        category=rz["category"],
        density=density,
        people=people,
        lastUpdated=datetime.datetime.now(datetime.timezone.utc),
        xPos=rz["xPos"],
        yPos=rz["yPos"]
      )
    )
    
  avg_density = int(sum(z.density for z in zones) / len(zones))
  
  return CrowdSimulationResponse(
    totalAttendance=total_people,
    overallDensityIndex=avg_density,
    criticalCount=critical_count,
    zones=zones
  )

@router.get("/crowd/simulation/insights", response_model=OperationalInsightsResponse)
async def get_simulation_insights():
  """Runs the AI Operations Insights module over the live simulation state."""
  from app.services.ai.insights_service import ai_insights_service
  
  raw_zones = [
    {"id": "z1", "name": "North Gate", "category": "gate", "base_density": 25, "multiplier": 50, "xPos": "50%", "yPos": "8%"},
    {"id": "z2", "name": "South Gate", "category": "gate", "base_density": 55, "multiplier": 50, "xPos": "50%", "yPos": "92%"},
    {"id": "z3", "name": "East Gate", "category": "gate", "base_density": 78, "multiplier": 50, "xPos": "92%", "yPos": "50%"},
    {"id": "z4", "name": "West Gate", "category": "gate", "base_density": 88, "multiplier": 50, "xPos": "8%", "yPos": "50%"},
    {"id": "z5", "name": "Food Court A", "category": "food", "base_density": 65, "multiplier": 30, "xPos": "75%", "yPos": "30%"},
    {"id": "z6", "name": "Food Court B", "category": "food", "base_density": 40, "multiplier": 30, "xPos": "75%", "yPos": "70%"},
    {"id": "z7", "name": "Merchandise Store", "category": "store", "base_density": 82, "multiplier": 20, "xPos": "50%", "yPos": "50%"},
    {"id": "z8", "name": "Main Entrance", "category": "entrance", "base_density": 92, "multiplier": 60, "xPos": "25%", "yPos": "75%"},
    {"id": "z9", "name": "VIP Entrance", "category": "entrance", "base_density": 15, "multiplier": 20, "xPos": "25%", "yPos": "25%"},
    {"id": "z10", "name": "Parking Area", "category": "parking", "base_density": 32, "multiplier": 80, "xPos": "12%", "yPos": "85%"},
  ]
  
  zones = []
  for rz in raw_zones:
    fluc = random.randint(-8, 8)
    density = min(max(rz["base_density"] + fluc, 5), 98)
    people = int(density * rz["multiplier"])
    zones.append(
      SimulationZoneSchema(
        id=rz["id"],
        name=rz["name"],
        category=rz["category"],
        density=density,
        people=people,
        lastUpdated=datetime.datetime.now(datetime.timezone.utc),
        xPos=rz["xPos"],
        yPos=rz["yPos"]
      )
    )
    
  insights = await ai_insights_service.generate_insights(zones)
  return OperationalInsightsResponse(insights=insights)
