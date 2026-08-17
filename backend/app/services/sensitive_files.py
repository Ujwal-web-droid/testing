"""
Sensitive File Exposure Detector.
Probes known dangerous file paths using HEAD requests.
Uses polite delays and stealth headers to avoid WAF blocks.
"""

import asyncio
import logging
from typing import Optional

from app.config import settings
from app.utils.http_client import create_stealth_client

logger = logging.getLogger(__name__)


# ─── Sensitive Files to Probe ─────────────────────────────────────
# Each entry: (path, description, severity)
SENSITIVE_FILES = [
    {
        "path": "/.env",
        "description": "Environment variables file — may contain API keys, database credentials, and secrets",
        "severity": "critical",
    },
    {
        "path": "/.git/config",
        "description": "Git configuration — exposes repository structure and possibly remote URLs with tokens",
        "severity": "critical",
    },
    {
        "path": "/.git/HEAD",
        "description": "Git HEAD reference — confirms .git directory is publicly accessible",
        "severity": "critical",
    },
    {
        "path": "/wp-config.php.bak",
        "description": "WordPress config backup — contains database credentials in plain text",
        "severity": "critical",
    },
    {
        "path": "/wp-config.php~",
        "description": "WordPress config editor backup — contains database credentials",
        "severity": "critical",
    },
    {
        "path": "/.DS_Store",
        "description": "macOS directory metadata — reveals file/folder structure of the server",
        "severity": "medium",
    },
    {
        "path": "/phpinfo.php",
        "description": "PHP info page — exposes server configuration, extensions, and environment variables",
        "severity": "high",
    },
    {
        "path": "/server-status",
        "description": "Apache server status — exposes active connections, request details, and server uptime",
        "severity": "high",
    },
    {
        "path": "/elmah.axd",
        "description": "ELMAH error log — exposes .NET application errors with stack traces",
        "severity": "high",
    },
    {
        "path": "/.htpasswd",
        "description": "Apache password file — contains hashed credentials for protected directories",
        "severity": "critical",
    },
    {
        "path": "/crossdomain.xml",
        "description": "Flash cross-domain policy — may allow unauthorized cross-origin access",
        "severity": "low",
    },
    {
        "path": "/robots.txt",
        "description": "Robots file — while public by design, may reveal hidden admin paths",
        "severity": "info",
    },
    {
        "path": "/.well-known/security.txt",
        "description": "Security contact info — good practice, not a vulnerability",
        "severity": "info",
    },
    {
        "path": "/backup.sql",
        "description": "SQL database dump — may contain entire database with user data",
        "severity": "critical",
    },
    {
        "path": "/database.sql",
        "description": "SQL database dump — may contain entire database with user data",
        "severity": "critical",
    },
]

# Points deducted per exposed file by severity
SEVERITY_PENALTY = {
    "critical": 5,
    "high": 4,
    "medium": 2,
    "low": 1,
    "info": 0,
}

MAX_SENSITIVE_SCORE = 20  # Max score for this category


async def check_sensitive_files(domain: str) -> dict:
    """
    Probe known sensitive file paths on the domain using HEAD requests.
    
    Returns:
        {
            "files_checked": int,
            "files_exposed": int,
            "score": int (0-20),
            "findings": [
                {
                    "path": str,
                    "exposed": bool,
                    "status_code": int | None,
                    "severity": str,
                    "description": str,
                }
            ]
        }
    """
    result = {
        "files_checked": 0,
        "files_exposed": 0,
        "score": MAX_SENSITIVE_SCORE,  # Start at max, deduct for exposures
        "findings": [],
    }

    # Filter out info-level files from scoring (they're not vulnerabilities)
    scoreable_files = [f for f in SENSITIVE_FILES if f["severity"] != "info"]
    info_files = [f for f in SENSITIVE_FILES if f["severity"] == "info"]

    async with create_stealth_client(timeout=8.0) as client:
        for file_def in SENSITIVE_FILES:
            result["files_checked"] += 1

            exposed, status_code = await _probe_file(client, domain, file_def["path"])

            # Add polite delay between probes to avoid rate limiting
            jitter = settings.SENSITIVE_FILE_PROBE_DELAY_MS / 1000.0
            await asyncio.sleep(jitter)

            if exposed and file_def["severity"] != "info":
                result["files_exposed"] += 1
                penalty = SEVERITY_PENALTY.get(file_def["severity"], 2)
                result["score"] = max(0, result["score"] - penalty)

            result["findings"].append({
                "path": file_def["path"],
                "exposed": exposed,
                "status_code": status_code,
                "severity": file_def["severity"],
                "description": file_def["description"],
            })

    return result


async def _probe_file(
    client,
    domain: str,
    path: str,
) -> tuple[bool, Optional[int]]:
    """
    Send a HEAD request to check if a sensitive file is publicly accessible.
    
    A file is considered "exposed" if:
    - Status code is 200
    - Content-Length > 0 (not an empty response)
    
    Returns (is_exposed, status_code).
    """
    url = f"https://{domain}{path}"

    try:
        response = await client.head(url)
        status = response.status_code

        if status == 200:
            # Check if it's a real file (not a catch-all 200 page)
            content_length = response.headers.get("content-length", "0")
            content_type = response.headers.get("content-type", "")

            # Some servers return 200 for everything (soft 404) —
            # filter out HTML error pages for non-HTML files
            is_html = "text/html" in content_type
            is_likely_real = int(content_length or 0) > 0

            # .env, .git, .sql files should NOT return HTML
            if path.endswith((".env", ".sql", ".git/config", ".git/HEAD", ".htpasswd")):
                if is_html:
                    return False, status  # Likely a soft-404 page

            if is_likely_real or not is_html:
                return True, status

        return False, status

    except Exception as e:
        logger.debug(f"Probe failed for {domain}{path}: {e}")
        return False, None
