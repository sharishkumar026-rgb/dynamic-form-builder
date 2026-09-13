from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.field_option import FieldOption


class FieldOptionRepository:
    """Database operations for field options."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # CREATE
    # ========================================================

    def create(
        self,
        option: FieldOption,
    ) -> FieldOption:

        self.db.add(option)
        self.db.commit()
        self.db.refresh(option)

        return option

    # ========================================================
    # GET BY ID
    # ========================================================

    def get_by_id(
        self,
        option_id: int,
    ) -> FieldOption | None:

        return (
            self.db.query(FieldOption)
            .filter(
                FieldOption.id == option_id
            )
            .first()
        )

    # ========================================================
    # GET BY ID AND FIELD
    # ========================================================

    def get_by_id_and_field(
        self,
        option_id: int,
        field_id: int,
    ) -> FieldOption | None:

        return (
            self.db.query(FieldOption)
            .filter(
                FieldOption.id == option_id,
                FieldOption.field_id == field_id,
            )
            .first()
        )

    # ========================================================
    # GET ALL OPTIONS FOR FIELD
    # ========================================================

    def get_by_field(
        self,
        field_id: int,
        skip: int = 0,
        limit: int = 100,
        is_active: bool | None = None,
    ) -> list[FieldOption]:

        query = (
            self.db.query(FieldOption)
            .filter(
                FieldOption.field_id == field_id
            )
        )

        if is_active is not None:
            query = query.filter(
                FieldOption.is_active == is_active
            )

        return (
            query
            .order_by(
                FieldOption.display_order.asc(),
                FieldOption.id.asc(),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # COUNT OPTIONS FOR FIELD
    # ========================================================

    def count_by_field(
        self,
        field_id: int,
        is_active: bool | None = None,
    ) -> int:

        query = (
            self.db.query(
                func.count(FieldOption.id)
            )
            .filter(
                FieldOption.field_id == field_id
            )
        )

        if is_active is not None:
            query = query.filter(
                FieldOption.is_active == is_active
            )

        return query.scalar() or 0

    # ========================================================
    # GET BY VALUE
    # ========================================================

    def get_by_value(
        self,
        field_id: int,
        value: str,
        exclude_option_id: int | None = None,
    ) -> FieldOption | None:

        query = (
            self.db.query(FieldOption)
            .filter(
                FieldOption.field_id == field_id,
                func.lower(
                    FieldOption.value
                ) == value.lower(),
            )
        )

        if exclude_option_id is not None:
            query = query.filter(
                FieldOption.id != exclude_option_id
            )

        return query.first()

    # ========================================================
    # GET BY VALUE AND FIELD
    #
    # Compatibility method for service
    # ========================================================

    def get_by_value_and_field(
        self,
        field_id: int,
        value: str,
        exclude_option_id: int | None = None,
    ) -> FieldOption | None:

        return self.get_by_value(
            field_id=field_id,
            value=value,
            exclude_option_id=exclude_option_id,
        )

    # ========================================================
    # GET BY LABEL
    # ========================================================

    def get_by_label(
        self,
        field_id: int,
        label: str,
        exclude_option_id: int | None = None,
    ) -> FieldOption | None:

        query = (
            self.db.query(FieldOption)
            .filter(
                FieldOption.field_id == field_id,
                func.lower(
                    FieldOption.label
                ) == label.lower(),
            )
        )

        if exclude_option_id is not None:
            query = query.filter(
                FieldOption.id != exclude_option_id
            )

        return query.first()

    # ========================================================
    # GET BY LABEL AND FIELD
    #
    # Compatibility method for service
    # ========================================================

    def get_by_label_and_field(
        self,
        field_id: int,
        label: str,
        exclude_option_id: int | None = None,
    ) -> FieldOption | None:

        return self.get_by_label(
            field_id=field_id,
            label=label,
            exclude_option_id=exclude_option_id,
        )

    # ========================================================
    # CHECK VALUE EXISTS
    # ========================================================

    def value_exists(
        self,
        field_id: int,
        value: str,
        exclude_option_id: int | None = None,
    ) -> bool:

        query = (
            self.db.query(FieldOption.id)
            .filter(
                FieldOption.field_id == field_id,
                func.lower(
                    FieldOption.value
                ) == value.lower(),
            )
        )

        if exclude_option_id is not None:
            query = query.filter(
                FieldOption.id != exclude_option_id
            )

        return query.first() is not None

    # ========================================================
    # CHECK LABEL EXISTS
    # ========================================================

    def label_exists(
        self,
        field_id: int,
        label: str,
        exclude_option_id: int | None = None,
    ) -> bool:

        query = (
            self.db.query(FieldOption.id)
            .filter(
                FieldOption.field_id == field_id,
                func.lower(
                    FieldOption.label
                ) == label.lower(),
            )
        )

        if exclude_option_id is not None:
            query = query.filter(
                FieldOption.id != exclude_option_id
            )

        return query.first() is not None

    # ========================================================
    # UPDATE
    # ========================================================

    def update(
        self,
        option: FieldOption,
        update_data: dict,
    ) -> FieldOption:

        for field, value in update_data.items():
            setattr(
                option,
                field,
                value,
            )

        self.db.commit()
        self.db.refresh(option)

        return option

    # ========================================================
    # UPDATE STATUS
    # ========================================================

    def update_status(
        self,
        option: FieldOption,
        is_active: bool,
    ) -> FieldOption:

        option.is_active = is_active

        self.db.commit()
        self.db.refresh(option)

        return option

    # ========================================================
    # UPDATE DISPLAY ORDER
    # ========================================================

    def update_display_order(
        self,
        option: FieldOption,
        display_order: int,
    ) -> FieldOption:

        option.display_order = display_order

        self.db.commit()
        self.db.refresh(option)

        return option

    # ========================================================
    # DELETE
    # ========================================================

    def delete(
        self,
        option: FieldOption,
    ) -> None:

        self.db.delete(option)
        self.db.commit()

    # ========================================================
    # EXISTS
    # ========================================================

    def exists(
        self,
        option_id: int,
    ) -> bool:

        return (
            self.db.query(FieldOption.id)
            .filter(
                FieldOption.id == option_id
            )
            .first()
            is not None
        )

    # ========================================================
    # EXISTS IN FIELD
    # ========================================================

    def exists_in_field(
        self,
        option_id: int,
        field_id: int,
    ) -> bool:

        return (
            self.db.query(FieldOption.id)
            .filter(
                FieldOption.id == option_id,
                FieldOption.field_id == field_id,
            )
            .first()
            is not None
        )

    # ========================================================
    # GET ACTIVE OPTIONS
    # ========================================================

    def get_active_options(
        self,
        field_id: int,
    ) -> list[FieldOption]:

        return (
            self.db.query(FieldOption)
            .filter(
                FieldOption.field_id == field_id,
                FieldOption.is_active.is_(True),
            )
            .order_by(
                FieldOption.display_order.asc(),
                FieldOption.id.asc(),
            )
            .all()
        )

    # ========================================================
    # GET MAXIMUM DISPLAY ORDER
    # ========================================================

    def get_max_display_order(
        self,
        field_id: int,
    ) -> int:

        result = (
            self.db.query(
                func.max(
                    FieldOption.display_order
                )
            )
            .filter(
                FieldOption.field_id == field_id
            )
            .scalar()
        )

        return (
            result
            if result is not None
            else 0
        )