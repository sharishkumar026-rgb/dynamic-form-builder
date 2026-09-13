from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.models.form import Form
from app.models.user import User
from app.repositories.form_repository import FormRepository
from app.schemas.form import (
    FormActionResponse,
    FormAPIResponse,
    FormCreate,
    FormDeleteResponse,
    FormListResponse,
    FormResponse,
    FormStatusUpdate,
    FormUpdate,
)


class FormService:
    """Business logic for forms."""

    def __init__(self, db: Session):
        self.db = db
        self.form_repository = FormRepository(db)

    # ========================================================
    # Get All Forms
    # ========================================================

    def get_forms(
        self,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
        is_active: bool | None = None,
    ) -> FormListResponse:

        if skip < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Skip cannot be negative",
            )

        if limit < 1 or limit > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Limit must be between 1 and 100",
            )

        forms = self.form_repository.get_all(
            skip=skip,
            limit=limit,
            is_active=is_active,
        )

        total = self.form_repository.count(
            is_active=is_active,
        )

        actor_role = self._get_actor_role(current_user)

        return FormListResponse(
            success=True,
            message=f"Forms retrieved successfully for {actor_role}",
            total=total,
            forms=[
                FormResponse.model_validate(form)
                for form in forms
            ],
        )

    # ========================================================
    # Get Form By ID
    # ========================================================

    def get_form(
        self,
        form_id: int,
        current_user: User,
    ) -> FormAPIResponse:

        form = self.form_repository.get_by_id(form_id)

        if form is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        actor_role = self._get_actor_role(current_user)

        return FormAPIResponse(
            success=True,
            message=f"Form retrieved successfully for {actor_role}",
            form=FormResponse.model_validate(form),
        )

    # ========================================================
    # Create Form
    # ========================================================

    def create_form(
        self,
        request: FormCreate,
        current_user: User,
        ip_address: str | None = None,
    ) -> FormActionResponse:

        title = request.title.strip()

        if not title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Form title cannot be empty",
            )

        existing_form = self.form_repository.get_by_title(
            title
        )

        if existing_form is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Form title already exists",
            )

        form = Form(
            title=title,
            description=request.description,
            is_active=True,
            created_by_id=current_user.id,
        )

        form = self.form_repository.create(form)

        # Reload form so relationships are available.
        form = self.form_repository.get_by_id(form.id)

        if form is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created form",
            )

        actor_role = self._get_actor_role(current_user)

        # ----------------------------------------------------
        # Activity Log
        # ----------------------------------------------------

        self._create_activity_log(
            current_user=current_user,
            action="CREATE",
            entity_id=form.id,
            description="Form created successfully",
            details={
                "form_id": form.id,
                "form_title": form.title,
                "created_by": current_user.id,
                "created_by_name": current_user.name,
                "created_by_email": current_user.email,
                "created_by_role": actor_role,
            },
            ip_address=ip_address,
        )

        return FormActionResponse(
            success=True,
            message=f"Form created successfully by {actor_role}",
            form=FormResponse.model_validate(form),
        )

    # ========================================================
    # Update Form
    # ========================================================

    def update_form(
        self,
        form_id: int,
        request: FormUpdate,
        current_user: User,
        ip_address: str | None = None,
    ) -> FormActionResponse:

        form = self.form_repository.get_by_id(form_id)

        if form is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        update_data: dict = {}

        # ----------------------------------------------------
        # Update Title
        # ----------------------------------------------------

        if request.title is not None:
            title = request.title.strip()

            if not title:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Form title cannot be empty",
                )

            existing_form = self.form_repository.get_by_title(
                title,
                exclude_form_id=form_id,
            )

            if existing_form is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Form title already exists",
                )

            update_data["title"] = title

        # ----------------------------------------------------
        # Update Description
        # ----------------------------------------------------

        if request.description is not None:
            update_data["description"] = request.description

        # ----------------------------------------------------
        # Validate Update
        # ----------------------------------------------------

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided for update",
            )

        # ----------------------------------------------------
        # Repository Update
        # ----------------------------------------------------

        updated_form = self.form_repository.update(
            form,
            update_data,
        )

        # Reload with relationships.
        updated_form = self.form_repository.get_by_id(
            updated_form.id
        )

        if updated_form is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve updated form",
            )

        actor_role = self._get_actor_role(current_user)

        # ----------------------------------------------------
        # Activity Log
        # ----------------------------------------------------

        self._create_activity_log(
            current_user=current_user,
            action="UPDATE",
            entity_id=updated_form.id,
            description="Form updated successfully",
            details={
                "form_id": updated_form.id,
                "form_title": updated_form.title,
                "updated_fields": list(update_data.keys()),
                "updated_by": current_user.id,
                "updated_by_name": current_user.name,
                "updated_by_email": current_user.email,
                "updated_by_role": actor_role,
            },
            ip_address=ip_address,
        )

        return FormActionResponse(
            success=True,
            message=f"Form updated successfully by {actor_role}",
            form=FormResponse.model_validate(updated_form),
        )

    # ========================================================
    # Update Form Status
    # ========================================================

    def update_status(
        self,
        form_id: int,
        request: FormStatusUpdate,
        current_user: User,
        ip_address: str | None = None,
    ) -> FormActionResponse:

        form = self.form_repository.get_by_id(form_id)

        if form is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        updated_form = self.form_repository.update_status(
            form,
            request.is_active,
        )

        # Reload with relationships.
        updated_form = self.form_repository.get_by_id(
            updated_form.id
        )

        if updated_form is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve updated form",
            )

        actor_role = self._get_actor_role(current_user)

        action = (
            "activated"
            if request.is_active
            else "deactivated"
        )

        # ----------------------------------------------------
        # Activity Log
        # ----------------------------------------------------

        self._create_activity_log(
            current_user=current_user,
            action="STATUS_UPDATE",
            entity_id=updated_form.id,
            description=f"Form {action} successfully",
            details={
                "form_id": updated_form.id,
                "form_title": updated_form.title,
                "is_active": request.is_active,
                "status": action,
                "updated_by": current_user.id,
                "updated_by_name": current_user.name,
                "updated_by_email": current_user.email,
                "updated_by_role": actor_role,
            },
            ip_address=ip_address,
        )

        return FormActionResponse(
            success=True,
            message=f"Form {action} successfully by {actor_role}",
            form=FormResponse.model_validate(updated_form),
        )

    # ========================================================
    # Enable Form
    # ========================================================

    def enable_form(
        self,
        form_id: int,
        current_user: User,
        ip_address: str | None = None,
    ) -> FormActionResponse:

        form = self.form_repository.get_by_id(form_id)

        if form is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        updated_form = self.form_repository.update_status(
            form,
            True,
        )

        updated_form = self.form_repository.get_by_id(
            updated_form.id
        )

        if updated_form is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve enabled form",
            )

        actor_role = self._get_actor_role(current_user)

        # ----------------------------------------------------
        # Activity Log
        # ----------------------------------------------------

        self._create_activity_log(
            current_user=current_user,
            action="ENABLE",
            entity_id=updated_form.id,
            description="Form enabled successfully",
            details={
                "form_id": updated_form.id,
                "form_title": updated_form.title,
                "is_active": True,
                "enabled_by": current_user.id,
                "enabled_by_name": current_user.name,
                "enabled_by_email": current_user.email,
                "enabled_by_role": actor_role,
            },
            ip_address=ip_address,
        )

        return FormActionResponse(
            success=True,
            message=f"Form enabled successfully by {actor_role}",
            form=FormResponse.model_validate(updated_form),
        )

    # ========================================================
    # Disable Form
    # ========================================================

    def disable_form(
        self,
        form_id: int,
        current_user: User,
        ip_address: str | None = None,
    ) -> FormActionResponse:

        form = self.form_repository.get_by_id(form_id)

        if form is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        updated_form = self.form_repository.update_status(
            form,
            False,
        )

        updated_form = self.form_repository.get_by_id(
            updated_form.id
        )

        if updated_form is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve disabled form",
            )

        actor_role = self._get_actor_role(current_user)

        # ----------------------------------------------------
        # Activity Log
        # ----------------------------------------------------

        self._create_activity_log(
            current_user=current_user,
            action="DISABLE",
            entity_id=updated_form.id,
            description="Form disabled successfully",
            details={
                "form_id": updated_form.id,
                "form_title": updated_form.title,
                "is_active": False,
                "disabled_by": current_user.id,
                "disabled_by_name": current_user.name,
                "disabled_by_email": current_user.email,
                "disabled_by_role": actor_role,
            },
            ip_address=ip_address,
        )

        return FormActionResponse(
            success=True,
            message=f"Form disabled successfully by {actor_role}",
            form=FormResponse.model_validate(updated_form),
        )

    # ========================================================
    # Delete Form
    # ========================================================

    def delete_form(
        self,
        form_id: int,
        current_user: User,
        ip_address: str | None = None,
    ) -> FormDeleteResponse:

        form = self.form_repository.get_by_id(form_id)

        if form is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        actor_role = self._get_actor_role(current_user)

        # Save information before deleting the form.
        deleted_form_id = form.id
        deleted_form_title = form.title

        self.form_repository.delete(form)

        # ----------------------------------------------------
        # Activity Log
        # ----------------------------------------------------

        self._create_activity_log(
            current_user=current_user,
            action="DELETE",
            entity_id=deleted_form_id,
            description="Form deleted successfully",
            details={
                "form_id": deleted_form_id,
                "form_title": deleted_form_title,
                "deleted_by": current_user.id,
                "deleted_by_name": current_user.name,
                "deleted_by_email": current_user.email,
                "deleted_by_role": actor_role,
            },
            ip_address=ip_address,
        )

        return FormDeleteResponse(
            success=True,
            message=f"Form deleted successfully by {actor_role}",
        )

    # ========================================================
    # Create Activity Log
    # ========================================================

    def _create_activity_log(
        self,
        current_user: User,
        action: str,
        entity_id: int | None,
        description: str,
        details: dict | None = None,
        ip_address: str | None = None,
    ) -> None:

        activity_log = ActivityLog(
            user_id=current_user.id,
            action=action,
            entity_type="form",
            entity_id=entity_id,
            description=description,
            details=details,
            ip_address=ip_address,
        )

        self.db.add(activity_log)
        self.db.commit()
        self.db.refresh(activity_log)

    # ========================================================
    # Get Actor Role
    # ========================================================

    def _get_actor_role(self, user: User) -> str:

        if user.role is not None:
            return user.role.name

        return "user"