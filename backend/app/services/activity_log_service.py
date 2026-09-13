from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.models.user import User
from app.repositories.activity_log_repository import ActivityLogRepository
from app.schemas.activity_log import (
    ActivityLogDetailResponse,
    ActivityLogListResponse,
)


class ActivityLogService:
    """
    Service layer for activity log operations.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = ActivityLogRepository(db)

    # ========================================================
    # HELPERS
    # ========================================================

    def _get_actor_role(self, current_user: User) -> str:
        """
        Get current user's role name.
        """
        if current_user.role:
            return current_user.role.name

        return "user"

    def _is_admin(self, current_user: User) -> bool:
        """
        Check whether current user is an admin.
        """
        role_name = self._get_actor_role(current_user)

        return role_name.lower() == "admin"

    def _check_log_access(
        self,
        current_user: User,
        log: ActivityLog,
    ) -> None:
        """
        Admin can access all logs.
        Normal users can access only their own logs.
        """

        if self._is_admin(current_user):
            return

        if log.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this activity log",
            )

    # ========================================================
    # GET ALL ACTIVITY LOGS
    # ========================================================

    def get_activity_logs(
        self,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        user_id: int | None = None,
        action: str | None = None,
        entity_type: str | None = None,
        entity_id: int | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> ActivityLogListResponse:
        """
        Retrieve activity logs.

        Admin:
            Can retrieve all activity logs.

        User:
            Can retrieve only their own activity logs.
        """

        actor_role = self._get_actor_role(current_user)

        # ----------------------------------------------------
        # Non-admin users can only see their own logs
        # ----------------------------------------------------

        if not self._is_admin(current_user):
            user_id = current_user.id

        # ----------------------------------------------------
        # Get logs
        # ----------------------------------------------------

        logs = self.repository.get_all(
            skip=skip,
            limit=limit,
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            start_date=start_date,
            end_date=end_date,
        )

        # ----------------------------------------------------
        # Get total count
        # ----------------------------------------------------

        total = self.repository.count(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            start_date=start_date,
            end_date=end_date,
        )

        # ----------------------------------------------------
        # Pagination
        # ----------------------------------------------------

        page = (skip // limit) + 1 if limit > 0 else 1

        page_size = limit

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return ActivityLogListResponse(
            success=True,
            message=(
                f"Activity logs retrieved successfully "
                f"by {actor_role}"
            ),
            activity_log=logs,
            total=total,
            page=page,
            page_size=page_size,
        )

    # ========================================================
    # GET ACTIVITY LOG BY ID
    # ========================================================

    def get_activity_log(
        self,
        log_id: int,
        current_user: User,
    ) -> ActivityLogDetailResponse:
        """
        Retrieve a single activity log.
        """

        log = self.repository.get_by_id(log_id)

        if not log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity log not found",
            )

        # ----------------------------------------------------
        # Permission check
        # ----------------------------------------------------

        self._check_log_access(
            current_user=current_user,
            log=log,
        )

        actor_role = self._get_actor_role(current_user)

        return ActivityLogDetailResponse(
            success=True,
            message=(
                f"Activity log retrieved successfully "
                f"by {actor_role}"
            ),
            activity_log=log,
        )

    # ========================================================
    # GET LOGS BY USER
    # ========================================================

    def get_logs_by_user(
        self,
        user_id: int,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
    ) -> ActivityLogListResponse:
        """
        Retrieve activity logs for a specific user.
        """

        if not self._is_admin(current_user):
            if user_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=(
                        "You are not authorized to access "
                        "another user's activity logs"
                    ),
                )

        logs = self.repository.get_all(
            skip=skip,
            limit=limit,
            user_id=user_id,
        )

        total = self.repository.count(
            user_id=user_id,
        )

        actor_role = self._get_actor_role(current_user)

        page = (skip // limit) + 1 if limit > 0 else 1

        return ActivityLogListResponse(
            success=True,
            message=(
                f"User activity logs retrieved successfully "
                f"by {actor_role}"
            ),
            activity_log=logs,
            total=total,
            page=page,
            page_size=limit,
        )

    # ========================================================
    # GET LOGS BY ACTION
    # ========================================================

    def get_logs_by_action(
        self,
        action: str,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
    ) -> ActivityLogListResponse:
        """
        Retrieve activity logs by action.
        """

        user_id = None

        if not self._is_admin(current_user):
            user_id = current_user.id

        logs = self.repository.get_all(
            skip=skip,
            limit=limit,
            user_id=user_id,
            action=action,
        )

        total = self.repository.count(
            user_id=user_id,
            action=action,
        )

        actor_role = self._get_actor_role(current_user)

        page = (skip // limit) + 1 if limit > 0 else 1

        return ActivityLogListResponse(
            success=True,
            message=(
                f"Activity logs for action '{action}' "
                f"retrieved successfully by {actor_role}"
            ),
            activity_log=logs,
            total=total,
            page=page,
            page_size=limit,
        )

    # ========================================================
    # GET LOGS BY ENTITY
    # ========================================================

    def get_logs_by_entity(
        self,
        entity_type: str,
        entity_id: int,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
    ) -> ActivityLogListResponse:
        """
        Retrieve activity logs for a specific entity.
        """

        user_id = None

        if not self._is_admin(current_user):
            user_id = current_user.id

        logs = self.repository.get_all(
            skip=skip,
            limit=limit,
            user_id=user_id,
            entity_type=entity_type,
            entity_id=entity_id,
        )

        total = self.repository.count(
            user_id=user_id,
            entity_type=entity_type,
            entity_id=entity_id,
        )

        actor_role = self._get_actor_role(current_user)

        page = (skip // limit) + 1 if limit > 0 else 1

        return ActivityLogListResponse(
            success=True,
            message=(
                f"Activity logs for {entity_type} "
                f"{entity_id} retrieved successfully "
                f"by {actor_role}"
            ),
            activity_log=logs,
            total=total,
            page=page,
            page_size=limit,
        )

    # ========================================================
    # GET LOGS BY DATE RANGE
    # ========================================================

    def get_logs_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
    ) -> ActivityLogListResponse:
        """
        Retrieve activity logs between two dates.
        """

        if end_date < start_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be greater than start date",
            )

        user_id = None

        if not self._is_admin(current_user):
            user_id = current_user.id

        logs = self.repository.get_all(
            skip=skip,
            limit=limit,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
        )

        total = self.repository.count(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
        )

        actor_role = self._get_actor_role(current_user)

        page = (skip // limit) + 1 if limit > 0 else 1

        return ActivityLogListResponse(
            success=True,
            message=(
                "Activity logs retrieved successfully "
                f"by {actor_role}"
            ),
            activity_log=logs,
            total=total,
            page=page,
            page_size=limit,
        )

    # ========================================================
    # GET RECENT ACTIVITY LOGS
    # ========================================================

    def get_recent_logs(
        self,
        current_user: User,
        limit: int = 20,
    ) -> ActivityLogListResponse:
        """
        Retrieve recent activity logs.
        """

        user_id = None

        if not self._is_admin(current_user):
            user_id = current_user.id

        logs = self.repository.get_all(
            skip=0,
            limit=limit,
            user_id=user_id,
        )

        total = self.repository.count(
            user_id=user_id,
        )

        actor_role = self._get_actor_role(current_user)

        return ActivityLogListResponse(
            success=True,
            message=(
                f"Recent activity logs retrieved successfully "
                f"by {actor_role}"
            ),
            activity_log=logs,
            total=total,
            page=1,
            page_size=limit,
        )

    # ========================================================
    # CREATE ACTIVITY LOG
    # ========================================================

    def create_activity_log(
        self,
        user_id: int | None,
        action: str,
        entity_type: str | None = None,
        entity_id: int | None = None,
        description: str | None = None,
        details: dict | None = None,
        ip_address: str | None = None,
    ) -> ActivityLog:
        """
        Create a new activity log.
        """

        activity_log = ActivityLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            details=details,
            ip_address=ip_address,
        )

        return self.repository.create(activity_log)