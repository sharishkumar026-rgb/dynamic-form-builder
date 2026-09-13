from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# Role Create
# ==========================================

class RoleCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )
    description: str | None = Field(
        default=None,
        max_length=255,
    )


# ==========================================
# Role Update
# ==========================================

class RoleUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )
    description: str | None = Field(
        default=None,
        max_length=255,
    )


# ==========================================
# Role Status Update
# ==========================================

class RoleStatusUpdate(BaseModel):
    is_active: bool


# ==========================================
# Role Response
# ==========================================

class RoleResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# Role Action Response
# ==========================================
# POST   /api/roles
# PUT    /api/roles/{role_id}
# PATCH  /api/roles/{role_id}/status

class RoleActionResponse(BaseModel):
    success: bool
    message: str
    role: RoleResponse


# ==========================================
# Role List Response
# ==========================================
# GET /api/roles

class RoleListResponse(BaseModel):
    success: bool
    message: str
    total: int
    roles: list[RoleResponse]


# ==========================================
# Single Role API Response
# ==========================================
# GET /api/roles/{role_id}

class RoleAPIResponse(BaseModel):
    success: bool
    message: str
    role: RoleResponse


# ==========================================
# Role Delete Response
# ==========================================
# DELETE /api/roles/{role_id}

class RoleDeleteResponse(BaseModel):
    success: bool
    message: str
    