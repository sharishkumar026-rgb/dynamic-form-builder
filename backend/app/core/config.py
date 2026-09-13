from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ---------------------------------------------------------
    # Application
    # ---------------------------------------------------------
    APP_NAME: str = "Dynamic Form Builder"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # ---------------------------------------------------------
    # API
    # ---------------------------------------------------------
    API_PREFIX: str = "/api"

    # ---------------------------------------------------------
    # Database - MySQL
    # ---------------------------------------------------------
    DATABASE_URL: str

    # ---------------------------------------------------------
    # JWT Authentication
    # ---------------------------------------------------------
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ---------------------------------------------------------
    # Redis
    # ---------------------------------------------------------
    REDIS_URL: str = "redis://redis:6379/0"

    # ---------------------------------------------------------
    # Celery
    # ---------------------------------------------------------
    CELERY_BROKER_URL: str = "redis://redis:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/2"

    # ---------------------------------------------------------
    # File Upload
    # ---------------------------------------------------------
    UPLOAD_DIR: str = "uploads"

    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB

    # ---------------------------------------------------------
    # CORS
    # ---------------------------------------------------------
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()