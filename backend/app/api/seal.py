"""
Trust Seal Routes — Public seal status and management.
"""

import uuid
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import Response
from sqlalchemy import select

from app.api.deps import DBSession, CurrentUser
from app.models.website import Website
from app.services.seal_generator import create_seal, get_seal_status, generate_badge_svg
from app.services.score_calculator import get_score_color, score_to_grade

router = APIRouter(prefix="/seal", tags=["Trust Seal"])


@router.post(
    "/create/{website_id}",
    summary="Create or get a trust seal for a domain",
)
async def create_or_get_seal(
    website_id: uuid.UUID,
    db: DBSession,
    user: CurrentUser,
    style: str = "badge",
):
    """Create a trust seal for a website or return existing one."""
    # Verify website belongs to user
    stmt = select(Website).where(
        Website.id == website_id,
        Website.user_id == user.id,
    )
    result = await db.execute(stmt)
    website = result.scalar_one_or_none()

    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Website not found",
        )

    seal_info = await create_seal(website_id, db, style=style)
    return seal_info


@router.get(
    "/status/{seal_token}",
    summary="Get public seal status (used by embeddable widget)",
)
async def public_seal_status(seal_token: str, db: DBSession):
    """
    Public endpoint — no auth required.
    Returns the seal status for the embeddable widget to display.
    """
    seal_data = await get_seal_status(seal_token, db)

    if not seal_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seal not found or inactive",
        )

    return seal_data


@router.get(
    "/badge/{seal_token}.svg",
    summary="Get the trust seal as an SVG image",
    response_class=Response,
)
async def seal_badge_svg(seal_token: str, db: DBSession):
    """
    Returns the trust seal badge as an SVG image.
    Can be used as an <img> src directly.
    """
    seal_data = await get_seal_status(seal_token, db)

    if not seal_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seal not found",
        )

    svg = seal_data["badge_svg"]

    return Response(
        content=svg,
        media_type="image/svg+xml",
        headers={
            "Cache-Control": "public, max-age=300",  # Cache for 5 minutes
            "Access-Control-Allow-Origin": "*",
        },
    )
