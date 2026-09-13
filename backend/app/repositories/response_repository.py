from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.form_response import FormResponse
from app.models.response_detail import ResponseDetail


class ResponseRepository:
    """Database operations for form responses."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # Create Response
    # ========================================================

    def create(
        self,
        response: FormResponse,
    ) -> FormResponse:

        self.db.add(response)
        self.db.commit()
        self.db.refresh(response)

        return response

    # ========================================================
    # Create Response Detail
    # ========================================================

    def create_detail(
        self,
        detail: ResponseDetail,
    ) -> ResponseDetail:

        self.db.add(detail)
        self.db.commit()
        self.db.refresh(detail)

        return detail

    # ========================================================
    # Get Response By ID
    # ========================================================

    def get_by_id(
        self,
        response_id: int,
    ) -> FormResponse | None:

        return (
            self.db.query(FormResponse)
            .options(
                joinedload(FormResponse.form),
                joinedload(FormResponse.submitted_by),
                joinedload(FormResponse.details)
                .joinedload(ResponseDetail.field),
            )
            .filter(
                FormResponse.id == response_id
            )
            .first()
        )

    # ========================================================
    # Get Response By ID And Form
    # ========================================================

    def get_by_id_and_form(
        self,
        response_id: int,
        form_id: int,
    ) -> FormResponse | None:

        return (
            self.db.query(FormResponse)
            .options(
                joinedload(FormResponse.form),
                joinedload(FormResponse.submitted_by),
                joinedload(FormResponse.details)
                .joinedload(ResponseDetail.field),
            )
            .filter(
                FormResponse.id == response_id,
                FormResponse.form_id == form_id,
            )
            .first()
        )

    # ========================================================
    # Get Responses By Form
    # ========================================================

    def get_by_form(
        self,
        form_id: int,
        skip: int = 0,
        limit: int = 100,
        submitted_by_id: int | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> list[FormResponse]:

        query = (
            self.db.query(FormResponse)
            .options(
                joinedload(FormResponse.submitted_by),
                joinedload(FormResponse.details)
                .joinedload(ResponseDetail.field),
            )
            .filter(
                FormResponse.form_id == form_id
            )
        )

        if submitted_by_id is not None:
            query = query.filter(
                FormResponse.submitted_by_id
                == submitted_by_id
            )

        if start_date is not None:
            query = query.filter(
                FormResponse.submitted_at >= start_date
            )

        if end_date is not None:
            query = query.filter(
                FormResponse.submitted_at <= end_date
            )

        return (
            query
            .order_by(
                FormResponse.submitted_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Count Responses By Form
    # ========================================================

    def count_by_form(
        self,
        form_id: int,
        submitted_by_id: int | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:

        query = self.db.query(
            func.count(FormResponse.id)
        ).filter(
            FormResponse.form_id == form_id
        )

        if submitted_by_id is not None:
            query = query.filter(
                FormResponse.submitted_by_id
                == submitted_by_id
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
    # Get Responses By User
    # ========================================================

    def get_by_user(
        self,
        submitted_by_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[FormResponse]:

        return (
            self.db.query(FormResponse)
            .options(
                joinedload(FormResponse.form),
                joinedload(FormResponse.details)
                .joinedload(ResponseDetail.field),
            )
            .filter(
                FormResponse.submitted_by_id
                == submitted_by_id
            )
            .order_by(
                FormResponse.submitted_at.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Count Responses By User
    # ========================================================

    def count_by_user(
        self,
        submitted_by_id: int,
    ) -> int:

        return (
            self.db.query(
                func.count(FormResponse.id)
            )
            .filter(
                FormResponse.submitted_by_id
                == submitted_by_id
            )
            .scalar()
            or 0
        )

    # ========================================================
    # Get Response Details
    # ========================================================

    def get_details(
        self,
        response_id: int,
    ) -> list[ResponseDetail]:

        return (
            self.db.query(ResponseDetail)
            .options(
                joinedload(ResponseDetail.field),
            )
            .filter(
                ResponseDetail.response_id
                == response_id
            )
            .order_by(
                ResponseDetail.id.asc()
            )
            .all()
        )

    # ========================================================
    # Get Single Response Detail
    # ========================================================

    def get_detail_by_id(
        self,
        detail_id: int,
    ) -> ResponseDetail | None:

        return (
            self.db.query(ResponseDetail)
            .options(
                joinedload(ResponseDetail.field),
            )
            .filter(
                ResponseDetail.id == detail_id
            )
            .first()
        )

    # ========================================================
    # Get Detail By Response And Field
    # ========================================================

    def get_detail_by_field(
        self,
        response_id: int,
        field_id: int,
    ) -> ResponseDetail | None:

        return (
            self.db.query(ResponseDetail)
            .filter(
                ResponseDetail.response_id
                == response_id,
                ResponseDetail.field_id
                == field_id,
            )
            .first()
        )

    # ========================================================
    # Update Response
    # ========================================================

    def update(
        self,
        response: FormResponse,
        update_data: dict,
    ) -> FormResponse:

        for field, value in update_data.items():
            setattr(response, field, value)

        self.db.commit()
        self.db.refresh(response)

        return response

    # ========================================================
    # Update Response Detail
    # ========================================================

    def update_detail(
        self,
        detail: ResponseDetail,
        update_data: dict,
    ) -> ResponseDetail:

        for field, value in update_data.items():
            setattr(detail, field, value)

        self.db.commit()
        self.db.refresh(detail)

        return detail

    # ========================================================
    # Delete Response Detail
    # ========================================================

    def delete_detail(
        self,
        detail: ResponseDetail,
    ) -> None:

        self.db.delete(detail)
        self.db.commit()

    # ========================================================
    # Delete Response
    # ========================================================

    def delete(
        self,
        response: FormResponse,
    ) -> None:

        self.db.delete(response)
        self.db.commit()

    # ========================================================
    # Get Response History
    # ========================================================

    def get_history(
        self,
        response_id: int,
    ) -> list[ResponseDetail]:

        return (
            self.db.query(ResponseDetail)
            .options(
                joinedload(ResponseDetail.field),
            )
            .filter(
                ResponseDetail.response_id
                == response_id
            )
            .order_by(
                ResponseDetail.updated_at.desc()
            )
            .all()
        )

    # ========================================================
    # Total Responses
    # ========================================================

    def count_all(
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
    # Responses Submitted On Date
    # ========================================================

    def count_by_date(
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
    # Response Submission Trends
    # ========================================================

    def get_submission_trends(
        self,
        start_date: datetime,
        end_date: datetime,
        form_id: int | None = None,
    ) -> list[tuple]:

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
                FormResponse.submitted_at >= start_date,
                FormResponse.submitted_at <= end_date,
            )
        )

        if form_id is not None:
            query = query.filter(
                FormResponse.form_id == form_id
            )

        return (
            query
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
    # Responses By Form
    # ========================================================

    def get_response_counts_by_form(
        self,
        limit: int = 10,
    ) -> list[tuple]:

        return (
            self.db.query(
                FormResponse.form_id,
                func.count(
                    FormResponse.id
                ).label("response_count"),
            )
            .group_by(
                FormResponse.form_id
            )
            .order_by(
                func.count(
                    FormResponse.id
                ).desc()
            )
            .limit(limit)
            .all()
        )