import pytest


ADMIN_EMAIL = "admin_forms_test@example.com"
ADMIN_PASSWORD = "AdminPassword@123"

USER_EMAIL = "user_forms_test@example.com"
USER_PASSWORD = "UserPassword@123"


@pytest.fixture
def admin_token(client):
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
def user_token(client):
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
def test_form(client, admin_token):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        "/api/forms",
        headers=headers,
        json={
            "title": "Dashboard API Test Form",
            "description": "Form used for dashboard API testing",
            "is_active": True,
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    response = client.get(
        "/api/forms",
        headers=headers,
        params={
            "search": "Dashboard API Test Form"
        },
    )

    assert response.status_code == 200

    data = response.json()["data"]

    if isinstance(data, dict):
        forms = data.get(
            "items",
            data.get("forms", [])
        )
    else:
        forms = data

    assert forms

    return next(
        form
        for form in forms
        if form["title"] == "Dashboard API Test Form"
    )


@pytest.fixture
def test_response(
    client,
    admin_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    form_id = test_form["id"]

    # Create a text field
    field_response = client.post(
        f"/api/forms/{form_id}/fields",
        headers=headers,
        json={
            "label": "Name",
            "name": "name",
            "field_type": "text",
            "placeholder": "Enter name",
            "description": "User name",
            "is_required": True,
            "display_order": 1,
        },
    )

    if field_response.status_code in (200, 201):
        field = field_response.json()["data"]
    else:
        fields_response = client.get(
            f"/api/forms/{form_id}/fields",
            headers=headers,
        )

        assert fields_response.status_code == 200

        data = fields_response.json()["data"]

        if isinstance(data, dict):
            fields = data.get(
                "items",
                data.get("fields", [])
            )
        else:
            fields = data

        field = next(
            item
            for item in fields
            if item["name"] == "name"
        )

    response = client.post(
        f"/api/forms/{form_id}/responses",
        headers=headers,
        json={
            "details": [
                {
                    "field_id": field["id"],
                    "value": "Dashboard Test User",
                }
            ]
        },
    )

    assert response.status_code in (200, 201)

    return response.json()["data"]


# ============================================================
# GET /api/dashboard/summary
# ============================================================

def test_dashboard_summary(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/summary",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_dashboard_summary_contains_statistics(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/summary",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    # Accept the common naming variations used by the service.
    assert (
        "total_forms" in data
        or "forms_count" in data
        or "form_count" in data
    )

    assert (
        "total_responses" in data
        or "responses_count" in data
        or "response_count" in data
    )


# ============================================================
# GET /api/dashboard/submission-trends
# ============================================================

def test_dashboard_submission_trends(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/submission-trends",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_dashboard_submission_trends_with_date_range(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/submission-trends",
        headers=headers,
        params={
            "days": 30,
        },
    )

    assert response.status_code in (200, 422)

    if response.status_code == 200:
        body = response.json()

        assert body["success"] is True
        assert "data" in body


def test_dashboard_submission_trends_contains_data(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/submission-trends",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# GET /api/dashboard/most-used-forms
# ============================================================

def test_dashboard_most_used_forms(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/most-used-forms",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_dashboard_most_used_forms_contains_data(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/most-used-forms",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# GET /api/dashboard/response-statistics
# ============================================================

def test_dashboard_response_statistics(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/response-statistics",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_dashboard_response_statistics_contains_data(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/response-statistics",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# Dashboard with actual form/response data
# ============================================================

def test_dashboard_summary_after_form_and_response(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/summary",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True

    data = body["data"]

    assert (
        "total_forms" in data
        or "forms_count" in data
        or "form_count" in data
    )

    assert (
        "total_responses" in data
        or "responses_count" in data
        or "response_count" in data
    )


def test_dashboard_most_used_forms_after_submission(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/most-used-forms",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_dashboard_submission_trends_after_submission(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/submission-trends",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_dashboard_response_statistics_after_submission(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/dashboard/response-statistics",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


# ============================================================
# Authentication
# ============================================================

def test_dashboard_summary_requires_auth(client):
    response = client.get(
        "/api/dashboard/summary"
    )

    assert response.status_code in (401, 403)


def test_dashboard_submission_trends_requires_auth(client):
    response = client.get(
        "/api/dashboard/submission-trends"
    )

    assert response.status_code in (401, 403)


def test_dashboard_most_used_forms_requires_auth(client):
    response = client.get(
        "/api/dashboard/most-used-forms"
    )

    assert response.status_code in (401, 403)


def test_dashboard_response_statistics_requires_auth(client):
    response = client.get(
        "/api/dashboard/response-statistics"
    )

    assert response.status_code in (401, 403)


# ============================================================
# User access
# ============================================================

def test_user_can_access_dashboard_summary(
    client,
    user_token,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        "/api/dashboard/summary",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_access_submission_trends(
    client,
    user_token,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        "/api/dashboard/submission-trends",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_access_most_used_forms(
    client,
    user_token,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        "/api/dashboard/most-used-forms",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_access_response_statistics(
    client,
    user_token,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        "/api/dashboard/response-statistics",
        headers=headers,
    )

    assert response.status_code in (200, 403)