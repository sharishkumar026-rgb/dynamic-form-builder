from datetime import date as Date, datetime

from pydantic import BaseModel, Field


# ============================================================
# FORM ANALYTICS SUMMARY
# ============================================================

class FormAnalyticsSummary(BaseModel):
    form_id: int = Field(
        ...,
        gt=0,
        examples=[10],
    )

    title: str = Field(
        ...,
        examples=["Employee Registration Form"],
    )

    is_active: bool = Field(
        ...,
        examples=[True],
    )

    total_fields: int = Field(
        ...,
        ge=0,
        examples=[8],
    )

    total_responses: int = Field(
        ...,
        ge=0,
        examples=[450],
    )

    average_field_responses: float = Field(
        ...,
        ge=0,
        examples=[56.25],
    )

    completion_rate: float = Field(
        ...,
        ge=0,
        le=100,
        examples=[95.5],
    )

    generated_at: datetime


class FormAnalyticsResponse(BaseModel):
    success: bool
    message: str
    data: FormAnalyticsSummary


# ============================================================
# FORM RESPONSE ANALYTICS
# ============================================================

class FormResponseAnalyticsRole(BaseModel):
    id: int = Field(
        ...,
        gt=0,
        examples=[2],
    )

    name: str = Field(
        ...,
        examples=["user"],
    )


class FormResponseAnalyticsUser(BaseModel):
    id: int = Field(
        ...,
        gt=0,
        examples=[2],
    )

    name: str = Field(
        ...,
        examples=["S Harish Kumar"],
    )

    email: str = Field(
        ...,
        examples=["user@sharishkumar.com"],
    )

    role: FormResponseAnalyticsRole


class FormResponseAnalyticsItem(BaseModel):
    response_id: int = Field(
        ...,
        gt=0,
        examples=[1],
    )

    form_id: int = Field(
        ...,
        gt=0,
        examples=[1],
    )

    submitted_by: FormResponseAnalyticsUser

    submitted_at: datetime

    updated_at: datetime

    answered_fields: int = Field(
        ...,
        ge=0,
        examples=[4],
    )

    details_count: int = Field(
        ...,
        ge=0,
        examples=[4],
    )


class FormResponseAnalyticsResponse(BaseModel):
    success: bool
    message: str

    total: int = Field(
        ...,
        ge=0,
        examples=[1],
    )

    data: list[FormResponseAnalyticsItem]


# ============================================================
# FIELD ANALYTICS
# ============================================================

class FieldAnalyticsItem(BaseModel):
    field_id: int = Field(
        ...,
        gt=0,
        examples=[5],
    )

    label: str = Field(
        ...,
        examples=["Department"],
    )

    name: str = Field(
        ...,
        examples=["department"],
    )

    field_type: str = Field(
        ...,
        examples=["dropdown"],
    )

    is_required: bool = Field(
        ...,
        examples=[True],
    )

    total_responses: int = Field(
        ...,
        ge=0,
        examples=[450],
    )

    response_count: int = Field(
        ...,
        ge=0,
        examples=[420],
    )

    unanswered_count: int = Field(
        ...,
        ge=0,
        examples=[30],
    )

    response_percentage: float = Field(
        ...,
        ge=0,
        le=100,
        examples=[93.33],
    )

    answer_distribution: dict[str, int] | None = Field(
        default=None,
        examples=[
            {
                "IT": 150,
                "Finance": 100,
                "HR": 80,
                "Sales": 90,
            }
        ],
    )


class FormFieldsAnalyticsData(BaseModel):
    form_id: int = Field(
        ...,
        gt=0,
        examples=[10],
    )

    fields: list[FieldAnalyticsItem]

    generated_at: datetime


class FormFieldsAnalyticsResponse(BaseModel):
    success: bool
    message: str
    data: FormFieldsAnalyticsData


# ============================================================
# SUBMISSION ANALYTICS
# ============================================================

class SubmissionAnalyticsItem(BaseModel):
    date: Date = Field(
        ...,
        examples=["2026-09-01"],
    )

    submissions: int = Field(
        ...,
        ge=0,
        examples=[85],
    )


class SubmissionAnalyticsData(BaseModel):
    form_id: int | None = Field(
        default=None,
        gt=0,
        examples=[1],
    )

    start_date: Date | None = Field(
        default=None,
        examples=["2026-09-06"],
    )

    end_date: Date | None = Field(
        default=None,
        examples=["2026-09-08"],
    )

    total_submissions: int = Field(
        ...,
        ge=0,
        examples=[1250],
    )

    trends: list[SubmissionAnalyticsItem]

    generated_at: datetime


class SubmissionAnalyticsResponse(BaseModel):
    success: bool
    message: str
    data: SubmissionAnalyticsData