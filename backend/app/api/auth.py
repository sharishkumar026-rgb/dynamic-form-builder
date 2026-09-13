from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.auth import (
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
)
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ========================================================
# Register
# ========================================================

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description=(
        "Register a new application user. "
        "If role_id is not provided, the default User role "
        "will be assigned."
    ),
)
def register(
    request: RegisterRequest,
    http_request: Request,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.register(
        request=request,
        ip_address=(
            http_request.client.host
            if http_request.client
            else None
        ),
    )


# ========================================================
# Login - OAuth2
# ========================================================

@router.post(
    "/login",
    response_model=LoginResponse,
    response_model_exclude_none=True,
    status_code=status.HTTP_200_OK,
    summary="Login user",
    description=(
        "Authenticate a user using OAuth2 username/password "
        "form data. The username field must contain the "
        "user's email address."
    ),
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    http_request: Request = None,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    # OAuth2 uses the field name "username".
    # Your application uses email.
    # Therefore username is treated as email.
    request = LoginRequest(
        email=form_data.username,
        password=form_data.password,
    )

    return service.login(
        request=request,
        ip_address=(
            http_request.client.host
            if http_request and http_request.client
            else None
        ),
    )


# ========================================================
# Refresh Token
# ========================================================

@router.post(
    "/refresh",
    response_model=RefreshTokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token",
    description=(
        "Generate a new access token using a valid "
        "refresh token."
    ),
)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.refresh_token(
        request=request,
    )


# ========================================================
# Logout
# ========================================================

@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout current user",
    description=(
        "Logout the currently authenticated user "
        "or admin."
    ),
)
def logout(
    http_request: Request,
    current_user: User = Depends(
        get_current_active_user
    ),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.logout(
        current_user=current_user,
        ip_address=(
            http_request.client.host
            if http_request.client
            else None
        ),
    )


# ========================================================
# Auth Me
# ========================================================

@router.get(
    "/me",
    response_model=CurrentUserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user",
    description=(
        "Return the currently authenticated user's "
        "or admin's profile and role details."
    ),
)
def get_current_user(
    current_user: User = Depends(
        get_current_active_user
    ),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    return service.get_current_user(
        current_user=current_user,
    )