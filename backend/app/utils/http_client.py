"""
Stealth HTTP Client Factory.
Rotates User-Agent strings and applies polite timeouts
to avoid triggering WAF / Cloudflare bot detection.
"""

import random
from typing import Optional

import httpx

from app.config import settings


# Realistic browser User-Agent strings (updated quarterly)
USER_AGENTS = [
    # Chrome on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    # Chrome on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    # Firefox on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
    # Firefox on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
    # Safari on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    # Edge on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
]


def get_random_user_agent() -> str:
    """Return a random realistic browser User-Agent."""
    return random.choice(USER_AGENTS)


def create_stealth_client(
    timeout: Optional[float] = None,
    follow_redirects: bool = True,
) -> httpx.AsyncClient:
    """
    Create an httpx.AsyncClient configured for stealth scanning.
    
    - Realistic User-Agent
    - Standard browser headers
    - Configurable timeout
    - Follows redirects (like a real browser)
    - No cookies persistence (clean session)
    """
    _timeout = timeout or settings.SCAN_TIMEOUT_SECONDS

    headers = {
        "User-Agent": get_random_user_agent(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "no-cache",
    }

    return httpx.AsyncClient(
        headers=headers,
        timeout=httpx.Timeout(_timeout, connect=10.0),
        follow_redirects=follow_redirects,
        verify=True,  # Verify SSL but don't fail on self-signed (handled in ssl_checker)
        http2=True,
    )
