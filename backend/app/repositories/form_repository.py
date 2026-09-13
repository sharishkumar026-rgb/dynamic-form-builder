from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.form import Form
from app.models.form_response import FormResponse


class FormRepository:
    """Database operations for forms."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # Create
    # ========================================================

    def create(self, form: Form) -> Form:
        self.db.add(form)
        self.db.commit()
        self.db.refresh(form)

        return form

    # ========================================================
    # Get By ID
    # ========================================================

    def get_by_id(self, form_id: int) -> Form | None:
        return (
            self.db.query(Form)
            .options(
                joinedload(Form.created_by),
                joinedload(Form.fields),
            )
            .filter(Form.id == form_id)
            .first()
        )

    # ========================================================
    # Get By Title
    # ========================================================

    def get_by_title(
        self,
        title: str,
        exclude_form_id: int | None = None,
    ) -> Form | None:

        query = self.db.query(Form).filter(
            func.lower(Form.title) == title.lower()
        )

        if exclude_form_id is not None:
            query = query.filter(
                Form.id != exclude_form_id
            )

        return query.first()

    # ========================================================
    # Get All Forms
    # ========================================================

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        is_active: bool | None = None,
        created_by_id: int | None = None,
    ) -> list[Form]:

        query = (
            self.db.query(Form)
            .options(
                joinedload(Form.created_by),
                joinedload(Form.fields),
            )
        )

        if is_active is not None:
            query = query.filter(
                Form.is_active == is_active
            )

        if created_by_id is not None:
            query = query.filter(
                Form.created_by_id == created_by_id
            )

        return (
            query
            .order_by(Form.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Count Forms
    # ========================================================

    def count(
        self,
        is_active: bool | None = None,
        created_by_id: int | None = None,
    ) -> int:

        query = self.db.query(
            func.count(Form.id)
        )

        if is_active is not None:
            query = query.filter(
                Form.is_active == is_active
            )

        if created_by_id is not None:
            query = query.filter(
                Form.created_by_id == created_by_id
            )

        return query.scalar() or 0

    # ========================================================
    # Update
    # ========================================================

    def update(
        self,
        form: Form,
        update_data: dict,
    ) -> Form:

        for field, value in update_data.items():
            setattr(form, field, value)

        self.db.commit()
        self.db.refresh(form)

        return form

    # ========================================================
    # Update Status
    # ========================================================

    def update_status(
        self,
        form: Form,
        is_active: bool,
    ) -> Form:

        form.is_active = is_active

        self.db.commit()
        self.db.refresh(form)

        return form

    # ========================================================
    # Delete
    # ========================================================

    def delete(self, form: Form) -> None:
        self.db.delete(form)
        self.db.commit()

    # ========================================================
    # Check Form Exists
    # ========================================================

    def exists(self, form_id: int) -> bool:
        return (
            self.db.query(Form.id)
            .filter(Form.id == form_id)
            .first()
            is not None
        )

    # ========================================================
    # Check Duplicate Title
    # ========================================================

    def title_exists(
        self,
        title: str,
        exclude_form_id: int | None = None,
    ) -> bool:

        query = self.db.query(Form.id).filter(
            func.lower(Form.title) == title.lower()
        )

        if exclude_form_id is not None:
            query = query.filter(
                Form.id != exclude_form_id
            )

        return query.first() is not None

    # ========================================================
    # Get Forms By Creator
    # ========================================================

    def get_by_creator(
        self,
        created_by_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Form]:

        return (
            self.db.query(Form)
            .options(
                joinedload(Form.created_by),
                joinedload(Form.fields),
            )
            .filter(
                Form.created_by_id == created_by_id
            )
            .order_by(Form.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Count Responses For Form
    # ========================================================

    def count_responses(
        self,
        form_id: int,
    ) -> int:

        return (
            self.db.query(
                func.count(FormResponse.id)
            )
            .filter(
                FormResponse.form_id == form_id
            )
            .scalar()
            or 0
        )

    # ========================================================
    # Get Active Forms
    # ========================================================

    def get_active_forms(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Form]:

        return (
            self.db.query(Form)
            .options(
                joinedload(Form.created_by),
                joinedload(Form.fields),
            )
            .filter(Form.is_active.is_(True))
            .order_by(Form.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Get Forms With Response Counts
    # ========================================================

    def get_forms_with_response_counts(
        self,
        skip: int = 0,
        limit: int = 10,
    ) -> list[tuple[Form, int]]:

        results = (
            self.db.query(
                Form,
                func.count(FormResponse.id).label(
                    "response_count"
                ),
            )
            .outerjoin(
                FormResponse,
                FormResponse.form_id == Form.id,
            )
            .filter(Form.is_active.is_(True))
            .group_by(Form.id)
            .order_by(
                func.count(FormResponse.id).desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

        return results