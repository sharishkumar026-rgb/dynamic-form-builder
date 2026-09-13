from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# CREATE
# ============================================================

class FieldOptionCreate(BaseModel):
    label: str = Field(..., min_length=1, max_length=255)
    value: str = Field(..., min_length=1, max_length=255)
    display_order: int = 0
    is_active: bool = True


# ============================================================
# UPDATE
# ============================================================

class FieldOptionUpdate(BaseModel):
    label: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    value: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    display_order: int | None = None
    is_active: bool | None = None


# ============================================================
# STATUS UPDATE
# ============================================================

class FieldOptionStatusUpdate(BaseModel):
    is_active: bool


# ============================================================
# OPTION RESPONSE
# ============================================================

class FieldOptionResponse(BaseModel):
    id: int
    field_id: int
    label: str
    value: str
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# CREATE / GET ONE / UPDATE RESPONSE
# ============================================================

class FieldOptionActionResponse(BaseModel):
    success: bool
    message: str
    option: FieldOptionResponse | None = None


# ============================================================
# GET ALL RESPONSE
# ============================================================

class FieldOptionListResponse(BaseModel):
    success: bool
    message: str
    total: int
    options: list[FieldOptionResponse]


# ============================================================
# DELETE RESPONSE
# ============================================================

class FieldOptionDeleteResponse(BaseModel):
    success: bool
    message: str