
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user

from app.models.user import User

from app.schemas.form_response import (
    FormResponseCreate,
    FormResponseUpdate,
)

from app.services.response_service import ResponseService


router = APIRouter(
    tags=["Responses"],
)


# ============================================================
# CREATE RESPONSE
# USER ONLY
# ============================================================

@router.post(
    "/forms/{form_id}/responses",
    status_code=status.HTTP_201_CREATED,
)
def create_response(
    form_id: int,
    response_data: FormResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ResponseService(db)

    return service.create_response(
        form_id=form_id,
        response_data=response_data,
        current_user=current_user,
    )


# ============================================================
# GET ALL RESPONSES
# ADMIN ONLY
# ============================================================

@router.get(
    "/forms/{form_id}/responses",
)
def get_form_responses(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ResponseService(db)

    return service.get_form_responses(
        form_id=form_id,
        current_user=current_user,
    )


# ============================================================
# GET RESPONSE BY ID
# ADMIN = ANY RESPONSE
# USER = OWN RESPONSE ONLY
# ============================================================

@router.get(
    "/responses/{response_id}",
)
def get_response(
    response_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ResponseService(db)

    return service.get_response(
        response_id=response_id,
        current_user=current_user,
    )


# ============================================================
# UPDATE RESPONSE
# USER ONLY
# OWN RESPONSE ONLY
# ============================================================

@router.put(
    "/responses/{response_id}",
)
def update_response(
    response_id: int,
    response_data: FormResponseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ResponseService(db)

    return service.update_response(
        response_id=response_id,
        response_data=response_data,
        current_user=current_user,
    )


# ============================================================
# DELETE RESPONSE
# USER ONLY
# OWN RESPONSE ONLY
# ============================================================

@router.delete(
    "/responses/{response_id}",
)
def delete_response(
    response_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ResponseService(db)

    return service.delete_response(
        response_id=response_id,
        current_user=current_user,
    )


# ============================================================
# RESPONSE HISTORY
# ADMIN ONLY
# ============================================================

@router.get(
    "/responses/{response_id}/history",
)
def get_response_history(
    response_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ResponseService(db)

    return service.get_response_history(
        response_id=response_id,
        current_user=current_user,
    )