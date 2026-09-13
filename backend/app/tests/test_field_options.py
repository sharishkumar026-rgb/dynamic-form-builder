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
    """Create a form for option tests."""

    form_data = {
        "title": "Field Options API Test Form",
        "description": "Form created for field option API testing",
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
def option_field(admin_token, test_form):
    """Create a dropdown field that supports options."""

    form_id = test_form["id"]

    field_data = {
        "label": "Department",
        "field_type": "dropdown",
        "name": "department",
        "placeholder": "Select department",
        "description": "Department selection",
        "is_required": True,
        "display_order": 1,
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
        f"Unable to create option field: "
        f"{response.status_code} - {response.text}"
    )


@pytest.fixture
def test_option(admin_token, test_form, option_field):
    """Create an option for the dropdown field."""

    form_id = test_form["id"]
    field_id = option_field["id"]

    option_data = {
        "label": "Engineering",
        "value": "engineering",
        "display_order": 1,
    }

    response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json=option_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    if response.status_code in (400, 409):
        response = client.get(
            f"/api/forms/{form_id}/fields/{field_id}/options",
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
        )

        assert response.status_code == 200

        data = response.json()["data"]

        if isinstance(data, dict):
            options = data.get("items", data.get("options", []))
        else:
            options = data

        for option in options:
            if option.get("value") == option_data["value"]:
                return option

    pytest.fail(
        f"Unable to create test option: "
        f"{response.status_code} - {response.text}"
    )


def test_get_field_options(
    admin_token,
    test_form,
    option_field,
):
    """
    GET /api/forms/{form_id}/fields/{field_id}/options
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data


def test_get_field_options_with_existing_option(
    admin_token,
    test_form,
    option_field,
    test_option,
):
    """
    Verify existing option is returned.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()["data"]

    if isinstance(data, dict):
        options = data.get("items", data.get("options", []))
    else:
        options = data

    option_ids = [option["id"] for option in options]

    assert test_option["id"] in option_ids


def test_get_field_option_for_nonexistent_field(
    admin_token,
    test_form,
):
    """
    GET options for an invalid field.
    """

    form_id = test_form["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields/999999/options",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_create_field_option(
    admin_token,
    test_form,
    option_field,
):
    """
    POST /api/forms/{form_id}/fields/{field_id}/options
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    option_data = {
        "label": "Finance",
        "value": "finance",
        "display_order": 2,
    }

    response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json=option_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["label"] == option_data["label"]
    assert data["data"]["value"] == option_data["value"]
    assert data["data"]["display_order"] == option_data["display_order"]


def test_create_multiple_options(
    admin_token,
    test_form,
    option_field,
):
    """
    Create multiple dropdown options.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    options = [
        {
            "label": "Human Resources",
            "value": "hr",
            "display_order": 3,
        },
        {
            "label": "Marketing",
            "value": "marketing",
            "display_order": 4,
        },
        {
            "label": "Sales",
            "value": "sales",
            "display_order": 5,
        },
    ]

    for option_data in options:
        response = client.post(
            f"/api/forms/{form_id}/fields/{field_id}/options",
            json=option_data,
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
        )

        assert response.status_code in (200, 201)


def test_create_duplicate_option_value(
    admin_token,
    test_form,
    option_field,
    test_option,
):
    """
    Duplicate option value within the same field should fail.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "label": "Duplicate Engineering",
            "value": test_option["value"],
            "display_order": 10,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_create_duplicate_option_label(
    admin_token,
    test_form,
    option_field,
    test_option,
):
    """
    Duplicate option label within the same field should fail.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "label": test_option["label"],
            "value": "different_value",
            "display_order": 11,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_create_option_without_label(
    admin_token,
    test_form,
    option_field,
):
    """
    Label is required.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "value": "missing_label",
            "display_order": 10,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 422


def test_create_option_without_value(
    admin_token,
    test_form,
    option_field,
):
    """
    Value is required.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "label": "Missing Value",
            "display_order": 10,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 422


def test_create_option_for_text_field(
    admin_token,
    test_form,
):
    """
    Options should only be allowed for:
    dropdown, checkbox, radio.
    """

    form_id = test_form["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields",
        json={
            "label": "Text Field",
            "field_type": "text",
            "name": "text_field_for_options",
            "placeholder": "Enter text",
            "description": None,
            "is_required": False,
            "display_order": 20,
            "validation_rules": {},
            "conditional_logic": None,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 201)

    field_id = response.json()["data"]["id"]

    option_response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "label": "Invalid Option",
            "value": "invalid",
            "display_order": 1,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert option_response.status_code in (400, 422)

    data = option_response.json()

    assert "message" in data


def test_update_field_option(
    admin_token,
    test_form,
    option_field,
    test_option,
):
    """
    PUT /api/forms/{form_id}/fields/{field_id}/options/{option_id}
    """

    form_id = test_form["id"]
    field_id = option_field["id"]
    option_id = test_option["id"]

    update_data = {
        "label": "Updated Engineering",
        "value": "updated_engineering",
        "display_order": 1,
    }

    response = client.put(
        f"/api/forms/{form_id}/fields/{field_id}/options/{option_id}",
        json=update_data,
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data
    assert "data" in data

    assert data["data"]["id"] == option_id
    assert data["data"]["label"] == update_data["label"]
    assert data["data"]["value"] == update_data["value"]


def test_update_nonexistent_option(
    admin_token,
    test_form,
    option_field,
):
    """
    PUT with an invalid option ID.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.put(
        f"/api/forms/{form_id}/fields/{field_id}/options/999999",
        json={
            "label": "Updated Option",
            "value": "updated_option",
            "display_order": 1,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_update_option_duplicate_value(
    admin_token,
    test_form,
    option_field,
    test_option,
):
    """
    Updating an option to an existing value should fail.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    create_response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "label": "Another Option",
            "value": "another_value",
            "display_order": 20,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert create_response.status_code in (200, 201)

    second_option_id = create_response.json()["data"]["id"]

    response = client.put(
        f"/api/forms/{form_id}/fields/{field_id}/options/{second_option_id}",
        json={
            "label": "Duplicate Value",
            "value": test_option["value"],
            "display_order": 20,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (400, 409)

    data = response.json()

    assert "message" in data


def test_delete_field_option(
    admin_token,
    test_form,
    option_field,
):
    """
    DELETE /api/forms/{form_id}/fields/{field_id}/options/{option_id}
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    create_response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "label": "Option To Delete",
            "value": "option_to_delete",
            "display_order": 30,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert create_response.status_code in (200, 201)

    option_id = create_response.json()["data"]["id"]

    response = client.delete(
        f"/api/forms/{form_id}/fields/{field_id}/options/{option_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code in (200, 204)

    if response.status_code == 200:
        data = response.json()
        assert "message" in data


def test_delete_nonexistent_option(
    admin_token,
    test_form,
    option_field,
):
    """
    DELETE with an invalid option ID.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.delete(
        f"/api/forms/{form_id}/fields/{field_id}/options/999999",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404

    data = response.json()

    assert "message" in data


def test_options_for_nonexistent_form(
    admin_token,
):
    """
    GET options for an invalid form.
    """

    response = client.get(
        "/api/forms/999999/fields/1/options",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404


def test_create_option_for_nonexistent_form(
    admin_token,
):
    """
    POST option for an invalid form.
    """

    response = client.post(
        "/api/forms/999999/fields/1/options",
        json={
            "label": "Invalid Form Option",
            "value": "invalid_form_option",
            "display_order": 1,
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
    )

    assert response.status_code == 404


def test_get_options_without_authentication(
    test_form,
    option_field,
):
    """
    GET options without JWT.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.get(
        f"/api/forms/{form_id}/fields/{field_id}/options"
    )

    assert response.status_code == 401


def test_create_option_without_authentication(
    test_form,
    option_field,
):
    """
    POST option without JWT.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]

    response = client.post(
        f"/api/forms/{form_id}/fields/{field_id}/options",
        json={
            "label": "Unauthorized Option",
            "value": "unauthorized",
            "display_order": 1,
        },
    )

    assert response.status_code == 401


def test_update_option_without_authentication(
    test_form,
    option_field,
    test_option,
):
    """
    PUT option without JWT.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]
    option_id = test_option["id"]

    response = client.put(
        f"/api/forms/{form_id}/fields/{field_id}/options/{option_id}",
        json={
            "label": "Unauthorized Update",
            "value": "unauthorized_update",
            "display_order": 1,
        },
    )

    assert response.status_code == 401


def test_delete_option_without_authentication(
    test_form,
    option_field,
    test_option,
):
    """
    DELETE option without JWT.
    """

    form_id = test_form["id"]
    field_id = option_field["id"]
    option_id = test_option["id"]

    response = client.delete(
        f"/api/forms/{form_id}/fields/{field_id}/options/{option_id}"
    )

    assert response.status_code == 401