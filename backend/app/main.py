from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.roles import router as roles_router
from app.api.forms import router as forms_router
from app.api.form_fields import router as form_fields_router
from app.api.field_options import router as field_options_router
from app.api.responses import router as responses_router
from app.api.dashboard import router as dashboard_router
from app.api.analytics import router as analytics_router
from app.api.reports import router as reports_router
from app.api.activity_logs import router as activity_logs_router


app = FastAPI(
    title="Dynamic Form Builder & Response Management System",
    description="Backend API for dynamic form creation, response management, analytics, and reporting.",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTER
# ============================================================

api_router = APIRouter(prefix="/api")


api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(roles_router)
api_router.include_router(forms_router)
api_router.include_router(form_fields_router)
api_router.include_router(field_options_router)
api_router.include_router(responses_router)
api_router.include_router(dashboard_router)
api_router.include_router(analytics_router)
api_router.include_router(reports_router)
api_router.include_router(activity_logs_router)


app.include_router(api_router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "success": True,
        "message": "Dynamic Form Builder API is running",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "API is healthy",
    }