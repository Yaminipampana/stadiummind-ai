import pytest
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["database"] == "healthy"
    assert "version" in data
    assert "uptime_seconds" in data

def test_auth_login_success(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@stadiummind.ai", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@stadiummind.ai"
    assert data["user"]["role"] == "admin"

def test_auth_login_failure(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@stadiummind.ai", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "detail" in response.json()

def test_auth_register_success(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={"name": "New Fan", "email": "newfan@stadiummind.ai", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["email"] == "newfan@stadiummind.ai"

def test_auth_register_already_exists(client: TestClient):
    # Registering a mock user that already exists in MOCK_USERS_DB
    response = client.post(
        "/api/v1/auth/register",
        json={"name": "Central Operations Admin", "email": "admin@stadiummind.ai", "password": "password123"}
    )
    assert response.status_code == 400
    assert "detail" in response.json()

def test_auth_me_no_token(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["id"] == "usr_fan_99"

def test_auth_me_with_mock_token(client: TestClient):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer mock-volunteer-token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["role"] == "volunteer"

def test_chat_endpoint(client: TestClient):
    response = client.post(
        "/api/v1/chat",
        json={"message": "Where is the nearest food court?", "session_id": "test_session"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert data["session_id"] == "test_session"
    assert "timestamp" in data

def test_chat_stream_endpoint(client: TestClient):
    response = client.post(
        "/api/v1/chat/stream",
        json={"message": "Where is the nearest food court?", "session_id": "test_session"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/event-stream; charset=utf-8"
    # Read first chunk to verify format
    chunks = []
    for line in response.iter_lines():
        if line:
            decoded_line = line.decode('utf-8') if isinstance(line, bytes) else line
            chunks.append(decoded_line)
            if len(chunks) >= 2:
                break
    assert len(chunks) > 0
    assert chunks[0].startswith("data: ")

def test_crowd_statistics(client: TestClient):
    response = client.get("/api/v1/crowd")
    assert response.status_code == 200
    data = response.json()
    assert "totalAttendance" in data
    assert "overallDensityIndex" in data
    assert len(data["heatpoints"]) > 0
    assert len(data["gates"]) > 0

def test_crowd_insights(client: TestClient):
    response = client.get("/api/v1/crowd/insights")
    assert response.status_code == 200
    data = response.json()
    assert "insights" in data
    assert len(data["insights"]) > 0

def test_crowd_simulation(client: TestClient):
    response = client.get("/api/v1/crowd/simulation")
    assert response.status_code == 200
    data = response.json()
    assert "totalAttendance" in data
    assert len(data["zones"]) == 10

def test_crowd_simulation_insights(client: TestClient):
    response = client.get("/api/v1/crowd/simulation/insights")
    assert response.status_code == 200
    data = response.json()
    assert "insights" in data
    assert len(data["insights"]) > 0

def test_navigation_pois(client: TestClient):
    response = client.get("/api/v1/navigation/pois")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

    response_filtered = client.get("/api/v1/navigation/pois?type=gate")
    assert response_filtered.status_code == 200
    for poi in response_filtered.json():
        assert poi["type"] == "gate"

def test_navigation_route(client: TestClient):
    response = client.post(
        "/api/v1/navigation/route",
        json={"source_id": "gate1", "dest_id": "rest1", "accessible_only": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sourceId"] == "gate1"
    assert data["destId"] == "rest1"
    assert len(data["points"]) > 0
    assert "distanceMeters" in data
    assert "estimatedSeconds" in data
    assert data["isAccessibleRoute"] is True

def test_queue_predictions(client: TestClient):
    response = client.get("/api/v1/queues/predictions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

    response_filtered = client.get("/api/v1/queues/predictions?type=gate")
    assert response_filtered.status_code == 200
    for q in response_filtered.json():
        assert q["poiType"] == "gate"

def test_queue_details(client: TestClient):
    response = client.get("/api/v1/queues/predictions/p3")
    assert response.status_code == 200
    data = response.json()
    assert data["poiId"] == "p3"
    assert data["poiName"] == "Hot Dog Express"

def test_volunteer_tasks(client: TestClient):
    response = client.get("/api/v1/volunteer/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_volunteer_claim_task(client: TestClient):
    response = client.post(
        "/api/v1/volunteer/tasks/t1/claim",
        json={"volunteer_id": "usr_volunteer_01"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in-progress"
    assert data["assignedToId"] == "usr_volunteer_01"

def test_volunteer_update_status(client: TestClient):
    response = client.put(
        "/api/v1/volunteer/tasks/t1/status",
        json={"status": "completed", "notes": "Task completed successfully"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"

def test_volunteer_report_issue(client: TestClient):
    response = client.post(
        "/api/v1/volunteer/report",
        json={"issue": "Water leakage in Section 202"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "issueId" in data

def test_admin_config(client: TestClient):
    # Get config
    response = client.get("/api/v1/admin/config")
    assert response.status_code == 200
    config = response.json()
    assert config["stadiumName"] == "StadiumMind Stadium, LA"

    # Update config
    response_update = client.put(
        "/api/v1/admin/config",
        json={"stadiumName": "New Stadium Name", "aiMode": "manual"}
    )
    assert response_update.status_code == 200
    updated_config = response_update.json()
    assert updated_config["stadiumName"] == "New Stadium Name"
    assert updated_config["aiMode"] == "manual"

def test_admin_stats(client: TestClient):
    response = client.get("/api/v1/admin/stats")
    assert response.status_code == 200
    data = response.json()
    assert "activeVolunteers" in data
    assert "openTasks" in data

def test_admin_broadcast(client: TestClient):
    response = client.post(
        "/api/v1/admin/broadcast",
        json={"message": "Severe weather alert"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "alertId" in data

def test_accessibility_facilities(client: TestClient):
    response = client.get("/api/v1/accessibility/facilities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_accessibility_wheelchair_request(client: TestClient):
    response = client.post(
        "/api/v1/accessibility/wheelchair-request",
        json={"locationName": "Gate 2 Entrance", "contactPhone": "+1234567890"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["userLocation"] == "Gate 2 Entrance"
    assert data["status"] == "requested"

def test_accessibility_wheelchair_status(client: TestClient):
    response = client.get("/api/v1/accessibility/wheelchair-request/req_test123")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "req_test123"
    assert data["status"] == "dispatched"

def test_sustainability_report(client: TestClient):
    response = client.get("/api/v1/sustainability/report")
    assert response.status_code == 200
    data = response.json()
    assert "co2SavedKg" in data
    assert len(data["wasteBins"]) > 0

def test_sustainability_recycle(client: TestClient):
    response = client.post(
        "/api/v1/sustainability/recycle",
        json={"userId": "usr_fan_99", "itemType": "bottle", "count": 5}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["rewardPoints"] == 50

def test_emergency_sos(client: TestClient):
    response = client.post(
        "/api/v1/emergency/sos",
        json={"type": "medical", "locationDescription": "Section 104 Row G"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "medical"
    assert data["status"] == "active"

def test_emergency_evacuate(client: TestClient):
    response = client.get("/api/v1/emergency/evacuate/Sec102")
    assert response.status_code == 200
    data = response.json()
    assert data["sourceZone"] == "Sec102"
    assert len(data["recommendedPathInstructions"]) > 0

def test_security_utilities():
    from app.core.security import create_access_token, decode_access_token
    token = create_access_token({"sub": "admin@stadiummind.ai", "role": "admin"})
    assert isinstance(token, str)
    assert len(token) > 0
    payload = decode_access_token(token)
    assert payload["sub"] == "admin@stadiummind.ai"
    assert payload["role"] == "admin"

@pytest.mark.anyio
async def test_security_roles():
    from app.core.security import verify_volunteer_role, verify_admin_role
    from fastapi import HTTPException
    
    # Test volunteer role verification
    vol_user = {"role": "volunteer", "email": "vol@stadiummind.ai"}
    admin_user = {"role": "admin", "email": "admin@stadiummind.ai"}
    regular_user = {"role": "user", "email": "user@stadiummind.ai"}
    
    assert await verify_volunteer_role(vol_user) == vol_user
    assert await verify_volunteer_role(admin_user) == admin_user
    with pytest.raises(HTTPException) as exc:
        await verify_volunteer_role(regular_user)
    assert exc.value.status_code == 403

    # Test admin role verification
    assert await verify_admin_role(admin_user) == admin_user
    with pytest.raises(HTTPException) as exc:
        await verify_admin_role(vol_user)
    assert exc.value.status_code == 403
    with pytest.raises(HTTPException) as exc:
        await verify_admin_role(regular_user)
    assert exc.value.status_code == 403

@pytest.mark.anyio
async def test_ai_service_direct():
    from app.services.ai_service import ai_service
    # Test different mock prompts in AI service
    res_gate = await ai_service.generate_response("Where is Gate 2?", "session_123", "en")
    assert "Gate" in res_gate
    
    res_food = await ai_service.generate_response("concession food wait time", "session_123", "en")
    assert "Hot Dog" in res_food or "Pizza" in res_food
    
    res_toilet = await ai_service.generate_response("Where are the restrooms?", "session_123", "en")
    assert "restroom" in res_toilet or "toilet" in res_toilet
    
    res_wheelchair = await ai_service.generate_response("I need a wheelchair", "session_123", "en")
    assert "wheelchair" in res_wheelchair or "elevator" in res_wheelchair
    
    res_emergency = await ai_service.generate_response("emergency evacuation", "session_123", "en")
    assert "evacuation" in res_emergency or "exit" in res_emergency
    
    # Test different languages
    res_es = await ai_service.generate_response("Where is Gate 2?", "session_123", "es")
    assert "puertas" in res_es.lower() or "puerta" in res_es.lower()
    
    res_fr = await ai_service.generate_response("Where is Gate 2?", "session_123", "fr")
    assert "portes" in res_fr.lower() or "porte" in res_fr.lower()

@pytest.mark.anyio
async def test_ai_insights_service_direct():
    import datetime
    from app.services.ai.insights_service import ai_insights_service
    from app.schemas.stadium import SimulationZoneSchema
    
    now_dt = datetime.datetime.now(datetime.timezone.utc)
    
    # Test high gate density
    zones_gate = [
        SimulationZoneSchema(id="z1", name="North Gate", category="gate", density=90, people=1000, lastUpdated=now_dt, xPos="10%", yPos="10%"),
        SimulationZoneSchema(id="z2", name="South Gate", category="gate", density=40, people=400, lastUpdated=now_dt, xPos="10%", yPos="20%")
    ]
    insights = await ai_insights_service.generate_insights(zones_gate)
    assert any(i.category == "gate" and "critical" in i.priority for i in insights)

    # Test high food density
    zones_food = [
        SimulationZoneSchema(id="z3", name="Food Court", category="food", density=85, people=850, lastUpdated=now_dt, xPos="10%", yPos="10%"),
        SimulationZoneSchema(id="z4", name="South Gate", category="gate", density=40, people=400, lastUpdated=now_dt, xPos="10%", yPos="20%")
    ]
    insights_food = await ai_insights_service.generate_insights(zones_food)
    assert any(i.category == "volunteer" and "high" in i.priority for i in insights_food)

def test_volunteer_report_issue_integration(client: TestClient):
    response_tasks_before = client.get("/api/v1/volunteer/tasks")
    tasks_before_count = len(response_tasks_before.json())

    response = client.post(
        "/api/v1/volunteer/report",
        json={"locationName": "Section 202", "severity": "high", "description": "Water leakage"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    
    response_tasks_after = client.get("/api/v1/volunteer/tasks")
    tasks_after = response_tasks_after.json()
    assert len(tasks_after) == tasks_before_count + 1
    new_task = tasks_after[-1]
    assert new_task["title"] == "Reported Issue: Section 202"
    assert new_task["priority"] == "high"

