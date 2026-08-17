"""
WebGuard AI — Application Configuration
Robust environment configuration for local development and Railway production.
"""

import json
import logging
import os
from typing import Any, List, Optional, Union
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

INSECURE_JWT_SECRETS = {
    "CHANGE-ME-in-production-use-openssl-rand-hex-64",
    "change-this-to-a-strong-random-secret-in-production",
    "secret",
    "changeme",
    "jwt_secret",
    "",
}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Ignore unmodeled Railway environment variables
    )

    # ─── Application & Environment ────────────────────────────────
    APP_NAME: str = "WebGuard AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # 'development', 'staging', 'production'
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    PORT: int = 8000

    # ─── CORS ─────────────────────────────────────────────────────
    # Union[str, List[str]] prevents Pydantic Settings from crashing on comma-separated env values
    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
    ]

    # ─── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://webguard:webguard@localhost:5432/webguard_db"

    # ─── JWT Authentication ───────────────────────────────────────
    JWT_SECRET_KEY: str = "dev-secret-key-do-not-use-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # ─── SMTP (Email Notifications) ───────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "alerts@webguard.ai"
    SMTP_FROM_NAME: str = "WebGuard AI"

    # ─── Twilio (WhatsApp Notifications) ──────────────────────────
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_FROM: str = "whatsapp:+14155238886"

    # ─── Scanner Settings ─────────────────────────────────────────
    SCAN_TIMEOUT_SECONDS: int = 15
    SCAN_MAX_CONCURRENT: int = 5
    SENSITIVE_FILE_PROBE_DELAY_MS: int = 200

    # ─── Scheduler ────────────────────────────────────────────────
    SCHEDULER_ENABLED: bool = True
    SCHEDULER_CRON_HOUR: int = 2
    SCHEDULER_CRON_MINUTE: int = 0

    # ─── Trust Seal ───────────────────────────────────────────────
    SEAL_PUBLIC_BASE_URL: str = "http://localhost:3000/seal"

    # ─── Validators ───────────────────────────────────────────────

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, v: Any) -> str:
        """
        Normalize standard PostgreSQL URLs (e.g. from Railway postgresql:// or postgres://)
        to the postgresql+asyncpg:// scheme required by the async engine.
        """
        if not v or not isinstance(v, str):
            return "postgresql+asyncpg://webguard:webguard@localhost:5432/webguard_db"
        
        url = v.strip()
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            
        return url

    @field_validator("ALLOWED_ORIGINS", mode="after")
    @classmethod
    def parse_allowed_origins(cls, v: Any) -> List[str]:
        """
        Parse comma-separated strings, JSON arrays, or lists into a clean list of origins.
        """
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(o).strip().rstrip("/") for o in parsed if str(o).strip()]
                except Exception:
                    pass
            return [o.strip().rstrip("/") for o in v.split(",") if o.strip()]
        elif isinstance(v, (list, tuple, set)):
            return [str(o).strip().rstrip("/") for o in v if str(o).strip()]
        return ["http://localhost:3000", "http://localhost:8000"]

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """
        Validate critical security settings in production environments.
        """
        is_production = (
            self.ENVIRONMENT.lower() in ("production", "prod")
            or os.getenv("RAILWAY_ENVIRONMENT") is not None
            or (not self.DEBUG and self.ENVIRONMENT.lower() != "development")
        )

        if is_production:
            if not self.JWT_SECRET_KEY or self.JWT_SECRET_KEY in INSECURE_JWT_SECRETS:
                raise ValueError(
                    "FATAL: In production, JWT_SECRET_KEY must be set to a secure secret. "
                    "Set JWT_SECRET_KEY environment variable in Railway service settings."
                )

            if "localhost" in self.DATABASE_URL or "127.0.0.1" in self.DATABASE_URL:
                logger.warning(
                    "DATABASE_URL appears to reference localhost in a production environment. "
                    "Ensure Railway PostgreSQL plugin is connected."
                )
        
        return self


settings = Settings()
