
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.user import User
from app.models.role import Role


class UserRepository:
    """Database operations for users."""

    def __init__(self, db: Session):
        self.db = db

    # ========================================================
    # Create
    # ========================================================

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return self.get_by_id(user.id)

    # ========================================================
    # Get By ID
    # ========================================================

    def get_by_id(self, user_id: int) -> User | None:
        return (
            self.db.query(User)
            .options(joinedload(User.role))
            .filter(User.id == user_id)
            .first()
        )

    # ========================================================
    # Get By Email
    # ========================================================

    def get_by_email(self, email: str) -> User | None:
        return (
            self.db.query(User)
            .options(joinedload(User.role))
            .filter(
                func.lower(User.email) == email.lower()
            )
            .first()
        )

    # ========================================================
    # Get Default User Role
    # ========================================================

    def get_default_user_role(self) -> Role | None:
        return (
            self.db.query(Role)
            .filter(
                Role.name == "user",
                Role.is_active.is_(True),
            )
            .first()
        )

    # ========================================================
    # Get Role By ID
    # ========================================================

    def get_role_by_id(self, role_id: int) -> Role | None:
        return (
            self.db.query(Role)
            .filter(Role.id == role_id)
            .first()
        )

    # ========================================================
    # Get All Users
    # ========================================================

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        is_active: bool | None = None,
    ) -> list[User]:

        query = (
            self.db.query(User)
            .options(joinedload(User.role))
        )

        if is_active is not None:
            query = query.filter(
                User.is_active == is_active
            )

        return (
            query
            .order_by(User.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Count Users
    # ========================================================

    def count(
        self,
        is_active: bool | None = None,
    ) -> int:

        query = self.db.query(
            func.count(User.id)
        )

        if is_active is not None:
            query = query.filter(
                User.is_active == is_active
            )

        return query.scalar() or 0

    # ========================================================
    # Update
    # ========================================================

    def update(
        self,
        user: User,
        update_data: dict | None = None,
    ) -> User:

        if update_data:
            for field, value in update_data.items():
                setattr(user, field, value)

        self.db.commit()

        return self.get_by_id(user.id)

    # ========================================================
    # Update Status
    # ========================================================

    def update_status(
        self,
        user: User,
        is_active: bool,
    ) -> User:

        user.is_active = is_active

        self.db.commit()

        return self.get_by_id(user.id)

    # ========================================================
    # Update Role
    # ========================================================

    def update_role(
        self,
        user: User,
        role_id: int,
    ) -> User:

        # Update role foreign key
        user.role_id = role_id

        # Save change
        self.db.commit()

        # Fresh query to load the NEW role relationship
        updated_user = (
            self.db.query(User)
            .options(joinedload(User.role))
            .filter(User.id == user.id)
            .first()
        )

        return updated_user

    # ========================================================
    # Delete
    # ========================================================

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()

    # ========================================================
    # Check Email Exists
    # ========================================================

    def email_exists(
        self,
        email: str,
        exclude_user_id: int | None = None,
    ) -> bool:

        query = self.db.query(User.id).filter(
            func.lower(User.email) == email.lower()
        )

        if exclude_user_id is not None:
            query = query.filter(
                User.id != exclude_user_id
            )

        return query.first() is not None

    # ========================================================
    # Get Active Users
    # ========================================================

    def get_active_users(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:

        return (
            self.db.query(User)
            .options(joinedload(User.role))
            .filter(User.is_active.is_(True))
            .order_by(User.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ========================================================
    # Get Users By Role
    # ========================================================

    def get_by_role(
        self,
        role_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:

        return (
            self.db.query(User)
            .options(joinedload(User.role))
            .filter(User.role_id == role_id)
            .order_by(User.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

