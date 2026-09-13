from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin, require_user
from app.models.user import User
from app.schemas.role import (
    RoleAPIResponse,
    RoleActionResponse,
    RoleCreate,
    RoleDeleteResponse,
    RoleListResponse,
    RoleStatusUpdate,
    RoleUpdate,
)
from app.services.role_service import RoleService


router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


# ============================================================
# GET IP ADDRESS
# ============================================================

def get_ip_address(http_request: Request) -> str | None:
    """Get client IP address from the request."""

    if http_request.client:
        return http_request.client.host

    return None


# ============================================================
# GET ALL ROLES
# ============================================================

@router.get(
    "",
    response_model=RoleListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all roles",
    description="Retrieve all application roles.",
)
def get_roles(
    http_request: Request,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    service = RoleService(db)

    return service.get_roles(
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# GET ROLE BY ID
# ============================================================

@router.get(
    "/{role_id}",
    response_model=RoleAPIResponse,
    status_code=status.HTTP_200_OK,
    summary="Get role by ID",
    description="Retrieve a specific application role.",
)
def get_role(
    role_id: int,
    http_request: Request,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    service = RoleService(db)

    return service.get_role(
        role_id=role_id,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# CREATE ROLE
# ============================================================

@router.post(
    "",
    response_model=RoleActionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create role",
    description="Create a new application role. Admin only.",
)
def create_role(
    request: RoleCreate,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = RoleService(db)

    return service.create_role(
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# UPDATE ROLE
# ============================================================

@router.put(
    "/{role_id}",
    response_model=RoleActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update role",
    description="Update an application role. Admin only.",
)
def update_role(
    role_id: int,
    request: RoleUpdate,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = RoleService(db)

    return service.update_role(
        role_id=role_id,
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# DELETE ROLE
# ============================================================

@router.delete(
    "/{role_id}",
    response_model=RoleDeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete role",
    description="Delete an application role. Admin only.",
)
def delete_role(
    role_id: int,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = RoleService(db)

    return service.delete_role(
        role_id=role_id,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )


# ============================================================
# UPDATE ROLE STATUS
# ============================================================

@router.patch(
    "/{role_id}/status",
    response_model=RoleActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update role status",
    description="Activate or deactivate an application role. Admin only.",
)
def update_role_status(
    role_id: int,
    request: RoleStatusUpdate,
    http_request: Request,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service = RoleService(db)

    return service.update_status(
        role_id=role_id,
        request=request,
        current_user=current_user,
        ip_address=get_ip_address(http_request),
    )