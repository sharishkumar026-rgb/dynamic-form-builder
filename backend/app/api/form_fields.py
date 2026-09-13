from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.form_field import (
    FormFieldActionResponse,
    FormFieldCreate,
    FormFieldDeleteResponse,
    FormFieldListResponse,
    FormFieldReorderRequest,
    FormFieldReorderResponse,
    FormFieldUpdate,
)
from app.services.form_builder_service import FormBuilderService


router = APIRouter(
    prefix="/forms/{form_id}/fields",
    tags=["Form Fields"],
)


def get_ip_address(http_request: Request) -> str | None:
    """Get client IP address from the request."""
    return (
        http_request.client.host
        if http_request.client
        else None
    )


# ============================================================
# GET ALL FIELDS
# ============================================================

@router.get(
    "",
    response_model=FormFieldListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get form fields",
    description=(
        "Retrieve all fields belonging to a form. "
        "Fields are returned according to their display order."
    ),
)
def get_fields(
    form_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.get_fields(
        form_id=form_id,
        current_user=current_user,
        skip=skip,
        limit=limit,
    )


# ============================================================
# GET FIELD BY ID
# ============================================================

@router.get(
    "/{field_id}",
    response_model=FormFieldActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get form field",
    description=(
        "Retrieve a specific form field including validation rules, "
        "conditional logic, options, and display order."
    ),
)
def get_field(
    form_id: int,
    field_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.get_field(
        form_id=form_id,
        field_id=field_id,
        current_user=current_user,
    )


# ============================================================
# CREATE FIELD
# ============================================================

@router.post(
    "",
    response_model=FormFieldActionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create form field",
    description=(
        "Create a dynamic field inside a form. "
        "Supported field types include text, number, email, date, "
        "dropdown, checkbox, radio, file, and rating."
    ),
)
def create_field(
    form_id: int,
    request: FormFieldCreate,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.create_field(
        form_id=form_id,
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# UPDATE FIELD
# ============================================================

@router.put(
    "/{field_id}",
    response_model=FormFieldActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update form field",
    description=(
        "Update a form field including label, name, placeholder, "
        "description, required status, validation rules, "
        "conditional logic, and field options."
    ),
)
def update_field(
    form_id: int,
    field_id: int,
    request: FormFieldUpdate,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.update_field(
        form_id=form_id,
        field_id=field_id,
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# DELETE FIELD
# ============================================================

@router.delete(
    "/{field_id}",
    response_model=FormFieldDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete form field",
    description=(
        "Delete a field from a form. "
        "Associated field options are also removed."
    ),
)
def delete_field(
    form_id: int,
    field_id: int,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.delete_field(
        form_id=form_id,
        field_id=field_id,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# REORDER FIELDS
# ============================================================

@router.patch(
    "/reorder",
    response_model=FormFieldReorderResponse,
    status_code=status.HTTP_200_OK,
    summary="Reorder form fields",
    description=(
        "Change the display order of fields inside a form."
    ),
)
def reorder_fields(
    form_id: int,
    request: FormFieldReorderRequest,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.reorder_fields(
        form_id=form_id,
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )