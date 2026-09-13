from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


# ========================================================
# ROLE RESPONSE
# ========================================================

class ActivityLogRoleResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ========================================================
# USER RESPONSE
# ========================================================

class ActivityLogUserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: ActivityLogRoleResponse | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ========================================================
# ACTIVITY LOG RESPONSE
# ========================================================

class ActivityLogResponse(BaseModel):
    id: int
    user: ActivityLogUserResponse | None = None
    action: str
    entity_type: str
    entity_id: int | None = None
    description: str | None = None
    details: dict[str, Any] | None = None
    ip_address: str | None = None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ========================================================
# ACTIVITY LOG DETAIL RESPONSE
# GET BY ID
# ========================================================

class ActivityLogDetailResponse(BaseModel):
    success: bool
    message: str
    activity_log: ActivityLogResponse


# ========================================================
# ACTIVITY LOG LIST RESPONSE
# GET ALL
# ========================================================

class ActivityLogListResponse(BaseModel):
    success: bool
    message: str
    activity_log: list[ActivityLogResponse]
    total: int
    page: int
    page_size: int


# ========================================================
# ACTIVITY LOG API RESPONSE
# GENERAL
# ========================================================

class ActivityLogAPIResponse(BaseModel):
    success: bool
    message: str
    activity_log: ActivityLogResponse | None = None