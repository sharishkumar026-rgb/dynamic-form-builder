from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("roles.id", ondelete="RESTRICT"),
        nullable=False,
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

    # Role relationship
    role = relationship(
        "Role",
        back_populates="users",
        lazy="joined",
    )

    # Forms created by the user
    forms = relationship(
        "Form",
        back_populates="created_by",
        foreign_keys="Form.created_by_id",
    )

    # Responses submitted by the user
    responses = relationship(
        "FormResponse",
        back_populates="submitted_by",
        foreign_keys="FormResponse.submitted_by_id",
    )

    # Activity logs created by the user
    activity_logs = relationship(
        "ActivityLog",
        back_populates="user",
        foreign_keys="ActivityLog.user_id",
    )

    def __repr__(self) -> str:
        return (
            f"<User("
            f"id={self.id}, "
            f"name='{self.name}', "
            f"email='{self.email}', "
            f"role_id={self.role_id}"
            f")>"
        )