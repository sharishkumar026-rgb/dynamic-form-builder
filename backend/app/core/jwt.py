from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from app.core.config import settings


def create_access_token(
    subject: str,
    expires_delta: timedelta | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """
    Create a JWT access token.
    """

    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    payload: dict[str, Any] = {
        "sub": subject,
        "type": "access",
        "iat": now,
        "exp": expire,
    }

    if extra_claims:
        payload.update(extra_claims)

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_refresh_token(
    subject: str,
    expires_delta: timedelta | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """
    Create a JWT refresh token.
    """

    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

    payload: dict[str, Any] = {
        "sub": subject,
        "type": "refresh",
        "iat": now,
        "exp": expire,
    }

    if extra_claims:
        payload.update(extra_claims)

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict[str, Any] | None:
    """
    Decode and validate an access token.

    Returns:
        Token payload if valid, otherwise None.
    """

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )

        if payload.get("type") != "access":
            return None

        if payload.get("sub") is None:
            return None

        return payload

    except JWTError:
        return None


def decode_refresh_token(token: str) -> dict[str, Any] | None:
    """
    Decode and validate a refresh token.

    Returns:
        Token payload if valid, otherwise None.
    """

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )

        if payload.get("type") != "refresh":
            return None

        if payload.get("sub") is None:
            return None

        return payload

    except JWTError:
        return None