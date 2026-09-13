import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


ADMIN_EMAIL = "admin_users_test@example.com"
ADMIN_PASSWORD = "AdminPassword@123"

USER_EMAIL = "user_users_test@example.com"
USER_PASSWORD = "UserPassword@123"


@pytest.fixture
def admin_token():
    """
    Login as admin and return access token.
    """

    response = client.post(
        "/api/auth/login",
        data={
            "username": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
        },
    )

    assert response.status_code == 200

    data = response.json()

    return data["data"]["access_token"]


@pytest.fixture
def admin_user(admin_token):
    """
    Get currently logged-in admin user.
    """

    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    return response.json()["data"]


@pytest.fixture
def test_user(admin_token):
    """
    Create a normal user for user-management tests.
    """

    user_data = {
        "name": "Users Test User",
        "email": USER_EMAIL,
        "password": USER_PASSWORD,
        "role_id": 2,
    }

    response = client.post(
        "/api/users",
        json=user_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    # User may already exist when tests are rerun.
    if response.status_code in (200, 201):
        return response.json()["data"]

    if response.status_code in (400, 409):
        get_response = client.get(
            "/api/users",
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
        )

        assert get_response.status_code == 200

        users = get_response.json()["data"]

        if isinstance(users, dict):
            users = users.get("items", users.get("users", []))

        for user in users:
            if user.get("email") == USER_EMAIL:
                return user

    pytest.fail(
        f"Unable to create test user: "
        f"{response.status_code} - {response.text}"
    )


def test_get_users(admin_token):
    """
    GET /api/users
    """

    response = client.get(
        "/api/users",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data


def test_get_users_pagination(admin_token):
    """
    GET /api/users?skip=0&limit=10
    """

    response = client.get(
        "/api/users",
        params={
            "skip": 0,
            "limit": 10,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "data" in data


def test_get_users_filter_active(admin_token):
    """
    GET /api/users?is_active=true
    """

    response = client.get(
        "/api/users",
        params={
            "is_active": True,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "data" in data


def test_get_user(admin_token, test_user):
    """
    GET /api/users/{user_id}
    """

    user_id = test_user["id"]

    response = client.get(
        f"/api/users/{user_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["id"] == user_id


def test_get_nonexistent_user(admin_token):
    """
    GET /api/users/{invalid_user_id}
    """

    response = client.get(
        "/api/users/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_create_user(admin_token):
    """
    POST /api/users
    """

    user_data = {
        "name": "New Users API Test",
        "email": "new_users_api_test@example.com",
        "password": "NewUserPassword@123",
        "role_id": 2,
    }

    response = client.post(
        "/api/users",
        json=user_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["name"] == user_data["name"]
    assert data["data"]["email"] == user_data["email"]


def test_create_user_duplicate_email(admin_token, test_user):
    """
    POST /api/users with an existing email.
    """

    user_data = {
        "name": "Duplicate User",
        "email": USER_EMAIL,
        "password": "AnotherPassword@123",
        "role_id": 2,
    }

    response = client.post(
        "/api/users",
        json=user_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_create_user_invalid_role(admin_token):
    """
    POST /api/users with a non-existing role.
    """

    user_data = {
        "name": "Invalid Role User",
        "email": "invalid_role_user@example.com",
        "password": "InvalidRolePassword@123",
        "role_id": 999999,
    }

    response = client.post(
        "/api/users",
        json=user_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 404)

    data = response.json()

    assert "message" in data


def test_update_user(admin_token, test_user):
    """
    PUT /api/users/{user_id}
    """

    user_id = test_user["id"]

    update_data = {
        "name": "Updated Users Test User",
        "email": USER_EMAIL,
    }

    response = client.put(
        f"/api/users/{user_id}",
        json=update_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["id"] == user_id
    assert data["data"]["name"] == update_data["name"]


def test_update_nonexistent_user(admin_token):
    """
    PUT /api/users/{invalid_user_id}
    """

    response = client.put(
        "/api/users/999999",
        json={
            "name": "Updated User",
            "email": "updated_nonexistent@example.com",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_update_user_status(admin_token, test_user):
    """
    PATCH /api/users/{user_id}/status
    """

    user_id = test_user["id"]

    response = client.patch(
        f"/api/users/{user_id}/status",
        json={
            "is_active": False
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["is_active"] is False


def test_enable_user(admin_token, test_user):
    """
    PATCH /api/users/{user_id}/status
    """

    user_id = test_user["id"]

    response = client.patch(
        f"/api/users/{user_id}/status",
        json={
            "is_active": True
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "data" in data
    assert data["data"]["is_active"] is True


def test_update_user_role(admin_token, test_user):
    """
    PATCH /api/users/{user_id}/role
    """

    user_id = test_user["id"]

    response = client.patch(
        f"/api/users/{user_id}/role",
        json={
            "role_id": 1
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    # If role_id=1 is the admin role, the service may allow
    # or reject this depending on the role-management rules.
    assert response.status_code in (200, 400)

    data = response.json()

    assert "message" in data


def test_delete_user(admin_token, test_user):
    """
    DELETE /api/users/{user_id}
    """

    user_id = test_user["id"]

    response = client.delete(
        f"/api/users/{user_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 204)

    if response.status_code == 200:
        data = response.json()
        assert "message" in data


def test_delete_nonexistent_user(admin_token):
    """
    DELETE /api/users/{invalid_user_id}
    """

    response = client.delete(
        "/api/users/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_get_users_without_authentication():
    """
    GET /api/users without JWT.
    """

    response = client.get("/api/users")

    assert response.status_code == 401


def test_get_user_without_authentication():
    """
    GET /api/users/{user_id} without JWT.
    """

    response = client.get("/api/users/1")

    assert response.status_code == 401


def test_create_user_without_authentication():
    """
    POST /api/users without JWT.
    """

    response = client.post(
        "/api/users",
        json={
            "name": "Unauthorized User",
            "email": "unauthorized@example.com",
            "password": "UnauthorizedPassword@123",
            "role_id": 2,
        },
    )

    assert response.status_code == 401