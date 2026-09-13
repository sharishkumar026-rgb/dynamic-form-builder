from datetime import datetime
import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.form import Form
from app.models.form_field import FormField
from app.models.form_response import FormResponse
from app.models.response_detail import ResponseDetail
from app.models.user import User

from app.repositories.activity_log_repository import ActivityLogRepository
from app.repositories.form_field_repository import FormFieldRepository
from app.repositories.form_repository import FormRepository
from app.repositories.response_repository import ResponseRepository


class ResponseService:
    """Business logic for form responses."""

    def __init__(self, db: Session):
        self.db = db

        self.response_repository = ResponseRepository(db)
        self.form_repository = FormRepository(db)
        self.form_field_repository = FormFieldRepository(db)
        self.activity_log_repository = ActivityLogRepository(db)

    # ============================================================
    # CREATE RESPONSE
    # POST /api/forms/{form_id}/responses
    # USER ONLY
    # ============================================================

    def create_response(
        self,
        form_id: int,
        response_data,
        current_user: User,
    ):
        self._check_user_permission(
            current_user=current_user,
            message="Only users can submit form responses",
        )

        form = (
            self.db.query(Form)
            .filter(Form.id == form_id)
            .first()
        )

        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        if not form.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Form is inactive",
            )

        fields = (
            self.db.query(FormField)
            .filter(
                FormField.form_id == form_id,
                FormField.is_active == True,
            )
            .options(
                joinedload(FormField.options)
            )
            .all()
        )

        field_map = {
            field.id: field
            for field in fields
        }

        field_ids = [
            detail.field_id
            for detail in response_data.details
        ]

        if len(field_ids) != len(set(field_ids)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Duplicate field IDs are not allowed",
            )

        for detail in response_data.details:

            field = field_map.get(detail.field_id)

            if not field:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Field ID {detail.field_id} "
                        f"does not belong to this form "
                        f"or is inactive"
                    ),
                )

            self._validate_field_value(
                field=field,
                value=detail.value,
                value_json=detail.value_json,
            )

        submitted_field_ids = set(field_ids)

        for field in fields:

            if field.is_required:

                if field.id not in submitted_field_ids:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=(
                            f"Required field "
                            f"'{field.label}' is missing"
                        ),
                    )

                detail = next(
                    (
                        item
                        for item in response_data.details
                        if item.field_id == field.id
                    ),
                    None,
                )

                if detail:

                    value_empty = (
                        detail.value is None
                        or str(detail.value).strip() == ""
                    )

                    json_empty = (
                        detail.value_json is None
                        or detail.value_json == []
                    )

                    if value_empty and json_empty:
                        raise HTTPException(
                            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=(
                                f"Required field "
                                f"'{field.label}' cannot be empty"
                            ),
                        )

        now = datetime.utcnow()

        response = FormResponse(
            form_id=form_id,
            submitted_by_id=current_user.id,
            submitted_at=now,
            updated_at=now,
        )

        self.db.add(response)
        self.db.flush()

        for detail in response_data.details:

            response_detail = ResponseDetail(
                response_id=response.id,
                field_id=detail.field_id,
                value=detail.value,
                value_json=detail.value_json,
                created_at=now,
                updated_at=now,
            )

            self.db.add(response_detail)

        try:
            self.activity_log_repository.create_log(
                user_id=current_user.id,
                action="CREATE",
                entity_type="response",
                entity_id=response.id,
            )
        except Exception:
            pass

        self.db.commit()

        response = self._get_response_with_relationships(
            response.id
        )

        return self._response_to_response(
            response=response,
            message="Response submitted successfully by user",
        )

    # ============================================================
    # GET ALL RESPONSES
    # GET /api/forms/{form_id}/responses
    # ADMIN ONLY
    # ============================================================

    def get_form_responses(
        self,
        form_id: int,
        current_user: User,
    ):
        self._check_admin_permission(
            current_user=current_user
        )

        form = (
            self.db.query(Form)
            .filter(Form.id == form_id)
            .first()
        )

        if not form:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Form not found",
            )

        responses = (
            self.db.query(FormResponse)
            .filter(
                FormResponse.form_id == form_id
            )
            .options(
                joinedload(FormResponse.form),

                joinedload(
                    FormResponse.submitted_by
                ).joinedload(
                    User.role
                ),

                joinedload(
                    FormResponse.details
                ).joinedload(
                    ResponseDetail.field
                ),
            )
            .order_by(
                FormResponse.id.desc()
            )
            .all()
        )

        return {
            "success": True,
            "message": "Responses retrieved successfully by admin",
            "total": len(responses),
            "response": [
                self._response_to_dict(item)
                for item in responses
            ],
        }

    # ============================================================
    # GET RESPONSE BY ID
    # GET /api/responses/{response_id}
    #
    # ADMIN → ANY RESPONSE
    # USER  → OWN RESPONSE ONLY
    # ============================================================

    def get_response(
        self,
        response_id: int,
        current_user: User,
    ):
        response = self._get_response_with_relationships(
            response_id
        )

        if not response:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Response not found",
            )

        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )

        if not current_user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User role not found",
            )

        role_name = current_user.role.name.lower()

        # --------------------------------------------------------
        # ADMIN
        # --------------------------------------------------------

        if role_name == "admin":

            return {
                "success": True,
                "message": "Response retrieved successfully by admin",
                "response": self._response_to_dict(
                    response
                ),
            }

        # --------------------------------------------------------
        # USER
        # --------------------------------------------------------

        if role_name == "user":

            if response.submitted_by_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only view your own response",
                )

            return {
                "success": True,
                "message": "Response retrieved successfully by user",
                "response": self._response_to_dict(
                    response
                ),
            }

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this response",
        )

    # ============================================================
    # UPDATE RESPONSE
    # PUT /api/responses/{response_id}
    # USER ONLY - OWN RESPONSE
    # ============================================================

    def update_response(
        self,
        response_id: int,
        response_data,
        current_user: User,
    ):
        response = self._get_response_with_relationships(
            response_id
        )

        if not response:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Response not found",
            )

        form = (
            self.db.query(Form)
            .filter(
                Form.id == response.form_id
            )
            .first()
        )

        self._check_response_update_permission(
            response=response,
            form=form,
            current_user=current_user,
        )

        fields = (
            self.db.query(FormField)
            .filter(
                FormField.form_id == response.form_id,
                FormField.is_active == True,
            )
            .options(
                joinedload(FormField.options)
            )
            .all()
        )

        field_map = {
            field.id: field
            for field in fields
        }

        field_ids = [
            detail.field_id
            for detail in response_data.details
        ]

        if len(field_ids) != len(set(field_ids)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Duplicate field IDs are not allowed",
            )

        for detail in response_data.details:

            field = field_map.get(
                detail.field_id
            )

            if not field:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Field ID {detail.field_id} "
                        f"does not belong to this form "
                        f"or is inactive"
                    ),
                )

            self._validate_field_value(
                field=field,
                value=detail.value,
                value_json=detail.value_json,
            )

        submitted_field_ids = set(field_ids)

        for field in fields:

            if field.is_required:

                if field.id not in submitted_field_ids:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=(
                            f"Required field "
                            f"'{field.label}' is missing"
                        ),
                    )

                detail = next(
                    (
                        item
                        for item in response_data.details
                        if item.field_id == field.id
                    ),
                    None,
                )

                if detail:

                    value_empty = (
                        detail.value is None
                        or str(detail.value).strip() == ""
                    )

                    json_empty = (
                        detail.value_json is None
                        or detail.value_json == []
                    )

                    if value_empty and json_empty:
                        raise HTTPException(
                            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=(
                                f"Required field "
                                f"'{field.label}' cannot be empty"
                            ),
                        )

        existing_details = {
            detail.field_id: detail
            for detail in response.details
        }

        now = datetime.utcnow()

        for detail_data in response_data.details:

            existing_detail = existing_details.get(
                detail_data.field_id
            )

            if existing_detail:

                existing_detail.value = (
                    detail_data.value
                )

                existing_detail.value_json = (
                    detail_data.value_json
                )

                existing_detail.updated_at = now

            else:

                new_detail = ResponseDetail(
                    response_id=response.id,
                    field_id=detail_data.field_id,
                    value=detail_data.value,
                    value_json=detail_data.value_json,
                    created_at=now,
                    updated_at=now,
                )

                self.db.add(new_detail)

        response.updated_at = now

        try:
            self.activity_log_repository.create_log(
                user_id=current_user.id,
                action="UPDATE",
                entity_type="response",
                entity_id=response.id,
            )
        except Exception:
            pass

        self.db.commit()

        response = self._get_response_with_relationships(
            response.id
        )

        return self._response_to_response(
            response=response,
            message="Response updated successfully by user",
        )

    # ============================================================
    # DELETE RESPONSE
    # DELETE /api/responses/{response_id}
    # USER ONLY - OWN RESPONSE
    # ============================================================

    def delete_response(
        self,
        response_id: int,
        current_user: User,
    ):
        response = (
            self.db.query(FormResponse)
            .filter(
                FormResponse.id == response_id
            )
            .first()
        )

        if not response:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Response not found",
            )

        form = (
            self.db.query(Form)
            .filter(
                Form.id == response.form_id
            )
            .first()
        )

        self._check_response_update_permission(
            response=response,
            form=form,
            current_user=current_user,
        )

        try:
            self.activity_log_repository.create_log(
                user_id=current_user.id,
                action="DELETE",
                entity_type="response",
                entity_id=response.id,
            )
        except Exception:
            pass

        self.db.delete(response)
        self.db.commit()

        return {
            "success": True,
            "message": "Response deleted successfully by user",
        }

    # ============================================================
    # RESPONSE HISTORY
    # GET /api/responses/{response_id}/history
    # ADMIN ONLY
    # ============================================================

    def get_response_history(
        self,
        response_id: int,
        current_user: User,
    ):
        self._check_admin_permission(
            current_user=current_user
        )

        response = self._get_response_with_relationships(
            response_id
        )

        if not response:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Response not found",
            )

        history = []

        for detail in response.details:

            history.append(
                {
                    "id": detail.id,
                    "response_id": detail.response_id,
                    "field_id": detail.field_id,
                    "value": detail.value,
                    "value_json": detail.value_json,
                    "created_at": detail.created_at,
                    "updated_at": detail.updated_at,
                }
            )

        return {
            "success": True,
            "message": "Response history retrieved successfully by admin",
            "total": len(history),
            "response": history,
        }

    # ============================================================
    # USER PERMISSION
    # ============================================================

    def _check_user_permission(
        self,
        current_user: User,
        message: str,
    ):
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )

        if not current_user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User role not found",
            )

        if current_user.role.name.lower() != "user":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message,
            )

    # ============================================================
    # ADMIN PERMISSION
    # ============================================================

    def _check_admin_permission(
        self,
        current_user: User,
    ):
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )

        if not current_user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User role not found",
            )

        if current_user.role.name.lower() != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin can view form responses",
            )

    # ============================================================
    # UPDATE / DELETE PERMISSION
    # USER ONLY - OWN RESPONSE
    # ============================================================

    def _check_response_update_permission(
        self,
        response: FormResponse,
        form: Form,
        current_user: User,
    ):
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )

        if not current_user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User role not found",
            )

        if current_user.role.name.lower() != "user":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only users can modify form responses",
            )

        if response.submitted_by_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only modify your own response",
            )

    # ============================================================
    # GET RESPONSE WITH RELATIONSHIPS
    # ============================================================

    def _get_response_with_relationships(
        self,
        response_id: int,
    ):
        return (
            self.db.query(FormResponse)
            .filter(
                FormResponse.id == response_id
            )
            .options(
                joinedload(
                    FormResponse.form
                ),

                joinedload(
                    FormResponse.submitted_by
                ).joinedload(
                    User.role
                ),

                joinedload(
                    FormResponse.details
                ).joinedload(
                    ResponseDetail.field
                ),
            )
            .first()
        )

    # ============================================================
    # FIELD VALIDATION
    # ============================================================

    def _validate_field_value(
        self,
        field: FormField,
        value,
        value_json,
    ):
        field_type = (
            field.field_type or ""
        ).lower().strip()

        # --------------------------------------------------------
        # Empty value
        # --------------------------------------------------------

        if value is None and value_json is None:
            return

        # --------------------------------------------------------
        # TEXT
        # --------------------------------------------------------

        if field_type in (
            "text",
            "textarea",
            "string",
        ):

            if value is not None and not isinstance(
                value,
                str,
            ):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid value for field "
                        f"'{field.label}'"
                    ),
                )

            return

        # --------------------------------------------------------
        # EMAIL
        # --------------------------------------------------------

        if field_type == "email":

            if value is None:
                return

            if not isinstance(value, str):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid email for field "
                        f"'{field.label}'"
                    ),
                )

            if not self._is_valid_email(value):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid email for field "
                        f"'{field.label}'"
                    ),
                )

            return

        # --------------------------------------------------------
        # NUMBER
        # --------------------------------------------------------

        if field_type in (
            "number",
            "integer",
            "float",
        ):

            if value is None:
                return

            try:
                float(value)
            except (
                TypeError,
                ValueError,
            ):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid number for field "
                        f"'{field.label}'"
                    ),
                )

            return

        # --------------------------------------------------------
        # BOOLEAN
        # --------------------------------------------------------

        if field_type in (
            "boolean",
            "checkbox",
        ):

            if value is None:
                return

            valid_boolean_values = {
                "true",
                "false",
                "1",
                "0",
                "yes",
                "no",
            }

            if (
                str(value).lower()
                not in valid_boolean_values
            ):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid boolean value for field "
                        f"'{field.label}'"
                    ),
                )

            return

        # --------------------------------------------------------
        # SELECT / DROPDOWN / RADIO
        # --------------------------------------------------------

        if field_type in (
            "select",
            "dropdown",
            "radio",
        ):

            if value is None:
                return

            options = (
                getattr(field, "options", None)
                or []
            )

            valid_values = {
                str(option.value)
                for option in options
                if option.is_active
            }

            if str(value) not in valid_values:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid option '{value}' "
                        f"for field '{field.label}'"
                    ),
                )

            return

        # --------------------------------------------------------
        # MULTI SELECT
        # --------------------------------------------------------

        if field_type in (
            "multiselect",
            "multi_select",
            "checkbox_group",
        ):

            values = value_json

            if values is None and value is not None:
                values = value

            if values is None:
                return

            if not isinstance(values, list):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Multiple values required for field "
                        f"'{field.label}'"
                    ),
                )

            options = (
                getattr(field, "options", None)
                or []
            )

            valid_values = {
                str(option.value)
                for option in options
                if option.is_active
            }

            for item in values:

                if str(item) not in valid_values:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=(
                            f"Invalid option '{item}' "
                            f"for field '{field.label}'"
                        ),
                    )

            return

        # --------------------------------------------------------
        # DATE
        # --------------------------------------------------------

        if field_type == "date":

            if value is None:
                return

            try:
                datetime.strptime(
                    str(value),
                    "%Y-%m-%d",
                )

            except ValueError:

                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Invalid date format for field "
                        f"'{field.label}'. "
                        f"Use YYYY-MM-DD"
                    ),
                )

    # ============================================================
    # EMAIL VALIDATION
    # ============================================================

    def _is_valid_email(
        self,
        email: str,
    ) -> bool:
        pattern = (
            r"^[A-Za-z0-9._%+-]+@"
            r"[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
        )

        return bool(
            re.match(
                pattern,
                email,
            )
        )

    # ============================================================
    # RESPONSE WRAPPER
    # ============================================================

    def _response_to_response(
        self,
        response: FormResponse,
        message: str,
    ):
        return {
            "success": True,
            "message": message,
            "response": self._response_to_dict(
                response
            ),
        }

    # ============================================================
    # RESPONSE SERIALIZATION
    # ============================================================

    def _response_to_dict(
        self,
        response: FormResponse,
    ):
        submitted_by = None

        if response.submitted_by:

            role_data = None

            if response.submitted_by.role:

                role_data = {
                    "id": response.submitted_by.role.id,
                    "name": response.submitted_by.role.name,
                    "description": (
                        response.submitted_by.role.description
                    ),
                    "is_active": (
                        response.submitted_by.role.is_active
                    ),
                }

            submitted_by = {
                "id": response.submitted_by.id,
                "name": response.submitted_by.name,
                "email": response.submitted_by.email,
                "role": role_data,
            }

        form_data = {
            "id": response.form.id,
            "title": response.form.title,
            "description": response.form.description,
            "is_active": response.form.is_active,
        }

        details = []

        for detail in response.details:

            field_data = None

            if detail.field:

                field_data = {
                    "id": detail.field.id,
                    "label": detail.field.label,
                    "name": detail.field.name,
                    "field_type": detail.field.field_type,
                    "is_required": detail.field.is_required,
                }

            details.append(
                {
                    "id": detail.id,
                    "response_id": detail.response_id,
                    "field_id": detail.field_id,
                    "field": field_data,
                    "value": detail.value,
                    "value_json": detail.value_json,
                    "created_at": detail.created_at,
                    "updated_at": detail.updated_at,
                }
            )

        return {
            "id": response.id,
            "form": form_data,
            "submitted_by": submitted_by,
            "submitted_at": response.submitted_at,
            "updated_at": response.updated_at,
            "details": details,
        }