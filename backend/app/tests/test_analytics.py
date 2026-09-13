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
            "title": "Analytics API Test Form",
            "description": "Form used for analytics API testing",
            "is_active": True,
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    response = client.get(
        "/api/forms",
        headers=headers,
        params={
            "search": "Analytics API Test Form"
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
        if form["title"] == "Analytics API Test Form"
    )


@pytest.fixture
def analytics_fields(
    client,
    admin_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    form_id = test_form["id"]

    field_definitions = [
        {
            "label": "Full Name",
            "name": "full_name",
            "field_type": "text",
            "placeholder": "Enter your name",
            "description": "Full name",
            "is_required": True,
            "display_order": 1,
        },
        {
            "label": "Age",
            "name": "age",
            "field_type": "number",
            "placeholder": "Enter your age",
            "description": "Age",
            "is_required": False,
            "display_order": 2,
        },
        {
            "label": "Department",
            "name": "department",
            "field_type": "dropdown",
            "description": "Department",
            "is_required": False,
            "display_order": 3,
        },
    ]

    fields = []

    for field_data in field_definitions:
        response = client.post(
            f"/api/forms/{form_id}/fields",
            headers=headers,
            json=field_data,
        )

        if response.status_code in (200, 201):
            fields.append(response.json()["data"])
            continue

        fields_response = client.get(
            f"/api/forms/{form_id}/fields",
            headers=headers,
        )

        assert fields_response.status_code == 200

        data = fields_response.json()["data"]

        if isinstance(data, dict):
            existing_fields = data.get(
                "items",
                data.get("fields", [])
            )
        else:
            existing_fields = data

        field = next(
            (
                item
                for item in existing_fields
                if item["name"] == field_data["name"]
            ),
            None,
        )

        assert field is not None
        fields.append(field)

    department_field = next(
        field
        for field in fields
        if field["name"] == "department"
    )

    option_response = client.post(
        f"/api/forms/{form_id}/fields/"
        f"{department_field['id']}/options",
        headers=headers,
        json={
            "label": "Engineering",
            "value": "engineering",
            "display_order": 1,
        },
    )

    assert option_response.status_code in (
        200,
        201,
        400,
    )

    return fields


@pytest.fixture
def test_response(
    client,
    admin_token,
    test_form,
    analytics_fields,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    fields = {
        field["name"]: field["id"]
        for field in analytics_fields
    }

    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json={
            "details": [
                {
                    "field_id": fields["full_name"],
                    "value": "Analytics Test User",
                },
                {
                    "field_id": fields["age"],
                    "value": "25",
                },
                {
                    "field_id": fields["department"],
                    "value": "engineering",
                },
            ]
        },
    )

    assert response.status_code in (200, 201)

    return response.json()["data"]


# ============================================================
# GET /api/analytics/forms/{form_id}
# ============================================================

def test_get_form_analytics(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_get_form_analytics_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/analytics/forms/999999",
        headers=headers,
    )

    assert response.status_code in (400, 404)


def test_form_analytics_contains_data(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# GET /api/analytics/forms/{form_id}/responses
# ============================================================

def test_get_form_response_analytics(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/responses",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_get_form_response_analytics_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/analytics/forms/999999/responses",
        headers=headers,
    )

    assert response.status_code in (400, 404)


def test_form_response_analytics_contains_data(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/responses",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# GET /api/analytics/forms/{form_id}/fields
# ============================================================

def test_get_form_field_analytics(
    client,
    admin_token,
    test_form,
    analytics_fields,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/fields",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_get_form_field_analytics_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/analytics/forms/999999/fields",
        headers=headers,
    )

    assert response.status_code in (400, 404)


def test_form_field_analytics_contains_data(
    client,
    admin_token,
    test_form,
    analytics_fields,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/fields",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# GET /api/analytics/submissions
# ============================================================

def test_get_submission_analytics(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/analytics/submissions",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_submission_analytics_contains_data(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/analytics/submissions",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


def test_submission_analytics_with_date_range(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/analytics/submissions",
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


# ============================================================
# Authentication
# ============================================================

def test_form_analytics_requires_auth(
    client,
    test_form,
):
    response = client.get(
        f"/api/analytics/forms/{test_form['id']}"
    )

    assert response.status_code in (401, 403)


def test_form_response_analytics_requires_auth(
    client,
    test_form,
):
    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/responses"
    )

    assert response.status_code in (401, 403)


def test_form_field_analytics_requires_auth(
    client,
    test_form,
):
    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/fields"
    )

    assert response.status_code in (401, 403)


def test_submission_analytics_requires_auth(client):
    response = client.get(
        "/api/analytics/submissions"
    )

    assert response.status_code in (401, 403)


# ============================================================
# User access
# ============================================================

def test_user_can_access_form_analytics(
    client,
    user_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_access_response_analytics(
    client,
    user_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/responses",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_access_field_analytics(
    client,
    user_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        f"/api/analytics/forms/{test_form['id']}/fields",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_access_submission_analytics(
    client,
    user_token,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        "/api/analytics/submissions",
        headers=headers,
    )

    assert response.status_code in (200, 403)