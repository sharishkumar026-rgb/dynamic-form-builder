from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User

from app.schemas.field_option import (
    FieldOptionActionResponse,
    FieldOptionCreate,
    FieldOptionDeleteResponse,
    FieldOptionListResponse,
    FieldOptionStatusUpdate,
    FieldOptionUpdate,
)

from app.services.form_builder_service import FormBuilderService

from app.core.dependencies import get_current_active_user


router = APIRouter(
    prefix="/forms/{form_id}/fields/{field_id}/options",
    tags=["Field Options"],
)


# ============================================================
# CREATE FIELD OPTION
# ADMIN ONLY
# ============================================================

@router.post(
    "",
    response_model=FieldOptionActionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_option(
    form_id: int,
    field_id: int,
    request: FieldOptionCreate,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.create_option(
        form_id=form_id,
        field_id=field_id,
        request=request,
        current_user=current_user,
        ip_address=http_request.client.host
        if http_request.client
        else None,
    )


# ============================================================
# GET ALL FIELD OPTIONS
# ADMIN + USER
# ============================================================

@router.get(
    "",
    response_model=FieldOptionListResponse,
    status_code=status.HTTP_200_OK,
)
def get_options(
    form_id: int,
    field_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.get_options(
        form_id=form_id,
        field_id=field_id,
        current_user=current_user,
    )


# ============================================================
# GET FIELD OPTION BY ID
# ADMIN + USER
# ============================================================

@router.get(
    "/{option_id}",
    response_model=FieldOptionActionResponse,
    status_code=status.HTTP_200_OK,
)
def get_option(
    form_id: int,
    field_id: int,
    option_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.get_option(
        form_id=form_id,
        field_id=field_id,
        option_id=option_id,
        current_user=current_user,
    )


# ============================================================
# UPDATE FIELD OPTION
# ADMIN ONLY
# ============================================================

@router.put(
    "/{option_id}",
    response_model=FieldOptionActionResponse,
    status_code=status.HTTP_200_OK,
)
def update_option(
    form_id: int,
    field_id: int,
    option_id: int,
    request: FieldOptionUpdate,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.update_option(
        form_id=form_id,
        field_id=field_id,
        option_id=option_id,
        request=request,
        current_user=current_user,
        ip_address=http_request.client.host
        if http_request.client
        else None,
    )


# ============================================================
# UPDATE FIELD OPTION STATUS
# ADMIN ONLY
# ============================================================

@router.patch(
    "/{option_id}/status",
    response_model=FieldOptionActionResponse,
    status_code=status.HTTP_200_OK,
)
def update_option_status(
    form_id: int,
    field_id: int,
    option_id: int,
    request: FieldOptionStatusUpdate,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.update_option_status(
        form_id=form_id,
        field_id=field_id,
        option_id=option_id,
        request=request,
        current_user=current_user,
        ip_address=http_request.client.host
        if http_request.client
        else None,
    )


# ============================================================
# DELETE FIELD OPTION
# ADMIN ONLY
# ============================================================

@router.delete(
    "/{option_id}",
    response_model=FieldOptionDeleteResponse,
    status_code=status.HTTP_200_OK,
)
def delete_option(
    form_id: int,
    field_id: int,
    option_id: int,
    http_request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = FormBuilderService(db)

    return service.delete_option(
        form_id=form_id,
        field_id=field_id,
        option_id=option_id,
        current_user=current_user,
        ip_address=http_request.client.host
        if http_request.client
        else None,
    )