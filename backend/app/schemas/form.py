from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# FORM RESPONSE
# ============================================================


class FormResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# CREATE FORM
# ============================================================


class FormCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        examples=["Employee Feedback Form"],
    )

    description: str | None = Field(
        default=None,
        examples=["Form for collecting employee feedback"],
    )


# ============================================================
# UPDATE FORM
# ============================================================


class FormUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    description: str | None = None


# ============================================================
# FORM STATUS UPDATE
# ============================================================


class FormStatusUpdate(BaseModel):
    is_active: bool


# ============================================================
# FORM LIST RESPONSE
# ============================================================
# GET /api/forms

class FormListResponse(BaseModel):
    success: bool
    message: str
    total: int
    forms: list[FormResponse]


# ============================================================
# SINGLE FORM RESPONSE
# ============================================================
# GET /api/forms/{form_id}

class FormAPIResponse(BaseModel):
    success: bool
    message: str
    form: FormResponse | None = None


# ============================================================
# FORM ACTION RESPONSE
# ============================================================
# POST / PUT / PATCH

class FormActionResponse(BaseModel):
    success: bool
    message: str
    form: FormResponse | None = None


# ============================================================
# DELETE FORM RESPONSE
# ============================================================

class FormDeleteResponse(BaseModel):
    success: bool
    message: str
    