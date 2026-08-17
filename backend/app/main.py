"""
WebGuard AI — FastAPI Application Entry Point.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.workers.scheduler import start_scheduler, stop_scheduler

# ─── Import Routers ──────────────────────────────────────────────
from app.api.auth import router as auth_router
from app.api.websites import router as websites_router
from app.api.scans import router as scans_router
from app.api.seal import router as seal_router
from app.api.subscriptions import router as subscriptions_router

# ─── Logging ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ─── Lifespan (startup/shutdown) ─────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — init DB and scheduler on startup, cleanup on shutdown."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Initialize database tables (dev mode — use Alembic in prod)
    await init_db()
    logger.info("Database initialized")

    # Start background scheduler
    start_scheduler()

    yield

    # Shutdown
    stop_scheduler()
    logger.info("Application shutdown complete")


# ─── FastAPI App ─────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Automated Website Compliance, Header Hardening, and Trust Seal Platform. "
        "Lightning-fast, API-driven security auditor for e-commerce stores and agencies."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── CORS Middleware ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Mount Routers ───────────────────────────────────────────────
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(websites_router, prefix=settings.API_V1_PREFIX)
app.include_router(scans_router, prefix=settings.API_V1_PREFIX)
app.include_router(seal_router, prefix=settings.API_V1_PREFIX)
app.include_router(subscriptions_router, prefix=settings.API_V1_PREFIX)


# ─── Health Check ────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


# ─── Root Redirect ──────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/health",
    }
