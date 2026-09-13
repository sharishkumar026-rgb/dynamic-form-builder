from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, ConfigDict


# ============================================================
# SAVED REPORT - FILTER
# ============================================================

class SavedReportFilter(BaseModel):
    field: str = Field(
        ...,
        min_length=1,
        max_length=100,
        examples=["gender"],
    )

    operator: str = Field(
        ...,
        min_length=1,
        max_length=30,
        examples=["equals"],
    )

    value: Any | None = Field(
        default=None,
        examples=["male"],
    )


# ============================================================
# SAVED REPORT - CREATE
# ============================================================

class ReportCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=200,
        examples=["Employee Feedback Report"],
    )

    description: str | None = Field(
        default=None,
        examples=["Monthly employee feedback analysis"],
    )

    form_id: int = Field(
        ...,
        gt=0,
        examples=[1],
    )

    selected_fields: list[str] = Field(
        default_factory=list,
        examples=[
            ["full_name", "email", "gender"]
        ],
    )

    filters: list[SavedReportFilter] = Field(
        default_factory=list,
    )

    sort_by: str | None = Field(
        default=None,
        max_length=100,
        examples=["full_name"],
    )

    sort_order: str | None = Field(
        default="asc",
        max_length=20,
        examples=["asc"],
    )

    group_by: str | None = Field(
        default=None,
        max_length=100,
        examples=["gender"],
    )

    visualization: str | None = Field(
        default=None,
        max_length=50,
        examples=["bar"],
    )


# ============================================================
# SAVED REPORT - UPDATE
# ============================================================

class ReportUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
        examples=["Updated Employee Report"],
    )

    description: str | None = Field(
        default=None,
        examples=["Updated report description"],
    )

    form_id: int | None = Field(
        default=None,
        gt=0,
        examples=[1],
    )

    selected_fields: list[str] | None = Field(
        default=None,
        examples=[
            ["full_name", "email", "gender"]
        ],
    )

    filters: list[SavedReportFilter] | None = Field(
        default=None,
    )

    sort_by: str | None = Field(
        default=None,
        max_length=100,
        examples=["full_name"],
    )

    sort_order: str | None = Field(
        default=None,
        max_length=20,
        examples=["desc"],
    )

    group_by: str | None = Field(
        default=None,
        max_length=100,
        examples=["gender"],
    )

    visualization: str | None = Field(
        default=None,
        max_length=50,
        examples=["pie"],
    )

    status: str | None = Field(
        default=None,
        max_length=30,
        examples=["active"],
    )


# ============================================================
# SAVED REPORT - RESPONSE
# ============================================================

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    name: str

    description: str | None = None

    form_id: int

    created_by_id: int

    selected_fields: list[str] | None = None

    filters: list[dict[str, Any]] | None = None

    sort_by: str | None = None

    sort_order: str | None = None

    group_by: str | None = None

    visualization: str | None = None

    status: str

    last_generated_at: datetime | None = None

    created_at: datetime

    updated_at: datetime


# ============================================================
# SAVED REPORT - LIST RESPONSE
# ============================================================

class ReportListResponse(BaseModel):
    success: bool

    message: str

    total: int

    data: list[ReportResponse]


# ============================================================
# SAVED REPORT - SINGLE RESPONSE
# ============================================================

class SingleReportResponse(BaseModel):
    success: bool

    message: str

    data: ReportResponse


# ============================================================
# REPORT FILTER
# ============================================================

class ReportFilter(BaseModel):
    start_date: datetime | None = Field(
        default=None,
        examples=["2026-08-01T00:00:00"],
    )

    end_date: datetime | None = Field(
        default=None,
        examples=["2026-09-02T23:59:59"],
    )

    submitted_by_id: int | None = Field(
        default=None,
        gt=0,
        examples=[5],
    )


# ============================================================
# REPORT ANSWER
# ============================================================

class FormReportAnswer(BaseModel):
    """
    Individual field answer inside a form response.
    """

    field_id: int = Field(
        ...,
        gt=0,
        examples=[1],
    )

    field_name: str = Field(
        ...,
        examples=["full_name"],
    )

    field_label: str = Field(
        ...,
        examples=["Full Name"],
    )

    field_type: str = Field(
        ...,
        examples=["text"],
    )

    value: Any | None = Field(
        default=None,
        examples=["Harish Kumar"],
    )

    value_json: Any | None = Field(
        default=None,
    )


# ============================================================
# FORM REPORT ITEM
# ============================================================

class FormReportItem(BaseModel):
    """
    Single submitted form response.
    """

    response_id: int = Field(
        ...,
        gt=0,
        examples=[101],
    )

    form_id: int = Field(
        ...,
        gt=0,
        examples=[1],
    )

    submitted_by: dict[str, Any] | None = Field(
        default=None,
        examples=[
            {
                "id": 2,
                "name": "Harish Kumar",
                "email": "harish@example.com",
                "role": "user",
            }
        ],
    )

    submitted_at: datetime | None = None

    updated_at: datetime | None = None

    answers: list[FormReportAnswer] = Field(
        default_factory=list,
    )


# ============================================================
# FORM REPORT DATA
# ============================================================

class FormReportData(BaseModel):
    """
    Complete form report.
    """

    form_id: int = Field(
        ...,
        gt=0,
        examples=[1],
    )

    title: str = Field(
        ...,
        examples=["Employee Feedback Form"],
    )

    description: str | None = Field(
        default=None,
        examples=[
            "Form for collecting employee feedback"
        ],
    )

    is_active: bool = Field(
        ...,
        examples=[True],
    )

    total_fields: int = Field(
        ...,
        ge=0,
        examples=[4],
    )

    total_responses: int = Field(
        ...,
        ge=0,
        examples=[450],
    )

    start_date: datetime | None = Field(
        default=None,
        examples=["2026-09-06T00:00:00"],
    )

    end_date: datetime | None = Field(
        default=None,
        examples=["2026-09-08T23:59:59"],
    )

    responses: list[FormReportItem] = Field(
        default_factory=list,
    )

    generated_at: datetime


# ============================================================
# FORM REPORT RESPONSE
# ============================================================

class FormReportResponse(BaseModel):
    success: bool

    message: str

    total: int

    data: FormReportData


# ============================================================
# REPORT STATISTICS DATA
# ============================================================

class ReportStatisticsData(BaseModel):
    """
    Form statistics.
    """

    form_id: int = Field(
        ...,
        gt=0,
        examples=[10],
    )

    form_title: str = Field(
        ...,
        examples=["Employee Registration Form"],
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

    average_answers_per_response: float = Field(
        ...,
        ge=0,
        examples=[6.5],
    )

    field_statistics: list[dict[str, Any]] = Field(
        default_factory=list,
    )

    start_date: datetime | None = Field(
        default=None,
        examples=["2026-09-06T00:00:00"],
    )

    end_date: datetime | None = Field(
        default=None,
        examples=["2026-09-08T23:59:59"],
    )

    generated_at: datetime


# ============================================================
# REPORT STATISTICS RESPONSE
# ============================================================

class ReportStatisticsResponse(BaseModel):
    success: bool

    message: str

    data: ReportStatisticsData


# ============================================================
# REPORT EXPORT REQUEST
# ============================================================

class ReportExportRequest(BaseModel):
    start_date: datetime | None = Field(
        default=None,
        examples=["2026-08-01T00:00:00"],
    )

    end_date: datetime | None = Field(
        default=None,
        examples=["2026-09-02T23:59:59"],
    )

    submitted_by_id: int | None = Field(
        default=None,
        gt=0,
        examples=[5],
    )


# ============================================================
# REPORT EXPORT DATA
# ============================================================

class ReportExportData(BaseModel):
    task_id: str = Field(
        ...,
        examples=[
            "8f2c7d21-1a4e-4f4c-9c8f-123456789abc"
        ],
    )

    report_type: str = Field(
        ...,
        examples=["excel"],
    )

    status: str = Field(
        ...,
        examples=["queued"],
    )

    message: str = Field(
        ...,
        examples=[
            "Report generation has been queued"
        ],
    )

    created_at: datetime


# ============================================================
# REPORT EXPORT RESPONSE
# ============================================================

class ReportExportResponse(BaseModel):
    success: bool

    message: str

    data: ReportExportData


# ============================================================
# REPORT EXPORT RESULT DATA
# ============================================================

class ReportExportResultData(BaseModel):
    task_id: str

    report_type: str

    status: str

    file_name: str | None = None

    file_url: str | None = None

    error: str | None = None

    completed_at: datetime | None = None


# ============================================================
# REPORT EXPORT RESULT RESPONSE
# ============================================================

class ReportExportResultResponse(BaseModel):
    success: bool

    message: str

    data: ReportExportResultData