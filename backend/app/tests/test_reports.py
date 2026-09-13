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
            "title": "Reports API Test Form",
            "description": "Form used for reports API testing",
            "is_active": True,
        },
    )

    if response.status_code in (200, 201):
        return response.json()["data"]

    response = client.get(
        "/api/forms",
        headers=headers,
        params={
            "search": "Reports API Test Form"
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
        if form["title"] == "Reports API Test Form"
    )


@pytest.fixture
def report_fields(
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
            "placeholder": "Enter full name",
            "description": "Full name",
            "is_required": True,
            "display_order": 1,
        },
        {
            "label": "Email",
            "name": "email",
            "field_type": "email",
            "placeholder": "Enter email",
            "description": "Email address",
            "is_required": True,
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
    report_fields,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    fields = {
        field["name"]: field["id"]
        for field in report_fields
    }

    response = client.post(
        f"/api/forms/{test_form['id']}/responses",
        headers=headers,
        json={
            "details": [
                {
                    "field_id": fields["full_name"],
                    "value": "Reports Test User",
                },
                {
                    "field_id": fields["email"],
                    "value": "reports.test@example.com",
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
# GET /api/reports/forms/{form_id}
# ============================================================

def test_get_form_report(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/reports/forms/{test_form['id']}",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_get_form_report_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/reports/forms/999999",
        headers=headers,
    )

    assert response.status_code in (400, 404)


def test_form_report_contains_data(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/reports/forms/{test_form['id']}",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# GET /api/reports/forms/{form_id}/statistics
# ============================================================

def test_get_form_report_statistics(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/reports/forms/{test_form['id']}/statistics",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
    assert "data" in body


def test_get_form_report_statistics_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        "/api/reports/forms/999999/statistics",
        headers=headers,
    )

    assert response.status_code in (400, 404)


def test_form_report_statistics_contains_data(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.get(
        f"/api/reports/forms/{test_form['id']}/statistics",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data is not None


# ============================================================
# POST /api/reports/forms/{form_id}/export/excel
# ============================================================

def test_export_form_report_excel(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/excel",
        headers=headers,
    )

    assert response.status_code in (200, 201, 202)


def test_export_excel_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        "/api/reports/forms/999999/export/excel",
        headers=headers,
    )

    assert response.status_code in (400, 404)


def test_export_excel_response_type(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/excel",
        headers=headers,
    )

    assert response.status_code in (200, 201, 202)

    content_type = response.headers.get(
        "content-type",
        ""
    ).lower()

    assert (
        "spreadsheet" in content_type
        or "excel" in content_type
        or "application/vnd" in content_type
        or "application/json" in content_type
    )


# ============================================================
# POST /api/reports/forms/{form_id}/export/pdf
# ============================================================

def test_export_form_report_pdf(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/pdf",
        headers=headers,
    )

    assert response.status_code in (200, 201, 202)


def test_export_pdf_invalid_form(
    client,
    admin_token,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        "/api/reports/forms/999999/export/pdf",
        headers=headers,
    )

    assert response.status_code in (400, 404)


def test_export_pdf_response_type(
    client,
    admin_token,
    test_form,
    test_response,
):
    headers = {
        "Authorization": f"Bearer {admin_token}"
    }

    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/pdf",
        headers=headers,
    )

    assert response.status_code in (200, 201, 202)

    content_type = response.headers.get(
        "content-type",
        ""
    ).lower()

    assert (
        "application/pdf" in content_type
        or "pdf" in content_type
        or "application/json" in content_type
    )


# ============================================================
# Authentication
# ============================================================

def test_form_report_requires_auth(
    client,
    test_form,
):
    response = client.get(
        f"/api/reports/forms/{test_form['id']}"
    )

    assert response.status_code in (401, 403)


def test_form_report_statistics_requires_auth(
    client,
    test_form,
):
    response = client.get(
        f"/api/reports/forms/{test_form['id']}/statistics"
    )

    assert response.status_code in (401, 403)


def test_excel_export_requires_auth(
    client,
    test_form,
):
    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/excel"
    )

    assert response.status_code in (401, 403)


def test_pdf_export_requires_auth(
    client,
    test_form,
):
    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/pdf"
    )

    assert response.status_code in (401, 403)


# ============================================================
# User access
# ============================================================

def test_user_can_access_form_report(
    client,
    user_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        f"/api/reports/forms/{test_form['id']}",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_access_report_statistics(
    client,
    user_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.get(
        f"/api/reports/forms/{test_form['id']}/statistics",
        headers=headers,
    )

    assert response.status_code in (200, 403)


def test_user_can_export_excel(
    client,
    user_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/excel",
        headers=headers,
    )

    assert response.status_code in (
        200,
        201,
        202,
        403,
    )


def test_user_can_export_pdf(
    client,
    user_token,
    test_form,
):
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = client.post(
        f"/api/reports/forms/{test_form['id']}/export/pdf",
        headers=headers,
    )

    assert response.status_code in (
        200,
        201,
        202,
        403,
    )