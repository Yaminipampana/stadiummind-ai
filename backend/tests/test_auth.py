from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email":"demo@test.com",
            "password":"password"
        }
    )

    assert response.status_code in [200,401]