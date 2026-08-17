"""
WebGuard AI — Application Configuration
Uses pydantic-settings to load from environment variables / .env file.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ─── Application ───────────────────────────────────────────────
    APP_NAME: str = "WebGuard AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8000"]

    # ─── Database ──────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://webguard:webguard@localhost:5432/webguard_db"

    # ─── JWT Authentication ────────────────────────────────────────
    JWT_SECRET_KEY: str = "CHANGE-ME-in-production-use-openssl-rand-hex-64"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # ─── SMTP (Email Notifications) ────────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "alerts@webguard.ai"
    SMTP_FROM_NAME: str = "WebGuard AI"

    # ─── Twilio (WhatsApp Notifications) ───────────────────────────
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_FROM: str = "whatsapp:+14155238886"

    # ─── Scanner Settings ──────────────────────────────────────────
    SCAN_TIMEOUT_SECONDS: int = 15
    SCAN_MAX_CONCURRENT: int = 5
    SENSITIVE_FILE_PROBE_DELAY_MS: int = 200  # Polite delay between probes

    # ─── Scheduler ─────────────────────────────────────────────────
    SCHEDULER_ENABLED: bool = True
    SCHEDULER_CRON_HOUR: int = 2  # Run daily at 02:00 UTC
    SCHEDULER_CRON_MINUTE: int = 0

    # ─── Trust Seal ────────────────────────────────────────────────
    SEAL_PUBLIC_BASE_URL: str = "http://localhost:3000/seal"


settings = Settings()
