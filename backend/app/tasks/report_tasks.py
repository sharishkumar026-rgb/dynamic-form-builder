from datetime import datetime

from celery import shared_task

from app.core.database import SessionLocal
from app.repositories.form_repository import FormRepository
from app.repositories.form_field_repository import FormFieldRepository
from app.repositories.response_repository import ResponseRepository


# ============================================================
# DATE PARSER
# ============================================================

def _parse_date(
    value: str | None,
) -> datetime | None:
    if not value:
        return None

    return datetime.fromisoformat(value)


# ============================================================
# BUILD FORM REPORT DATA
# ============================================================

def _build_report_data(
    db,
    form_id: int,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
):
    form_repository = FormRepository(db)
    field_repository = FormFieldRepository(db)
    response_repository = ResponseRepository(db)

    # --------------------------------------------------------
    # Get form
    # --------------------------------------------------------

    form = form_repository.get_by_id(
        form_id
    )

    if not form:
        raise ValueError(
            "Form not found"
        )

    # --------------------------------------------------------
    # Get fields
    # --------------------------------------------------------

    fields = field_repository.get_by_form(
        form_id
    )

    # --------------------------------------------------------
    # Get responses
    # --------------------------------------------------------

    responses = response_repository.get_by_form(
        form_id=form_id,
        skip=0,
        limit=100000,
        start_date=start_date,
        end_date=end_date,
    )

    # --------------------------------------------------------
    # Build response data
    # --------------------------------------------------------

    response_data = []

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

        detail_map = {
            detail.field_id: detail
            for detail in response.details
        }

        answers = []

        for field in fields:

            detail = detail_map.get(
                field.id
            )

            if detail:

                answers.append(
                    {
                        "field_id": field.id,
                        "field_name": field.name,
                        "field_label": field.label,
                        "field_type": field.field_type,
                        "value": detail.value,
                        "value_json": detail.value_json,
                    }
                )

            else:

                answers.append(
                    {
                        "field_id": field.id,
                        "field_name": field.name,
                        "field_label": field.label,
                        "field_type": field.field_type,
                        "value": None,
                        "value_json": None,
                    }
                )

        response_data.append(
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
        "form_id": form.id,
        "title": form.title,
        "description": form.description,
        "is_active": form.is_active,
        "total_fields": len(fields),
        "total_responses": len(responses),
        "start_date": start_date,
        "end_date": end_date,
        "responses": response_data,
        "generated_at": datetime.utcnow(),
    }


# ============================================================
# GENERATE FORM REPORT
# ============================================================

@shared_task(
    bind=True,
    name="app.tasks.report_tasks.generate_form_report",
)
def generate_form_report(
    self,
    form_id: int,
    start_date: str | None = None,
    end_date: str | None = None,
):
    db = SessionLocal()

    try:

        parsed_start_date = _parse_date(
            start_date
        )

        parsed_end_date = _parse_date(
            end_date
        )

        report_data = _build_report_data(
            db=db,
            form_id=form_id,
            start_date=parsed_start_date,
            end_date=parsed_end_date,
        )

        return {
            "success": True,
            "task_id": self.request.id,
            "message": (
                "Form report generated successfully"
            ),
            "data": report_data,
        }

    finally:

        db.close()


# ============================================================
# GENERATE FORM STATISTICS
# ============================================================

@shared_task(
    bind=True,
    name="app.tasks.report_tasks.generate_form_statistics",
)
def generate_form_statistics(
    self,
    form_id: int,
    start_date: str | None = None,
    end_date: str | None = None,
):
    db = SessionLocal()

    try:

        parsed_start_date = _parse_date(
            start_date
        )

        parsed_end_date = _parse_date(
            end_date
        )

        form_repository = FormRepository(db)

        field_repository = FormFieldRepository(db)

        response_repository = ResponseRepository(db)

        # ----------------------------------------------------
        # Get form
        # ----------------------------------------------------

        form = form_repository.get_by_id(
            form_id
        )

        if not form:
            raise ValueError(
                "Form not found"
            )

        # ----------------------------------------------------
        # Get fields
        # ----------------------------------------------------

        fields = field_repository.get_by_form(
            form_id
        )

        # ----------------------------------------------------
        # Get responses
        # ----------------------------------------------------

        responses = response_repository.get_by_form(
            form_id=form_id,
            skip=0,
            limit=100000,
            start_date=parsed_start_date,
            end_date=parsed_end_date,
        )

        total_responses = len(
            responses
        )

        # ----------------------------------------------------
        # Field statistics
        # ----------------------------------------------------

        field_statistics = []

        total_answers = 0

        for field in fields:

            response_count = 0

            for response in responses:

                for detail in response.details:

                    if detail.field_id != field.id:
                        continue

                    has_value = False

                    if detail.value_json is not None:

                        if isinstance(
                            detail.value_json,
                            list,
                        ):
                            has_value = (
                                len(
                                    detail.value_json
                                )
                                > 0
                            )

                        elif isinstance(
                            detail.value_json,
                            dict,
                        ):
                            has_value = (
                                len(
                                    detail.value_json
                                )
                                > 0
                            )

                        else:
                            has_value = True

                    elif detail.value is not None:

                        if isinstance(
                            detail.value,
                            str,
                        ):
                            has_value = bool(
                                detail.value.strip()
                            )
                        else:
                            has_value = True

                    if has_value:

                        response_count += 1
                        total_answers += 1

                    break

            field_statistics.append(
                {
                    "field_id": field.id,
                    "field_name": field.name,
                    "field_label": field.label,
                    "field_type": field.field_type,
                    "response_count": response_count,
                }
            )

        # ----------------------------------------------------
        # Average answers
        # ----------------------------------------------------

        if total_responses > 0:

            average_answers = round(
                total_answers
                / total_responses,
                2,
            )

        else:

            average_answers = 0.0

        # ----------------------------------------------------
        # Result
        # ----------------------------------------------------

        return {
            "success": True,
            "task_id": self.request.id,
            "message": (
                "Form statistics generated successfully"
            ),
            "data": {
                "form_id": form.id,
                "form_title": form.title,
                "total_fields": len(fields),
                "total_responses": total_responses,
                "average_answers_per_response": average_answers,
                "field_statistics": field_statistics,
                "start_date": parsed_start_date,
                "end_date": parsed_end_date,
                "generated_at": datetime.utcnow(),
            },
        }

    finally:

        db.close()