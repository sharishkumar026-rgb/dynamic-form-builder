from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# Create Response Detail
# ============================================================

class ResponseDetailCreate(BaseModel):
    field_id: int = Field(
        ...,
        gt=0,
        examples=[1],
    )

    value: str | None = Field(
        default=None,
        examples=["Harish Kumar"],
    )

    value_json: Any | None = Field(
        default=None,
        examples=[
            ["Python", "FastAPI", "React"]
        ],
    )


# ============================================================
# Update Response Detail
# ============================================================

class ResponseDetailUpdate(BaseModel):
    value: str | None = Field(
        default=None,
        examples=["Updated value"],
    )

    value_json: Any | None = Field(
        default=None,
        examples=[
            ["Python", "Django"]
        ],
    )


# ============================================================
# Response Detail Output
# ============================================================

class ResponseDetailResponse(BaseModel):
    id: int
    response_id: int
    field_id: int
    value: str | None
    value_json: Any | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# Single Response Detail
# ============================================================

class ResponseDetailDetailResponse(BaseModel):
    success: bool
    message: str
    data: ResponseDetailResponse


# ============================================================
# Response Detail List
# ============================================================

class ResponseDetailListResponse(BaseModel):
    success: bool
    message: str
    total: int
    data: list[ResponseDetailResponse]


# ============================================================
# Delete Response Detail
# ============================================================

class ResponseDetailDeleteResponse(BaseModel):
    success: bool
    message: str
    data: dict