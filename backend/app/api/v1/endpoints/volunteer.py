import datetime
from fastapi import APIRouter, Body
from app.schemas.stadium import VolunteerTaskResponse, TaskClaimRequest, TaskStatusUpdatePayload

router = APIRouter()

# In-memory storage for mock tasks
MOCK_TASKS = [
  VolunteerTaskResponse(
    id="t1",
    title="Clean Spill near Section 102",
    description="Soda spilled on stairs. Safety hazard for elderly fans.",
    locationName="Level 1 Corridor, Sec 102",
    priority="medium",
    status="pending",
    createdAt=datetime.datetime.utcnow() - datetime.timedelta(minutes=10),
    updatedAt=datetime.datetime.utcnow() - datetime.timedelta(minutes=10),
  ),
  VolunteerTaskResponse(
    id="t2",
    title="High Congestion Gate 4",
    description="Guide overflow crowd towards Gate 3 queue lines.",
    locationName="Outer Plaza, West Gate 4",
    priority="high",
    status="pending",
    createdAt=datetime.datetime.utcnow() - datetime.timedelta(minutes=5),
    updatedAt=datetime.datetime.utcnow() - datetime.timedelta(minutes=5),
  ),
  VolunteerTaskResponse(
    id="t3",
    title="Wheelchair Assistance Section 108",
    description="Elderly guest needs transport assistance to seat row.",
    locationName="Level 1 Concourse Section 108",
    priority="critical",
    status="in-progress",
    assignedToId="usr_volunteer_1",
    createdAt=datetime.datetime.utcnow() - datetime.timedelta(minutes=15),
    updatedAt=datetime.datetime.utcnow() - datetime.timedelta(minutes=12),
  )
]

@router.get("/volunteer/tasks", response_model=list[VolunteerTaskResponse])
async def get_volunteer_tasks():
  """Returns active volunteer tasks waiting for claims or completion."""
  return MOCK_TASKS

@router.post("/volunteer/tasks/{task_id}/claim", response_model=VolunteerTaskResponse)
async def claim_task(task_id: str, payload: TaskClaimRequest = Body(...)):
  """Claims a task for the calling volunteer."""
  for task in MOCK_TASKS:
    if task.id == task_id:
      task.status = "in-progress"
      task.assignedToId = payload.volunteer_id
      task.updatedAt = datetime.datetime.utcnow()
      return task
  return MOCK_TASKS[0]

@router.put("/volunteer/tasks/{task_id}/status", response_model=VolunteerTaskResponse)
async def update_task_status(task_id: str, payload: TaskStatusUpdatePayload = Body(...)):
  """Updates task status to completed, cancelled, etc."""
  for task in MOCK_TASKS:
    if task.id == task_id:
      task.status = payload.status
      task.updatedAt = datetime.datetime.utcnow()
      return task
  return MOCK_TASKS[0]

@router.post("/volunteer/report")
async def report_crowd_issue(payload: dict = Body(...)):
  """Logs volunteer incident telemetry."""
  return {"success": True, "issueId": "iss_991"}
