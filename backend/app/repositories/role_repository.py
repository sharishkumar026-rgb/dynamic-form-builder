from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.user import User


class RoleRepository:
    """Database operations for roles."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # Create
    # ========================================================

    def create(self, role: Role) -> Role:
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)

        return role

    # ========================================================
    # Get By ID
    # ========================================================

    def get_by_id(self, role_id: int) -> Role | None:
        return (
            self.db.query(Role)
            .filter(Role.id == role_id)
            .first()
        )

    # ========================================================
    # Get By Name
    # ========================================================

    def get_by_name(self, name: str) -> Role | None:
        return (
            self.db.query(Role)
            .filter(
                func.lower(Role.name) == name.lower()
            )
            .first()
        )

    # ========================================================
    # Get All Roles
    # ========================================================

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        is_active: bool | None = None,
    ) -> list[Role]:

        query = self.db.query(Role)

        if is_active is not None:
            query = query.filter(
                Role.is_active == is_active
            )

        return (
            query
            .order_by(Role.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Count Roles
    # ========================================================

    def count(
        self,
        is_active: bool | None = None,
    ) -> int:

        query = self.db.query(
            func.count(Role.id)
        )

        if is_active is not None:
            query = query.filter(
                Role.is_active == is_active
            )

        return query.scalar() or 0

    # ========================================================
    # Update
    # ========================================================

    def update(
        self,
        role: Role,
        update_data: dict,
    ) -> Role:

        for field, value in update_data.items():
            setattr(role, field, value)

        self.db.commit()
        self.db.refresh(role)

        return role

    # ========================================================
    # Update Status
    # ========================================================

    def update_status(
        self,
        role: Role,
        is_active: bool,
    ) -> Role:

        role.is_active = is_active

        self.db.commit()
        self.db.refresh(role)

        return role

    # ========================================================
    # Delete
    # ========================================================

    def delete(self, role: Role) -> None:
        self.db.delete(role)
        self.db.commit()

    # ========================================================
    # Check Role Exists
    # ========================================================

    def exists(
        self,
        name: str,
        exclude_role_id: int | None = None,
    ) -> bool:

        query = self.db.query(Role.id).filter(
            func.lower(Role.name) == name.lower()
        )

        if exclude_role_id is not None:
            query = query.filter(
                Role.id != exclude_role_id
            )

        return query.first() is not None

    # ========================================================
    # Check Role Is Used By Users
    # ========================================================

    def is_role_in_use(self, role_id: int) -> bool:
        return (
            self.db.query(User.id)
            .filter(User.role_id == role_id)
            .first()
            is not None
        )

    # ========================================================
    # Count Users By Role
    # ========================================================

    def count_users_by_role(self, role_id: int) -> int:
        return (
            self.db.query(
                func.count(User.id)
            )
            .filter(User.role_id == role_id)
            .scalar()
            or 0
        )