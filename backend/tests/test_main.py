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
