from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.form_field import FormField


class FormFieldRepository:
    """Database operations for form fields."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # Create
    # ========================================================

    def create(
        self,
        field: FormField,
    ) -> FormField:

        self.db.add(field)
        self.db.commit()
        self.db.refresh(field)

        return field

    # ========================================================
    # Get By ID
    # ========================================================

    def get_by_id(
        self,
        field_id: int,
    ) -> FormField | None:

        return (
            self.db.query(FormField)
            .options(
                joinedload(FormField.form),
                joinedload(FormField.options),
            )
            .filter(
                FormField.id == field_id
            )
            .first()
        )

    # ========================================================
    # Get By ID And Form
    # ========================================================

    def get_by_id_and_form(
        self,
        field_id: int,
        form_id: int,
    ) -> FormField | None:

        return (
            self.db.query(FormField)
            .options(
                joinedload(FormField.form),
                joinedload(FormField.options),
            )
            .filter(
                FormField.id == field_id,
                FormField.form_id == form_id,
            )
            .first()
        )

    # ========================================================
    # Get All Fields For Form
    # ========================================================

    def get_by_form(
        self,
        form_id: int,
        skip: int = 0,
        limit: int = 100,
        is_active: bool | None = None,
    ) -> list[FormField]:

        query = (
            self.db.query(FormField)
            .options(
                joinedload(FormField.options),
            )
            .filter(
                FormField.form_id == form_id
            )
        )

        if is_active is not None:
            query = query.filter(
                FormField.is_active == is_active
            )

        return (
            query
            .order_by(
                FormField.display_order.asc(),
                FormField.id.asc(),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Count Fields For Form
    # ========================================================

    def count_by_form(
        self,
        form_id: int,
        is_active: bool | None = None,
    ) -> int:

        query = (
            self.db.query(
                func.count(FormField.id)
            )
            .filter(
                FormField.form_id == form_id
            )
        )

        if is_active is not None:
            query = query.filter(
                FormField.is_active == is_active
            )

        return query.scalar() or 0

    # ========================================================
    # Get Field By Name
    # ========================================================

    def get_by_name(
        self,
        form_id: int,
        name: str,
        exclude_field_id: int | None = None,
    ) -> FormField | None:

        query = (
            self.db.query(FormField)
            .filter(
                FormField.form_id == form_id,
                func.lower(FormField.name)
                == name.lower(),
            )
        )

        if exclude_field_id is not None:
            query = query.filter(
                FormField.id != exclude_field_id
            )

        return query.first()

    # ========================================================
    # Check Field Name Exists
    # ========================================================

    def name_exists(
        self,
        form_id: int,
        name: str,
        exclude_field_id: int | None = None,
    ) -> bool:

        query = (
            self.db.query(FormField.id)
            .filter(
                FormField.form_id == form_id,
                func.lower(FormField.name)
                == name.lower(),
            )
        )

        if exclude_field_id is not None:
            query = query.filter(
                FormField.id != exclude_field_id
            )

        return query.first() is not None

    # ========================================================
    # Update
    # ========================================================

    def update(
        self,
        field: FormField,
        update_data: dict,
    ) -> FormField:

        for attribute, value in update_data.items():
            setattr(
                field,
                attribute,
                value,
            )

        self.db.commit()
        self.db.refresh(field)

        return field

    # ========================================================
    # Update Status
    # ========================================================

    def update_status(
        self,
        field: FormField,
        is_active: bool,
    ) -> FormField:

        field.is_active = is_active

        self.db.commit()
        self.db.refresh(field)

        return field

    # ========================================================
    # Update Display Order
    # ========================================================

    def update_display_order(
        self,
        field: FormField,
        display_order: int,
    ) -> FormField:

        field.display_order = display_order

        self.db.commit()
        self.db.refresh(field)

        return field

    # ========================================================
    # Reorder Fields
    # ========================================================

    def reorder(
        self,
        form_id: int,
        field_orders: list[dict],
    ) -> list[FormField]:

        field_ids = [
            item["field_id"]
            for item in field_orders
        ]

        if not field_ids:
            return []

        fields = (
            self.db.query(FormField)
            .filter(
                FormField.form_id == form_id,
                FormField.id.in_(field_ids),
            )
            .all()
        )

        fields_by_id = {
            field.id: field
            for field in fields
        }

        for item in field_orders:

            field_id = item["field_id"]
            display_order = item["display_order"]

            field = fields_by_id.get(field_id)

            if field is not None:
                field.display_order = display_order

        self.db.commit()

        for field in fields:
            self.db.refresh(field)

        return sorted(
            fields,
            key=lambda field: (
                field.display_order,
                field.id,
            ),
        )

    # ========================================================
    # Delete
    # ========================================================

    def delete(
        self,
        field: FormField,
    ) -> None:

        self.db.delete(field)
        self.db.commit()

    # ========================================================
    # Exists
    # ========================================================

    def exists(
        self,
        field_id: int,
    ) -> bool:

        return (
            self.db.query(FormField.id)
            .filter(
                FormField.id == field_id
            )
            .first()
            is not None
        )

    # ========================================================
    # Exists In Form
    # ========================================================

    def exists_in_form(
        self,
        field_id: int,
        form_id: int,
    ) -> bool:

        return (
            self.db.query(FormField.id)
            .filter(
                FormField.id == field_id,
                FormField.form_id == form_id,
            )
            .first()
            is not None
        )

    # ========================================================
    # Get Active Fields
    # ========================================================

    def get_active_fields(
        self,
        form_id: int,
    ) -> list[FormField]:

        return (
            self.db.query(FormField)
            .options(
                joinedload(FormField.options),
            )
            .filter(
                FormField.form_id == form_id,
                FormField.is_active.is_(True),
            )
            .order_by(
                FormField.display_order.asc(),
                FormField.id.asc(),
            )
            .all()
        )

    # ========================================================
    # Get Fields By Type
    # ========================================================

    def get_by_type(
        self,
        form_id: int,
        field_type: str,
    ) -> list[FormField]:

        return (
            self.db.query(FormField)
            .options(
                joinedload(FormField.options),
            )
            .filter(
                FormField.form_id == form_id,
                FormField.field_type == field_type,
            )
            .order_by(
                FormField.display_order.asc(),
                FormField.id.asc(),
            )
            .all()
        )

    # ========================================================
    # Get Maximum Display Order
    # ========================================================

    def get_max_display_order(
        self,
        form_id: int,
    ) -> int:

        result = (
            self.db.query(
                func.max(
                    FormField.display_order
                )
            )
            .filter(
                FormField.form_id == form_id
            )
            .scalar()
        )

        return (
            result
            if result is not None
            else 0
        )