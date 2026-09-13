from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.password import hash_password

from app.models.user import User
from app.models.activity_log import ActivityLog

from app.repositories.user_repository import UserRepository

from app.schemas.user import (
    DeleteUserResponse,
    SingleUserResponse,
    UserActionResponse,
    UserCreateRequest,
    UserListResponse,
    UserResponse,
    UserRoleUpdateRequest,
    UserStatusUpdateRequest,
    UserUpdateRequest,
)


class UserService:
    """Business logic for users."""

    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)

    # ============================================================
    # GET ALL USERS
    # ============================================================

    def get_users(
        self,
        current_user: User,
    ) -> UserListResponse:

        users = self.user_repository.get_all()

        actor_role = self._get_actor_role(
            current_user
        )

        return UserListResponse(
            success=True,
            message=(
                f"Users retrieved successfully by "
                f"{actor_role}"
            ),
            total=len(users),
            users=[
                UserResponse.model_validate(user)
                for user in users
            ],
        )

    # ============================================================
    # GET USER BY ID
    # ============================================================

    def get_user(
        self,
        user_id: int,
        current_user: User,
    ) -> SingleUserResponse:

        user = self.user_repository.get_by_id(
            user_id
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        actor_role = self._get_actor_role(
            current_user
        )

        return SingleUserResponse(
            success=True,
            message=(
                f"User details retrieved successfully by "
                f"{actor_role}"
            ),
            user=UserResponse.model_validate(
                user
            ),
        )

    # ============================================================
    # CREATE USER
    # ============================================================

    def create_user(
        self,
        request: UserCreateRequest,
        current_user: User,
    ) -> UserActionResponse:

        # --------------------------------------------------------
        # Check duplicate email
        # --------------------------------------------------------

        existing_user = (
            self.user_repository.get_by_email(
                request.email
            )
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        # --------------------------------------------------------
        # Check role exists
        # --------------------------------------------------------

        role = self.user_repository.get_role_by_id(
            request.role_id
        )

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        # --------------------------------------------------------
        # Check role is active
        # --------------------------------------------------------

        if not role.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot assign an inactive role",
            )

        # --------------------------------------------------------
        # Hash password
        # --------------------------------------------------------

        password_hash = hash_password(
            request.password
        )

        # --------------------------------------------------------
        # Create user
        # --------------------------------------------------------

        user = User(
            name=request.name.strip(),
            email=request.email,
            password_hash=password_hash,
            role_id=request.role_id,
            is_active=True,
        )

        user = self.user_repository.create(
            user
        )

        # --------------------------------------------------------
        # Retrieve created user
        # --------------------------------------------------------

        created_user = self.user_repository.get_by_id(
            user.id
        )

        if created_user is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created user",
            )

        actor_role = self._get_actor_role(
            current_user
        )

        # ========================================================
        # ACTIVITY LOG
        # ========================================================

        activity_log = ActivityLog(
            user_id=current_user.id,
            action="CREATE",
            entity_type="user",
            entity_id=created_user.id,
            description="User created successfully",
            details={
                "created_user_id": created_user.id,
                "created_user_name": created_user.name,
                "created_user_email": created_user.email,
                "role_id": created_user.role_id,
                "role_name": (
                    created_user.role.name
                    if created_user.role
                    else None
                ),
                "performed_by": current_user.name,
                "performed_by_role": actor_role,
            },
        )

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

        # --------------------------------------------------------
        # Response
        # --------------------------------------------------------

        return UserActionResponse(
            success=True,
            message=(
                f"User created successfully by "
                f"{actor_role}"
            ),
            user=UserResponse.model_validate(
                created_user
            ),
        )

    # ============================================================
    # UPDATE USER
    # ============================================================

    def update_user(
        self,
        user_id: int,
        request: UserUpdateRequest,
        current_user: User,
    ) -> UserActionResponse:

        user = self.user_repository.get_by_id(
            user_id
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        updated_fields = []

        # --------------------------------------------------------
        # Update email
        # --------------------------------------------------------

        if request.email is not None:

            existing_user = (
                self.user_repository.get_by_email(
                    request.email
                )
            )

            if (
                existing_user is not None
                and existing_user.id != user.id
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already registered",
                )

            user.email = request.email
            updated_fields.append("email")

        # --------------------------------------------------------
        # Update name
        # --------------------------------------------------------

        if request.name is not None:

            user.name = request.name.strip()
            updated_fields.append("name")

        # --------------------------------------------------------
        # Update role
        # --------------------------------------------------------

        if request.role_id is not None:

            role = self.user_repository.get_role_by_id(
                request.role_id
            )

            if role is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Role not found",
                )

            if not role.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot assign an inactive role",
                )

            user.role_id = request.role_id

            # Keep SQLAlchemy relationship synchronized
            user.role = role

            updated_fields.append("role_id")

        # --------------------------------------------------------
        # Save update
        # --------------------------------------------------------

        updated_user = self.user_repository.update(
            user
        )

        if updated_user is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user",
            )

        # Refresh relationship state
        self.db.expire_all()

        updated_user = self.user_repository.get_by_id(
            user_id
        )

        if updated_user is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve updated user",
            )

        actor_role = self._get_actor_role(
            current_user
        )

        # ========================================================
        # ACTIVITY LOG
        # ========================================================

        activity_log = ActivityLog(
            user_id=current_user.id,
            action="UPDATE",
            entity_type="user",
            entity_id=updated_user.id,
            description="User updated successfully",
            details={
                "user_id": updated_user.id,
                "user_name": updated_user.name,
                "user_email": updated_user.email,
                "updated_fields": updated_fields,
                "performed_by": current_user.name,
                "performed_by_role": actor_role,
            },
        )

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

        # --------------------------------------------------------
        # Response
        # --------------------------------------------------------

        return UserActionResponse(
            success=True,
            message=(
                f"User updated successfully by "
                f"{actor_role}"
            ),
            user=UserResponse.model_validate(
                updated_user
            ),
        )

    # ============================================================
    # CHANGE USER ROLE
    # ============================================================

    def update_user_role(
        self,
        user_id: int,
        request: UserRoleUpdateRequest,
        current_user: User,
    ) -> UserActionResponse:

        # --------------------------------------------------------
        # Get user
        # --------------------------------------------------------

        user = self.user_repository.get_by_id(
            user_id
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # --------------------------------------------------------
        # Get actor role BEFORE changing the user's role
        # --------------------------------------------------------

        actor_role = self._get_actor_role(
            current_user
        )

        # --------------------------------------------------------
        # Store old role details
        # --------------------------------------------------------

        old_role_id = user.role_id

        old_role_name = (
            user.role.name
            if user.role
            else None
        )

        # --------------------------------------------------------
        # Get new role
        # --------------------------------------------------------

        new_role = self.user_repository.get_role_by_id(
            request.role_id
        )

        if new_role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )

        # --------------------------------------------------------
        # Check new role is active
        # --------------------------------------------------------

        if not new_role.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot assign an inactive role",
            )

        # --------------------------------------------------------
        # Check same role
        # --------------------------------------------------------

        if old_role_id == request.role_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has this role",
            )

        # --------------------------------------------------------
        # Update role
        # --------------------------------------------------------

        self.user_repository.update_role(
            user,
            request.role_id,
        )

        # --------------------------------------------------------
        # Clear SQLAlchemy session cache
        # --------------------------------------------------------

        self.db.expire_all()

        # --------------------------------------------------------
        # Retrieve updated user
        # --------------------------------------------------------

        updated_user = self.user_repository.get_by_id(
            user_id
        )

        if updated_user is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve updated user",
            )

        # --------------------------------------------------------
        # Make sure role relationship exists
        # --------------------------------------------------------

        if updated_user.role is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Updated user role could not be loaded",
            )

        # --------------------------------------------------------
        # Make sure role ID is correct
        # --------------------------------------------------------

        if updated_user.role.id != request.role_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User role was not updated correctly",
            )

        # ========================================================
        # ACTIVITY LOG
        # ========================================================

        activity_log = ActivityLog(
            user_id=current_user.id,
            action="ROLE_UPDATE",
            entity_type="user",
            entity_id=updated_user.id,
            description="User role updated successfully",
            details={
                "user_id": updated_user.id,
                "user_name": updated_user.name,
                "user_email": updated_user.email,
                "old_role_id": old_role_id,
                "old_role_name": old_role_name,
                "new_role_id": new_role.id,
                "new_role_name": new_role.name,
                "changed_by": current_user.name,
                "changed_by_role": actor_role,
            },
        )

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

        # --------------------------------------------------------
        # Response
        # --------------------------------------------------------

        return UserActionResponse(
            success=True,
            message=(
                f"User role changed successfully by "
                f"{actor_role}"
            ),
            user=UserResponse.model_validate(
                updated_user
            ),
        )

    # ============================================================
    # UPDATE USER STATUS
    # ============================================================

    def update_user_status(
        self,
        user_id: int,
        request: UserStatusUpdateRequest,
        current_user: User,
    ) -> UserActionResponse:

        user = self.user_repository.get_by_id(
            user_id
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # --------------------------------------------------------
        # Update status
        # --------------------------------------------------------

        user.is_active = request.is_active

        updated_user = self.user_repository.update(
            user
        )

        if updated_user is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user status",
            )

        actor_role = self._get_actor_role(
            current_user
        )

        # --------------------------------------------------------
        # Activation / Deactivation details
        # --------------------------------------------------------

        if request.is_active:

            action = "STATUS_UPDATE"
            description = "User activated successfully"
            status_value = "active"

            message = (
                f"User activated successfully by "
                f"{actor_role}"
            )

        else:

            action = "STATUS_UPDATE"
            description = "User deactivated successfully"
            status_value = "inactive"

            message = (
                f"User deactivated successfully by "
                f"{actor_role}"
            )

        # ========================================================
        # ACTIVITY LOG
        # ========================================================

        activity_log = ActivityLog(
            user_id=current_user.id,
            action=action,
            entity_type="user",
            entity_id=updated_user.id,
            description=description,
            details={
                "user_id": updated_user.id,
                "user_name": updated_user.name,
                "status": status_value,
                "is_active": updated_user.is_active,
                "performed_by": current_user.name,
                "performed_by_role": actor_role,
            },
        )

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

        # --------------------------------------------------------
        # Response
        # --------------------------------------------------------

        return UserActionResponse(
            success=True,
            message=message,
            user=UserResponse.model_validate(
                updated_user
            ),
        )

    # ============================================================
    # DELETE USER
    # ============================================================

    def delete_user(
        self,
        user_id: int,
        current_user: User,
    ) -> DeleteUserResponse:

        user = self.user_repository.get_by_id(
            user_id
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # --------------------------------------------------------
        # Store user details before deletion
        # --------------------------------------------------------

        deleted_user_id = user.id
        deleted_user_name = user.name
        deleted_user_email = user.email
        deleted_user_role_id = user.role_id

        deleted_user_role_name = (
            user.role.name
            if user.role
            else None
        )

        actor_role = self._get_actor_role(
            current_user
        )

        # --------------------------------------------------------
        # Delete user
        # --------------------------------------------------------

        self.user_repository.delete(
            user
        )

        # ========================================================
        # ACTIVITY LOG
        # ========================================================

        activity_log = ActivityLog(
            user_id=current_user.id,
            action="DELETE",
            entity_type="user",
            entity_id=deleted_user_id,
            description="User deleted successfully",
            details={
                "deleted_user_id": deleted_user_id,
                "deleted_user_name": deleted_user_name,
                "deleted_user_email": deleted_user_email,
                "role_id": deleted_user_role_id,
                "role_name": deleted_user_role_name,
                "deleted_by": current_user.name,
                "deleted_by_role": actor_role,
            },
        )

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

        # --------------------------------------------------------
        # Response
        # --------------------------------------------------------

        return DeleteUserResponse(
            success=True,
            message=(
                f"User deleted successfully by "
                f"{actor_role}"
            ),
        )

    # ============================================================
    # PRIVATE HELPER
    # ============================================================

    def _get_actor_role(
        self,
        user: User,
    ) -> str:

        if user.role is not None:
            return user.role.name

        return "user"