"""
Unit tests for Phase 2 Configuration & Railway PostgreSQL compatibility.
"""

import os
import pytest
from app.config import Settings, INSECURE_JWT_SECRETS


def test_database_url_normalization_postgres_prefix():
    """Test postgres:// prefix is normalized to postgresql+asyncpg://"""
    url = "postgres://postgres:mypassword@junction.proxy.rlwy.net:12345/railway"
    normalized = Settings.normalize_database_url(url)
    assert normalized == "postgresql+asyncpg://postgres:mypassword@junction.proxy.rlwy.net:12345/railway"


def test_database_url_normalization_postgresql_prefix():
    """Test standard postgresql:// prefix is normalized to postgresql+asyncpg://"""
    url = "postgresql://postgres:mypassword@junction.proxy.rlwy.net:12345/railway"
    normalized = Settings.normalize_database_url(url)
    assert normalized == "postgresql+asyncpg://postgres:mypassword@junction.proxy.rlwy.net:12345/railway"


def test_database_url_preserves_asyncpg_prefix():
    """Test postgresql+asyncpg:// prefix is preserved untouched"""
    url = "postgresql+asyncpg://postgres:mypassword@junction.proxy.rlwy.net:12345/railway"
    normalized = Settings.normalize_database_url(url)
    assert normalized == url


def test_allowed_origins_comma_separated():
    """Test comma-separated string is parsed to list of clean origins"""
    raw = "https://editcash.site, http://localhost:3000/, https://webguard.ai/"
    parsed = Settings.parse_allowed_origins(raw)
    assert parsed == [
        "https://editcash.site",
        "http://localhost:3000",
        "https://webguard.ai",
    ]


def test_allowed_origins_json_array():
    """Test JSON-formatted array string is parsed cleanly"""
    raw = '["https://editcash.site", "https://api.editcash.site"]'
    parsed = Settings.parse_allowed_origins(raw)
    assert parsed == ["https://editcash.site", "https://api.editcash.site"]


def test_production_fails_on_insecure_jwt_secret():
    """Test that production mode strictly fails if JWT_SECRET_KEY is insecure or missing"""
    for bad_secret in INSECURE_JWT_SECRETS:
        with pytest.raises(ValueError, match="FATAL: In production, JWT_SECRET_KEY must be set"):
            Settings(
                _env_file=None,
                ENVIRONMENT="production",
                JWT_SECRET_KEY=bad_secret,
                DATABASE_URL="postgresql+asyncpg://user:pass@railway.net:5432/db",
            )


def test_production_succeeds_with_strong_jwt_secret():
    """Test production initializes properly with a secure secret"""
    strong_secret = "a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef"
    s = Settings(
        _env_file=None,
        ENVIRONMENT="production",
        JWT_SECRET_KEY=strong_secret,
        DATABASE_URL="postgresql+asyncpg://user:pass@railway.net:5432/db",
        ALLOWED_ORIGINS="https://editcash.site,https://webguard.ai",
    )
    assert s.JWT_SECRET_KEY == strong_secret
    assert s.ALLOWED_ORIGINS == ["https://editcash.site", "https://webguard.ai"]


def test_development_allows_default_secret():
    """Test development mode allows default secret without error"""
    s = Settings(
        _env_file=None,
        ENVIRONMENT="development",
        DEBUG=True,
        DATABASE_URL="postgresql+asyncpg://webguard:webguard@localhost:5432/webguard_db",
    )
    assert s.JWT_SECRET_KEY == "dev-secret-key-do-not-use-in-production"
