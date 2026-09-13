from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


# ============================================================
# Database Engine
# ============================================================

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG,
)


# ============================================================
# Database Session
# ============================================================

SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ============================================================
# SQLAlchemy Base
# ============================================================

class Base(DeclarativeBase):
    pass


# ============================================================
# FastAPI Database Dependency
# ============================================================

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()