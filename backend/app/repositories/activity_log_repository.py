from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.activity_log import ActivityLog


class ActivityLogRepository:
    """Database operations for activity logs."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # CREATE
    # ========================================================

    def create(
        self,
        activity_log: ActivityLog,
    ) -> ActivityLog:

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

        return activity_log

    # ========================================================
    # GET BY ID
    # ========================================================

    def get_by_id(
        self,
        log_id: int,
    ) -> ActivityLog | None:

        return (
            self.db.query(ActivityLog)
            .options(
                joinedload(ActivityLog.user),
            )
            .filter(
                ActivityLog.id == log_id
            )
            .first()
        )

    # ========================================================
    # GET ALL LOGS
    # ========================================================

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        user_id: int | None = None,
        action: str | None = None,
        entity_type: str | None = None,
        entity_id: int | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> list[ActivityLog]:

        query = (
            self.db.query(ActivityLog)
            .options(
                joinedload(ActivityLog.user),
            )
        )

        # ----------------------------------------------------
        # USER FILTER
        # ----------------------------------------------------

        if user_id is not None:
            query = query.filter(
                ActivityLog.user_id == user_id
            )

        # ----------------------------------------------------
        # ACTION FILTER
        # ----------------------------------------------------

        if action is not None:
            query = query.filter(
                ActivityLog.action == action
            )

        # ----------------------------------------------------
        # ENTITY TYPE FILTER
        # ----------------------------------------------------

        if entity_type is not None:
            query = query.filter(
                ActivityLog.entity_type == entity_type
            )

        # ----------------------------------------------------
        # ENTITY ID FILTER
        # ----------------------------------------------------

        if entity_id is not None:
            query = query.filter(
                ActivityLog.entity_id == entity_id
            )

        # ----------------------------------------------------
        # START DATE
        # ----------------------------------------------------

        if start_date is not None:
            query = query.filter(
                ActivityLog.created_at >= start_date
            )

        # ----------------------------------------------------
        # END DATE
        # ----------------------------------------------------

        if end_date is not None:
            query = query.filter(
                ActivityLog.created_at <= end_date
            )

        # ----------------------------------------------------
        # RESULT
        # ----------------------------------------------------

        return (
            query
            .order_by(
                ActivityLog.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # COUNT LOGS
    # ========================================================

    def count(
        self,
        user_id: int | None = None,
        action: str | None = None,
        entity_type: str | None = None,
        entity_id: int | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:

        query = self.db.query(
            func.count(ActivityLog.id)
        )

        if user_id is not None:
            query = query.filter(
                ActivityLog.user_id == user_id
            )

        if action is not None:
            query = query.filter(
                ActivityLog.action == action
            )

        if entity_type is not None:
            query = query.filter(
                ActivityLog.entity_type == entity_type
            )

        if entity_id is not None:
            query = query.filter(
                ActivityLog.entity_id == entity_id
            )

        if start_date is not None:
            query = query.filter(
                ActivityLog.created_at >= start_date
            )

        if end_date is not None:
            query = query.filter(
                ActivityLog.created_at <= end_date
            )

        return query.scalar() or 0

    # ========================================================
    # GET LOGS BY USER
    # ========================================================

    def get_by_user(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ActivityLog]:

        return (
            self.db.query(ActivityLog)
            .options(
                joinedload(ActivityLog.user),
            )
            .filter(
                ActivityLog.user_id == user_id
            )
            .order_by(
                ActivityLog.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # COUNT LOGS BY USER
    # ========================================================

    def count_by_user(
        self,
        user_id: int,
    ) -> int:

        return (
            self.db.query(
                func.count(ActivityLog.id)
            )
            .filter(
                ActivityLog.user_id == user_id
            )
            .scalar()
            or 0
        )

    # ========================================================
    # GET LOGS BY ACTION
    # ========================================================

    def get_by_action(
        self,
        action: str,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ActivityLog]:

        return (
            self.db.query(ActivityLog)
            .options(
                joinedload(ActivityLog.user),
            )
            .filter(
                ActivityLog.action == action
            )
            .order_by(
                ActivityLog.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # COUNT LOGS BY ACTION
    # ========================================================

    def count_by_action(
        self,
        action: str,
    ) -> int:

        return (
            self.db.query(
                func.count(ActivityLog.id)
            )
            .filter(
                ActivityLog.action == action
            )
            .scalar()
            or 0
        )

    # ========================================================
    # GET LOGS BY ENTITY
    # ========================================================

    def get_by_entity(
        self,
        entity_type: str,
        entity_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ActivityLog]:

        return (
            self.db.query(ActivityLog)
            .options(
                joinedload(ActivityLog.user),
            )
            .filter(
                ActivityLog.entity_type == entity_type,
                ActivityLog.entity_id == entity_id,
            )
            .order_by(
                ActivityLog.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # COUNT LOGS BY ENTITY
    # ========================================================

    def count_by_entity(
        self,
        entity_type: str,
        entity_id: int,
    ) -> int:

        return (
            self.db.query(
                func.count(ActivityLog.id)
            )
            .filter(
                ActivityLog.entity_type == entity_type,
                ActivityLog.entity_id == entity_id,
            )
            .scalar()
            or 0
        )

    # ========================================================
    # COUNT BY ENTITY TYPE
    # ========================================================

    def count_by_entity_type(
        self,
        entity_type: str,
    ) -> int:

        return (
            self.db.query(
                func.count(ActivityLog.id)
            )
            .filter(
                ActivityLog.entity_type == entity_type
            )
            .scalar()
            or 0
        )

    # ========================================================
    # GET RECENT LOGS
    # ========================================================

    def get_recent(
        self,
        limit: int = 20,
    ) -> list[ActivityLog]:

        return (
            self.db.query(ActivityLog)
            .options(
                joinedload(ActivityLog.user),
            )
            .order_by(
                ActivityLog.created_at.desc()
            )
            .limit(limit)
            .all()
        )

    # ========================================================
    # GET LOGS BY DATE RANGE
    # ========================================================

    def get_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ActivityLog]:

        return (
            self.db.query(ActivityLog)
            .options(
                joinedload(ActivityLog.user),
            )
            .filter(
                ActivityLog.created_at >= start_date,
                ActivityLog.created_at <= end_date,
            )
            .order_by(
                ActivityLog.created_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # COUNT BY DATE RANGE
    # ========================================================

    def count_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime,
    ) -> int:

        return (
            self.db.query(
                func.count(ActivityLog.id)
            )
            .filter(
                ActivityLog.created_at >= start_date,
                ActivityLog.created_at <= end_date,
            )
            .scalar()
            or 0
        )