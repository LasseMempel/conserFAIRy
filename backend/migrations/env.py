import asyncio
import os
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Import your models so Alembic can detect schema changes
from app.db import Base  # noqa: F401 - must be imported for autogenerate
import app.db  # noqa: F401 - ensures all models are registered on Base.metadata

# Alembic Config object
config = context.config

# Set up loggers from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Point Alembic at your models for autogenerate support
target_metadata = Base.metadata

# ---------------------------------------------------------------------------
# Read DATABASE_URL from environment
# Offline mode needs a sync URL, online mode needs the async URL
# ---------------------------------------------------------------------------
def get_async_url() -> str:
    """Return the async URL as-is (e.g. sqlite+aiosqlite:///)."""
    return os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./development.db")


def get_sync_url() -> str:
    """Return a sync URL for offline mode (strips async driver prefix)."""
    url = get_async_url()
    return url.replace("sqlite+aiosqlite", "sqlite").replace("postgresql+asyncpg", "postgresql")


def run_migrations_offline() -> None:
    """Run migrations without a live DB connection (generates SQL to stdout)."""
    context.configure(
        url=get_sync_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations against the live database using an async engine."""
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_async_url()  # async URL for the async engine

    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in online mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()