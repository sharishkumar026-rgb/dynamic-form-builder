from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.user import User
from app.repositories.role_repository import RoleRepository
from app.schemas.role import (
    RoleAPIResponse,
    RoleActionResponse,
    RoleCreate,
    RoleDeleteResponse,
    RoleListResponse,
    RoleResponse,
    RoleStatusUpdate,
    RoleUpdate,
)


class RoleService:
    """Business logic for role management."""

    def __init__(self, db: Session):
        self.db = db
        self.role_repository = RoleRepository(db)

    # ==========================================================
    # Helper Methods
    # ==========================================================

    def _get_actor_role(self, current_user: User) -> str:
        """
        Get the role name of the user performing the action.
        """
        if current_user.role:
            return current_user.role.name.lower()

        return "user"

    def _role_to_response(self, role: Role) -> RoleResponse:
        """
        Convert Role model to RoleResponse schema.
        """
        return RoleResponse(
            id=role.id,
            name=role.name,
            description=role.description,
            is_active=role.is_active,
            created_at=role.created_at,
            updated_at=role.updated_at,
        )

    # ==========================================================
    # CREATE ROLE
    # ==========================================================

    def create_role(
        self,
        request: RoleCreate,
        current_user: User,
        ip_address: str | None = None,
    ) -> RoleActionResponse:

        # Check duplicate role name
        if self.role_repository.exists(request.name):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Role already exists",
            )

        # Create role
        role = Role(
            name=request.name,
            description=request.description,
            is_active=True,
        )

        role = self.role_repository.create(role)

        # Get actor role
        actor_role = self._get_actor_role(current_user)

        return RoleActionResponse(
            success=True,
            message=f"Role created successfully by {actor_role}",
            role=self._role_to_response(role),
        )

    # ==========================================================
    # GET ALL ROLES
    # ==========================================================

    def get_roles(
        self,
        current_user: User,
        ip_address: str | None = None,
    ) -> RoleListResponse:

        # Get roles
        roles = self.role_repository.get_all()

        # Get total count
        total = self.role_repository.count()

        # Get actor role
        actor_role = self._get_actor_role(current_user)

        # Convert database models to response objects
        role_list = [
            self._role_to_response(role)
            for role in roles
        ]

        return RoleListResponse(
            success=True,
            message=f"Roles retrieved successfully by {actor_role}",
            total=total,
            roles=role_list,
        )

    # ==========================================================
    # GET ROLE BY ID
    # ==========================================================

    def get_role(
        self,
        role_id: int,
        current_user: User,
        ip_address: str | None = None,
    ) -> RoleAPIResponse:

        # Find role
        role = self.role_repository.get_by_id(role_id)

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        # Get actor role
        actor_role = self._get_actor_role(current_user)

        return RoleAPIResponse(
            success=True,
            message=f"Role retrieved successfully by {actor_role}",
            role=self._role_to_response(role),
        )

    # ==========================================================
    # UPDATE ROLE
    # ==========================================================

    def update_role(
        self,
        role_id: int,
        request: RoleUpdate,
        current_user: User,
        ip_address: str | None = None,
    ) -> RoleActionResponse:

        # Find role
        role = self.role_repository.get_by_id(role_id)

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        update_data = {}

        # ------------------------------------------------------
        # Update Name
        # ------------------------------------------------------

        if request.name is not None:

            # Check duplicate role name
            if self.role_repository.exists(
                request.name,
                exclude_role_id=role_id,
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Role already exists",
                )

            update_data["name"] = request.name

        # ------------------------------------------------------
        # Update Description
        # ------------------------------------------------------

        if request.description is not None:
            update_data["description"] = request.description

        # ------------------------------------------------------
        # Update Database
        # ------------------------------------------------------

        if update_data:
            role = self.role_repository.update(
                role,
                update_data,
            )

        # Get actor role
        actor_role = self._get_actor_role(current_user)

        return RoleActionResponse(
            success=True,
            message=f"Role updated successfully by {actor_role}",
            role=self._role_to_response(role),
        )

    # ==========================================================
    # UPDATE ROLE STATUS
    # ==========================================================

    def update_status(
        self,
        role_id: int,
        request: RoleStatusUpdate,
        current_user: User,
        ip_address: str | None = None,
    ) -> RoleActionResponse:

        # Find role
        role = self.role_repository.get_by_id(role_id)

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        # Update status
        role = self.role_repository.update_status(
            role,
            request.is_active,
        )

        # Get actor role
        actor_role = self._get_actor_role(current_user)

        # Create appropriate message
        if request.is_active:
            message = (
                f"Role activated successfully by {actor_role}"
            )
        else:
            message = (
                f"Role deactivated successfully by {actor_role}"
            )

        return RoleActionResponse(
            success=True,
            message=message,
            role=self._role_to_response(role),
        )

    # ==========================================================
    # DELETE ROLE
    # ==========================================================

    def delete_role(
        self,
        role_id: int,
        current_user: User,
        ip_address: str | None = None,
    ) -> RoleDeleteResponse:

        # Find role
        role = self.role_repository.get_by_id(role_id)

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        # ------------------------------------------------------
        # Prevent deleting role assigned to users
        # ------------------------------------------------------

        if self.role_repository.is_role_in_use(role_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete role assigned to users",
            )

        # Get actor role
        actor_role = self._get_actor_role(current_user)

        # Delete role
        self.role_repository.delete(role)

        return RoleDeleteResponse(
            success=True,
            message=f"Role deleted successfully by {actor_role}",
        )