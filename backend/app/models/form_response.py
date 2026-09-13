from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class FormResponse(Base):
    __tablename__ = "form_responses"

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

    # Nullable because the assignment allows public submissions
    submitted_by_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Form relationship
    form = relationship(
        "Form",
        back_populates="responses",
    )

    # User who submitted the response
    submitted_by = relationship(
        "User",
        back_populates="responses",
        foreign_keys=[submitted_by_id],
    )

    # Individual field responses
    details = relationship(
        "ResponseDetail",
        back_populates="response",
        cascade="all, delete-orphan",
        order_by="ResponseDetail.id",
    )

    def __repr__(self) -> str:
        return (
            f"<FormResponse("
            f"id={self.id}, "
            f"form_id={self.form_id}, "
            f"submitted_by_id={self.submitted_by_id}, "
            f"submitted_at={self.submitted_at}"
            f")>"
        )