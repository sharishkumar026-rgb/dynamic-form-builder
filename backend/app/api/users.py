from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin, require_user
from app.models.user import User
from app.schemas.user import (
    DeleteUserResponse,
    SingleUserResponse,
    UserActionResponse,
    UserCreateRequest,
    UserListResponse,
    UserRoleUpdateRequest,
    UserStatusUpdateRequest,
    UserUpdateRequest,
)
from app.services.user_service import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ============================================================
# IP ADDRESS HELPER
# ============================================================

def get_ip_address(request: Request) -> str | None:
    if request.client:
        return request.client.host

    return None


# ============================================================
# GET ALL USERS
# ============================================================
# Admin + User

@router.get(
    "",
    response_model=UserListResponse,
    status_code=status.HTTP_200_OK,
)
def get_users(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    service = UserService(db)

    return service.get_users(
        current_user=current_user,
    )


# ============================================================
# GET SINGLE USER
# ============================================================
# Admin + User

@router.get(
    "/{user_id}",
    response_model=SingleUserResponse,
    status_code=status.HTTP_200_OK,
)
def get_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    service = UserService(db)

    return service.get_user(
        user_id=user_id,
        current_user=current_user,
    )


# ============================================================
# CREATE USER
# ============================================================
# Admin only

@router.post(
    "",
    response_model=UserActionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    request_data: UserCreateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = UserService(db)

    return service.create_user(
        request=request_data,
        current_user=current_user,
    )


# ============================================================
# UPDATE USER
# ============================================================
# Admin only

@router.put(
    "/{user_id}",
    response_model=UserActionResponse,
    status_code=status.HTTP_200_OK,
)
def update_user(
    user_id: int,
    request_data: UserUpdateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = UserService(db)

    return service.update_user(
        user_id=user_id,
        request=request_data,
        current_user=current_user,
    )


# ============================================================
# CHANGE USER ROLE
# ============================================================
# Admin only

@router.patch(
    "/{user_id}/role",
    response_model=UserActionResponse,
    status_code=status.HTTP_200_OK,
)
def update_user_role(
    user_id: int,
    request_data: UserRoleUpdateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = UserService(db)

    return service.update_user_role(
        user_id=user_id,
        request=request_data,
        current_user=current_user,
    )


# ============================================================
# DELETE USER
# ============================================================
# Admin only

@router.delete(
    "/{user_id}",
    response_model=DeleteUserResponse,
    status_code=status.HTTP_200_OK,
)
def delete_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = UserService(db)

    return service.delete_user(
        user_id=user_id,
        current_user=current_user,
    )


# ============================================================
# UPDATE USER STATUS
# ============================================================
# Admin only

@router.patch(
    "/{user_id}/status",
    response_model=UserActionResponse,
    status_code=status.HTTP_200_OK,
)
def update_user_status(
    user_id: int,
    request_data: UserStatusUpdateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = UserService(db)

    return service.update_user_status(
        user_id=user_id,
        request=request_data,
        current_user=current_user,
    )