from typing import Any

from fastapi.responses import JSONResponse


# ============================================================
# SUCCESS RESPONSE
# ============================================================

def success_response(
    message: str,
    data: Any = None,
    status_code: int = 200,
) -> JSONResponse:
    """
    Create a standard successful API response.

    Example:
    {
        "success": true,
        "message": "Form created successfully",
        "data": {}
    }
    """

    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
        },
    )


# ============================================================
# ERROR RESPONSE
# ============================================================

def error_response(
    message: str,
    data: Any = None,
    status_code: int = 400,
) -> JSONResponse:
    """
    Create a standard error API response.

    Example:
    {
        "success": false,
        "message": "Form not found",
        "data": null
    }
    """

    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": data,
        },
    )


# ============================================================
# CREATED RESPONSE
# ============================================================

def created_response(
    message: str,
    data: Any = None,
) -> JSONResponse:
    """
    Create a standard 201 Created response.
    """

    return success_response(
        message=message,
        data=data,
        status_code=201,
    )


# ============================================================
# NO CONTENT RESPONSE
# ============================================================

def no_content_response() -> JSONResponse:
    """
    Create a standard 204 No Content response.
    """

    return JSONResponse(
        status_code=204,
        content=None,
    )


# ============================================================
# PAGINATED RESPONSE
# ============================================================

def paginated_response(
    message: str,
    items: list[Any],
    total: int,
    skip: int,
    limit: int,
) -> JSONResponse:
    """
    Create a standard paginated API response.

    Example:
    {
        "success": true,
        "message": "Forms retrieved successfully",
        "data": {
            "items": [],
            "total": 10,
            "skip": 0,
            "limit": 100
        }
    }
    """

    return success_response(
        message=message,
        data={
            "items": items,
            "total": total,
            "skip": skip,
            "limit": limit,
        },
    )