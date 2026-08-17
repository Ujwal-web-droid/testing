"""
Comprehensive validation for Railway environment configuration & FastAPI engine initialization.
"""

import os
import pytest
from unittest.mock import patch
from app.config import Settings
from app.database import _get_sanitized_db_info


def test_railway_full_environment_simulation():
    """Simulate exact Railway environment variables injected during deployment"""
    railway_env = {
        "RAILWAY_ENVIRONMENT": "production",
        "ENVIRONMENT": "production",
        "PORT": "8080",
        "DATABASE_URL": "postgresql://postgres:randomPassword123@junction.proxy.rlwy.net:45678/railway",
        "JWT_SECRET_KEY": "f9e8d7c6b5a43210f9e8d7c6b5a43210f9e8d7c6b5a43210f9e8d7c6b5a43210",
        "ALLOWED_ORIGINS": "https://editcash.site,https://webguard.ai",
        "RAILWAY_PROJECT_ID": "a3861797-a8e4-4570-b2a4-ebb2b739dbaa",
        "RAILWAY_SERVICE_ID": "9c9d2485-9874-4b8c-8e91-9a96358a9fa2",
    }

    with patch.dict(os.environ, railway_env, clear=False):
        settings = Settings(_env_file=None)
        
        # 1. Verify DATABASE_URL normalization
        assert settings.DATABASE_URL == "postgresql+asyncpg://postgres:randomPassword123@junction.proxy.rlwy.net:45678/railway"
        
        # 2. Verify JWT_SECRET_KEY is loaded and not placeholder
        assert settings.JWT_SECRET_KEY == "f9e8d7c6b5a43210f9e8d7c6b5a43210f9e8d7c6b5a43210f9e8d7c6b5a43210"
        
        # 3. Verify ALLOWED_ORIGINS parsed as list
        assert settings.ALLOWED_ORIGINS == ["https://editcash.site", "https://webguard.ai"]
        
        # 4. Verify PORT is parsed
        assert settings.PORT == 8080


def test_database_url_sanitization():
    """Verify passwords are redacted in logs"""
    url = "postgresql+asyncpg://postgres:superSecretPassword@junction.proxy.rlwy.net:5432/railway"
    sanitized = _get_sanitized_db_info(url)
    assert "superSecretPassword" not in sanitized
    assert "***" in sanitized
    assert "junction.proxy.rlwy.net" in sanitized
    assert "railway" in sanitized


def test_railway_production_fails_without_jwt_secret():
    """Verify Railway production fails early if user forgets to set JWT_SECRET_KEY in Railway dashboard"""
    railway_env = {
        "RAILWAY_ENVIRONMENT": "production",
        "DATABASE_URL": "postgresql://postgres:pass@junction.proxy.rlwy.net:5432/railway",
        "JWT_SECRET_KEY": "",  # Missing secret
    }

    with patch.dict(os.environ, railway_env, clear=False):
        with pytest.raises(ValueError, match="FATAL: In production, JWT_SECRET_KEY must be set"):
            Settings(_env_file=None)
