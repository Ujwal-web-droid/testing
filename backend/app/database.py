"""
WebGuard AI — Async Database Engine & Session Factory
Uses SQLAlchemy 2.0 async with asyncpg driver.
"""

import logging
from typing import Any
from urllib.parse import urlparse
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

logger = logging.getLogger(__name__)

# ─── Sanitized Connection Info Logging ────────────────────────────
def _get_sanitized_db_info(url: str) -> str:
    try:
        parsed = urlparse(url)
        host = parsed.hostname or "unknown"
        port = parsed.port or 5432
        db_name = parsed.path.lstrip("/") or "unknown"
        return f"{parsed.scheme}://***@{host}:{port}/{db_name}"
    except Exception:
        return "postgresql+asyncpg://***"


class Base(DeclarativeBase):
    pass


_engine: Any = None
_session_factory: Any = None


def get_engine() -> AsyncEngine:
    """Get or create the singleton SQLAlchemy async engine."""
    global _engine
    if _engine is None:
        sanitized_url = _get_sanitized_db_info(settings.DATABASE_URL)
        logger.info(f"Configuring async database engine: {sanitized_url}")
        _engine = create_async_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            pool_size=10,
            max_overflow=5,
            pool_pre_ping=True,
        )
    return _engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Get or create the singleton async sessionmaker."""
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
        )
    return _session_factory


class _LazyEngineProxy:
    def __getattr__(self, name: str) -> Any:
        return getattr(get_engine(), name)


class _LazySessionFactoryProxy:
    def __call__(self, *args: Any, **kwargs: Any) -> Any:
        return get_session_factory()(*args, **kwargs)

    def __getattr__(self, name: str) -> Any:
        return getattr(get_session_factory(), name)


# Exported proxies preserving exact backward compatibility for existing imports
engine = _LazyEngineProxy()
async_session_factory = _LazySessionFactoryProxy()


# ─── Dependency ────────────────────────────────────────────────────
async def get_db_session() -> AsyncSession:
    """FastAPI dependency that yields an async DB session."""
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables (development only — use Alembic in production)."""
    eng = get_engine()
    sanitized_url = _get_sanitized_db_info(settings.DATABASE_URL)
    try:
        async with eng.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.error(f"Database connection/initialization error on {sanitized_url}: {e}")
        raise
