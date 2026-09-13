from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Form/data source used by the report
    form_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("forms.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # User who created the report
    created_by_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Saved report configuration
    selected_fields: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    filters: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    sort_by: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    sort_order: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
        default="asc",
    )

    group_by: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    visualization: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="active",
        server_default="active",
        index=True,
    )

    # Last time this report was generated
    last_generated_at: Mapped[datetime | None] = mapped_column(
        DateTime,
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

    # ========================================================
    # Relationships
    # ========================================================

    form = relationship(
        "Form",
        backref="reports",
        foreign_keys=[form_id],
    )

    created_by = relationship(
        "User",
        backref="reports",
        foreign_keys=[created_by_id],
    )

    def __repr__(self) -> str:
        return (
            f"<Report("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"form_id={self.form_id}, "
            f"created_by_id={self.created_by_id}, "
            f"status='{self.status}'"
            f")>"
        )