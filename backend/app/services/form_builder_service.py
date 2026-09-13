from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.models.field_option import FieldOption
from app.models.form import Form
from app.models.form_field import FormField
from app.models.user import User

from app.repositories.activity_log_repository import ActivityLogRepository
from app.repositories.field_option_repository import FieldOptionRepository
from app.repositories.form_field_repository import FormFieldRepository
from app.repositories.form_repository import FormRepository

from app.schemas.field_option import (
    FieldOptionCreate,
    FieldOptionResponse,
    FieldOptionUpdate,
    FieldOptionStatusUpdate,
)

from app.schemas.form_field import (
    FormFieldCreate,
    FormFieldResponse,
    FormFieldUpdate,
    FormFieldReorder,
)

from app.schemas.form import FormResponse


class FormBuilderService:

    # =========================================================
    # INITIALIZE
    # =========================================================

    def __init__(self, db: Session):
        self.db = db

        self.form_repository = FormRepository(db)
        self.form_field_repository = FormFieldRepository(db)
        self.field_option_repository = FieldOptionRepository(db)
        self.activity_log_repository = ActivityLogRepository(db)

    # =========================================================
    # FORM FIELD METHODS
    # =========================================================

    # ---------------------------------------------------------
    # CREATE FIELD
    # ---------------------------------------------------------

    def create_field(
        self,
        form_id: int,
        request: FormFieldCreate,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field_type = request.field_type.lower().strip()
        field_name = request.name.strip()

        supported_types = {
            "text",
            "textarea",
            "number",
            "email",
            "date",
            "time",
            "datetime",
            "dropdown",
            "select",
            "checkbox",
            "radio",
            "multiple_choice",
            "file",
            "rating",
            "password",
            "url",
        }

        if field_type not in supported_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported field type '{request.field_type}'",
            )

        if self.form_field_repository.get_by_name(
            form_id=form_id,
            name=field_name,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A field with this name already exists in this form",
            )

        self._validate_field_position(
            form_id=form_id,
            display_order=request.display_order,
        )

        field = self.form_field_repository.create(
            form_id=form_id,
            label=request.label,
            field_type=field_type,
            name=field_name,
            placeholder=request.placeholder,
            description=request.description,
            is_required=request.is_required,
            display_order=request.display_order,
            validation_rules=request.validation_rules,
            conditional_logic=request.conditional_logic,
            is_active=request.is_active,
        )

        self._create_activity_log(
            current_user=current_user,
            action="CREATE",
            entity_type="form_field",
            entity_id=field.id,
            description="Form field created successfully",
            ip_address=ip_address,
            details={
                "field_id": field.id,
                "form_id": form_id,
                "field_name": field.name,
                "field_type": field.field_type,
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": "Form field created successfully by admin",
            "field": self._to_field_response(field),
        }

    # ---------------------------------------------------------
    # GET ALL FIELDS
    # ---------------------------------------------------------

    def get_fields(
        self,
        form_id: int,
        current_user: User,
        skip: int = 0,
        limit: int = 100,
    ):
        self._get_form_for_view(
            form_id=form_id,
        )

        fields = self.form_field_repository.get_by_form(
            form_id=form_id,
            skip=skip,
            limit=limit,
        )

        total = self.form_field_repository.count_by_form(
            form_id=form_id,
        )

        return {
            "success": True,
            "message": (
                "Form fields retrieved successfully by "
                f"{self._get_actor_role(current_user)}"
            ),
            "total": total,
            "fields": [
                self._to_field_response(field)
                for field in fields
            ],
        }

    # ---------------------------------------------------------
    # GET SINGLE FIELD
    # ---------------------------------------------------------

    def get_field(
        self,
        form_id: int,
        field_id: int,
        current_user: User,
    ):
        self._get_form_for_view(
            form_id=form_id,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        return {
            "success": True,
            "message": (
                "Form field retrieved successfully by "
                f"{self._get_actor_role(current_user)}"
            ),
            "field": self._to_field_response(field),
        }

    # ---------------------------------------------------------
    # UPDATE FIELD
    # ---------------------------------------------------------

    def update_field(
        self,
        form_id: int,
        field_id: int,
        request: FormFieldUpdate,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        if request.field_type is not None:
            field_type = request.field_type.lower().strip()

            supported_types = {
                "text",
                "textarea",
                "number",
                "email",
                "date",
                "time",
                "datetime",
                "dropdown",
                "select",
                "checkbox",
                "radio",
                "multiple_choice",
                "file",
                "rating",
                "password",
                "url",
            }

            if field_type not in supported_types:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported field type '{request.field_type}'",
                )
        else:
            field_type = None

        if request.name is not None:
            field_name = request.name.strip()

            existing_field = self.form_field_repository.get_by_name(
                form_id=form_id,
                name=field_name,
            )

            if existing_field and existing_field.id != field_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A field with this name already exists in this form",
                )
        else:
            field_name = None

        if request.display_order is not None:
            existing_order = (
                self.form_field_repository.get_by_display_order(
                    form_id=form_id,
                    display_order=request.display_order,
                )
            )

            if existing_order and existing_order.id != field_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "A field with this display order "
                        "already exists in this form"
                    ),
                )

        update_data = {}

        if request.label is not None:
            update_data["label"] = request.label

        if field_type is not None:
            update_data["field_type"] = field_type

        if field_name is not None:
            update_data["name"] = field_name

        if request.placeholder is not None:
            update_data["placeholder"] = request.placeholder

        if request.description is not None:
            update_data["description"] = request.description

        if request.is_required is not None:
            update_data["is_required"] = request.is_required

        if request.display_order is not None:
            update_data["display_order"] = request.display_order

        if request.validation_rules is not None:
            update_data["validation_rules"] = request.validation_rules

        if request.conditional_logic is not None:
            update_data["conditional_logic"] = request.conditional_logic

        if request.is_active is not None:
            update_data["is_active"] = request.is_active

        updated_field = self.form_field_repository.update(
            field,
            update_data,
        )

        self._create_activity_log(
            current_user=current_user,
            action="UPDATE",
            entity_type="form_field",
            entity_id=field.id,
            description="Form field updated successfully",
            ip_address=ip_address,
            details={
                "field_id": field.id,
                "form_id": form_id,
                "updated_fields": list(update_data.keys()),
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": "Form field updated successfully by admin",
            "field": self._to_field_response(updated_field),
        }

    # ---------------------------------------------------------
    # DELETE FIELD
    # ---------------------------------------------------------

    def delete_field(
        self,
        form_id: int,
        field_id: int,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        field_name = field.name

        options = self.field_option_repository.get_by_field(
            field_id=field_id,
        )

        for option in options:
            self.field_option_repository.delete(option)

        self.form_field_repository.delete(field)

        self._create_activity_log(
            current_user=current_user,
            action="DELETE",
            entity_type="form_field",
            entity_id=field_id,
            description="Form field deleted successfully",
            ip_address=ip_address,
            details={
                "field_id": field_id,
                "form_id": form_id,
                "field_name": field_name,
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": "Form field deleted successfully by admin",
        }

    # ---------------------------------------------------------
    # REORDER FIELDS
    # ---------------------------------------------------------

    def reorder_fields(
        self,
        form_id: int,
        request: FormFieldReorder,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field_orders = request.field_orders

        field_ids = [
            item.field_id
            for item in field_orders
        ]

        display_orders = [
            item.display_order
            for item in field_orders
        ]

        if len(field_ids) != len(set(field_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate field IDs are not allowed",
            )

        if len(display_orders) != len(set(display_orders)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate display orders are not allowed",
            )

        fields = self.form_field_repository.get_by_form(
            form_id=form_id,
            skip=0,
            limit=10000,
        )

        existing_ids = {
            field.id
            for field in fields
        }

        invalid_ids = [
            field_id
            for field_id in field_ids
            if field_id not in existing_ids
        ]

        if invalid_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Field IDs not found in this form: {invalid_ids}"
                ),
            )

        reorder_data = [
            {
                "field_id": item.field_id,
                "display_order": item.display_order,
            }
            for item in field_orders
        ]

        self.form_field_repository.reorder(
            form_id=form_id,
            field_orders=reorder_data,
        )

        updated_fields = self.form_field_repository.get_by_form(
            form_id=form_id,
            skip=0,
            limit=10000,
        )

        self._create_activity_log(
            current_user=current_user,
            action="REORDER",
            entity_type="form_field",
            entity_id=form_id,
            description="Form fields reordered successfully",
            ip_address=ip_address,
            details={
                "form_id": form_id,
                "field_orders": reorder_data,
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": "Form fields reordered successfully by admin",
            "fields": [
                self._to_field_response(field)
                for field in updated_fields
            ],
        }

    # =========================================================
    # FIELD OPTION METHODS
    # =========================================================

    # ---------------------------------------------------------
    # CREATE OPTION
    # ---------------------------------------------------------

    def create_option(
        self,
        form_id: int,
        field_id: int,
        request: FieldOptionCreate,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        option_field_types = {
            "dropdown",
            "select",
            "checkbox",
            "radio",
            "multiple_choice",
        }

        if field.field_type.lower() not in option_field_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Field type '{field.field_type}' "
                    "does not support options"
                ),
            )

        # Check duplicate option value
        existing_option = (
            self.field_option_repository.get_by_value_and_field(
                field_id=field_id,
                value=request.value,
            )
        )

        if existing_option:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"An option with value '{request.value}' "
                    f"already exists for field '{field.label}'"
                ),
            )

        # Create FieldOption model object
        option = FieldOption(
            field_id=field_id,
            label=request.label,
            value=request.value,
            display_order=request.display_order,
            is_active=request.is_active,
        )

        # Save using repository
        option = self.field_option_repository.create(
            option
        )

        self._create_activity_log(
            current_user=current_user,
            action="CREATE",
            entity_type="field_option",
            entity_id=option.id,
            description="Field option created successfully",
            ip_address=ip_address,
            details={
                "option_id": option.id,
                "field_id": field_id,
                "form_id": form_id,
                "label": option.label,
                "value": option.value,
                "display_order": option.display_order,
                "is_active": option.is_active,
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": "Field option created successfully by admin",
            "option": self._to_option_response(option),
        }

    # ---------------------------------------------------------
    # GET ALL OPTIONS
    # ---------------------------------------------------------

    def get_options(
        self,
        form_id: int,
        field_id: int,
        current_user: User,
    ):
        self._get_form_for_view(
            form_id=form_id,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        options = self.field_option_repository.get_by_field(
            field_id=field_id,
        )

        return {
            "success": True,
            "message": (
                "Field options retrieved successfully by "
                f"{self._get_actor_role(current_user)}"
            ),
            "total": len(options),
            "options": [
                self._to_option_response(option)
                for option in options
            ],
        }

    # ---------------------------------------------------------
    # GET SINGLE OPTION
    # ---------------------------------------------------------

    def get_option(
        self,
        form_id: int,
        field_id: int,
        option_id: int,
        current_user: User,
    ):
        self._get_form_for_view(
            form_id=form_id,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        option = self.field_option_repository.get_by_id_and_field(
            option_id=option_id,
            field_id=field_id,
        )

        if not option:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Field option not found",
            )

        return {
            "success": True,
            "message": (
                "Field option retrieved successfully by "
                f"{self._get_actor_role(current_user)}"
            ),
            "option": self._to_option_response(option),
        }

    # ---------------------------------------------------------
    # UPDATE OPTION
    # ---------------------------------------------------------

    def update_option(
        self,
        form_id: int,
        field_id: int,
        option_id: int,
        request: FieldOptionUpdate,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        option = self.field_option_repository.get_by_id_and_field(
            option_id=option_id,
            field_id=field_id,
        )

        if not option:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Field option not found",
            )

        update_data = {}

        if request.label is not None:
            update_data["label"] = request.label

        if request.value is not None:
            existing_option = (
                self.field_option_repository.get_by_value_and_field(
                    field_id=field_id,
                    value=request.value,
                    exclude_option_id=option_id,
                )
            )

            if existing_option:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"An option with value '{request.value}' "
                        f"already exists for field '{field.label}'"
                    ),
                )

            update_data["value"] = request.value

        if request.display_order is not None:
            update_data["display_order"] = request.display_order

        if request.is_active is not None:
            update_data["is_active"] = request.is_active

        updated_option = self.field_option_repository.update(
            option,
            update_data,
        )

        self._create_activity_log(
            current_user=current_user,
            action="UPDATE",
            entity_type="field_option",
            entity_id=option.id,
            description="Field option updated successfully",
            ip_address=ip_address,
            details={
                "option_id": option.id,
                "field_id": field_id,
                "form_id": form_id,
                "updated_fields": list(update_data.keys()),
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": "Field option updated successfully by admin",
            "option": self._to_option_response(updated_option),
        }

    # ---------------------------------------------------------
    # UPDATE OPTION STATUS
    # ---------------------------------------------------------

    def update_option_status(
        self,
        form_id: int,
        field_id: int,
        option_id: int,
        request: FieldOptionStatusUpdate,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        option = self.field_option_repository.get_by_id_and_field(
            option_id=option_id,
            field_id=field_id,
        )

        if not option:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Field option not found",
            )

        updated_option = self.field_option_repository.update_status(
            option,
            request.is_active,
        )

        action = (
            "ENABLE"
            if request.is_active
            else "DISABLE"
        )

        self._create_activity_log(
            current_user=current_user,
            action=action,
            entity_type="field_option",
            entity_id=option.id,
            description=(
                "Field option enabled successfully"
                if request.is_active
                else "Field option disabled successfully"
            ),
            ip_address=ip_address,
            details={
                "option_id": option.id,
                "field_id": field_id,
                "form_id": form_id,
                "is_active": request.is_active,
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": (
                "Field option enabled successfully by admin"
                if request.is_active
                else "Field option disabled successfully by admin"
            ),
            "option": self._to_option_response(updated_option),
        }

    # ---------------------------------------------------------
    # DELETE OPTION
    # ---------------------------------------------------------

    def delete_option(
        self,
        form_id: int,
        field_id: int,
        option_id: int,
        current_user: User,
        ip_address: str | None = None,
    ):
        self._get_form_for_management(
            form_id=form_id,
            current_user=current_user,
        )

        field = self.form_field_repository.get_by_id_and_form(
            field_id=field_id,
            form_id=form_id,
        )

        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form field not found in this form",
            )

        option = self.field_option_repository.get_by_id_and_field(
            option_id=option_id,
            field_id=field_id,
        )

        if not option:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Field option not found",
            )

        option_label = option.label
        option_value = option.value

        self.field_option_repository.delete(option)

        self._create_activity_log(
            current_user=current_user,
            action="DELETE",
            entity_type="field_option",
            entity_id=option_id,
            description="Field option deleted successfully",
            ip_address=ip_address,
            details={
                "option_id": option_id,
                "field_id": field_id,
                "form_id": form_id,
                "label": option_label,
                "value": option_value,
                "performed_by": {
                    "id": current_user.id,
                    "name": current_user.name,
                    "email": current_user.email,
                    "role": self._get_actor_role(current_user),
                },
            },
        )

        return {
            "success": True,
            "message": "Field option deleted successfully by admin",
        }

    # =========================================================
    # HELPER METHODS
    # =========================================================

    # ---------------------------------------------------------
    # FORM VIEW ACCESS
    # ---------------------------------------------------------

    def _get_form_for_view(
        self,
        form_id: int,
    ) -> Form:
        form = self.form_repository.get_by_id(form_id)

        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        return form

    # ---------------------------------------------------------
    # FORM MANAGEMENT ACCESS
    # ---------------------------------------------------------

    def _get_form_for_management(
        self,
        form_id: int,
        current_user: User,
    ) -> Form:
        form = self.form_repository.get_by_id(form_id)

        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        if not self._is_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin can manage form fields and options",
            )

        return form

    # ---------------------------------------------------------
    # ADMIN CHECK
    # ---------------------------------------------------------

    def _is_admin(
        self,
        current_user: User,
    ) -> bool:
        if not current_user.role:
            return False

        return (
            current_user.role.name.lower()
            == "admin"
        )

    # ---------------------------------------------------------
    # ACTOR ROLE
    # ---------------------------------------------------------

    def _get_actor_role(
        self,
        current_user: User,
    ) -> str:
        if current_user.role:
            return current_user.role.name.lower()

        return "user"

    # ---------------------------------------------------------
    # FIELD POSITION VALIDATION
    # ---------------------------------------------------------

    def _validate_field_position(
        self,
        form_id: int,
        display_order: int,
    ):
        existing_field = (
            self.form_field_repository.get_by_display_order(
                form_id=form_id,
                display_order=display_order,
            )
        )

        if existing_field:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "A field with this display order "
                    "already exists in this form"
                ),
            )

    # ---------------------------------------------------------
    # FIELD RESPONSE
    # ---------------------------------------------------------

    def _to_field_response(
        self,
        field: FormField,
    ) -> dict:
        return {
            "id": field.id,
            "form_id": field.form_id,
            "label": field.label,
            "field_type": field.field_type,
            "name": field.name,
            "placeholder": field.placeholder,
            "description": field.description,
            "is_required": field.is_required,
            "display_order": field.display_order,
            "validation_rules": field.validation_rules,
            "conditional_logic": field.conditional_logic,
            "is_active": field.is_active,
            "created_at": field.created_at,
            "updated_at": field.updated_at,
        }

    # ---------------------------------------------------------
    # OPTION RESPONSE
    # ---------------------------------------------------------

    def _to_option_response(
        self,
        option: FieldOption,
    ) -> dict:
        return {
            "id": option.id,
            "field_id": option.field_id,
            "label": option.label,
            "value": option.value,
            "display_order": option.display_order,
            "is_active": option.is_active,
            "created_at": option.created_at,
            "updated_at": option.updated_at,
        }

    # ---------------------------------------------------------
    # ACTIVITY LOG
    # ---------------------------------------------------------

    def _create_activity_log(
        self,
        current_user: User,
        action: str,
        entity_type: str,
        entity_id: int,
        description: str,
        ip_address: str | None = None,
        details: dict | None = None,
    ):
        log = ActivityLog(
            user_id=current_user.id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            ip_address=ip_address,
            details=details,
        )

        self.activity_log_repository.create(log)