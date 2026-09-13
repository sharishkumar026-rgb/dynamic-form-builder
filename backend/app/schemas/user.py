from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ============================================================
# ROLE RESPONSE
# ============================================================


class UserRoleResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# USER RESPONSE
# ============================================================


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    role: UserRoleResponse | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# CREATE USER
# ============================================================


class UserCreateRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["John Doe"],
    )

    email: EmailStr = Field(
        ...,
        examples=["john@example.com"],
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        examples=["Password@123"],
    )

    role_id: int = Field(
        ...,
        gt=0,
        examples=[2],
    )


# ============================================================
# UPDATE USER
# ============================================================


class UserUpdateRequest(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    email: EmailStr | None = None

    role_id: int | None = Field(
        default=None,
        gt=0,
    )


# ============================================================
# CHANGE USER ROLE
# ============================================================


class UserRoleUpdateRequest(BaseModel):
    role_id: int = Field(
        ...,
        gt=0,
        examples=[2],
    )


# ============================================================
# UPDATE USER STATUS
# ============================================================


class UserStatusUpdateRequest(BaseModel):
    is_active: bool


# ============================================================
# USER LIST RESPONSE
# ============================================================


class UserListResponse(BaseModel):
    success: bool
    message: str
    total: int
    users: list[UserResponse]


# ============================================================
# SINGLE USER RESPONSE
# ============================================================


class SingleUserResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse | None = None


# ============================================================
# DELETE USER RESPONSE
# ============================================================


class DeleteUserResponse(BaseModel):
    success: bool
    message: str


# ============================================================
# GENERIC USER ACTION RESPONSE
# ============================================================


class UserActionResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse | None = None