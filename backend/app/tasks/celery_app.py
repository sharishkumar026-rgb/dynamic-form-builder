from celery import Celery

from app.core.config import settings

# Import all SQLAlchemy models before Celery tasks start.
# This ensures all model relationships are registered.
import app.models


celery_app = Celery(
    "dynamic_form_builder",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)


celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    result_expires=3600,
    imports=(
        "app.tasks.export_tasks",
        "app.tasks.report_tasks",
    ),
)


@celery_app.task(
    name="app.tasks.celery_app.health_check",
)
def health_check():
    return {
        "success": True,
        "message": "Celery worker is running successfully",
    }