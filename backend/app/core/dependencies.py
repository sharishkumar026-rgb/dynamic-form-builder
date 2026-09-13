from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.jwt import decode_access_token
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_PREFIX}/auth/login"
)


def get_database() -> Generator[Session, None, None]:
    yield from get_db()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_database),
) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")

    if user_id is None:
        raise credentials_exception

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise credentials_exception

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:

    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return current_user


def require_admin(
    current_user: User = Depends(get_current_active_user),
) -> User:

    if current_user.role is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    if current_user.role.name.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


def require_user(
    current_user: User = Depends(get_current_active_user),
) -> User:

    if current_user.role is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role is not assigned",
        )

    if current_user.role.name.lower() not in {"admin", "user"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User access required",
        )

    return current_user