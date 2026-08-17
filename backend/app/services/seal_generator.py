"""
Trust Seal Generator.
Creates embeddable badge code and SVG graphics for website compliance display.
"""

import uuid
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings
from app.models.trust_seal import TrustSeal
from app.models.website import Website
from app.services.score_calculator import get_score_color, score_to_grade, get_score_label


async def create_seal(
    website_id: uuid.UUID,
    db: AsyncSession,
    style: str = "badge",
) -> dict:
    """Create a trust seal for a website."""
    # Check if seal already exists
    stmt = select(TrustSeal).where(TrustSeal.website_id == website_id)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        return {
            "seal_token": existing.seal_token,
            "style": existing.style,
            "is_active": existing.is_active,
            "embed_code": _generate_embed_code(existing.seal_token, existing.style),
            "verification_url": f"{settings.SEAL_PUBLIC_BASE_URL}/{existing.seal_token}",
        }

    seal = TrustSeal(
        website_id=website_id,
        style=style,
    )
    db.add(seal)
    await db.flush()

    return {
        "seal_token": seal.seal_token,
        "style": seal.style,
        "is_active": seal.is_active,
        "embed_code": _generate_embed_code(seal.seal_token, seal.style),
        "verification_url": f"{settings.SEAL_PUBLIC_BASE_URL}/{seal.seal_token}",
    }


async def get_seal_status(seal_token: str, db: AsyncSession) -> Optional[dict]:
    """
    Get the public seal status for a given token.
    This is called by the embeddable widget to display the badge.
    """
    stmt = (
        select(TrustSeal, Website)
        .join(Website, TrustSeal.website_id == Website.id)
        .where(TrustSeal.seal_token == seal_token)
        .where(TrustSeal.is_active == True)
    )
    result = await db.execute(stmt)
    row = result.first()

    if not row:
        return None

    seal, website = row

    score = website.last_score or 0
    color = get_score_color(score)
    grade = score_to_grade(score)
    label = get_score_label(score)

    return {
        "domain": website.domain,
        "score": score,
        "grade": grade,
        "label": label,
        "color": color,
        "last_scanned": website.last_scanned_at.isoformat() if website.last_scanned_at else None,
        "seal_style": seal.style,
        "verification_url": f"{settings.SEAL_PUBLIC_BASE_URL}/{seal_token}",
        "badge_svg": generate_badge_svg(score, grade, color, website.domain),
    }


def generate_badge_svg(
    score: int,
    grade: str,
    color: str,
    domain: str,
) -> str:
    """Generate an SVG badge showing the security score."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="48" viewBox="0 0 200 48">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1e293b"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="200" height="48" rx="8" fill="url(#bg)" stroke="{color}" stroke-width="1.5"/>
  <!-- Shield Icon -->
  <g transform="translate(12, 8)">
    <path d="M16 2L4 7v6.5c0 5.6 4.2 10.8 12 13.5 7.8-2.7 12-7.9 12-13.5V7L16 2z" 
          fill="{color}" opacity="0.2" stroke="{color}" stroke-width="1.5"/>
    <text x="16" y="20" text-anchor="middle" font-family="Arial,sans-serif" 
          font-size="12" font-weight="bold" fill="{color}">{grade}</text>
  </g>
  <!-- Text -->
  <text x="52" y="19" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">
    WebGuard Verified
  </text>
  <text x="52" y="35" font-family="Arial,sans-serif" font-size="10" fill="#94a3b8">
    Score: {score}/100 · Protected
  </text>
</svg>'''


def _generate_embed_code(seal_token: str, style: str) -> str:
    """Generate the HTML embed snippet for the trust seal widget."""
    base_url = settings.SEAL_PUBLIC_BASE_URL.rstrip("/")
    api_base = settings.ALLOWED_ORIGINS[0] if settings.ALLOWED_ORIGINS else "http://localhost:8000"

    return f'''<!-- WebGuard AI Trust Seal -->
<div id="webguard-seal" data-token="{seal_token}" data-style="{style}"></div>
<script src="{api_base}/seal-widget.js" async></script>'''
