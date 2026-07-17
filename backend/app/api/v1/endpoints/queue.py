from fastapi import APIRouter
from app.schemas.stadium import QueuePredictionResponse, AlternativeStand

router = APIRouter()

MOCK_QUEUES = [
  QueuePredictionResponse(
    poiId="p1",
    poiName="Gate 1 Main Entrance",
    poiType="gate",
    currentWaitMinutes=14,
    predictedWait15Min=18,
    predictedWait30Min=22,
    trend="rising",
    queueLengthCount=54,
    alternatives=[
      AlternativeStand(poiId="p2", poiName="Gate 3 Side Entrance", waitMinutes=4, distanceMeters=95.0)
    ]
  ),
  QueuePredictionResponse(
    poiId="p3",
    poiName="Hot Dog Express",
    poiType="concession",
    currentWaitMinutes=25,
    predictedWait15Min=20,
    predictedWait30Min=12,
    trend="falling",
    queueLengthCount=38,
    alternatives=[
      AlternativeStand(poiId="p4", poiName="Pizza Corner", waitMinutes=10, distanceMeters=40.0)
    ]
  ),
  QueuePredictionResponse(
    poiId="p5",
    poiName="Restrooms Section 102",
    poiType="restroom",
    currentWaitMinutes=8,
    predictedWait15Min=8,
    predictedWait30Min=7,
    trend="stable",
    queueLengthCount=14,
    alternatives=[]
  )
]

@router.get("/queues/predictions", response_model=list[QueuePredictionResponse])
async def get_queue_predictions(type: str | None = None):
  """Returns current and forecasted queue states for concession and gates."""
  if type:
    return [q for q in MOCK_QUEUES if q.poiType == type]
  return MOCK_QUEUES

@router.get("/queues/predictions/{poi_id}", response_model=QueuePredictionResponse)
async def get_queue_details(poi_id: str):
  """Returns predictive timelines for a single gate or stand queue."""
  for q in MOCK_QUEUES:
    if q.poiId == poi_id:
      return q
  return MOCK_QUEUES[0]
