# ============================================================
# USER CONSTANTS
# ============================================================

ROLE_ADMIN = "admin"
ROLE_USER = "user"

ACTIVE_STATUS = "active"
INACTIVE_STATUS = "inactive"


# ============================================================
# FORM CONSTANTS
# ============================================================

FORM_ACTIVE = True
FORM_INACTIVE = False


# ============================================================
# FORM FIELD TYPES
# ============================================================

FIELD_TYPE_TEXT = "text"
FIELD_TYPE_NUMBER = "number"
FIELD_TYPE_EMAIL = "email"
FIELD_TYPE_DATE = "date"
FIELD_TYPE_DROPDOWN = "dropdown"
FIELD_TYPE_CHECKBOX = "checkbox"
FIELD_TYPE_RADIO = "radio"
FIELD_TYPE_FILE = "file"
FIELD_TYPE_RATING = "rating"


ALLOWED_FIELD_TYPES = {
    FIELD_TYPE_TEXT,
    FIELD_TYPE_NUMBER,
    FIELD_TYPE_EMAIL,
    FIELD_TYPE_DATE,
    FIELD_TYPE_DROPDOWN,
    FIELD_TYPE_CHECKBOX,
    FIELD_TYPE_RADIO,
    FIELD_TYPE_FILE,
    FIELD_TYPE_RATING,
}


# ============================================================
# FIELD TYPES THAT SUPPORT OPTIONS
# ============================================================

OPTION_FIELD_TYPES = {
    FIELD_TYPE_DROPDOWN,
    FIELD_TYPE_CHECKBOX,
    FIELD_TYPE_RADIO,
}


# ============================================================
# VALIDATION RULE TYPES
# ============================================================

VALIDATION_MIN_LENGTH = "min_length"
VALIDATION_MAX_LENGTH = "max_length"
VALIDATION_MIN_VALUE = "min_value"
VALIDATION_MAX_VALUE = "max_value"
VALIDATION_PATTERN = "pattern"


ALLOWED_VALIDATION_RULES = {
    VALIDATION_MIN_LENGTH,
    VALIDATION_MAX_LENGTH,
    VALIDATION_MIN_VALUE,
    VALIDATION_MAX_VALUE,
    VALIDATION_PATTERN,
}


# ============================================================
# CONDITIONAL LOGIC OPERATORS
# ============================================================

CONDITION_EQUALS = "equals"
CONDITION_NOT_EQUALS = "not_equals"
CONDITION_CONTAINS = "contains"
CONDITION_NOT_CONTAINS = "not_contains"
CONDITION_GREATER_THAN = "greater_than"
CONDITION_LESS_THAN = "less_than"
CONDITION_GREATER_THAN_OR_EQUAL = "greater_than_or_equal"
CONDITION_LESS_THAN_OR_EQUAL = "less_than_or_equal"


ALLOWED_CONDITION_OPERATORS = {
    CONDITION_EQUALS,
    CONDITION_NOT_EQUALS,
    CONDITION_CONTAINS,
    CONDITION_NOT_CONTAINS,
    CONDITION_GREATER_THAN,
    CONDITION_LESS_THAN,
    CONDITION_GREATER_THAN_OR_EQUAL,
    CONDITION_LESS_THAN_OR_EQUAL,
}


# ============================================================
# ACTIVITY LOG ACTIONS
# ============================================================

ACTION_CREATE = "CREATE"
ACTION_UPDATE = "UPDATE"
ACTION_DELETE = "DELETE"
ACTION_ENABLE = "ENABLE"
ACTION_DISABLE = "DISABLE"
ACTION_LOGIN = "LOGIN"
ACTION_LOGOUT = "LOGOUT"
ACTION_SUBMIT = "SUBMIT"
ACTION_EXPORT = "EXPORT"
ACTION_VIEW = "VIEW"


ALLOWED_ACTIVITY_ACTIONS = {
    ACTION_CREATE,
    ACTION_UPDATE,
    ACTION_DELETE,
    ACTION_ENABLE,
    ACTION_DISABLE,
    ACTION_LOGIN,
    ACTION_LOGOUT,
    ACTION_SUBMIT,
    ACTION_EXPORT,
    ACTION_VIEW,
}


# ============================================================
# ACTIVITY LOG ENTITY TYPES
# ============================================================

ENTITY_USER = "USER"
ENTITY_ROLE = "ROLE"
ENTITY_FORM = "FORM"
ENTITY_FORM_FIELD = "FORM_FIELD"
ENTITY_FIELD_OPTION = "FIELD_OPTION"
ENTITY_RESPONSE = "RESPONSE"
ENTITY_REPORT = "REPORT"


ALLOWED_ENTITY_TYPES = {
    ENTITY_USER,
    ENTITY_ROLE,
    ENTITY_FORM,
    ENTITY_FORM_FIELD,
    ENTITY_FIELD_OPTION,
    ENTITY_RESPONSE,
    ENTITY_REPORT,
}


# ============================================================
# REPORT CONSTANTS
# ============================================================

REPORT_TYPE_EXCEL = "excel"
REPORT_TYPE_PDF = "pdf"

ALLOWED_REPORT_TYPES = {
    REPORT_TYPE_EXCEL,
    REPORT_TYPE_PDF,
}


# ============================================================
# FILE CONSTANTS
# ============================================================

FILE_EXTENSION_XLSX = ".xlsx"
FILE_EXTENSION_PDF = ".pdf"

MAX_REPORT_ROWS = 100000


# ============================================================
# PAGINATION CONSTANTS
# ============================================================

DEFAULT_SKIP = 0
DEFAULT_LIMIT = 100
MAX_LIMIT = 1000


# ============================================================
# RESPONSE CONSTANTS
# ============================================================

RESPONSE_SUCCESS = True
RESPONSE_FAILURE = False


# ============================================================
# GENERAL MESSAGES
# ============================================================

MSG_SUCCESS = "Operation completed successfully"
MSG_NOT_FOUND = "Resource not found"
MSG_CREATED = "Resource created successfully"
MSG_UPDATED = "Resource updated successfully"
MSG_DELETED = "Resource deleted successfully"


# ============================================================
# AUTHENTICATION MESSAGES
# ============================================================

MSG_LOGIN_SUCCESS = "Login successful"
MSG_LOGOUT_SUCCESS = "Logout successful"
MSG_INVALID_CREDENTIALS = "Invalid email or password"
MSG_ACCOUNT_INACTIVE = "User account is inactive"


# ============================================================
# FORM MESSAGES
# ============================================================

MSG_FORM_CREATED = "Form created successfully"
MSG_FORM_UPDATED = "Form updated successfully"
MSG_FORM_DELETED = "Form deleted successfully"
MSG_FORM_ENABLED = "Form enabled successfully"
MSG_FORM_DISABLED = "Form disabled successfully"
MSG_FORM_NOT_FOUND = "Form not found"


# ============================================================
# FIELD MESSAGES
# ============================================================

MSG_FIELD_CREATED = "Form field created successfully"
MSG_FIELD_UPDATED = "Form field updated successfully"
MSG_FIELD_DELETED = "Form field deleted successfully"
MSG_FIELD_NOT_FOUND = "Form field not found"
MSG_INVALID_FIELD_TYPE = "Invalid field type"


# ============================================================
# OPTION MESSAGES
# ============================================================

MSG_OPTION_CREATED = "Field option created successfully"
MSG_OPTION_UPDATED = "Field option updated successfully"
MSG_OPTION_DELETED = "Field option deleted successfully"
MSG_OPTION_NOT_FOUND = "Field option not found"


# ============================================================
# RESPONSE MESSAGES
# ============================================================

MSG_RESPONSE_CREATED = "Form response submitted successfully"
MSG_RESPONSE_UPDATED = "Form response updated successfully"
MSG_RESPONSE_DELETED = "Form response deleted successfully"
MSG_RESPONSE_NOT_FOUND = "Form response not found"


# ============================================================
# REPORT MESSAGES
# ============================================================

MSG_REPORT_GENERATED = "Report generated successfully"
MSG_REPORT_EXPORT_QUEUED = "Report export queued successfully"
MSG_EXCEL_EXPORT_QUEUED = "Excel export queued successfully"
MSG_PDF_EXPORT_QUEUED = "PDF export queued successfully"


# ============================================================
# ACTIVITY LOG MESSAGES
# ============================================================

MSG_ACTIVITY_LOG_RETRIEVED = "Activity logs retrieved successfully"
MSG_ACTIVITY_LOG_NOT_FOUND = "Activity log not found"