from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin, require_user
from app.models.user import User
from app.schemas.form import (
    FormAPIResponse,
    FormActionResponse,
    FormCreate,
    FormDeleteResponse,
    FormListResponse,
    FormStatusUpdate,
    FormUpdate,
)
from app.services.form_service import FormService


router = APIRouter(
    prefix="/forms",
    tags=["Forms"],
)


# ============================================================
# IP ADDRESS HELPER
# ============================================================

def get_ip_address(request: Request) -> str | None:
    """Get client IP address from the request."""
    if request.client:
        return request.client.host

    return None


# ============================================================
# GET ALL FORMS
# ============================================================
# Admin + User

@router.get(
    "",
    response_model=FormListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all forms",
    description="Retrieve all forms. Admin and User can view forms.",
)
def get_forms(
    skip: int = 0,
    limit: int = 100,
    is_active: bool | None = None,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.get_forms(
        current_user=current_user,
        skip=skip,
        limit=limit,
        is_active=is_active,
    )


# ============================================================
# GET FORM BY ID
# ============================================================
# Admin + User

@router.get(
    "/{form_id}",
    response_model=FormAPIResponse,
    status_code=status.HTTP_200_OK,
    summary="Get form by ID",
    description="Retrieve a specific form. Admin and User can view forms.",
)
def get_form(
    form_id: int,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.get_form(
        form_id=form_id,
        current_user=current_user,
    )


# ============================================================
# CREATE FORM
# ============================================================
# Admin only

@router.post(
    "",
    response_model=FormActionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create form",
    description="Create a new dynamic form. Admin only.",
)
def create_form(
    request: FormCreate,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.create_form(
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# UPDATE FORM
# ============================================================
# Admin only

@router.put(
    "/{form_id}",
    response_model=FormActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update form",
    description="Update an existing form. Admin only.",
)
def update_form(
    form_id: int,
    request: FormUpdate,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.update_form(
        form_id=form_id,
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# DELETE FORM
# ============================================================
# Admin only

@router.delete(
    "/{form_id}",
    response_model=FormDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete form",
    description="Delete an existing form. Admin only.",
)
def delete_form(
    form_id: int,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.delete_form(
        form_id=form_id,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# UPDATE FORM STATUS
# ============================================================
# Admin only

@router.patch(
    "/{form_id}/status",
    response_model=FormActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update form status",
    description="Activate or deactivate a form. Admin only.",
)
def update_form_status(
    form_id: int,
    request: FormStatusUpdate,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.update_status(
        form_id=form_id,
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# ENABLE FORM
# ============================================================
# Admin only

@router.patch(
    "/{form_id}/enable",
    response_model=FormActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Enable form",
    description="Enable an existing form. Admin only.",
)
def enable_form(
    form_id: int,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.enable_form(
        form_id=form_id,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# DISABLE FORM
# ============================================================
# Admin only

@router.patch(
    "/{form_id}/disable",
    response_model=FormActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Disable form",
    description="Disable an existing form. Admin only.",
)
def disable_form(
    form_id: int,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = FormService(db)

    return service.disable_form(
        form_id=form_id,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )