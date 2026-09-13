from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ResponseDetail(Base):
    __tablename__ = "response_details"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    response_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("form_responses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    field_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("form_fields.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Stores text, numbers, dates, ratings, arrays, etc.
    value: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Used for structured values such as checkbox selections
    value_json: Mapped[Any | None] = mapped_column(
        JSON,
        nullable=True,
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

    # Parent response
    response = relationship(
        "FormResponse",
        back_populates="details",
    )

    # Field that this answer belongs to
    field = relationship(
        "FormField",
        foreign_keys=[field_id],
    )

    def __repr__(self) -> str:
        return (
            f"<ResponseDetail("
            f"id={self.id}, "
            f"response_id={self.response_id}, "
            f"field_id={self.field_id}"
            f")>"
        )