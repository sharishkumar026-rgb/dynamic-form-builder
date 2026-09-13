from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class FieldOption(Base):
    __tablename__ = "field_options"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    field_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("form_fields.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    label: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    value: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        index=True,
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

    # Parent form field
    field = relationship(
        "FormField",
        back_populates="options",
    )

    def __repr__(self) -> str:
        return (
            f"<FieldOption("
            f"id={self.id}, "
            f"field_id={self.field_id}, "
            f"label='{self.label}', "
            f"value='{self.value}', "
            f"display_order={self.display_order}"
            f")>"
        )