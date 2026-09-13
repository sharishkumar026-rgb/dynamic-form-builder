from datetime import date

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.dashboard import (
    DashboardResponseStatisticsResponse,
    DashboardMostUsedFormsResponse,
    DashboardSubmissionTrendsResponse,
    DashboardSummaryResponse,
)
from app.services.analytics_service import AnalyticsService


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard summary",
    description=(
        "Retrieve dashboard summary including total forms, "
        "active forms, inactive forms, total responses, "
        "total users, and active users."
    ),
)
def get_dashboard_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = AnalyticsService(db)

    return service.get_dashboard_summary(
        current_user=current_user,
    )


# ============================================================
# SUBMISSION TRENDS
# ============================================================

@router.get(
    "/submission-trends",
    response_model=DashboardSubmissionTrendsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get submission trends",
    description=(
        "Retrieve form submission trends for the selected "
        "date range."
    ),
)
def get_submission_trends(
    start_date: date | None = Query(
        default=None,
        description="Start date in YYYY-MM-DD format.",
    ),
    end_date: date | None = Query(
        default=None,
        description="End date in YYYY-MM-DD format.",
    ),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = AnalyticsService(db)

    return service.get_dashboard_submission_trends(
        current_user=current_user,
        start_date=start_date,
        end_date=end_date,
    )


# ============================================================
# MOST USED FORMS
# ============================================================

@router.get(
    "/most-used-forms",
    response_model=DashboardMostUsedFormsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get most used forms",
    description=(
        "Retrieve forms ordered by the number of submitted "
        "responses."
    ),
)
def get_most_used_forms(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of forms to return.",
    ),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = AnalyticsService(db)

    return service.get_most_used_forms(
        current_user=current_user,
        limit=limit,
    )


# ============================================================
# RESPONSE STATISTICS
# ============================================================

@router.get(
    "/response-statistics",
    response_model=DashboardResponseStatisticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get response statistics",
    description=(
        "Retrieve response statistics including today's "
        "responses, weekly responses, monthly responses, "
        "average responses per form, and the most active form."
    ),
)
def get_response_statistics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    service = AnalyticsService(db)

    return service.get_response_statistics(
        current_user=current_user,
    )