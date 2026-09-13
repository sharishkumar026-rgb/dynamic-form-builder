from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.report import Report


class ReportRepository:
    """Database operations for saved reports."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # Create
    # ========================================================

    def create(
        self,
        *,
        name: str,
        description: str | None,
        form_id: int,
        created_by_id: int,
        selected_fields: list[str] | None = None,
        filters: list[dict[str, Any]] | None = None,
        sort_by: str | None = None,
        sort_order: str | None = "asc",
        group_by: str | None = None,
        visualization: str | None = None,
    ) -> Report:

        report = Report(
            name=name,
            description=description,
            form_id=form_id,
            created_by_id=created_by_id,
            selected_fields=selected_fields or [],
            filters=filters or [],
            sort_by=sort_by,
            sort_order=sort_order or "asc",
            group_by=group_by,
            visualization=visualization,
            status="active",
        )

        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)

        return report

    # ========================================================
    # Get all reports
    # ========================================================

    def get_all(
        self,
        *,
        created_by_id: int | None = None,
        is_admin: bool = False,
    ) -> list[Report]:

        query = (
            select(Report)
            .options(
                joinedload(Report.form),
                joinedload(Report.created_by),
            )
            .order_by(Report.created_at.desc())
        )

        if not is_admin and created_by_id is not None:
            query = query.where(
                Report.created_by_id == created_by_id
            )

        result = self.db.execute(query)

        return list(
            result.unique().scalars().all()
        )

    # ========================================================
    # Get by ID
    # ========================================================

    def get_by_id(
        self,
        report_id: int,
    ) -> Report | None:

        query = (
            select(Report)
            .options(
                joinedload(Report.form),
                joinedload(Report.created_by),
            )
            .where(
                Report.id == report_id
            )
        )

        result = self.db.execute(query)

        return result.unique().scalar_one_or_none()

    # ========================================================
    # Get by ID with permission
    # ========================================================

    def get_user_report(
        self,
        *,
        report_id: int,
        user_id: int,
        is_admin: bool = False,
    ) -> Report | None:

        query = (
            select(Report)
            .options(
                joinedload(Report.form),
                joinedload(Report.created_by),
            )
            .where(
                Report.id == report_id
            )
        )

        if not is_admin:
            query = query.where(
                Report.created_by_id == user_id
            )

        result = self.db.execute(query)

        return result.unique().scalar_one_or_none()

    # ========================================================
    # Update
    # ========================================================

    def update(
        self,
        report: Report,
        values: dict[str, Any],
    ) -> Report:

        for field, value in values.items():
            setattr(report, field, value)

        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)

        return report

    # ========================================================
    # Delete
    # ========================================================

    def delete(
        self,
        report: Report,
    ) -> None:

        self.db.delete(report)
        self.db.commit()