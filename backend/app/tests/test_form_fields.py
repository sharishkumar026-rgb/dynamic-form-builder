import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

ADMIN_EMAIL = "admin_forms_test@example.com"
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

    return response.json()["data"]["access_token"]


@pytest.fixture
def test_form(admin_token):
    """Create a form for field tests."""

    form_data = {
        "title": "Form Fields API Test Form",
        "description": "Form created for field API testing",
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


@pytest.fixture
def test_field(admin_token, test_form):
    """Create a text field for testing."""

    form_id = test_form["id"]

    field_data = {
        "label": "Full Name",
        "field_type": "text",
        "name": "full_name",
        "placeholder": "Enter your full name",
        "description": "User full name",
        "is_required": True,
        "display_order": 1,
        "validation_rules": {
            "min_length": 2,
            "max_length": 100
        },
        "conditional_logic": None,
    }

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json=field_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    if response.status_code in (400, 409):
        response = client.get(
            f"/api/forms/{form_id}/fields",
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
        )

        assert response.status_code == 200

        data = response.json()["data"]

        if isinstance(data, dict):
            fields = data.get("items", data.get("fields", []))
        else:
            fields = data

        for field in fields:
            if field.get("name") == field_data["name"]:
                return field

    pytest.fail(
        f"Unable to create test field: "
        f"{response.status_code} - {response.text}"
    )


def test_get_form_fields(admin_token, test_form):
    """
    GET /api/forms/{form_id}/fields
    """

    form_id = test_form["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data


def test_get_form_fields_empty_or_existing(admin_token, test_form):
    """
    Verify that the fields endpoint returns a valid collection.
    """

    form_id = test_form["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


def test_get_form_field(admin_token, test_form, test_field):
    """
    GET /api/forms/{form_id}/fields/{field_id}
    """

    form_id = test_form["id"]
    field_id = test_field["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields/{field_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data
    assert data["data"]["id"] == field_id


def test_get_nonexistent_field(admin_token, test_form):
    """
    GET /api/forms/{form_id}/fields/{invalid_field_id}
    """

    form_id = test_form["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_create_text_field(admin_token, test_form):
    """
    POST /api/forms/{form_id}/fields
    """

    form_id = test_form["id"]

    field_data = {
        "label": "Email Address",
        "field_type": "email",
        "name": "email_address",
        "placeholder": "Enter email",
        "description": "Email field",
        "is_required": True,
        "display_order": 2,
        "validation_rules": {},
        "conditional_logic": None,
    }

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json=field_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["label"] == field_data["label"]
    assert data["data"]["field_type"] == field_data["field_type"]
    assert data["data"]["name"] == field_data["name"]


@pytest.mark.parametrize(
    "field_type",
    [
        "text",
        "number",
        "email",
        "date",
        "dropdown",
        "checkbox",
        "radio",
        "file",
        "rating",
    ],
)
def test_create_supported_field_types(
    admin_token,
    test_form,
    field_type,
):
    """
    Verify all assignment-supported field types.
    """

    form_id = test_form["id"]

    field_data = {
        "label": f"Test {field_type}",
        "field_type": field_type,
        "name": f"test_{field_type}",
        "placeholder": f"Enter {field_type}",
        "description": f"{field_type} field",
        "is_required": False,
        "display_order": 10,
        "validation_rules": {},
        "conditional_logic": None,
    }

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json=field_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert "data" in data
    assert data["data"]["field_type"] == field_type


def test_create_invalid_field_type(admin_token, test_form):
    """
    Invalid field type should be rejected.
    """

    form_id = test_form["id"]

    field_data = {
        "label": "Invalid Field",
        "field_type": "invalid_type",
        "name": "invalid_field",
        "placeholder": None,
        "description": None,
        "is_required": False,
        "display_order": 20,
        "validation_rules": {},
        "conditional_logic": None,
    }

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json=field_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 422)

    data = response.json()

    assert "message" in data


def test_create_field_without_label(admin_token, test_form):
    """
    Field label is required.
    """

    form_id = test_form["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json={
            "field_type": "text",
            "name": "missing_label",
            "is_required": False,
            "display_order": 30,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 422


def test_create_field_without_name(admin_token, test_form):
    """
    Field name is required.
    """

    form_id = test_form["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json={
            "label": "Missing Name",
            "field_type": "text",
            "is_required": False,
            "display_order": 31,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 422


def test_create_field_duplicate_name(
    admin_token,
    test_form,
    test_field,
):
    """
    Duplicate field name within the same form should fail.
    """

    form_id = test_form["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json={
            "label": "Duplicate Field",
            "field_type": "text",
            "name": test_field["name"],
            "is_required": False,
            "display_order": 40,
            "validation_rules": {},
            "conditional_logic": None,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_create_field_with_validation_rules(
    admin_token,
    test_form,
):
    """
    Field validation rules should be accepted.
    """

    form_id = test_form["id"]

    field_data = {
        "label": "Username",
        "field_type": "text",
        "name": "username_validation",
        "placeholder": "Enter username",
        "description": "Username validation",
        "is_required": True,
        "display_order": 50,
        "validation_rules": {
            "min_length": 3,
            "max_length": 30,
            "pattern": "^[A-Za-z0-9_]+$",
        },
        "conditional_logic": None,
    }

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json=field_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()["data"]

    assert data["validation_rules"] == field_data["validation_rules"]


def test_create_field_with_conditional_logic(
    admin_token,
    test_form,
    test_field,
):
    """
    Conditional visibility logic should be accepted.
    """

    form_id = test_form["id"]

    field_data = {
        "label": "Additional Information",
        "field_type": "text",
        "name": "additional_information",
        "placeholder": "Enter additional information",
        "description": "Conditionally visible field",
        "is_required": False,
        "display_order": 60,
        "validation_rules": {},
        "conditional_logic": {
            "field": test_field["id"],
            "operator": "equals",
            "value": "Yes",
        },
    }

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json=field_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()["data"]

    assert data["conditional_logic"] == field_data["conditional_logic"]


def test_update_form_field(
    admin_token,
    test_form,
    test_field,
):
    """
    PUT /api/forms/{form_id}/fields/{field_id}
    """

    form_id = test_form["id"]
    field_id = test_field["id"]

    update_data = {
        "label": "Updated Full Name",
        "field_type": "text",
        "name": "full_name",
        "placeholder": "Enter updated name",
        "description": "Updated description",
        "is_required": False,
        "display_order": 1,
        "validation_rules": {
            "min_length": 3,
            "max_length": 150,
        },
        "conditional_logic": None,
    }

    response = client.put(
        f"/api/forms/{form_id}/fields/{field_id}",
        json=update_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["id"] == field_id
    assert data["data"]["label"] == update_data["label"]
    assert data["data"]["is_required"] is False


def test_update_nonexistent_field(admin_token, test_form):
    """
    PUT /api/forms/{form_id}/fields/{invalid_field_id}
    """

    form_id = test_form["id"]

    response = client.put(
        f"/api/forms/{form_id}/fields/999999",
        json={
            "label": "Updated Field",
            "field_type": "text",
            "name": "updated_field",
            "is_required": False,
            "display_order": 1,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_update_field_to_invalid_type(
    admin_token,
    test_form,
    test_field,
):
    """
    Invalid field type during update should fail.
    """

    form_id = test_form["id"]
    field_id = test_field["id"]

    response = client.put(
        f"/api/forms/{form_id}/fields/{field_id}",
        json={
            "label": "Invalid Update",
            "field_type": "invalid_type",
            "name": "invalid_update",
            "is_required": False,
            "display_order": 1,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 422)

    data = response.json()

    assert "message" in data


def test_reorder_form_fields(
    admin_token,
    test_form,
    test_field,
):
    """
    PATCH /api/forms/{form_id}/fields/reorder
    """

    form_id = test_form["id"]

    response = client.patch(
        f"/api/forms/{form_id}/fields/reorder",
        json={
            "field_orders": [
                {
                    "field_id": test_field["id"],
                    "display_order": 1,
                }
            ]
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data


def test_reorder_nonexistent_field(
    admin_token,
    test_form,
):
    """
    Reordering an invalid field should fail.
    """

    form_id = test_form["id"]

    response = client.patch(
        f"/api/forms/{form_id}/fields/reorder",
        json={
            "field_orders": [
                {
                    "field_id": 999999,
                    "display_order": 1,
                }
            ]
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 404)

    data = response.json()

    assert "message" in data


def test_delete_form_field(admin_token, test_form):
    """
    DELETE /api/forms/{form_id}/fields/{field_id}
    """

    form_id = test_form["id"]

    create_response = client.post(
        f"/api/forms/{form_id}/fields",
        json={
            "label": "Field To Delete",
            "field_type": "text",
            "name": "field_to_delete",
            "placeholder": None,
            "description": None,
            "is_required": False,
            "display_order": 100,
            "validation_rules": {},
            "conditional_logic": None,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert create_response.status_code in (200, 201)

    field_id = create_response.json()["data"]["id"]

    response = client.delete(
        f"/api/forms/{form_id}/fields/{field_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 204)

    if response.status_code == 200:
        data = response.json()
        assert "message" in data


def test_delete_nonexistent_field(admin_token, test_form):
    """
    DELETE /api/forms/{form_id}/fields/{invalid_field_id}
    """

    form_id = test_form["id"]

    response = client.delete(
        f"/api/forms/{form_id}/fields/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_form_fields_for_nonexistent_form(admin_token):
    """
    GET fields for an invalid form.
    """

    response = client.get(
        "/api/forms/999999/fields",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404


def test_create_field_for_nonexistent_form(admin_token):
    """
    POST field for an invalid form.
    """

    response = client.post(
        "/api/forms/999999/fields",
        json={
            "label": "Invalid Form Field",
            "field_type": "text",
            "name": "invalid_form_field",
            "is_required": False,
            "display_order": 1,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404


def test_get_fields_without_authentication(test_form):
    """
    GET fields without JWT.
    """

    form_id = test_form["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields"
    )

    assert response.status_code == 401


def test_get_field_without_authentication(test_form, test_field):
    """
    GET field without JWT.
    """

    form_id = test_form["id"]
    field_id = test_field["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields/{field_id}"
    )

    assert response.status_code == 401


def test_create_field_without_authentication(test_form):
    """
    POST field without JWT.
    """

    form_id = test_form["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json={
            "label": "Unauthorized Field",
            "field_type": "text",
            "name": "unauthorized_field",
            "is_required": False,
            "display_order": 1,
        },
    )

    assert response.status_code == 401


def test_update_field_without_authentication(test_form, test_field):
    """
    PUT field without JWT.
    """

    form_id = test_form["id"]
    field_id = test_field["id"]

    response = client.put(
        f"/api/forms/{form_id}/fields/{field_id}",
        json={
            "label": "Unauthorized Update",
            "field_type": "text",
            "name": "unauthorized_update",
            "is_required": False,
            "display_order": 1,
        },
    )

    assert response.status_code == 401


def test_delete_field_without_authentication(test_form, test_field):
    """
    DELETE field without JWT.
    """

    form_id = test_form["id"]
    field_id = test_field["id"]

    response = client.delete(
        f"/api/forms/{form_id}/fields/{field_id}"
    )

    assert response.status_code == 401


def test_reorder_fields_without_authentication(test_form, test_field):
    """
    PATCH reorder without JWT.
    """

    form_id = test_form["id"]

    response = client.patch(
        f"/api/forms/{form_id}/fields/reorder",
        json={
            "field_orders": [
                {
                    "field_id": test_field["id"],
                    "display_order": 1,
                }
            ]
        },
    )

    assert response.status_code == 401