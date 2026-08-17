"""
Security Header Analyzer.
Checks for the presence and correctness of critical HTTP security headers.
Each missing header is scored and includes a severity rating.
"""

import logging
from typing import Optional

import httpx

from app.utils.http_client import create_stealth_client

logger = logging.getLogger(__name__)


# ─── Header Definitions ──────────────────────────────────────────
# Each entry: (header_name, expected_description, severity, max_points)
SECURITY_HEADERS = [
    {
        "name": "Content-Security-Policy",
        "expected": "A valid CSP directive (e.g., default-src 'self')",
        "severity": "critical",
        "points": 10,
        "description": (
            "Content-Security-Policy prevents XSS attacks by controlling which "
            "resources the browser is allowed to load. Without it, attackers can "
            "inject malicious scripts into your pages."
        ),
    },
    {
        "name": "Strict-Transport-Security",
        "expected": "max-age=31536000; includeSubDomains; preload",
        "severity": "critical",
        "points": 8,
        "description": (
            "HSTS forces browsers to only use HTTPS connections, preventing "
            "man-in-the-middle attacks and SSL stripping."
        ),
    },
    {
        "name": "X-Frame-Options",
        "expected": "DENY or SAMEORIGIN",
        "severity": "high",
        "points": 7,
        "description": (
            "X-Frame-Options prevents your site from being embedded in iframes, "
            "protecting against clickjacking attacks."
        ),
    },
    {
        "name": "X-Content-Type-Options",
        "expected": "nosniff",
        "severity": "high",
        "points": 7,
        "description": (
            "X-Content-Type-Options prevents MIME-type sniffing, ensuring the browser "
            "strictly follows the declared Content-Type."
        ),
    },
    {
        "name": "X-XSS-Protection",
        "expected": "0 (modern) or 1; mode=block (legacy)",
        "severity": "medium",
        "points": 5,
        "description": (
            "X-XSS-Protection enables the browser's built-in XSS filter. While "
            "deprecated in modern browsers, it provides defense-in-depth for older ones."
        ),
    },
    {
        "name": "Referrer-Policy",
        "expected": "strict-origin-when-cross-origin or no-referrer",
        "severity": "medium",
        "points": 6,
        "description": (
            "Referrer-Policy controls how much referrer information is included "
            "with requests, protecting user privacy and preventing data leakage."
        ),
    },
    {
        "name": "Permissions-Policy",
        "expected": "camera=(), microphone=(), geolocation=()",
        "severity": "medium",
        "points": 7,
        "description": (
            "Permissions-Policy restricts which browser features (camera, mic, "
            "geolocation) your site can use, reducing the attack surface."
        ),
    },
]

MAX_HEADER_SCORE = sum(h["points"] for h in SECURITY_HEADERS)  # 50


async def analyze_headers(domain: str) -> dict:
    """
    Fetch the domain's HTTP response and analyze security headers.
    
    Returns:
        {
            "headers_checked": int,
            "headers_present": int,
            "headers_missing": int,
            "score": int (0-50),
            "findings": [
                {
                    "header_name": str,
                    "present": bool,
                    "value": str | None,
                    "expected": str,
                    "severity": str,
                    "score": int,
                    "description": str,
                }
            ]
        }
    """
    result = {
        "headers_checked": len(SECURITY_HEADERS),
        "headers_present": 0,
        "headers_missing": 0,
        "score": 0,
        "findings": [],
    }

    response_headers = await _fetch_headers(domain)

    if response_headers is None:
        # Could not reach the domain — all headers marked as missing
        for header_def in SECURITY_HEADERS:
            result["findings"].append({
                "header_name": header_def["name"],
                "present": False,
                "value": None,
                "expected": header_def["expected"],
                "severity": header_def["severity"],
                "score": 0,
                "description": header_def["description"],
            })
        result["headers_missing"] = len(SECURITY_HEADERS)
        return result

    total_score = 0

    for header_def in SECURITY_HEADERS:
        header_name = header_def["name"]
        # Case-insensitive header lookup
        value = _get_header_value(response_headers, header_name)
        present = value is not None

        points = header_def["points"] if present else 0
        total_score += points

        if present:
            result["headers_present"] += 1
        else:
            result["headers_missing"] += 1

        result["findings"].append({
            "header_name": header_name,
            "present": present,
            "value": value,
            "expected": header_def["expected"],
            "severity": header_def["severity"],
            "score": points,
            "description": header_def["description"],
        })

    # Normalize score to 0-50 range
    result["score"] = int((total_score / MAX_HEADER_SCORE) * 50)

    return result


async def _fetch_headers(domain: str) -> Optional[httpx.Headers]:
    """Fetch HTTP response headers from a domain."""
    urls_to_try = [f"https://{domain}", f"http://{domain}"]

    async with create_stealth_client() as client:
        for url in urls_to_try:
            try:
                response = await client.get(url)
                return response.headers
            except Exception as e:
                logger.debug(f"Failed to fetch headers from {url}: {e}")
                continue

    logger.error(f"Could not fetch headers from {domain}")
    return None


def _get_header_value(headers: httpx.Headers, name: str) -> Optional[str]:
    """Case-insensitive header value lookup."""
    for key, value in headers.items():
        if key.lower() == name.lower():
            return value
    return None
