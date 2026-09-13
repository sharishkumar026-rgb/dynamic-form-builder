from datetime import datetime
from typing import Any

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class FormField(Base):
    __tablename__ = "form_fields"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    form_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("forms.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    label: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    field_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    placeholder: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_required: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        index=True,
    )

    # Validation configuration
    validation_rules: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    # Conditional visibility configuration
    conditional_logic: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Parent form
    form = relationship(
        "Form",
        back_populates="fields",
    )

    # Options for dropdown/radio/checkbox fields
    options = relationship(
        "FieldOption",
        back_populates="field",
        cascade="all, delete-orphan",
        order_by="FieldOption.display_order",
    )

    def __repr__(self) -> str:
        return (
            f"<FormField("
            f"id={self.id}, "
            f"form_id={self.form_id}, "
            f"name='{self.name}', "
            f"field_type='{self.field_type}', "
            f"display_order={self.display_order}"
            f")>"
        )