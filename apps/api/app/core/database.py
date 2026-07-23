from sqlalchemy import MetaData, func
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID, JSONB

from app.core.config import get_settings

settings = get_settings()

# SQLite dialect compilation overrides for Postgres-specific types
@compiles(PostgresUUID, "sqlite")
def compile_uuid_sqlite(element, compiler, **kw):
    return "VARCHAR(36)"

@compiles(JSONB, "sqlite")
def compile_jsonb_sqlite(element, compiler, **kw):
    return "JSON"

@compiles(func.uuid_generate_v4, "sqlite")
def compile_uuid_generate_sqlite(element, compiler, **kw):
    return "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr(lower(hex(randomblob(2))),1,1) || substr('89ab',random() % 4 + 1,1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"

# Naming convention for constraints
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=convention)


class Base(DeclarativeBase):
    """Base model for all database models."""

    metadata = metadata

    # Audit columns
    __mapper_args__ = {"eager_defaults": True}


# Async engine
engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
)

# Session factory
async_session_factory = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_db() -> AsyncSession:
    """Get database session."""
    async with async_session_factory() as session:
        yield session


async def init_db() -> None:
    """Initialize database connection."""
    async with engine.connect() as conn:
        await conn.run_sync(metadata.create_all)


async def close_db() -> None:
    """Close database connection."""
    await engine.dispose()