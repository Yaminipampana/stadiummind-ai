from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat():
    response = client.post(
        "/api/v1/chat",
        json={
            "message":"Hello"
        }
    )

    assert response.status_code in [200,400]