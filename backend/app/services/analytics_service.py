from collections import Counter
from datetime import date, datetime, timedelta, timezone
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.form_field import FormField
from app.models.form_response import FormResponse
from app.models.user import User
from app.repositories.form_field_repository import FormFieldRepository
from app.repositories.form_repository import FormRepository
from app.repositories.response_repository import ResponseRepository


class AnalyticsService:
    """
    Service layer for form analytics.

    Responsibilities:
    - Dashboard analytics
    - Form-level analytics
    - Response analytics
    - Field-level analytics
    - Submission analytics
    - Answer distribution
    - Permission checking
    """

    def __init__(self, db: Session):
        self.db = db

        self.form_repository = FormRepository(db)
        self.form_field_repository = FormFieldRepository(db)
        self.response_repository = ResponseRepository(db)

    # ============================================================
    # DASHBOARD SUMMARY
    # ============================================================

    def get_dashboard_summary(
        self,
        current_user,
    ):
        """
        Get overall dashboard summary.

        Admin:
            Can view all forms, responses and users.

        User:
            Can view forms where they have submitted responses
            and their own submitted responses.
        """

        is_admin = current_user.role.name.lower() == "admin"

        # --------------------------------------------------------
        # Forms
        # --------------------------------------------------------

        if is_admin:
            forms_query = self.db.query(Form)
        else:
            # Normal user sees forms to which they submitted
            # at least one response.
            forms_query = (
                self.db.query(Form)
                .join(
                    FormResponse,
                    FormResponse.form_id == Form.id,
                )
                .filter(
                    FormResponse.submitted_by_id == current_user.id
                )
                .distinct()
            )

        total_forms = forms_query.count()

        active_forms = (
            forms_query
            .filter(Form.is_active.is_(True))
            .count()
        )

        inactive_forms = (
            forms_query
            .filter(Form.is_active.is_(False))
            .count()
        )

        # --------------------------------------------------------
        # Responses
        # --------------------------------------------------------

        responses_query = self.db.query(FormResponse)

        if not is_admin:
            responses_query = responses_query.filter(
                FormResponse.submitted_by_id == current_user.id
            )

        total_responses = responses_query.count()

        # --------------------------------------------------------
        # Users
        # --------------------------------------------------------

        if is_admin:
            total_users = (
                self.db.query(User).count()
            )

            active_users = (
                self.db.query(User)
                .filter(User.is_active.is_(True))
                .count()
            )

        else:
            total_users = 1

            active_users = (
                1
                if getattr(
                    current_user,
                    "is_active",
                    False,
                )
                else 0
            )

        return {
            "success": True,
            "message": (
                f"Dashboard summary retrieved successfully "
                f"by {current_user.role.name}"
            ),
            "data": {
                "total_forms": total_forms,
                "active_forms": active_forms,
                "inactive_forms": inactive_forms,
                "total_responses": total_responses,
                "total_users": total_users,
                "active_users": active_users,
                "generated_at": datetime.now(timezone.utc),
            },
        }

    # ============================================================
    # DASHBOARD SUBMISSION TRENDS
    # ============================================================

    def get_dashboard_submission_trends(
        self,
        current_user,
        start_date: date | None = None,
        end_date: date | None = None,
    ):
        """
        Get daily submission trends for dashboard.

        Admin:
            Sees all submissions.

        User:
            Sees only submissions made by themselves.
        """

        if end_date is None:
            end_date = datetime.now(timezone.utc).date()

        if start_date is None:
            start_date = end_date - timedelta(days=30)

        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "start_date cannot be greater "
                    "than end_date"
                ),
            )

        is_admin = current_user.role.name.lower() == "admin"

        query = (
            self.db.query(
                func.date(
                    FormResponse.submitted_at
                ).label("date"),
                func.count(
                    FormResponse.id
                ).label("submissions"),
            )
            .filter(
                func.date(
                    FormResponse.submitted_at
                ) >= start_date,
                func.date(
                    FormResponse.submitted_at
                ) <= end_date,
            )
        )

        # --------------------------------------------------------
        # User-specific submissions
        # --------------------------------------------------------

        if not is_admin:
            query = query.filter(
                FormResponse.submitted_by_id == current_user.id
            )

        trends = (
            query
            .group_by(
                func.date(
                    FormResponse.submitted_at
                )
            )
            .order_by(
                func.date(
                    FormResponse.submitted_at
                )
            )
            .all()
        )

        data = []

        for item in trends:
            data.append(
                {
                    "date": item.date,
                    "submissions": int(
                        item.submissions or 0
                    ),
                }
            )

        total = sum(
            item["submissions"]
            for item in data
        )

        return {
            "success": True,
            "message": (
                f"Dashboard submission trends "
                f"retrieved successfully by "
                f"{current_user.role.name}"
            ),
            "total": total,
            "data": data,
        }

    # ============================================================
    # MOST USED FORMS
    # ============================================================

    def get_most_used_forms(
        self,
        current_user,
        limit: int = 10,
    ):
        """
        Get forms with the highest number of responses.

        Admin:
            Counts all responses.

        User:
            Counts only responses submitted by that user.
        """

        is_admin = current_user.role.name.lower() == "admin"

        query = (
            self.db.query(
                Form.id.label("form_id"),
                Form.title.label("title"),
                Form.is_active.label("is_active"),
                func.count(
                    FormResponse.id
                ).label("response_count"),
            )
            .join(
                FormResponse,
                FormResponse.form_id == Form.id,
            )
        )

        # --------------------------------------------------------
        # User-specific responses
        # --------------------------------------------------------

        if not is_admin:
            query = query.filter(
                FormResponse.submitted_by_id == current_user.id
            )

        results = (
            query
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

        data = []

        for item in results:
            data.append(
                {
                    "form_id": item.form_id,
                    "title": item.title,
                    "response_count": int(
                        item.response_count or 0
                    ),
                    "is_active": item.is_active,
                }
            )

        return {
            "success": True,
            "message": (
                f"Most used forms retrieved successfully "
                f"by {current_user.role.name}"
            ),
            "total": len(data),
            "data": data,
        }

    # ============================================================
    # RESPONSE STATISTICS
    # ============================================================

    def get_response_statistics(
        self,
        current_user,
    ):
        """
        Get response statistics for dashboard.

        Admin:
            All responses.

        User:
            Only responses submitted by themselves.
        """

        is_admin = current_user.role.name.lower() == "admin"

        # --------------------------------------------------------
        # Base response query
        # --------------------------------------------------------

        base_query = self.db.query(FormResponse)

        if not is_admin:
            base_query = base_query.filter(
                FormResponse.submitted_by_id == current_user.id
            )

        total_responses = base_query.count()

        # --------------------------------------------------------
        # Date boundaries
        # --------------------------------------------------------

        now = datetime.now(timezone.utc)

        today_start = now.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        week_start = (
            today_start
            - timedelta(days=today_start.weekday())
        )

        month_start = today_start.replace(day=1)

        # --------------------------------------------------------
        # Today
        # --------------------------------------------------------

        today_responses = (
            base_query
            .filter(
                FormResponse.submitted_at >= today_start
            )
            .count()
        )

        # --------------------------------------------------------
        # This week
        # --------------------------------------------------------

        this_week_responses = (
            base_query
            .filter(
                FormResponse.submitted_at >= week_start
            )
            .count()
        )

        # --------------------------------------------------------
        # This month
        # --------------------------------------------------------

        this_month_responses = (
            base_query
            .filter(
                FormResponse.submitted_at >= month_start
            )
            .count()
        )

        # --------------------------------------------------------
        # Total forms
        # --------------------------------------------------------

        if is_admin:
            total_forms = (
                self.db.query(Form).count()
            )
        else:
            total_forms = (
                self.db.query(Form.id)
                .join(
                    FormResponse,
                    FormResponse.form_id == Form.id,
                )
                .filter(
                    FormResponse.submitted_by_id
                    == current_user.id
                )
                .distinct()
                .count()
            )

        average_responses_per_form = (
            total_responses / total_forms
            if total_forms > 0
            else 0.0
        )

        # --------------------------------------------------------
        # Most active form
        # --------------------------------------------------------

        most_active_query = (
            self.db.query(
                Form.id.label("form_id"),
                Form.title.label("form_title"),
                func.count(
                    FormResponse.id
                ).label("response_count"),
            )
            .join(
                FormResponse,
                FormResponse.form_id == Form.id,
            )
        )

        if not is_admin:
            most_active_query = (
                most_active_query
                .filter(
                    FormResponse.submitted_by_id
                    == current_user.id
                )
            )

        most_active_form = (
            most_active_query
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

        most_active_form_id = None
        most_active_form_title = None

        if most_active_form:
            most_active_form_id = (
                most_active_form.form_id
            )

            most_active_form_title = (
                most_active_form.form_title
            )

        return {
            "success": True,
            "message": (
                f"Response statistics retrieved "
                f"successfully by "
                f"{current_user.role.name}"
            ),
            "data": {
                "total_responses": total_responses,
                "today_responses": today_responses,
                "this_week_responses": this_week_responses,
                "this_month_responses": this_month_responses,
                "average_responses_per_form": round(
                    average_responses_per_form,
                    2,
                ),
                "most_active_form_id": (
                    most_active_form_id
                ),
                "most_active_form_title": (
                    most_active_form_title
                ),
                "generated_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # FORM ANALYTICS
    # ============================================================

    def get_form_analytics(
        self,
        form_id: int,
        current_user,
    ):
        """
        Get summary analytics for a form.
        """

        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        fields = (
            self.form_field_repository
            .get_active_fields(form_id)
        )

        total_responses = (
            self.response_repository
            .count_by_form(form_id)
        )

        response_counts = []

        for field in fields:
            response_count = (
                self._count_field_responses(
                    form_id=form_id,
                    field_id=field.id,
                )
            )

            response_counts.append(
                response_count
            )

        average_field_responses = (
            sum(response_counts)
            / len(response_counts)
            if response_counts
            else 0
        )

        completion_rate = (
            self._calculate_completion_rate(
                form_id=form_id,
                fields=fields,
            )
        )

        return {
            "success": True,
            "message": (
                f"Form analytics retrieved successfully by "
                f"{current_user.role.name}"
            ),
            "data": {
                "form_id": form.id,
                "title": form.title,
                "is_active": form.is_active,
                "total_fields": len(fields),
                "total_responses": total_responses,
                "average_field_responses": round(
                    average_field_responses,
                    2,
                ),
                "completion_rate": round(
                    completion_rate,
                    2,
                ),
                "generated_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # FORM RESPONSE ANALYTICS
    # ============================================================

    def get_form_response_analytics(
        self,
        form_id: int,
        current_user,
        skip: int = 0,
        limit: int = 100,
    ):
        """
        Get response-level analytics for a form.
        """

        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        responses = (
            self.response_repository
            .get_by_form(
                form_id=form_id,
                skip=skip,
                limit=limit,
            )
        )

        total = (
            self.response_repository
            .count_by_form(form_id)
        )

        data = []

        for response in responses:

            submitted_by = None

            if response.submitted_by:
                submitted_by = {
                    "id": response.submitted_by.id,
                    "name": response.submitted_by.name,
                    "email": response.submitted_by.email,
                    "role": (
                        {
                            "id": response.submitted_by.role.id,
                            "name": response.submitted_by.role.name,
                        }
                        if response.submitted_by.role
                        else None
                    ),
                }

            answered_fields = len(
                response.details or []
            )

            data.append(
                {
                    "response_id": response.id,
                    "form_id": response.form_id,
                    "submitted_by": submitted_by,
                    "submitted_at": response.submitted_at,
                    "updated_at": response.updated_at,
                    "answered_fields": answered_fields,
                    "details_count": answered_fields,
                }
            )

        return {
            "success": True,
            "message": (
                f"Form response analytics retrieved "
                f"successfully by {current_user.role.name}"
            ),
            "total": total,
            "data": data,
        }

    # ============================================================
    # FIELD ANALYTICS
    # ============================================================

    def get_form_field_analytics(
        self,
        form_id: int,
        current_user,
    ):
        """
        Get analytics for every field in a form.

        For dropdown/radio/checkbox fields,
        answer distribution is returned.
        """

        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        fields = (
            self.form_field_repository
            .get_active_fields(form_id)
        )

        total_responses = (
            self.response_repository
            .count_by_form(form_id)
        )

        data = []

        for field in fields:

            response_count = (
                self._count_field_responses(
                    form_id=form_id,
                    field_id=field.id,
                )
            )

            unanswered_count = max(
                total_responses - response_count,
                0,
            )

            answer_distribution = None

            if field.field_type in {
                "dropdown",
                "radio",
                "checkbox",
            }:
                answer_distribution = (
                    self._get_answer_distribution(
                        form_id=form_id,
                        field=field,
                    )
                )

            response_percentage = (
                (
                    response_count
                    / total_responses
                )
                * 100
                if total_responses
                else 0
            )

            data.append(
                {
                    "field_id": field.id,
                    "label": field.label,
                    "name": field.name,
                    "field_type": field.field_type,
                    "is_required": field.is_required,
                    "total_responses": total_responses,
                    "response_count": response_count,
                    "unanswered_count": unanswered_count,
                    "response_percentage": round(
                        response_percentage,
                        2,
                    ),
                    "answer_distribution": (
                        answer_distribution
                    ),
                }
            )

        return {
            "success": True,
            "message": (
                f"Form field analytics retrieved "
                f"successfully by {current_user.role.name}"
            ),
            "total": len(data),
            "data": {
                "form_id": form_id,
                "fields": data,
                "generated_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # SUBMISSION ANALYTICS
    # ============================================================

    def get_submission_analytics(
        self,
        current_user,
        form_id: int | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
    ):
        """
        Get submission trends.

        Optional:
        - form_id
        - start_date
        - end_date

        Dates are inclusive.
        """

        # --------------------------------------------------------
        # Check form permission
        # --------------------------------------------------------

        if form_id is not None:

            form = self._get_form(form_id)

            self._check_permission(
                form=form,
                current_user=current_user,
            )

        # --------------------------------------------------------
        # Default end date
        # --------------------------------------------------------

        today = datetime.now(
            timezone.utc
        ).date()

        if end_date is None:
            end_date = today

        # --------------------------------------------------------
        # Default start date
        # --------------------------------------------------------

        if start_date is None:
            start_date = (
                end_date
                - timedelta(days=30)
            )

        # --------------------------------------------------------
        # Validate date range
        # --------------------------------------------------------

        if start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "start_date cannot be greater "
                    "than end_date"
                ),
            )

        # --------------------------------------------------------
        # Convert date to datetime
        # --------------------------------------------------------

        start_datetime = datetime.combine(
            start_date,
            datetime.min.time(),
        )

        end_datetime = datetime.combine(
            end_date,
            datetime.max.time(),
        )

        # --------------------------------------------------------
        # Get trends
        # --------------------------------------------------------

        trends = self._get_submission_trends(
            form_id=form_id,
            start_date=start_datetime,
            end_date=end_datetime,
        )

        # --------------------------------------------------------
        # Calculate total
        # --------------------------------------------------------

        total_submissions = sum(
            item["submissions"]
            for item in trends
        )

        # --------------------------------------------------------
        # Response
        # --------------------------------------------------------

        return {
            "success": True,
            "message": (
                "Submission analytics retrieved "
                "successfully by "
                f"{current_user.role.name}"
            ),
            "total": total_submissions,
            "data": {
                "form_id": form_id,
                "start_date": start_date,
                "end_date": end_date,
                "total_submissions": total_submissions,
                "trends": trends,
                "generated_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # GET SUBMISSION TRENDS
    # ============================================================

    def _get_submission_trends(
        self,
        form_id: int | None,
        start_date: datetime,
        end_date: datetime,
    ):
        """
        Get daily submission counts.
        """

        if form_id is not None:

            trends = (
                self.response_repository
                .get_submission_trends(
                    form_id=form_id,
                    start_date=start_date,
                    end_date=end_date,
                )
            )

        else:

            trends = (
                self.response_repository
                .get_submission_trends(
                    start_date=start_date,
                    end_date=end_date,
                )
            )

        result = []

        for item in trends:

            if isinstance(item, tuple):

                date_value = item[0]
                submissions = item[1]

            else:

                date_value = getattr(
                    item,
                    "date",
                    None,
                )

                submissions = getattr(
                    item,
                    "submissions",
                    0,
                )

            result.append(
                {
                    "date": date_value,
                    "submissions": int(
                        submissions or 0
                    ),
                }
            )

        return result

    # ============================================================
    # ANSWER DISTRIBUTION
    # ============================================================

    def _get_answer_distribution(
        self,
        form_id: int,
        field: FormField,
    ):
        """
        Calculate answer distribution for:
        - dropdown
        - radio
        - checkbox
        """

        responses = (
            self.response_repository
            .get_by_form(
                form_id=form_id,
                skip=0,
                limit=100000,
            )
        )

        counter = Counter()

        for response in responses:

            for detail in response.details or []:

                if detail.field_id != field.id:
                    continue

                values = self._extract_values(
                    detail
                )

                for value in values:
                    counter[str(value)] += 1

        options = getattr(
            field,
            "options",
            None,
        ) or []

        result = {}

        for option in options:

            if not option.is_active:
                continue

            result[str(option.value)] = (
                counter.get(
                    str(option.value),
                    0,
                )
            )

        for value, count in counter.items():

            if value not in result:
                result[value] = count

        return result

    # ============================================================
    # FIELD RESPONSE COUNT
    # ============================================================

    def _count_field_responses(
        self,
        form_id: int,
        field_id: int,
    ) -> int:
        """
        Count non-empty answers for a field.
        """

        responses = (
            self.response_repository
            .get_by_form(
                form_id=form_id,
                skip=0,
                limit=100000,
            )
        )

        count = 0

        for response in responses:

            for detail in response.details or []:

                if detail.field_id != field_id:
                    continue

                if self._has_value(detail):
                    count += 1

        return count

    # ============================================================
    # COMPLETION RATE
    # ============================================================

    def _calculate_completion_rate(
        self,
        form_id: int,
        fields: list[FormField],
    ) -> float:
        """
        Calculate percentage of responses where
        all required fields were answered.
        """

        total_responses = (
            self.response_repository
            .count_by_form(form_id)
        )

        if total_responses == 0:
            return 0.0

        required_fields = [
            field
            for field in fields
            if field.is_required
        ]

        if not required_fields:
            return 100.0

        responses = (
            self.response_repository
            .get_by_form(
                form_id=form_id,
                skip=0,
                limit=100000,
            )
        )

        completed = 0

        required_field_ids = {
            field.id
            for field in required_fields
        }

        for response in responses:

            answered_ids = {
                detail.field_id
                for detail in response.details or []
                if self._has_value(detail)
            }

            if required_field_ids.issubset(
                answered_ids
            ):
                completed += 1

        return (
            completed / total_responses
        ) * 100

    # ============================================================
    # FORM
    # ============================================================

    def _get_form(
        self,
        form_id: int,
    ) -> Form:
        """
        Get form or raise 404.
        """

        form = self.form_repository.get_by_id(
            form_id
        )

        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        return form

    # ============================================================
    # PERMISSION
    # ============================================================

    def _check_permission(
        self,
        form: Form,
        current_user,
    ):
        """
        Admin:
            Can view analytics for every form.

        User:
            Can view analytics for their own forms.
        """

        if current_user.role.name.lower() == "admin":
            return

        if form.created_by_id != current_user.id:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You do not have permission to view "
                    "analytics for this form"
                ),
            )

    # ============================================================
    # VALUE HELPERS
    # ============================================================

    @staticmethod
    def _has_value(
        detail: Any,
    ) -> bool:
        """
        Check whether a response detail contains a value.
        """

        if detail is None:
            return False

        value = getattr(
            detail,
            "value",
            None,
        )

        if value is not None:

            if str(value).strip():
                return True

        value_json = getattr(
            detail,
            "value_json",
            None,
        )

        if value_json is not None:

            if isinstance(
                value_json,
                list,
            ):
                return len(value_json) > 0

            if isinstance(
                value_json,
                dict,
            ):
                return len(value_json) > 0

            return True

        return False

    @staticmethod
    def _extract_values(
        detail: Any,
    ) -> list[Any]:
        """
        Extract one or multiple answer values.
        """

        value_json = getattr(
            detail,
            "value_json",
            None,
        )

        if isinstance(
            value_json,
            list,
        ):
            return value_json

        if value_json is not None:
            return [value_json]

        value = getattr(
            detail,
            "value",
            None,
        )

        if value is None:
            return []

        return [value]