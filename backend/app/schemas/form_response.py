from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# RESPONSE DETAIL - CREATE
# ============================================================

class ResponseDetailCreate(BaseModel):
    field_id: int = Field(..., gt=0, examples=[1])
    value: str | None = Field(
        default=None,
        examples=["Harish Kumar"],
    )
    value_json: Any | None = Field(
        default=None,
        examples=[["Python", "FastAPI", "React"]],
    )


# ============================================================
# RESPONSE DETAIL - UPDATE
# ============================================================

class ResponseDetailUpdate(BaseModel):
    field_id: int = Field(..., gt=0, examples=[1])
    value: str | None = Field(
        default=None,
        examples=["Updated value"],
    )
    value_json: Any | None = Field(default=None)


# ============================================================
# FORM RESPONSE - CREATE
# ============================================================

class FormResponseCreate(BaseModel):
    details: list[ResponseDetailCreate] = Field(
        ...,
        min_length=1,
    )


# ============================================================
# FORM RESPONSE - UPDATE
# ============================================================

class FormResponseUpdate(BaseModel):
    details: list[ResponseDetailUpdate] = Field(
        ...,
        min_length=1,
    )


# ============================================================
# ROLE DATA
# ============================================================

class ResponseRoleData(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# USER DATA
# ============================================================

class ResponseUserData(BaseModel):
    id: int
    name: str
    email: str
    role: ResponseRoleData | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# FORM DATA
# ============================================================

class ResponseFormData(BaseModel):
    id: int
    title: str
    description: str | None = None
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# FIELD DATA
# ============================================================

class ResponseFieldData(BaseModel):
    id: int
    label: str
    name: str
    field_type: str
    is_required: bool

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# RESPONSE DETAIL DATA
# ============================================================

class ResponseDetailResponse(BaseModel):
    id: int
    response_id: int
    field_id: int

    field: ResponseFieldData | None = None

    value: str | None = None
    value_json: Any | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# COMPLETE RESPONSE DATA
# ============================================================

class FormResponseData(BaseModel):
    id: int

    form: ResponseFormData

    submitted_by: ResponseUserData | None = None

    submitted_at: datetime
    updated_at: datetime

    details: list[ResponseDetailResponse]

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# POST / PUT / GET BY ID RESPONSE
# ============================================================

class FormResponseResponse(BaseModel):
    success: bool
    message: str
    response: FormResponseData


# ============================================================
# RESPONSE DETAIL RESPONSE
# ============================================================

class FormResponseDetailResponse(BaseModel):
    success: bool
    message: str
    response: FormResponseData


# ============================================================
# GET ALL RESPONSES
# ============================================================

class FormResponseListResponse(BaseModel):
    success: bool
    message: str
    total: int
    response: list[FormResponseData]


# ============================================================
# DELETE RESPONSE
# ============================================================

class FormResponseDeleteResponse(BaseModel):
    success: bool
    message: str


# ============================================================
# RESPONSE HISTORY ITEM
# ============================================================

class ResponseHistoryItem(BaseModel):
    id: int
    response_id: int
    field_id: int

    value: str | None = None
    value_json: Any | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# RESPONSE HISTORY
# ============================================================

class ResponseHistoryResponse(BaseModel):
    success: bool
    message: str
    total: int
    response: list[ResponseHistoryItem]