from datetime import datetime

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.activity_log import (
    ActivityLogDetailResponse,
    ActivityLogListResponse,
)
from app.services.activity_log_service import ActivityLogService


router = APIRouter(
    prefix="/activity-logs",
    tags=["Activity Logs"],
)


@router.get(
    "",
    response_model=ActivityLogListResponse,
    status_code=status.HTTP_200_OK,
)
def get_activity_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: int | None = None,
    action: str | None = None,
    entity_type: str | None = None,
    entity_id: int | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ActivityLogService(db)

    return service.get_activity_logs(
        current_user=current_user,
        skip=skip,
        limit=limit,
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        start_date=start_date,
        end_date=end_date,
    )


@router.get(
    "/{log_id}",
    response_model=ActivityLogDetailResponse,
    status_code=status.HTTP_200_OK,
)
def get_activity_log(
    log_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ActivityLogService(db)

    return service.get_activity_log(
        log_id=log_id,
        current_user=current_user,
    )