import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


@pytest.fixture
def registered_user():
    user_data = {
        "name": "Test User",
        "email": "testauth@example.com",
        "password": "TestPassword@123",
        "role_id": 2,
    }

    response = client.post(
        "/api/auth/register",
        json=user_data,
    )

    # User may already exist when tests are rerun
    if response.status_code not in (200, 201, 400, 409):
        pytest.fail(
            f"Registration failed unexpectedly: "
            f"{response.status_code} - {response.text}"
        )

    return user_data


def test_register(registered_user):
    response = client.post(
        "/api/auth/register",
        json=registered_user,
    )

    assert response.status_code in (200, 201, 400, 409)

    data = response.json()

    assert "message" in data


def test_register_duplicate_email(registered_user):
    response = client.post(
        "/api/auth/register",
        json=registered_user,
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_login(registered_user):
    response = client.post(
        "/api/auth/login",
        data={
            "username": registered_user["email"],
            "password": registered_user["password"],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data["data"]
    assert "refresh_token" in data["data"]
    assert data["data"]["token_type"] == "bearer"


def test_login_invalid_password(registered_user):
    response = client.post(
        "/api/auth/login",
        data={
            "username": registered_user["email"],
            "password": "WrongPassword@123",
        },
    )

    assert response.status_code in (400, 401)

    data = response.json()

    assert "message" in data


def test_login_invalid_email():
    response = client.post(
        "/api/auth/login",
        data={
            "username": "doesnotexist@example.com",
            "password": "TestPassword@123",
        },
    )

    assert response.status_code in (400, 401)

    data = response.json()

    assert "message" in data


def test_me(registered_user):
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": registered_user["email"],
            "password": registered_user["password"],
        },
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["data"]["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": f"Bearer {access_token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "data" in data
    assert data["data"]["email"] == registered_user["email"]


def test_me_without_token():
    response = client.get("/api/auth/me")

    assert response.status_code == 401


def test_refresh_token(registered_user):
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": registered_user["email"],
            "password": registered_user["password"],
        },
    )

    assert login_response.status_code == 200

    refresh_token = login_response.json()["data"]["refresh_token"]

    response = client.post(
        "/api/auth/refresh",
        json={
            "refresh_token": refresh_token,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data["data"]


def test_refresh_token_invalid():
    response = client.post(
        "/api/auth/refresh",
        json={
            "refresh_token": "invalid-refresh-token",
        },
    )

    assert response.status_code in (400, 401)

    data = response.json()

    assert "message" in data


def test_logout(registered_user):
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": registered_user["email"],
            "password": registered_user["password"],
        },
    )

    assert login_response.status_code == 200

    access_token = login_response.json()["data"]["access_token"]

    response = client.post(
        "/api/auth/logout",
        headers={
            "Authorization": f"Bearer {access_token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data


def test_logout_without_token():
    response = client.post("/api/auth/logout")

    assert response.status_code == 401