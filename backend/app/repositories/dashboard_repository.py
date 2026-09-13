from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.form_response import FormResponse
from app.models.user import User


class DashboardRepository:
    """Database operations for dashboard statistics."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # Forms
    # ========================================================

    def count_forms(
        self,
        is_active: bool | None = None,
    ) -> int:

        query = self.db.query(
            func.count(Form.id)
        )

        if is_active is not None:
            query = query.filter(
                Form.is_active == is_active
            )

        return query.scalar() or 0

    # ========================================================
    # Users
    # ========================================================

    def count_users(
        self,
        is_active: bool | None = None,
    ) -> int:

        query = self.db.query(
            func.count(User.id)
        )

        if is_active is not None:
            query = query.filter(
                User.is_active == is_active
            )

        return query.scalar() or 0

    # ========================================================
    # Total Responses
    # ========================================================

    def count_responses(
        self,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:

        query = self.db.query(
            func.count(FormResponse.id)
        )

        if start_date is not None:
            query = query.filter(
                FormResponse.submitted_at >= start_date
            )

        if end_date is not None:
            query = query.filter(
                FormResponse.submitted_at <= end_date
            )

        return query.scalar() or 0

    # ========================================================
    # Submission Trends
    # ========================================================

    def get_submission_trends(
        self,
        start_date: datetime,
        end_date: datetime,
    ) -> list[tuple]:

        return (
            self.db.query(
                func.date(
                    FormResponse.submitted_at
                ).label("date"),
                func.count(
                    FormResponse.id
                ).label("submissions"),
            )
            .filter(
                FormResponse.submitted_at >= start_date,
                FormResponse.submitted_at <= end_date,
            )
            .group_by(
                func.date(
                    FormResponse.submitted_at
                )
            )
            .order_by(
                func.date(
                    FormResponse.submitted_at
                ).asc()
            )
            .all()
        )

    # ========================================================
    # Most Used Forms
    # ========================================================

    def get_most_used_forms(
        self,
        limit: int = 10,
    ) -> list[tuple]:

        return (
            self.db.query(
                Form.id.label("form_id"),
                Form.title.label("title"),
                func.count(
                    FormResponse.id
                ).label("response_count"),
                Form.is_active.label("is_active"),
            )
            .outerjoin(
                FormResponse,
                FormResponse.form_id == Form.id,
            )
            .group_by(
                Form.id,
                Form.title,
                Form.is_active,
            )
            .order_by(
                func.count(
                    FormResponse.id
                ).desc()
            )
            .limit(limit)
            .all()
        )

    # ========================================================
    # Most Active Form
    # ========================================================

    def get_most_active_form(self) -> tuple | None:

        return (
            self.db.query(
                Form.id.label("form_id"),
                Form.title.label("title"),
                func.count(
                    FormResponse.id
                ).label("response_count"),
            )
            .join(
                FormResponse,
                FormResponse.form_id == Form.id,
            )
            .group_by(
                Form.id,
                Form.title,
            )
            .order_by(
                func.count(
                    FormResponse.id
                ).desc()
            )
            .first()
        )

    # ========================================================
    # Response Count By Form
    # ========================================================

    def get_response_counts_by_form(
        self,
    ) -> list[tuple]:

        return (
            self.db.query(
                Form.id.label("form_id"),
                Form.title.label("title"),
                func.count(
                    FormResponse.id
                ).label("response_count"),
            )
            .outerjoin(
                FormResponse,
                FormResponse.form_id == Form.id,
            )
            .group_by(
                Form.id,
                Form.title,
            )
            .order_by(
                func.count(
                    FormResponse.id
                ).desc()
            )
            .all()
        )

    # ========================================================
    # Responses Between Dates
    # ========================================================

    def count_responses_between(
        self,
        start_date: datetime,
        end_date: datetime,
    ) -> int:

        return (
            self.db.query(
                func.count(FormResponse.id)
            )
            .filter(
                FormResponse.submitted_at >= start_date,
                FormResponse.submitted_at <= end_date,
            )
            .scalar()
            or 0
        )

    # ========================================================
    # Average Responses Per Form
    # ========================================================

    def get_average_responses_per_form(self) -> float:

        total_responses = (
            self.db.query(
                func.count(FormResponse.id)
            )
            .scalar()
            or 0
        )

        total_forms = (
            self.db.query(
                func.count(Form.id)
            )
            .scalar()
            or 0
        )

        if total_forms == 0:
            return 0.0

        return round(
            total_responses / total_forms,
            2,
        )

    # ========================================================
    # Response Statistics
    # ========================================================

    def get_response_statistics(
        self,
        today_start: datetime,
        today_end: datetime,
        week_start: datetime,
        week_end: datetime,
        month_start: datetime,
        month_end: datetime,
    ) -> dict:

        total_responses = self.count_responses()

        today_responses = self.count_responses_between(
            today_start,
            today_end,
        )

        this_week_responses = self.count_responses_between(
            week_start,
            week_end,
        )

        this_month_responses = self.count_responses_between(
            month_start,
            month_end,
        )

        average_responses_per_form = (
            self.get_average_responses_per_form()
        )

        most_active_form = self.get_most_active_form()

        return {
            "total_responses": total_responses,
            "today_responses": today_responses,
            "this_week_responses": this_week_responses,
            "this_month_responses": this_month_responses,
            "average_responses_per_form": (
                average_responses_per_form
            ),
            "most_active_form": most_active_form,
        }