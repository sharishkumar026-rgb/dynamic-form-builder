from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.jwt import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from app.core.password import hash_password, verify_password

from app.models.user import User
from app.models.role import Role
from app.models.activity_log import ActivityLog

from app.repositories.user_repository import UserRepository

from app.schemas.auth import (
    AuthUserResponse,
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
)


class AuthService:
    """Business logic for authentication."""

    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)

    # ============================================================
    # REGISTER
    # ============================================================

    def register(
        self,
        request: RegisterRequest,
        ip_address: str | None = None,
    ) -> RegisterResponse:

        # --------------------------------------------------------
        # Check whether email already exists
        # --------------------------------------------------------

        existing_user = self.user_repository.get_by_email(
            request.email
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        # --------------------------------------------------------
        # Get role using role_id from request
        # --------------------------------------------------------

        role = (
            self.db.query(Role)
            .filter(
                Role.id == request.role_id,
                Role.is_active.is_(True),
            )
            .first()
        )

        if role is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or inactive role",
            )

        # --------------------------------------------------------
        # Create user
        # --------------------------------------------------------

        user = User(
            name=request.name.strip(),
            email=request.email,
            password_hash=hash_password(request.password),
            role_id=role.id,
            is_active=True,
        )

        user = self.user_repository.create(user)

        # --------------------------------------------------------
        # Reload user with role relationship
        # --------------------------------------------------------

        user = self.user_repository.get_by_id(user.id)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created user",
            )

        # ========================================================
        # CREATE ACTIVITY LOG
        # ========================================================

        activity_log = ActivityLog(
            user_id=user.id,
            action="REGISTER",
            entity_type="user",
            entity_id=user.id,
            description="User registered successfully",
            details={
                "name": user.name,
                "role_id": role.id,
                "role": role.name,
                "email": user.email,
            },
            ip_address=ip_address,
        )

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

        # --------------------------------------------------------
        # Role-based success message
        # --------------------------------------------------------

        actor_role = self._get_actor_role(user)

        return RegisterResponse(
            success=True,
            message=f"{actor_role} registered successfully",
            user=AuthUserResponse.model_validate(user),
        )

    # ============================================================
    # LOGIN
    # ============================================================

    def login(
        self,
        request: LoginRequest,
        ip_address: str | None = None,
    ) -> LoginResponse:

        user = self.user_repository.get_by_email(
            request.email
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        if not verify_password(
            request.password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        # --------------------------------------------------------
        # Get role name
        # --------------------------------------------------------

        actor_role = self._get_actor_role(user)

        # --------------------------------------------------------
        # Token claims
        # --------------------------------------------------------

        token_claims = {
            "email": user.email,
            "role_id": user.role_id,
        }

        access_token = create_access_token(
            subject=str(user.id),
            extra_claims=token_claims,
        )

        refresh_token = create_refresh_token(
            subject=str(user.id),
            extra_claims=token_claims,
        )

        return LoginResponse(
            success=True,
            message=f"{actor_role} logged in successfully",
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=AuthUserResponse.model_validate(user),
        )

    # ============================================================
    # REFRESH TOKEN
    # ============================================================

    def refresh_token(
        self,
        request: RefreshTokenRequest,
        ip_address: str | None = None,
    ) -> RefreshTokenResponse:

        payload = decode_refresh_token(
            request.refresh_token
        )

        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        user = self.user_repository.get_by_id(user_id)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={
                    "WWW-Authenticate": "Bearer"
                },
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        # --------------------------------------------------------
        # Token claims
        # --------------------------------------------------------

        token_claims = {
            "email": user.email,
            "role_id": user.role_id,
        }

        access_token = create_access_token(
            subject=str(user.id),
            extra_claims=token_claims,
        )

        actor_role = self._get_actor_role(user)

        return RefreshTokenResponse(
            success=True,
            message=(
                f"Access token refreshed successfully "
                f"for {actor_role}"
            ),
            access_token=access_token,
            token_type="bearer",
        )

    # ============================================================
    # CURRENT USER
    # ============================================================

    def get_current_user(
        self,
        current_user: User,
    ) -> CurrentUserResponse:

        actor_role = self._get_actor_role(current_user)

        return CurrentUserResponse(
            success=True,
            message=(
                f"{actor_role} details retrieved successfully"
            ),
            user=AuthUserResponse.model_validate(
                current_user
            ),
        )

    # ============================================================
    # LOGOUT
    # ============================================================

    def logout(
        self,
        current_user: User,
        ip_address: str | None = None,
    ) -> LogoutResponse:

        actor_role = self._get_actor_role(current_user)

        return LogoutResponse(
            success=True,
            message=f"{actor_role} logged out successfully",
        )

    # ============================================================
    # PRIVATE HELPERS
    # ============================================================

    def _get_actor_role(
        self,
        user: User,
    ) -> str:
        """
        Return a display-friendly role name.

        Database:
            admin -> Admin
            user  -> User
        """

        if user.role is not None:
            return user.role.name.strip().capitalize()

        return "User"