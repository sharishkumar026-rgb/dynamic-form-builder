from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    # ============================================================
    # PRIMARY KEY
    # ============================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    # ============================================================
    # USER / ACTOR
    # ============================================================

    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ============================================================
    # ACTIVITY INFORMATION
    # ============================================================

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    entity_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    entity_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ============================================================
    # ADDITIONAL DETAILS
    # ============================================================

    details: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    # ============================================================
    # IP ADDRESS
    # ============================================================

    ip_address: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
    )

    # ============================================================
    # CREATED AT
    # ============================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    # ============================================================
    # RELATIONSHIP
    # ============================================================

    user = relationship(
        "User",
        back_populates="activity_logs",
        foreign_keys=[user_id],
    )