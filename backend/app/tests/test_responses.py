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
            "title": "Responses API Test Form",
            "description": "Form used for response API testing",
            "is_active": True,
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    response = client.get(
        "/api/forms",
        headers=headers,
        params={"search": "Responses API Test Form"},
    )

    assert response.status_code == 200

    data = response.json()["data"]

    if isinstance(data, dict):
        forms = data.get("items", data.get("forms", []))
    else:
        forms = data

    assert forms

    return next(
        form
        for form in forms
        if form["title"] == "Responses API Test Form"
    )


@pytest.fixture
def response_form_fields(client, admin_token, test_form):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    form_id = test_form["id"]

    fields = []

    field_definitions = [
        {
            "label": "Full Name",
            "name": "full_name",
            "field_type": "text",
            "placeholder": "Enter your name",
            "description": "User full name",
            "is_required": True,
            "display_order": 1,
        },
        {
            "label": "Email",
            "name": "email",
            "field_type": "email",
            "placeholder": "Enter your email",
            "description": "User email",
            "is_required": True,
            "display_order": 2,
        },
        {
            "label": "Department",
            "name": "department",
            "field_type": "dropdown",
            "description": "User department",
            "is_required": False,
            "display_order": 3,
        },
    ]

    for field_data in field_definitions:
        response = client.post(
            f"/api/forms/{form_id}/fields",
            headers=headers,
            json=field_data,
        )

        if response.status_code in (200, 201):
            field = response.json()["data"]
            fields.append(field)
        else:
            response = client.get(
                f"/api/forms/{form_id}/fields",
                headers=headers,
            )

            assert response.status_code == 200

            data = response.json()["data"]

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

    # Add dropdown option
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

    assert option_response.status_code in (200, 201, 400)

    return fields


@pytest.fixture
def response_payload(response_form_fields):
    fields = {
        field["name"]: field["id"]
        for field in response_form_fields
    }

    return {
        "details": [
            {
                "field_id": fields["full_name"],
                "value": "Harish Kumar",
            },
            {
                "field_id": fields["email"],
                "value": "harish.response@example.com",
            },
            {
                "field_id": fields["department"],
                "value": "engineering",
            },
        ]
    }


@pytest.fixture
def test_response(
    client,
    admin_token,
    test_form,
    response_form_fields,
    response_payload,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json=response_payload,
    )

    assert response.status_code in (200, 201)

    return response.json()["data"]


# ============================================================
# GET /api/forms/{form_id}/responses
# ============================================================

def test_list_form_responses(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_list_form_responses_pagination(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        params={
            "page": 1,
            "page_size": 10,
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True


def test_list_responses_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/forms/999999/responses",
        headers=headers,
    )

    assert response.status_code in (404, 400)


# ============================================================
# POST /api/forms/{form_id}/responses
# ============================================================

def test_create_response(
    client,
    admin_token,
    test_form,
    response_form_fields,
    response_payload,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json=response_payload,
    )

    assert response.status_code in (200, 201)

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_create_response_missing_required_field(
    client,
    admin_token,
    test_form,
    response_form_fields,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    fields = {
        field["name"]: field["id"]
        for field in response_form_fields
    }

    payload = {
        "details": [
            {
                "field_id": fields["email"],
                "value": "missing.name@example.com",
            }
        ]
    }

    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json=payload,
    )

    assert response.status_code in (400, 422)


def test_create_response_invalid_field(
    client,
    admin_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json={
            "details": [
                {
                    "field_id": 999999,
                    "value": "Invalid field",
                }
            ]
        },
    )

    assert response.status_code in (400, 404, 422)


def test_create_response_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        "/api/forms/999999/responses",
        headers=headers,
        json={
            "details": []
        },
    )

    assert response.status_code in (400, 404)


def test_create_response_empty_payload(
    client,
    admin_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json={},
    )

    assert response.status_code in (400, 422)


# ============================================================
# GET /api/responses/{response_id}
# ============================================================

def test_get_response(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response_id = test_response["id"]

    response = client.get(
        f"/api/responses/{response_id}",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_get_response_not_found(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/responses/999999",
        headers=headers,
    )

    assert response.status_code == 404


# ============================================================
# PUT /api/responses/{response_id}
# ============================================================

def test_update_response(
    client,
    admin_token,
    test_response,
    response_form_fields,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    fields = {
        field["name"]: field["id"]
        for field in response_form_fields
    }

    response_id = test_response["id"]

    response = client.put(
        f"/api/responses/{response_id}",
        headers=headers,
        json={
            "details": [
                {
                    "field_id": fields["full_name"],
                    "value": "Updated Harish Kumar",
                },
                {
                    "field_id": fields["email"],
                    "value": "updated.response@example.com",
                },
                {
                    "field_id": fields["department"],
                    "value": "engineering",
                },
            ]
        },
    )

    assert response.status_code in (200, 201)

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_update_response_not_found(
    client,
    admin_token,
    response_form_fields,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    field_id = response_form_fields[0]["id"]

    response = client.put(
        "/api/responses/999999",
        headers=headers,
        json={
            "details": [
                {
                    "field_id": field_id,
                    "value": "Updated value",
                }
            ]
        },
    )

    assert response.status_code == 404


def test_update_response_invalid_field(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.put(
        f"/api/responses/{test_response['id']}",
        headers=headers,
        json={
            "details": [
                {
                    "field_id": 999999,
                    "value": "Invalid field",
                }
            ]
        },
    )

    assert response.status_code in (400, 404, 422)


# ============================================================
# GET /api/responses/{response_id}/history
# ============================================================

def test_response_history(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response_id = test_response["id"]

    response = client.get(
        f"/api/responses/{response_id}/history",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_response_history_not_found(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/responses/999999/history",
        headers=headers,
    )

    assert response.status_code == 404


# ============================================================
# DELETE /api/responses/{response_id}
# ============================================================

def test_delete_response(
    client,
    admin_token,
    test_form,
    response_form_fields,
    response_payload,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    create_response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json=response_payload,
    )

    assert create_response.status_code in (200, 201)

    response_id = create_response.json()["data"]["id"]

    response = client.delete(
        f"/api/responses/{response_id}",
        headers=headers,
    )

    assert response.status_code in (200, 204)

    if response.status_code == 200:
        body = response.json()
        assert body["success"] is True


def test_delete_response_not_found(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.delete(
        "/api/responses/999999",
        headers=headers,
    )

    assert response.status_code == 404


# ============================================================
# Authentication
# ============================================================

def test_list_responses_requires_auth(
    client,
    test_form,
):
    response = client.get(
        f"/api/forms/{test_form['id']}/responses"
    )

    assert response.status_code in (401, 403)


def test_create_response_requires_auth(
    client,
    test_form,
    response_payload,
):
    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        json=response_payload,
    )

    # Current implementation requires authentication.
    assert response.status_code in (401, 403)


def test_get_response_requires_auth(
    client,
    test_response,
):
    response = client.get(
        f"/api/responses/{test_response['id']}"
    )

    assert response.status_code in (401, 403)


def test_update_response_requires_auth(
    client,
    test_response,
    response_form_fields,
):
    field_id = response_form_fields[0]["id"]

    response = client.put(
        f"/api/responses/{test_response['id']}",
        json={
            "details": [
                {
                    "field_id": field_id,
                    "value": "Unauthorized update",
                }
            ]
        },
    )

    assert response.status_code in (401, 403)


def test_delete_response_requires_auth(
    client,
    test_response,
):
    response = client.delete(
        f"/api/responses/{test_response['id']}"
    )

    assert response.status_code in (401, 403)


def test_response_history_requires_auth(
    client,
    test_response,
):
    response = client.get(
        f"/api/responses/{test_response['id']}/history"
    )

    assert response.status_code in (401, 403)


# ============================================================
# User access
# ============================================================

def test_user_can_list_form_responses(
    client,
    user_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_get_response(
    client,
    user_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        f"/api/responses/{test_response['id']}",
        headers=headers,
    )

    assert response.status_code in (200, 403)


# ============================================================
# Response data validation
# ============================================================

def test_response_contains_form_id(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/responses/{test_response['id']}",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert "form_id" in data


def test_response_contains_timestamps(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/responses/{test_response['id']}",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert (
        "submitted_at" in data
        or "created_at" in data
    )


def test_response_contains_details(
    client,
    admin_token,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/responses/{test_response['id']}",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert (
        "details" in data
        or "response_details" in data
    )