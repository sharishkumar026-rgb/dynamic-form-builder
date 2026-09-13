from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# ROLE RESPONSE
# ============================================================

class RoleResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# AUTH USER RESPONSE
# ============================================================

class AuthUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    role: RoleResponse | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# REGISTER REQUEST
# ============================================================

class RegisterRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    email: EmailStr = Field(
        ...,
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )

    role_id: int = Field(
        ...,
        gt=0,
    )


# ============================================================
# REGISTER RESPONSE
# ============================================================

class RegisterResponse(BaseModel):
    success: bool
    message: str
    user: AuthUserResponse | None = None


# ============================================================
# LOGIN REQUEST
# ============================================================

class LoginRequest(BaseModel):
    email: EmailStr = Field(
        ...,
        examples=["admin@example.com"],
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
        examples=["Password@123"],
    )


# ============================================================
# LOGIN RESPONSE
# ============================================================

class LoginResponse(BaseModel):
    success: bool
    message: str
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: AuthUserResponse


# ============================================================
# REFRESH TOKEN REQUEST
# ============================================================

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(
        ...,
        min_length=1,
    )


# ============================================================
# REFRESH TOKEN RESPONSE
# ============================================================

class RefreshTokenResponse(BaseModel):
    success: bool
    message: str
    access_token: str
    token_type: str = "bearer"


# ============================================================
# TOKEN DATA
# ============================================================

class TokenData(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ============================================================
# CURRENT USER RESPONSE
# GET /api/auth/me
# ============================================================

class CurrentUserResponse(BaseModel):
    success: bool
    message: str
    user: AuthUserResponse


# ============================================================
# LOGOUT RESPONSE
# POST /api/auth/logout
# ============================================================

class LogoutResponse(BaseModel):
    success: bool
    message: str