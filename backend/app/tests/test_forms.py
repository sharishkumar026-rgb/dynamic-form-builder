import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

ADMIN_EMAIL = "admin_forms_test@example.com"
ADMIN_PASSWORD = "AdminPassword@123"

USER_EMAIL = "user_forms_test@example.com"
USER_PASSWORD = "UserPassword@123"


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

    return response.json()["data"]["access_token"]


@pytest.fixture
def user_token():
    """Login as normal user and return access token."""

    response = client.post(
        "/api/auth/login",
        data={
            "username": USER_EMAIL,
            "password": USER_PASSWORD,
        },
    )

    assert response.status_code == 200

    return response.json()["data"]["access_token"]


@pytest.fixture
def test_form(admin_token):
    """Create a form for testing."""

    form_data = {
        "title": "Forms API Test Form",
        "description": "Form created for API testing",
    }

    response = client.post(
        "/api/forms",
        json=form_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    if response.status_code in (400, 409):
        response = client.get(
            "/api/forms",
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
        )

        assert response.status_code == 200

        data = response.json()["data"]

        if isinstance(data, dict):
            forms = data.get("items", data.get("forms", []))
        else:
            forms = data

        for form in forms:
            if form.get("title") == form_data["title"]:
                return form

    pytest.fail(
        f"Unable to create test form: "
        f"{response.status_code} - {response.text}"
    )


def test_get_forms(admin_token):
    """
    GET /api/forms
    """

    response = client.get(
        "/api/forms",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data


def test_get_forms_pagination(admin_token):
    """
    GET /api/forms?skip=0&limit=10
    """

    response = client.get(
        "/api/forms",
        params={
            "skip": 0,
            "limit": 10,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200
    assert "data" in response.json()


def test_get_forms_active_filter(admin_token):
    """
    GET /api/forms?is_active=true
    """

    response = client.get(
        "/api/forms",
        params={
            "is_active": True,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200
    assert "data" in response.json()


def test_get_form(admin_token, test_form):
    """
    GET /api/forms/{form_id}
    """

    form_id = test_form["id"]

    response = client.get(
        f"/api/forms/{form_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["id"] == form_id


def test_get_nonexistent_form(admin_token):
    """
    GET /api/forms/{invalid_form_id}
    """

    response = client.get(
        "/api/forms/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_create_form(admin_token):
    """
    POST /api/forms
    """

    form_data = {
        "title": "New Forms API Test",
        "description": "New form created during API testing",
    }

    response = client.post(
        "/api/forms",
        json=form_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["title"] == form_data["title"]
    assert data["data"]["description"] == form_data["description"]
    assert "created_at" in data["data"]
    assert "updated_at" in data["data"]


def test_create_form_without_title(admin_token):
    """
    POST /api/forms without title.
    """

    response = client.post(
        "/api/forms",
        json={
            "description": "Form without title",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 422


def test_create_form_empty_title(admin_token):
    """
    POST /api/forms with empty title.
    """

    response = client.post(
        "/api/forms",
        json={
            "title": "",
            "description": "Empty title form",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 422


def test_create_duplicate_form(admin_token, test_form):
    """
    POST /api/forms with an existing title.
    """

    response = client.post(
        "/api/forms",
        json={
            "title": test_form["title"],
            "description": "Duplicate form",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_update_form(admin_token, test_form):
    """
    PUT /api/forms/{form_id}
    """

    form_id = test_form["id"]

    update_data = {
        "title": "Updated Forms API Test",
        "description": "Updated form description",
    }

    response = client.put(
        f"/api/forms/{form_id}",
        json=update_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["id"] == form_id
    assert data["data"]["title"] == update_data["title"]
    assert data["data"]["description"] == update_data["description"]


def test_update_nonexistent_form(admin_token):
    """
    PUT /api/forms/{invalid_form_id}
    """

    response = client.put(
        "/api/forms/999999",
        json={
            "title": "Nonexistent Form",
            "description": "Updated description",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_update_form_duplicate_title(admin_token, test_form):
    """
    PUT /api/forms/{form_id} with a title already used
    by another form.
    """

    create_response = client.post(
        "/api/forms",
        json={
            "title": "Another Existing Form",
            "description": "Another form",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert create_response.status_code in (200, 201)

    form_id = test_form["id"]

    response = client.put(
        f"/api/forms/{form_id}",
        json={
            "title": "Another Existing Form",
            "description": "Duplicate title",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_disable_form(admin_token, test_form):
    """
    PATCH /api/forms/{form_id}/disable
    """

    form_id = test_form["id"]

    response = client.patch(
        f"/api/forms/{form_id}/disable",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["is_active"] is False


def test_enable_form(admin_token, test_form):
    """
    PATCH /api/forms/{form_id}/enable
    """

    form_id = test_form["id"]

    response = client.patch(
        f"/api/forms/{form_id}/enable",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["is_active"] is True


def test_disable_nonexistent_form(admin_token):
    """
    PATCH /api/forms/{invalid_form_id}/disable
    """

    response = client.patch(
        "/api/forms/999999/disable",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_enable_nonexistent_form(admin_token):
    """
    PATCH /api/forms/{invalid_form_id}/enable
    """

    response = client.patch(
        "/api/forms/999999/enable",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_delete_form(admin_token):
    """
    DELETE /api/forms/{form_id}
    """

    create_response = client.post(
        "/api/forms",
        json={
            "title": "Form To Delete",
            "description": "This form will be deleted",
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert create_response.status_code in (200, 201)

    form_id = create_response.json()["data"]["id"]

    response = client.delete(
        f"/api/forms/{form_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 204)

    if response.status_code == 200:
        data = response.json()
        assert "message" in data


def test_delete_nonexistent_form(admin_token):
    """
    DELETE /api/forms/{invalid_form_id}
    """

    response = client.delete(
        "/api/forms/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_user_can_get_forms(user_token):
    """
    Normal user can retrieve forms according to service permissions.
    """

    response = client.get(
        "/api/forms",
        headers={
            "Authorization": f"Bearer {user_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "data" in data


def test_user_cannot_manage_other_users_form(user_token, test_form):
    """
    Normal user should not be able to modify a form
    created by another user.
    """

    form_id = test_form["id"]

    response = client.put(
        f"/api/forms/{form_id}",
        json={
            "title": "Unauthorized Form Update",
            "description": "Should not be allowed",
        },
        headers={
            "Authorization": f"Bearer {user_token}"
        },
    )

    assert response.status_code in (403, 404)


def test_user_cannot_delete_other_users_form(user_token, test_form):
    """
    Normal user should not be able to delete another user's form.
    """

    form_id = test_form["id"]

    response = client.delete(
        f"/api/forms/{form_id}",
        headers={
            "Authorization": f"Bearer {user_token}"
        },
    )

    assert response.status_code in (403, 404)


def test_get_forms_without_authentication():
    """
    GET /api/forms without JWT.
    """

    response = client.get("/api/forms")

    assert response.status_code == 401


def test_get_form_without_authentication():
    """
    GET /api/forms/{form_id} without JWT.
    """

    response = client.get("/api/forms/1")

    assert response.status_code == 401


def test_create_form_without_authentication():
    """
    POST /api/forms without JWT.
    """

    response = client.post(
        "/api/forms",
        json={
            "title": "Unauthorized Form",
            "description": "Unauthorized creation",
        },
    )

    assert response.status_code == 401


def test_update_form_without_authentication():
    """
    PUT /api/forms/{form_id} without JWT.
    """

    response = client.put(
        "/api/forms/1",
        json={
            "title": "Unauthorized Update",
            "description": "Unauthorized update",
        },
    )

    assert response.status_code == 401


def test_delete_form_without_authentication():
    """
    DELETE /api/forms/{form_id} without JWT.
    """

    response = client.delete("/api/forms/1")

    assert response.status_code == 401


def test_enable_form_without_authentication():
    """
    PATCH /api/forms/{form_id}/enable without JWT.
    """

    response = client.patch("/api/forms/1/enable")

    assert response.status_code == 401


def test_disable_form_without_authentication():
    """
    PATCH /api/forms/{form_id}/disable without JWT.
    """

    response = client.patch("/api/forms/1/disable")

    assert response.status_code == 401


def test_no_status_endpoint():
    """
    The assignment intentionally does not expose:
    PATCH /api/forms/{form_id}/status
    """

    response = client.patch(
        "/api/forms/1/status",
        json={
            "is_active": False
        },
    )

    assert response.status_code == 404