from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings


# ============================================================
# CONFIGURATION
# ============================================================

UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# File types supported by the dynamic form File Upload field.
ALLOWED_FILE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".txt",
}


# ============================================================
# FILE VALIDATION
# ============================================================

def validate_file_extension(filename: str) -> str:
    """
    Validate the uploaded file extension.

    Returns:
        Normalized extension.
    """

    if not filename:
        raise ValueError("File name is required")

    extension = Path(filename).suffix.lower()

    if not extension:
        raise ValueError("File must have an extension")

    if extension not in ALLOWED_FILE_EXTENSIONS:
        raise ValueError(
            f"File type '{extension}' is not allowed"
        )

    return extension


def validate_file_size(file_size: int) -> None:
    """
    Validate file size against the configured maximum.
    """

    if file_size <= 0:
        raise ValueError("Uploaded file is empty")

    if file_size > MAX_FILE_SIZE:
        max_size_mb = MAX_FILE_SIZE // (1024 * 1024)

        raise ValueError(
            f"File size must not exceed {max_size_mb} MB"
        )


# ============================================================
# GENERATE SAFE FILE NAME
# ============================================================

def generate_file_name(
    original_filename: str,
) -> str:
    """
    Generate a unique file name.

    The original file extension is preserved.
    """

    extension = validate_file_extension(
        original_filename
    )

    return f"{uuid4().hex}{extension}"


# ============================================================
# SAVE UPLOADED FILE
# ============================================================

async def save_upload_file(
    file: UploadFile,
) -> dict:
    """
    Validate and save an uploaded file.

    Returns file metadata.
    """

    if not file.filename:
        raise ValueError("File name is required")

    extension = validate_file_extension(
        file.filename
    )

    # Read file contents.
    contents = await file.read()

    # Validate size.
    validate_file_size(len(contents))

    # Generate unique filename.
    stored_filename = (
        f"{uuid4().hex}{extension}"
    )

    file_path = UPLOAD_DIR / stored_filename

    # Save file.
    file_path.write_bytes(contents)

    return {
        "original_filename": file.filename,
        "stored_filename": stored_filename,
        "content_type": file.content_type,
        "size": len(contents),
        "path": str(file_path),
    }


# ============================================================
# DELETE UPLOADED FILE
# ============================================================

def delete_file(
    file_path: str,
) -> bool:
    """
    Delete an uploaded file.

    Returns:
        True if the file was deleted.
        False if the file does not exist.
    """

    path = Path(file_path)

    if not path.exists():
        return False

    if not path.is_file():
        return False

    path.unlink()

    return True


# ============================================================
# CHECK FILE EXISTS
# ============================================================

def file_exists(
    file_path: str,
) -> bool:
    """
    Check whether an uploaded file exists.
    """

    return Path(file_path).is_file()