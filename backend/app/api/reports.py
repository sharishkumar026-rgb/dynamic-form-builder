from datetime import date, datetime
from pathlib import Path

from celery.result import AsyncResult
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.report import (
    FormReportResponse,
    ReportExportRequest,
    ReportExportResponse,
    ReportStatisticsResponse,
)
from app.services.report_service import ReportService
from app.tasks.celery_app import celery_app


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


# ============================================================
# EXPORT DIRECTORY
# ============================================================

EXPORT_DIR = Path(
    settings.UPLOAD_DIR
) / "exports"

EXPORT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# FORM REPORT
# ============================================================

@router.get(
    "/forms/{form_id}",
    response_model=FormReportResponse,
)
def get_form_report(
    form_id: int,
    request: Request,

    skip: int = Query(
        default=0,
        ge=0,
    ),

    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),

    start_date: datetime | None = Query(
        default=None,
    ),

    end_date: datetime | None = Query(
        default=None,
    ),

    current_user: User = Depends(
        get_current_active_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    """
    Get a report for a form.
    """

    service = ReportService(db)

    return service.get_form_report(
        form_id=form_id,
        current_user=current_user,
        skip=skip,
        limit=limit,

        start_date=(
            start_date.date()
            if start_date
            else None
        ),

        end_date=(
            end_date.date()
            if end_date
            else None
        ),
    )


# ============================================================
# FORM STATISTICS
# ============================================================

@router.get(
    "/forms/{form_id}/statistics",
    response_model=ReportStatisticsResponse,
)
def get_form_statistics(
    form_id: int,
    request: Request,

    start_date: datetime | None = Query(
        default=None,
    ),

    end_date: datetime | None = Query(
        default=None,
    ),

    current_user: User = Depends(
        get_current_active_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    """
    Get statistics for a form.
    """

    service = ReportService(db)

    return service.get_form_statistics(
        form_id=form_id,

        current_user=current_user,

        start_date=(
            start_date.date()
            if start_date
            else None
        ),

        end_date=(
            end_date.date()
            if end_date
            else None
        ),
    )


# ============================================================
# EXPORT EXCEL
# ============================================================

@router.post(
    "/forms/{form_id}/export/excel",
    response_model=ReportExportResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def export_excel(
    form_id: int,

    request: ReportExportRequest,

    http_request: Request,

    current_user: User = Depends(
        get_current_active_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    """
    Queue Excel report generation.
    """

    service = ReportService(db)

    return service.export_excel(
        form_id=form_id,
        request=request,
        current_user=current_user,
    )


# ============================================================
# EXPORT PDF
# ============================================================

@router.post(
    "/forms/{form_id}/export/pdf",
    response_model=ReportExportResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def export_pdf(
    form_id: int,

    request: ReportExportRequest,

    http_request: Request,

    current_user: User = Depends(
        get_current_active_user
    ),

    db: Session = Depends(
        get_db
    ),
):
    """
    Queue PDF report generation.
    """

    service = ReportService(db)

    return service.export_pdf(
        form_id=form_id,
        request=request,
        current_user=current_user,
    )


# ============================================================
# EXPORT TASK STATUS
# ============================================================

@router.get(
    "/exports/status/{task_id}"
)
def get_export_status(
    task_id: str,

    current_user: User = Depends(
        get_current_active_user
    ),
):
    """
    Check export task status.
    """

    task = AsyncResult(
        task_id,
        app=celery_app,
    )

    # ========================================================
    # PENDING
    # ========================================================

    if task.state == "PENDING":

        return {
            "success": True,

            "message": (
                "Export task is waiting "
                "to be processed"
            ),

            "data": {
                "task_id": task_id,
                "status": "pending",
                "file_name": None,
                "file_url": None,
                "error": None,
            },
        }

    # ========================================================
    # STARTED
    # ========================================================

    if task.state == "STARTED":

        return {
            "success": True,

            "message": (
                "Export task is being processed"
            ),

            "data": {
                "task_id": task_id,
                "status": "processing",
                "file_name": None,
                "file_url": None,
                "error": None,
            },
        }

    # ========================================================
    # SUCCESS
    # ========================================================

    if task.state == "SUCCESS":

        result = task.result or {}

        file_name = result.get(
            "file_name"
        )

        file_url = None

        if file_name:

            file_url = (
                f"/api/reports/exports/"
                f"{file_name}"
            )

        return {
            "success": True,

            "message": (
                "Export completed successfully"
            ),

            "data": {
                "task_id": task_id,
                "status": "completed",
                "file_name": file_name,
                "file_url": file_url,
                "error": None,
            },
        }

    # ========================================================
    # FAILURE
    # ========================================================

    if task.state == "FAILURE":

        return {
            "success": False,

            "message": (
                "Export generation failed"
            ),

            "data": {
                "task_id": task_id,
                "status": "failed",
                "file_name": None,
                "file_url": None,

                "error": str(
                    task.result
                ),
            },
        }

    # ========================================================
    # OTHER STATES
    # ========================================================

    return {
        "success": True,

        "message": (
            "Export task status retrieved"
        ),

        "data": {
            "task_id": task_id,
            "status": (
                task.state.lower()
            ),
            "file_name": None,
            "file_url": None,
            "error": None,
        },
    }


# ============================================================
# DOWNLOAD EXPORT
# ============================================================

@router.get(
    "/exports/{filename}"
)
def download_export(
    filename: str,

    current_user: User = Depends(
        get_current_active_user
    ),
):
    """
    Download generated Excel or PDF report.
    """

    # ========================================================
    # PREVENT PATH TRAVERSAL
    # ========================================================

    safe_filename = Path(
        filename
    ).name

    if safe_filename != filename:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Invalid file name"
            ),
        )

    # ========================================================
    # ALLOWED EXTENSIONS
    # ========================================================

    allowed_extensions = {
        ".xlsx": (
            "application/"
            "vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),

        ".pdf": (
            "application/pdf"
        ),
    }

    extension = Path(
        safe_filename
    ).suffix.lower()

    media_type = (
        allowed_extensions.get(
            extension
        )
    )

    if media_type is None:

        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),

            detail=(
                "Only Excel (.xlsx) and "
                "PDF (.pdf) files are allowed"
            ),
        )

    # ========================================================
    # FILE PATH
    # ========================================================

    file_path = (
        EXPORT_DIR /
        safe_filename
    )

    if not file_path.is_file():

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),

            detail=(
                "Exported file not found"
            ),
        )

    # ========================================================
    # RETURN FILE
    # ========================================================

    return FileResponse(
        path=str(
            file_path
        ),

        media_type=media_type,

        filename=safe_filename,

        headers={
            "Content-Disposition": (
                f'attachment; '
                f'filename="{safe_filename}"'
            )
        },
    )