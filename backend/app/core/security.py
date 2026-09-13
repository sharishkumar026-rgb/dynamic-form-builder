from datetime import datetime, timedelta, timezone
from typing import Any

from app.core.config import settings
from app.core.jwt import create_access_token, create_refresh_token


def create_token_pair(user_id: int) -> dict[str, Any]:
    """
    Create access and refresh tokens for a user.
    """

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    refresh_token_expires = timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    access_token = create_access_token(
        subject=str(user_id),
        expires_delta=access_token_expires,
    )

    refresh_token = create_refresh_token(
        subject=str(user_id),
        expires_delta=refresh_token_expires,
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def get_token_expiry(minutes: int) -> datetime:
    """
    Return UTC expiry datetime for a token.
    """

    return datetime.now(timezone.utc) + timedelta(minutes=minutes)