# Dynamic Form Builder & Response Management System - Backend

Backend API for the Dynamic Form Builder & Response Management System.

The backend is built with FastAPI and provides APIs for authentication, users, roles, dynamic form creation, form fields, field options, form responses, analytics, reports, dashboard statistics, and activity logs.

---

## Technology Stack

- Python 3.12
- FastAPI
- SQLAlchemy ORM
- Alembic
- Pydantic
- JWT Authentication
- MySQL 8.0
- Redis
- Celery
- Pandas
- OpenPyXL
- ReportLab
- PyMySQL
- Pytest

---

## Backend Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── security.py
│   │   ├── jwt.py
│   │   ├── password.py
│   │   └── permissions.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── form.py
│   │   ├── form_field.py
│   │   ├── field_option.py
│   │   ├── form_response.py
│   │   ├── response_detail.py
│   │   └── activity_log.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── role.py
│   │   ├── form.py
│   │   ├── form_field.py
│   │   ├── field_option.py
│   │   ├── form_response.py
│   │   ├── response_detail.py
│   │   ├── dashboard.py
│   │   ├── analytics.py
│   │   └── report.py
│   │
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── user_repository.py
│   │   ├── role_repository.py
│   │   ├── form_repository.py
│   │   ├── form_field_repository.py
│   │   ├── field_option_repository.py
│   │   ├── response_repository.py
│   │   ├── activity_log_repository.py
│   │   └── dashboard_repository.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── role_service.py
│   │   ├── form_service.py
│   │   ├── form_builder_service.py
│   │   ├── response_service.py
│   │   ├── analytics_service.py
│   │   ├── report_service.py
│   │   └── activity_log_service.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── roles.py
│   │       ├── forms.py
│   │       ├── form_fields.py
│   │       ├── field_options.py
│   │       ├── responses.py
│   │       ├── dashboard.py
│   │       ├── analytics.py
│   │       ├── reports.py
│   │       └── activity_logs.py
│   │
│   ├── tasks/
│   │   ├── __init__.py
│   │   ├── celery_app.py
│   │   ├── export_tasks.py
│   │   └── report_tasks.py
│   │
│   └── utils/
│       ├── __init__.py
│       ├── constants.py
│       ├── response.py
│       ├── validators.py
│       └── file_handler.py
│
├── alembic/
├── tests/
├── requirements.txt
├── Dockerfile
├── .env
├── .env.example
└── README.md