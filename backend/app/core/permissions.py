from fastapi import HTTPException, status

from app.models.user import User


def is_admin(user: User) -> bool:
    """
    Check whether the user has the Admin role.
    """
    return (
        user.role is not None
        and user.role.name.lower() == "admin"
    )


def is_user(user: User) -> bool:
    """
    Check whether the user has the User role.
    """
    return (
        user.role is not None
        and user.role.name.lower() == "user"
    )


def require_admin_permission(user: User) -> None:
    """
    Raise an exception if the user is not an Admin.
    """
    if not is_admin(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permission required",
        )


def require_user_permission(user: User) -> None:
    """
    Allow Admin and User roles.
    """
    if not (is_admin(user) or is_user(user)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User permission required",
        )


def can_manage_users(user: User) -> bool:
    """
    Only Admin can manage users.
    """
    return is_admin(user)


def can_manage_roles(user: User) -> bool:
    """
    Only Admin can manage roles.
    """
    return is_admin(user)


def can_manage_forms(user: User) -> bool:
    """
    Only Admin can create, update, delete,
    enable, or disable forms.
    """
    return is_admin(user)


def can_submit_forms(user: User) -> bool:
    """
    Admin and User can submit forms.
    """
    return is_admin(user) or is_user(user)


def can_view_responses(user: User) -> bool:
    """
    Admin and User can view responses according
    to the response access rules.
    """
    return is_admin(user) or is_user(user)


def can_manage_activity_logs(user: User) -> bool:
    """
    Only Admin can view activity logs.
    """
    return is_admin(user)


def can_view_analytics(user: User) -> bool:
    """
    Admin and User can view analytics.
    """
    return is_admin(user) or is_user(user)


def can_generate_reports(user: User) -> bool:
    """
    Admin and User can generate reports.
    """
    return is_admin(user) or is_user(user)