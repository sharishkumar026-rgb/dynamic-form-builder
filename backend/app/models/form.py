from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Form(Base):
    __tablename__ = "forms"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="1",
        index=True,
    )

    created_by_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
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

    # User who created the form
    created_by = relationship(
        "User",
        back_populates="forms",
        foreign_keys=[created_by_id],
    )

    # Dynamic fields belonging to this form
    fields = relationship(
        "FormField",
        back_populates="form",
        cascade="all, delete-orphan",
        order_by="FormField.display_order",
    )

    # Responses submitted for this form
    responses = relationship(
        "FormResponse",
        back_populates="form",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return (
            f"<Form("
            f"id={self.id}, "
            f"title='{self.title}', "
            f"is_active={self.is_active}, "
            f"created_by_id={self.created_by_id}"
            f")>"
        )