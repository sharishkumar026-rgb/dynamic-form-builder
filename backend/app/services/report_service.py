from datetime import date, datetime, time, timezone
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.report import Report

from app.repositories.form_field_repository import FormFieldRepository
from app.repositories.form_repository import FormRepository
from app.repositories.report_repository import ReportRepository
from app.repositories.response_repository import ResponseRepository

from app.schemas.report import (
    ReportCreate,
    ReportExportRequest,
    ReportUpdate,
)

from app.tasks.report_tasks import (
    generate_form_report,
    generate_form_statistics,
)

from app.tasks.export_tasks import (
    generate_excel_report,
    generate_pdf_report,
)


class ReportService:
    """
    Service layer for:
    - Saved report CRUD
    - Form report generation
    - Report statistics
    - Asynchronous Excel/PDF exports
    """

    def __init__(self, db: Session):
        self.db = db

        self.form_repository = FormRepository(db)
        self.form_field_repository = FormFieldRepository(db)
        self.response_repository = ResponseRepository(db)
        self.report_repository = ReportRepository(db)

    # ============================================================
    # SAVED REPORT - CREATE
    # ============================================================

    def create_report(
        self,
        report_data: ReportCreate,
        current_user,
    ) -> Report:
        """
        Create and save a custom report configuration.
        """

        form = self._get_form(report_data.form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        # Validate selected fields if provided
        if report_data.selected_fields:
            self._validate_selected_fields(
                form_id=report_data.form_id,
                selected_fields=report_data.selected_fields,
            )

        filters = [
            item.model_dump()
            for item in report_data.filters
        ]

        report = self.report_repository.create(
            name=report_data.name,
            description=report_data.description,
            form_id=report_data.form_id,
            created_by_id=current_user.id,
            selected_fields=report_data.selected_fields,
            filters=filters,
            sort_by=report_data.sort_by,
            sort_order=report_data.sort_order,
            group_by=report_data.group_by,
            visualization=report_data.visualization,
        )

        return report

    # ============================================================
    # SAVED REPORT - GET ALL
    # ============================================================

    def get_reports(
        self,
        current_user,
    ) -> list[Report]:
        """
        Get saved reports.

        Admin:
            Can see all reports.

        User:
            Can see only reports created by themselves.
        """

        is_admin = self._is_admin(current_user)

        return self.report_repository.get_all(
            created_by_id=current_user.id,
            is_admin=is_admin,
        )

    # ============================================================
    # SAVED REPORT - GET ONE
    # ============================================================

    def get_report(
        self,
        report_id: int,
        current_user,
    ) -> Report:
        """
        Get one saved report with permission checking.
        """

        is_admin = self._is_admin(current_user)

        report = self.report_repository.get_user_report(
            report_id=report_id,
            user_id=current_user.id,
            is_admin=is_admin,
        )

        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found",
            )

        return report

    # ============================================================
    # SAVED REPORT - UPDATE
    # ============================================================

    def update_report(
        self,
        report_id: int,
        report_data: ReportUpdate,
        current_user,
    ) -> Report:
        """
        Update a saved report.
        """

        report = self.get_report(
            report_id=report_id,
            current_user=current_user,
        )

        update_data = report_data.model_dump(
            exclude_unset=True
        )

        # --------------------------------------------------------
        # Validate new form
        # --------------------------------------------------------

        if "form_id" in update_data:
            new_form_id = update_data["form_id"]

            form = self._get_form(new_form_id)

            self._check_permission(
                form=form,
                current_user=current_user,
            )

            report.form_id = new_form_id

        # --------------------------------------------------------
        # Validate selected fields
        # --------------------------------------------------------

        if "selected_fields" in update_data:
            selected_fields = update_data[
                "selected_fields"
            ]

            if selected_fields:
                self._validate_selected_fields(
                    form_id=report.form_id,
                    selected_fields=selected_fields,
                )

        # --------------------------------------------------------
        # Convert filters
        # --------------------------------------------------------

        if "filters" in update_data:
            filters = update_data["filters"]

            if filters is not None:
                update_data["filters"] = [
                    item.model_dump()
                    if hasattr(item, "model_dump")
                    else item
                    for item in filters
                ]

        # --------------------------------------------------------
        # Validate status
        # --------------------------------------------------------

        if "status" in update_data:
            allowed_statuses = {
                "active",
                "inactive",
            }

            if update_data["status"] not in allowed_statuses:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "Invalid report status. "
                        "Allowed values: active, inactive"
                    ),
                )

        # --------------------------------------------------------
        # Update
        # --------------------------------------------------------

        report = self.report_repository.update(
            report=report,
            values=update_data,
        )

        return report

    # ============================================================
    # SAVED REPORT - DELETE
    # ============================================================

    def delete_report(
        self,
        report_id: int,
        current_user,
    ) -> None:
        """
        Delete a saved report.
        """

        report = self.get_report(
            report_id=report_id,
            current_user=current_user,
        )

        self.report_repository.delete(report)

    # ============================================================
    # FORM REPORT
    # ============================================================

    def get_form_report(
        self,
        form_id: int,
        current_user,
        skip: int = 0,
        limit: int = 100,
        start_date: date | datetime | None = None,
        end_date: date | datetime | None = None,
    ):
        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        start_date, end_date = self._normalize_dates(
            start_date=start_date,
            end_date=end_date,
        )

        self._validate_dates(
            start_date=start_date,
            end_date=end_date,
        )

        responses = self.response_repository.get_by_form(
            form_id=form_id,
            skip=skip,
            limit=limit,
            start_date=start_date,
            end_date=end_date,
        )

        total_responses = self.response_repository.count_by_form(
            form_id=form_id,
            start_date=start_date,
            end_date=end_date,
        )

        fields = self.form_field_repository.get_by_form(
            form_id
        )

        response_items = []

        for response in responses:
            submitted_by = None

            if response.submitted_by:
                submitted_by = {
                    "id": response.submitted_by.id,
                    "name": response.submitted_by.name,
                    "email": response.submitted_by.email,
                    "role": (
                        response.submitted_by.role.name
                        if response.submitted_by.role
                        else None
                    ),
                }

            answers = []

            detail_map = {
                detail.field_id: detail
                for detail in response.details
            }

            for field in fields:
                detail = detail_map.get(field.id)

                if detail:
                    value = detail.value
                    value_json = detail.value_json
                else:
                    value = None
                    value_json = None

                answers.append(
                    {
                        "field_id": field.id,
                        "field_name": field.name,
                        "field_label": field.label,
                        "field_type": field.field_type,
                        "value": value,
                        "value_json": value_json,
                    }
                )

            response_items.append(
                {
                    "response_id": response.id,
                    "form_id": response.form_id,
                    "submitted_by": submitted_by,
                    "submitted_at": response.submitted_at,
                    "updated_at": response.updated_at,
                    "answers": answers,
                }
            )

        return {
            "success": True,
            "message": "Form report retrieved successfully",
            "total": total_responses,
            "data": {
                "form_id": form.id,
                "title": form.title,
                "description": form.description,
                "is_active": form.is_active,
                "total_fields": len(fields),
                "total_responses": total_responses,
                "start_date": start_date,
                "end_date": end_date,
                "responses": response_items,
                "generated_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # FORM STATISTICS
    # ============================================================

    def get_form_statistics(
        self,
        form_id: int,
        current_user,
        start_date: date | datetime | None = None,
        end_date: date | datetime | None = None,
    ):
        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        start_date, end_date = self._normalize_dates(
            start_date=start_date,
            end_date=end_date,
        )

        self._validate_dates(
            start_date=start_date,
            end_date=end_date,
        )

        responses = self.response_repository.get_by_form(
            form_id=form_id,
            skip=0,
            limit=100000,
            start_date=start_date,
            end_date=end_date,
        )

        total_responses = self.response_repository.count_by_form(
            form_id=form_id,
            start_date=start_date,
            end_date=end_date,
        )

        fields = self.form_field_repository.get_by_form(
            form_id
        )

        field_statistics = []

        for field in fields:
            response_count = self._count_field_responses(
                field_id=field.id,
                responses=responses,
            )

            field_statistics.append(
                {
                    "field_id": field.id,
                    "field_name": field.name,
                    "field_label": field.label,
                    "field_type": field.field_type,
                    "response_count": response_count,
                }
            )

        average_answers = self._calculate_average_answers(
            responses=responses,
            total_responses=total_responses,
        )

        return {
            "success": True,
            "message": (
                "Form report statistics "
                "retrieved successfully"
            ),
            "data": {
                "form_id": form.id,
                "form_title": form.title,
                "total_fields": len(fields),
                "total_responses": total_responses,
                "average_answers_per_response": average_answers,
                "field_statistics": field_statistics,
                "start_date": start_date,
                "end_date": end_date,
                "generated_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # QUEUE FORM REPORT
    # ============================================================

    def queue_form_report(
        self,
        form_id: int,
        current_user,
        start_date: date | datetime | None = None,
        end_date: date | datetime | None = None,
    ):
        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        start_date, end_date = self._normalize_dates(
            start_date=start_date,
            end_date=end_date,
        )

        self._validate_dates(
            start_date=start_date,
            end_date=end_date,
        )

        task = generate_form_report.delay(
            form_id=form_id,
            start_date=(
                start_date.isoformat()
                if start_date
                else None
            ),
            end_date=(
                end_date.isoformat()
                if end_date
                else None
            ),
        )

        return {
            "success": True,
            "message": (
                "Form report generation "
                "has been queued"
            ),
            "data": {
                "task_id": task.id,
                "status": "queued",
            },
        }

    # ============================================================
    # QUEUE FORM STATISTICS
    # ============================================================

    def queue_form_statistics(
        self,
        form_id: int,
        current_user,
        start_date: date | datetime | None = None,
        end_date: date | datetime | None = None,
    ):
        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        start_date, end_date = self._normalize_dates(
            start_date=start_date,
            end_date=end_date,
        )

        self._validate_dates(
            start_date=start_date,
            end_date=end_date,
        )

        task = generate_form_statistics.delay(
            form_id=form_id,
            start_date=(
                start_date.isoformat()
                if start_date
                else None
            ),
            end_date=(
                end_date.isoformat()
                if end_date
                else None
            ),
        )

        return {
            "success": True,
            "message": (
                "Form statistics generation "
                "has been queued"
            ),
            "data": {
                "task_id": task.id,
                "status": "queued",
            },
        }

    # ============================================================
    # EXPORT EXCEL
    # ============================================================

    def export_excel(
        self,
        form_id: int,
        request: ReportExportRequest,
        current_user,
    ):
        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        start_date, end_date = self._normalize_dates(
            start_date=request.start_date,
            end_date=request.end_date,
        )

        self._validate_dates(
            start_date=start_date,
            end_date=end_date,
        )

        task = generate_excel_report.delay(
            form_id=form_id,
            start_date=(
                start_date.isoformat()
                if start_date
                else None
            ),
            end_date=(
                end_date.isoformat()
                if end_date
                else None
            ),
            submitted_by_id=request.submitted_by_id,
            user_id=current_user.id,
        )

        return {
            "success": True,
            "message": (
                "Excel report generation "
                "has been queued"
            ),
            "data": {
                "task_id": task.id,
                "report_type": "excel",
                "status": "queued",
                "message": (
                    "Excel report generation "
                    "has been queued"
                ),
                "created_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # EXPORT PDF
    # ============================================================

    def export_pdf(
        self,
        form_id: int,
        request: ReportExportRequest,
        current_user,
    ):
        form = self._get_form(form_id)

        self._check_permission(
            form=form,
            current_user=current_user,
        )

        start_date, end_date = self._normalize_dates(
            start_date=request.start_date,
            end_date=request.end_date,
        )

        self._validate_dates(
            start_date=start_date,
            end_date=end_date,
        )

        task = generate_pdf_report.delay(
            form_id=form_id,
            start_date=(
                start_date.isoformat()
                if start_date
                else None
            ),
            end_date=(
                end_date.isoformat()
                if end_date
                else None
            ),
            submitted_by_id=request.submitted_by_id,
            user_id=current_user.id,
        )

        return {
            "success": True,
            "message": (
                "PDF report generation "
                "has been queued"
            ),
            "data": {
                "task_id": task.id,
                "report_type": "pdf",
                "status": "queued",
                "message": (
                    "PDF report generation "
                    "has been queued"
                ),
                "created_at": datetime.now(
                    timezone.utc
                ),
            },
        }

    # ============================================================
    # VALIDATE SELECTED FIELDS
    # ============================================================

    def _validate_selected_fields(
        self,
        form_id: int,
        selected_fields: list[str],
    ) -> None:
        """
        Make sure every selected field belongs to the form.
        """

        fields = self.form_field_repository.get_by_form(
            form_id
        )

        valid_names = {
            field.name
            for field in fields
        }

        invalid_fields = [
            field_name
            for field_name in selected_fields
            if field_name not in valid_names
        ]

        if invalid_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Invalid selected fields",
                    "invalid_fields": invalid_fields,
                },
            )

    # ============================================================
    # CHECK ADMIN
    # ============================================================

    @staticmethod
    def _is_admin(
        current_user,
    ) -> bool:
        if not current_user.role:
            return False

        return (
            current_user.role.name.lower()
            == "admin"
        )

    # ============================================================
    # COUNT FIELD RESPONSES
    # ============================================================

    def _count_field_responses(
        self,
        field_id: int,
        responses,
    ) -> int:
        count = 0

        for response in responses:
            for detail in response.details:
                if detail.field_id != field_id:
                    continue

                if self._has_value(
                    detail.value,
                    detail.value_json,
                ):
                    count += 1

                break

        return count

    # ============================================================
    # CALCULATE AVERAGE ANSWERS
    # ============================================================

    def _calculate_average_answers(
        self,
        responses,
        total_responses: int,
    ) -> float:
        if total_responses <= 0:
            return 0.0

        total_answers = 0

        for response in responses:
            for detail in response.details:
                if self._has_value(
                    detail.value,
                    detail.value_json,
                ):
                    total_answers += 1

        return round(
            total_answers / total_responses,
            2,
        )

    # ============================================================
    # GET FORM
    # ============================================================

    def _get_form(
        self,
        form_id: int,
    ) -> Form:
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
    # PERMISSION CHECK
    # ============================================================

    def _check_permission(
        self,
        form: Form,
        current_user,
    ):
        """
        Admins can access all forms.

        Regular users can access forms they created.
        """

        role_name = None

        if current_user.role:
            role_name = current_user.role.name

        if role_name and role_name.lower() == "admin":
            return

        if (
            hasattr(form, "created_by_id")
            and form.created_by_id
            == current_user.id
        ):
            return

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You do not have permission "
                "to access this form report"
            ),
        )

    # ============================================================
    # NORMALIZE DATES
    # ============================================================

    @staticmethod
    def _normalize_dates(
        start_date: date | datetime | None,
        end_date: date | datetime | None,
    ) -> tuple[
        datetime | None,
        datetime | None,
    ]:
        if start_date is not None:
            if isinstance(
                start_date,
                datetime,
            ):
                start_date = datetime.combine(
                    start_date.date(),
                    time.min,
                )

            elif isinstance(
                start_date,
                date,
            ):
                start_date = datetime.combine(
                    start_date,
                    time.min,
                )

        if end_date is not None:
            if isinstance(
                end_date,
                datetime,
            ):
                end_date = datetime.combine(
                    end_date.date(),
                    time.max,
                )

            elif isinstance(
                end_date,
                date,
            ):
                end_date = datetime.combine(
                    end_date,
                    time.max,
                )

        return start_date, end_date

    # ============================================================
    # VALIDATE DATES
    # ============================================================

    @staticmethod
    def _validate_dates(
        start_date: datetime | None,
        end_date: datetime | None,
    ):
        if (
            start_date is not None
            and end_date is not None
            and start_date > end_date
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "start_date cannot be "
                    "greater than end_date"
                ),
            )

    # ============================================================
    # CHECK VALUE
    # ============================================================

    @staticmethod
    def _has_value(
        value,
        value_json,
    ) -> bool:
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

        if value is None:
            return False

        if isinstance(
            value,
            str,
        ):
            return bool(
                value.strip()
            )

        return True