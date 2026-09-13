import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

ADMIN_EMAIL = "admin_roles_test@example.com"
ADMIN_PASSWORD = "AdminPassword@123"


@pytest.fixture
def admin_token():
    """Login as admin and return access token."""

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
def test_role(admin_token):
    """Create a test role."""

    role_data = {
        "name": "test_role_api",
        "description": "Role created for API testing",
    }

    response = client.post(
        "/api/roles",
        json=role_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    if response.status_code in (400, 409):
        response = client.get(
            "/api/roles",
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
        )

        assert response.status_code == 200

        data = response.json()["data"]

        if isinstance(data, dict):
            roles = data.get("items", data.get("roles", []))
        else:
            roles = data

        for role in roles:
            if role.get("name") == role_data["name"]:
                return role

    pytest.fail(
        f"Unable to create test role: "
        f"{response.status_code} - {response.text}"
    )


def test_get_roles(admin_token):
    """
    GET /api/roles
    """

    response = client.get(
        "/api/roles",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data


def test_get_roles_pagination(admin_token):
    """
    GET /api/roles?skip=0&limit=10
    """

    response = client.get(
        "/api/roles",
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


def test_get_role(admin_token, test_role):
    """
    GET /api/roles/{role_id}
    """

    role_id = test_role["id"]

    response = client.get(
        f"/api/roles/{role_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["id"] == role_id


def test_get_nonexistent_role(admin_token):
    """
    GET /api/roles/{invalid_role_id}
    """

    response = client.get(
        "/api/roles/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_create_role(admin_token):
    """
    POST /api/roles
    """

    role_data = {
        "name": "new_test_role",
        "description": "New role created during API testing",
    }

    response = client.post(
        "/api/roles",
        json=role_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["name"] == role_data["name"]
    assert data["data"]["description"] == role_data["description"]


def test_create_duplicate_role(admin_token, test_role):
    """
    POST /api/roles with an existing role name.
    """

    role_data = {
        "name": test_role["name"],
        "description": "Duplicate role",
    }

    response = client.post(
        "/api/roles",
        json=role_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_create_role_without_name(admin_token):
    """
    POST /api/roles with missing name.
    """

    response = client.post(
        "/api/roles",
        json={
            "description": "Role without name",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 422


def test_update_role(admin_token, test_role):
    """
    PUT /api/roles/{role_id}
    """

    role_id = test_role["id"]

    update_data = {
        "name": "updated_test_role",
        "description": "Updated role description",
    }

    response = client.put(
        f"/api/roles/{role_id}",
        json=update_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["id"] == role_id
    assert data["data"]["name"] == update_data["name"]
    assert data["data"]["description"] == update_data["description"]


def test_update_nonexistent_role(admin_token):
    """
    PUT /api/roles/{invalid_role_id}
    """

    response = client.put(
        "/api/roles/999999",
        json={
            "name": "nonexistent_role",
            "description": "Updated description",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_update_role_duplicate_name(admin_token, test_role):
    """
    PUT /api/roles/{role_id} with an existing role name.
    """

    role_id = test_role["id"]

    response = client.put(
        f"/api/roles/{role_id}",
        json={
            "name": "admin",
            "description": "Trying to use existing role",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_update_role_status_inactive(admin_token, test_role):
    """
    PATCH /api/roles/{role_id}/status
    """

    role_id = test_role["id"]

    response = client.patch(
        f"/api/roles/{role_id}/status",
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


def test_update_role_status_active(admin_token, test_role):
    """
    PATCH /api/roles/{role_id}/status
    """

    role_id = test_role["id"]

    response = client.patch(
        f"/api/roles/{role_id}/status",
        json={
            "is_active": True
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["is_active"] is True


def test_protected_admin_role_update(admin_token):
    """
    Default admin role should not be modified if
    role service protects the default role.
    """

    response = client.put(
        "/api/roles/1",
        json={
            "name": "modified_admin",
            "description": "Trying to modify admin role",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 403)


def test_protected_user_role_update(admin_token):
    """
    Default user role should not be modified if
    role service protects the default role.
    """

    response = client.put(
        "/api/roles/2",
        json={
            "name": "modified_user",
            "description": "Trying to modify user role",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 403)


def test_delete_role(admin_token, test_role):
    """
    DELETE /api/roles/{role_id}
    """

    role_id = test_role["id"]

    response = client.delete(
        f"/api/roles/{role_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 204)

    if response.status_code == 200:
        data = response.json()
        assert "message" in data


def test_delete_nonexistent_role(admin_token):
    """
    DELETE /api/roles/{invalid_role_id}
    """

    response = client.delete(
        "/api/roles/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_protected_admin_role_delete(admin_token):
    """
    Default admin role should not be deleted.
    """

    response = client.delete(
        "/api/roles/1",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 403)


def test_protected_user_role_delete(admin_token):
    """
    Default user role should not be deleted.
    """

    response = client.delete(
        "/api/roles/2",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 403)


def test_get_roles_without_authentication():
    """
    GET /api/roles without JWT.
    """

    response = client.get("/api/roles")

    assert response.status_code == 401


def test_get_role_without_authentication():
    """
    GET /api/roles/{role_id} without JWT.
    """

    response = client.get("/api/roles/1")

    assert response.status_code == 401


def test_create_role_without_authentication():
    """
    POST /api/roles without JWT.
    """

    response = client.post(
        "/api/roles",
        json={
            "name": "unauthorized_role",
            "description": "Unauthorized role",
        },
    )

    assert response.status_code == 401


def test_update_role_without_authentication():
    """
    PUT /api/roles/{role_id} without JWT.
    """

    response = client.put(
        "/api/roles/1",
        json={
            "name": "unauthorized_update",
            "description": "Unauthorized update",
        },
    )

    assert response.status_code == 401


def test_delete_role_without_authentication():
    """
    DELETE /api/roles/{role_id} without JWT.
    """

    response = client.delete("/api/roles/1")

    assert response.status_code == 401


def test_update_role_status_without_authentication():
    """
    PATCH /api/roles/{role_id}/status without JWT.
    """

    response = client.patch(
        "/api/roles/1/status",
        json={
            "is_active": False
        },
    )

    assert response.status_code == 401