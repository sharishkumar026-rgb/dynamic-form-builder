from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import settings
from app.core.database import Base

# Import all models so SQLAlchemy adds them to Base.metadata
from app.models.user import User
from app.models.role import Role
from app.models.form import Form
from app.models.form_field import FormField
from app.models.field_option import FieldOption
from app.models.form_response import FormResponse
from app.models.response_detail import ResponseDetail
from app.models.activity_log import ActivityLog


# Alembic Config object
config = context.config


# Configure Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# SQLAlchemy metadata used by Alembic
target_metadata = Base.metadata


# Use DATABASE_URL from application settings
# Replace % with %% because Alembic ConfigParser treats % specially.
config.set_main_option(
    "sqlalchemy.url",
    settings.DATABASE_URL.replace("%", "%%"),
)


def run_migrations_offline() -> None:
    """
    Run migrations in offline mode.

    This generates SQL without creating a database connection.
    """

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in online mode.

    This connects directly to the MySQL database
    and applies the migration.
    """

    configuration = config.get_section(
        config.config_ini_section,
        {},
    )

    configuration["sqlalchemy.url"] = settings.DATABASE_URL

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# Decide which migration mode to use
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()