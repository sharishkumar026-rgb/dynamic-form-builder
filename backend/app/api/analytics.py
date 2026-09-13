from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics import (
    FormAnalyticsResponse,
    FormFieldsAnalyticsResponse,
    FormResponseAnalyticsResponse,
    SubmissionAnalyticsResponse,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)

# ============================================================
# FORM ANALYTICS
# ============================================================

@router.get(
    "/forms/{form_id}",
    response_model=FormAnalyticsResponse,
)
def get_form_analytics(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AnalyticsService(db)

    return service.get_form_analytics(
        form_id=form_id,
        current_user=current_user,
    )


# ============================================================
# FORM RESPONSE ANALYTICS
# ============================================================

@router.get(
    "/forms/{form_id}/responses",
    response_model=FormResponseAnalyticsResponse,
)
def get_form_response_analytics(
    form_id: int,
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AnalyticsService(db)

    return service.get_form_response_analytics(
        form_id=form_id,
        current_user=current_user,
        skip=skip,
        limit=limit,
    )


# ============================================================
# FORM FIELD ANALYTICS
# ============================================================

@router.get(
    "/forms/{form_id}/fields",
    response_model=FormFieldsAnalyticsResponse,
)
def get_form_field_analytics(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AnalyticsService(db)

    return service.get_form_field_analytics(
        form_id=form_id,
        current_user=current_user,
    )


# ============================================================
# SUBMISSION ANALYTICS
# ============================================================

@router.get(
    "/submissions",
    response_model=SubmissionAnalyticsResponse,
)
def get_submission_analytics(
    form_id: int | None = Query(
        default=None,
        description="Optional form ID",
    ),
    start_date: str | None = Query(
        default=None,
        description="Start date in YYYY-MM-DD format",
    ),
    end_date: str | None = Query(
        default=None,
        description="End date in YYYY-MM-DD format",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get submission analytics.

    Date values are accepted as strings so that
    leading/trailing spaces can be safely removed.

    Example:

        start_date = 2026-09-06
        end_date   = 2026-09-08
    """

    # --------------------------------------------------------
    # Parse start date
    # --------------------------------------------------------

    parsed_start_date: date | None = None

    if start_date is not None:

        cleaned_start_date = start_date.strip()

        if cleaned_start_date:

            try:
                parsed_start_date = date.fromisoformat(
                    cleaned_start_date
                )

            except ValueError:

                raise HTTPException(
                    status_code=400,
                    detail=(
                        "start_date must be in "
                        "YYYY-MM-DD format"
                    ),
                )

    # --------------------------------------------------------
    # Parse end date
    # --------------------------------------------------------

    parsed_end_date: date | None = None

    if end_date is not None:

        cleaned_end_date = end_date.strip()

        if cleaned_end_date:

            try:
                parsed_end_date = date.fromisoformat(
                    cleaned_end_date
                )

            except ValueError:

                raise HTTPException(
                    status_code=400,
                    detail=(
                        "end_date must be in "
                        "YYYY-MM-DD format"
                    ),
                )

    # --------------------------------------------------------
    # Call service
    # --------------------------------------------------------

    service = AnalyticsService(db)

    return service.get_submission_analytics(
        current_user=current_user,
        form_id=form_id,
        start_date=parsed_start_date,
        end_date=parsed_end_date,
    )