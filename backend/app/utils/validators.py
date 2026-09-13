from datetime import date, datetime
import re
from typing import Any

from app.utils.constants import (
    ALLOWED_FIELD_TYPES,
    OPTION_FIELD_TYPES,
    VALIDATION_MIN_LENGTH,
    VALIDATION_MAX_LENGTH,
    VALIDATION_MIN_VALUE,
    VALIDATION_MAX_VALUE,
    VALIDATION_PATTERN,
    CONDITION_EQUALS,
    CONDITION_NOT_EQUALS,
    CONDITION_CONTAINS,
    CONDITION_NOT_CONTAINS,
    CONDITION_GREATER_THAN,
    CONDITION_LESS_THAN,
    CONDITION_GREATER_THAN_OR_EQUAL,
    CONDITION_LESS_THAN_OR_EQUAL,
)


# ============================================================
# GENERAL HELPERS
# ============================================================

def is_empty(value: Any) -> bool:
    """
    Check whether a submitted value is empty.
    """

    if value is None:
        return True

    if isinstance(value, str) and not value.strip():
        return True

    if isinstance(value, list) and len(value) == 0:
        return True

    return False


def validate_field_type(field_type: str) -> None:
    """
    Validate whether the field type is supported.
    """

    if field_type not in ALLOWED_FIELD_TYPES:
        raise ValueError(
            f"Unsupported field type: {field_type}"
        )


# ============================================================
# REQUIRED FIELD VALIDATION
# ============================================================

def validate_required(
    value: Any,
    is_required: bool,
    field_label: str,
) -> None:
    """
    Validate required fields.
    """

    if is_required and is_empty(value):
        raise ValueError(
            f"{field_label} is required"
        )


# ============================================================
# TEXT VALIDATION
# ============================================================

def validate_text(
    value: Any,
    field_label: str,
) -> str:
    """
    Validate text field values.
    """

    if not isinstance(value, str):
        raise ValueError(
            f"{field_label} must be a text value"
        )

    return value


# ============================================================
# NUMBER VALIDATION
# ============================================================

def validate_number(
    value: Any,
    field_label: str,
) -> int | float:
    """
    Validate number field values.
    """

    if isinstance(value, bool):
        raise ValueError(
            f"{field_label} must be a number"
        )

    if isinstance(value, (int, float)):
        return value

    try:
        number = float(value)

        if number.is_integer():
            return int(number)

        return number

    except (TypeError, ValueError):
        raise ValueError(
            f"{field_label} must be a valid number"
        )


# ============================================================
# EMAIL VALIDATION
# ============================================================

def validate_email(
    value: Any,
    field_label: str,
) -> str:
    """
    Validate email field values.
    """

    if not isinstance(value, str):
        raise ValueError(
            f"{field_label} must be a valid email address"
        )

    email = value.strip()

    pattern = (
        r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+"
        r"@[A-Za-z0-9-]+"
        r"(?:\.[A-Za-z0-9-]+)+$"
    )

    if not re.match(pattern, email):
        raise ValueError(
            f"{field_label} must be a valid email address"
        )

    return email


# ============================================================
# DATE VALIDATION
# ============================================================

def validate_date(
    value: Any,
    field_label: str,
) -> str:
    """
    Validate date field values.

    Expected format:
        YYYY-MM-DD
    """

    if not isinstance(value, str):
        raise ValueError(
            f"{field_label} must be a valid date"
        )

    try:
        datetime.strptime(
            value,
            "%Y-%m-%d",
        )

    except ValueError:
        raise ValueError(
            f"{field_label} must use YYYY-MM-DD format"
        )

    return value


# ============================================================
# DROPDOWN / RADIO VALIDATION
# ============================================================

def validate_single_option(
    value: Any,
    allowed_values: set[str],
    field_label: str,
) -> str:
    """
    Validate dropdown/radio value.
    """

    if not isinstance(value, str):
        raise ValueError(
            f"{field_label} must contain a valid option"
        )

    if value not in allowed_values:
        raise ValueError(
            f"Invalid option selected for {field_label}"
        )

    return value


# ============================================================
# CHECKBOX VALIDATION
# ============================================================

def validate_checkbox(
    value: Any,
    allowed_values: set[str],
    field_label: str,
) -> list[str]:
    """
    Validate checkbox values.

    Checkbox submissions must be a list.
    """

    if not isinstance(value, list):
        raise ValueError(
            f"{field_label} must contain a list of options"
        )

    for item in value:
        if not isinstance(item, str):
            raise ValueError(
                f"Invalid checkbox value for {field_label}"
            )

        if item not in allowed_values:
            raise ValueError(
                f"Invalid option selected for {field_label}: {item}"
            )

    return value


# ============================================================
# RATING VALIDATION
# ============================================================

def validate_rating(
    value: Any,
    field_label: str,
) -> int | float:
    """
    Validate rating values.

    Rating range:
        1 - 5
    """

    number = validate_number(
        value=value,
        field_label=field_label,
    )

    if number < 1 or number > 5:
        raise ValueError(
            f"{field_label} rating must be between 1 and 5"
        )

    return number


# ============================================================
# FILE VALIDATION
# ============================================================

def validate_file(
    value: Any,
    field_label: str,
) -> Any:
    """
    Validate file submission.

    Actual file-size and extension checks should be
    handled by file_handler.py.
    """

    if is_empty(value):
        raise ValueError(
            f"{field_label} file is required"
        )

    return value


# ============================================================
# VALIDATION RULES
# ============================================================

def validate_rules(
    value: Any,
    validation_rules: dict[str, Any] | None,
    field_label: str,
) -> None:
    """
    Apply configurable validation rules to a field value.

    Supported rules:
        min_length
        max_length
        min_value
        max_value
        pattern
    """

    if not validation_rules or is_empty(value):
        return

    # --------------------------------------------------------
    # Minimum length
    # --------------------------------------------------------

    if VALIDATION_MIN_LENGTH in validation_rules:
        min_length = validation_rules[
            VALIDATION_MIN_LENGTH
        ]

        if not isinstance(value, (str, list)):
            raise ValueError(
                f"{field_label} does not support min_length"
            )

        if len(value) < min_length:
            raise ValueError(
                f"{field_label} must contain at least "
                f"{min_length} characters/items"
            )

    # --------------------------------------------------------
    # Maximum length
    # --------------------------------------------------------

    if VALIDATION_MAX_LENGTH in validation_rules:
        max_length = validation_rules[
            VALIDATION_MAX_LENGTH
        ]

        if not isinstance(value, (str, list)):
            raise ValueError(
                f"{field_label} does not support max_length"
            )

        if len(value) > max_length:
            raise ValueError(
                f"{field_label} must contain at most "
                f"{max_length} characters/items"
            )

    # --------------------------------------------------------
    # Minimum value
    # --------------------------------------------------------

    if VALIDATION_MIN_VALUE in validation_rules:
        min_value = validation_rules[
            VALIDATION_MIN_VALUE
        ]

        try:
            if float(value) < float(min_value):
                raise ValueError(
                    f"{field_label} must be at least "
                    f"{min_value}"
                )

        except (TypeError, ValueError):
            raise ValueError(
                f"{field_label} must be a valid numeric value"
            )

    # --------------------------------------------------------
    # Maximum value
    # --------------------------------------------------------

    if VALIDATION_MAX_VALUE in validation_rules:
        max_value = validation_rules[
            VALIDATION_MAX_VALUE
        ]

        try:
            if float(value) > float(max_value):
                raise ValueError(
                    f"{field_label} must be at most "
                    f"{max_value}"
                )

        except (TypeError, ValueError):
            raise ValueError(
                f"{field_label} must be a valid numeric value"
            )

    # --------------------------------------------------------
    # Regex pattern
    # --------------------------------------------------------

    if VALIDATION_PATTERN in validation_rules:
        pattern = validation_rules[
            VALIDATION_PATTERN
        ]

        if not isinstance(value, str):
            raise ValueError(
                f"{field_label} must be text for pattern validation"
            )

        try:
            matched = re.fullmatch(
                pattern,
                value,
            )

        except re.error:
            raise ValueError(
                f"Invalid validation pattern for {field_label}"
            )

        if not matched:
            raise ValueError(
                f"{field_label} does not match the required pattern"
            )


# ============================================================
# CONDITIONAL LOGIC
# ============================================================

def evaluate_condition(
    actual_value: Any,
    operator: str,
    expected_value: Any,
) -> bool:
    """
    Evaluate one conditional visibility rule.
    """

    if operator == CONDITION_EQUALS:
        return actual_value == expected_value

    if operator == CONDITION_NOT_EQUALS:
        return actual_value != expected_value

    if operator == CONDITION_CONTAINS:
        if isinstance(actual_value, list):
            return expected_value in actual_value

        return (
            str(expected_value).lower()
            in str(actual_value).lower()
        )

    if operator == CONDITION_NOT_CONTAINS:
        if isinstance(actual_value, list):
            return expected_value not in actual_value

        return (
            str(expected_value).lower()
            not in str(actual_value).lower()
        )

    if operator == CONDITION_GREATER_THAN:
        return actual_value > expected_value

    if operator == CONDITION_LESS_THAN:
        return actual_value < expected_value

    if operator == CONDITION_GREATER_THAN_OR_EQUAL:
        return actual_value >= expected_value

    if operator == CONDITION_LESS_THAN_OR_EQUAL:
        return actual_value <= expected_value

    raise ValueError(
        f"Unsupported conditional operator: {operator}"
    )


def evaluate_conditional_logic(
    conditional_logic: dict[str, Any] | None,
    submitted_values: dict[int, Any],
) -> bool:
    """
    Determine whether a field should be visible.

    Expected structure:

    {
        "field_id": 1,
        "operator": "equals",
        "value": "yes"
    }

    Multiple conditions can be supplied as:

    {
        "conditions": [
            {
                "field_id": 1,
                "operator": "equals",
                "value": "yes"
            },
            {
                "field_id": 2,
                "operator": "greater_than",
                "value": 18
            }
        ],
        "logic": "AND"
    }
    """

    if not conditional_logic:
        return True

    # --------------------------------------------------------
    # Single condition
    # --------------------------------------------------------

    if "field_id" in conditional_logic:
        field_id = conditional_logic.get("field_id")
        operator = conditional_logic.get("operator")
        expected_value = conditional_logic.get("value")

        actual_value = submitted_values.get(field_id)

        return evaluate_condition(
            actual_value=actual_value,
            operator=operator,
            expected_value=expected_value,
        )

    # --------------------------------------------------------
    # Multiple conditions
    # --------------------------------------------------------

    conditions = conditional_logic.get(
        "conditions",
        [],
    )

    if not conditions:
        return True

    logic = str(
        conditional_logic.get("logic", "AND")
    ).upper()

    results = []

    for condition in conditions:
        field_id = condition.get("field_id")
        operator = condition.get("operator")
        expected_value = condition.get("value")

        actual_value = submitted_values.get(field_id)

        results.append(
            evaluate_condition(
                actual_value=actual_value,
                operator=operator,
                expected_value=expected_value,
            )
        )

    if logic == "OR":
        return any(results)

    return all(results)


# ============================================================
# COMPLETE FIELD VALUE VALIDATION
# ============================================================

def validate_field_value(
    field_type: str,
    value: Any,
    field_label: str,
    is_required: bool = False,
    validation_rules: dict[str, Any] | None = None,
    allowed_values: set[str] | None = None,
) -> Any:
    """
    Validate a field value according to its dynamic field type.
    """

    validate_field_type(field_type)

    validate_required(
        value=value,
        is_required=is_required,
        field_label=field_label,
    )

    # Optional field with no value
    if is_empty(value):
        return value

    allowed_values = allowed_values or set()

    # --------------------------------------------------------
    # Text
    # --------------------------------------------------------

    if field_type == "text":
        validated_value = validate_text(
            value,
            field_label,
        )

    # --------------------------------------------------------
    # Number
    # --------------------------------------------------------

    elif field_type == "number":
        validated_value = validate_number(
            value,
            field_label,
        )

    # --------------------------------------------------------
    # Email
    # --------------------------------------------------------

    elif field_type == "email":
        validated_value = validate_email(
            value,
            field_label,
        )

    # --------------------------------------------------------
    # Date
    # --------------------------------------------------------

    elif field_type == "date":
        validated_value = validate_date(
            value,
            field_label,
        )

    # --------------------------------------------------------
    # Dropdown / Radio
    # --------------------------------------------------------

    elif field_type in {
        "dropdown",
        "radio",
    }:
        validated_value = validate_single_option(
            value=value,
            allowed_values=allowed_values,
            field_label=field_label,
        )

    # --------------------------------------------------------
    # Checkbox
    # --------------------------------------------------------

    elif field_type == "checkbox":
        validated_value = validate_checkbox(
            value=value,
            allowed_values=allowed_values,
            field_label=field_label,
        )

    # --------------------------------------------------------
    # Rating
    # --------------------------------------------------------

    elif field_type == "rating":
        validated_value = validate_rating(
            value=value,
            field_label=field_label,
        )

    # --------------------------------------------------------
    # File
    # --------------------------------------------------------

    elif field_type == "file":
        validated_value = validate_file(
            value=value,
            field_label=field_label,
        )

    else:
        raise ValueError(
            f"Unsupported field type: {field_type}"
        )

    # Apply configurable validation rules
    validate_rules(
        value=validated_value,
        validation_rules=validation_rules,
        field_label=field_label,
    )

    return validated_value