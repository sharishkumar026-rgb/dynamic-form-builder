from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# Form Field Create
# ==========================================

class FormFieldCreate(BaseModel):
    label: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )
    field_type: str
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )
    placeholder: str | None = None
    description: str | None = None
    is_required: bool = False
    display_order: int = 0
    validation_rules: dict[str, Any] | None = None
    conditional_logic: dict[str, Any] | None = None
    is_active: bool = True


# ==========================================
# Form Field Order Item
# ==========================================

class FormFieldOrderItem(BaseModel):
    field_id: int
    display_order: int


# ==========================================
# Form Field Reorder
# ==========================================

class FormFieldReorder(BaseModel):
    field_orders: list[FormFieldOrderItem] = Field(
        ...,
        min_length=1,
    )


# ==========================================
# Form Field Update
# ==========================================

class FormFieldUpdate(BaseModel):
    label: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    field_type: str | None = None
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    placeholder: str | None = None
    description: str | None = None
    is_required: bool | None = None
    display_order: int | None = None
    validation_rules: dict[str, Any] | None = None
    conditional_logic: dict[str, Any] | None = None
    is_active: bool | None = None


# ==========================================
# Form Field Response
# ==========================================

class FormFieldResponse(BaseModel):
    id: int
    form_id: int
    label: str
    field_type: str
    name: str
    placeholder: str | None = None
    description: str | None = None
    is_required: bool
    display_order: int
    validation_rules: dict[str, Any] | None = None
    conditional_logic: dict[str, Any] | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Form Field Detail Response
# ==========================================

class FormFieldDetailResponse(BaseModel):
    success: bool
    message: str
    field: FormFieldResponse

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Form Field Action Response
# ==========================================

class FormFieldActionResponse(BaseModel):
    success: bool
    message: str
    field: FormFieldResponse | None = None


# ==========================================
# Form Field Delete Response
# ==========================================

class FormFieldDeleteResponse(BaseModel):
    success: bool
    message: str


# ==========================================
# Form Field List Response
# ==========================================

class FormFieldListResponse(BaseModel):
    success: bool
    message: str
    total: int
    fields: list[FormFieldResponse]


# ==========================================
# Form Field Reorder Request
# ==========================================

class FormFieldReorderRequest(BaseModel):
    field_orders: list[FormFieldOrderItem] = Field(
        ...,
        min_length=1,
    )


# ==========================================
# Form Field Reorder Response
# ==========================================

class FormFieldReorderResponse(BaseModel):
    success: bool
    message: str
    fields: list[FormFieldResponse]
