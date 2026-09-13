from datetime import date as Date, datetime

from pydantic import BaseModel, Field


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

class DashboardSummaryData(BaseModel):
    total_forms: int = Field(
        ...,
        ge=0,
        examples=[25],
    )

    active_forms: int = Field(
        ...,
        ge=0,
        examples=[20],
    )

    inactive_forms: int = Field(
        ...,
        ge=0,
        examples=[5],
    )

    total_responses: int = Field(
        ...,
        ge=0,
        examples=[1250],
    )

    total_users: int = Field(
        ...,
        ge=0,
        examples=[150],
    )

    active_users: int = Field(
        ...,
        ge=0,
        examples=[140],
    )

    generated_at: datetime


class DashboardSummaryResponse(BaseModel):
    success: bool
    message: str
    data: DashboardSummaryData


# ============================================================
# SUBMISSION TRENDS
# ============================================================

class SubmissionTrendItem(BaseModel):
    date: Date = Field(
        ...,
        examples=["2026-09-01"],
    )

    submissions: int = Field(
        ...,
        ge=0,
        examples=[85],
    )


class DashboardSubmissionTrendsResponse(BaseModel):
    success: bool
    message: str
    total: int
    data: list[SubmissionTrendItem]


# ============================================================
# MOST USED FORMS
# ============================================================

class MostUsedFormItem(BaseModel):
    form_id: int = Field(
        ...,
        gt=0,
        examples=[10],
    )

    title: str = Field(
        ...,
        examples=["Employee Registration Form"],
    )

    response_count: int = Field(
        ...,
        ge=0,
        examples=[450],
    )

    is_active: bool = Field(
        ...,
        examples=[True],
    )


class DashboardMostUsedFormsResponse(BaseModel):
    success: bool
    message: str
    total: int
    data: list[MostUsedFormItem]


# ============================================================
# RESPONSE STATISTICS
# ============================================================

class ResponseStatisticsData(BaseModel):
    total_responses: int = Field(
        ...,
        ge=0,
        examples=[1250],
    )

    today_responses: int = Field(
        ...,
        ge=0,
        examples=[85],
    )

    this_week_responses: int = Field(
        ...,
        ge=0,
        examples=[420],
    )

    this_month_responses: int = Field(
        ...,
        ge=0,
        examples=[1250],
    )

    average_responses_per_form: float = Field(
        ...,
        ge=0,
        examples=[50.0],
    )

    most_active_form_id: int | None = Field(
        default=None,
        gt=0,
        examples=[10],
    )

    most_active_form_title: str | None = Field(
        default=None,
        examples=["Employee Registration Form"],
    )

    generated_at: datetime


class DashboardResponseStatisticsResponse(BaseModel):
    success: bool
    message: str
    data: ResponseStatisticsData


# ============================================================
# COMPLETE DASHBOARD
# ============================================================

class DashboardData(BaseModel):
    summary: DashboardSummaryData

    submission_trends: list[SubmissionTrendItem]

    most_used_forms: list[MostUsedFormItem]

    response_statistics: ResponseStatisticsData


class DashboardResponse(BaseModel):
    success: bool
    message: str
    data: DashboardData