"""
Website Management Routes — CRUD for connected domains.
"""

import uuid
import re
from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select, func

from app.api.deps import DBSession, CurrentUser
from app.models.website import Website
from app.schemas.website import (
    WebsiteCreate, WebsiteUpdate, WebsiteResponse, WebsiteListResponse,
)

router = APIRouter(prefix="/websites", tags=["Websites"])

# Plan limits for domain count
PLAN_LIMITS = {
    "free": 1,
    "starter": 3,
    "pro": 10,
    "agency": 50,
}


def normalize_domain(domain: str) -> str:
    """Strip protocol, trailing slashes, and www prefix."""
    domain = re.sub(r'^https?://', '', domain)
    domain = domain.rstrip('/')
    domain = re.sub(r'^www\.', '', domain)
    return domain.lower()


@router.get(
    "/",
    response_model=WebsiteListResponse,
    summary="List all connected domains",
)
async def list_websites(db: DBSession, user: CurrentUser):
    stmt = (
        select(Website)
        .where(Website.user_id == user.id)
        .order_by(Website.created_at.desc())
    )
    result = await db.execute(stmt)
    websites = result.scalars().all()

    return WebsiteListResponse(
        websites=[WebsiteResponse.model_validate(w) for w in websites],
        total=len(websites),
    )


@router.post(
    "/",
    response_model=WebsiteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new domain to monitor",
)
async def create_website(
    payload: WebsiteCreate,
    db: DBSession,
    user: CurrentUser,
):
    domain = normalize_domain(payload.domain)

    # Check plan limits
    count_stmt = select(func.count(Website.id)).where(Website.user_id == user.id)
    count_result = await db.execute(count_stmt)
    current_count = count_result.scalar()
    max_domains = PLAN_LIMITS.get(user.plan, 1)

    if current_count >= max_domains:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Your {user.plan} plan allows {max_domains} domain(s). Upgrade to add more.",
        )

    # Check if domain already exists for this user
    exists_stmt = select(Website).where(
        Website.user_id == user.id,
        Website.domain == domain,
    )
    exists_result = await db.execute(exists_stmt)
    if exists_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Domain {domain} is already connected to your account",
        )

    website = Website(
        user_id=user.id,
        domain=domain,
        display_name=payload.display_name or domain,
        monitoring_enabled=payload.monitoring_enabled,
    )
    db.add(website)
    await db.flush()

    return WebsiteResponse.model_validate(website)


@router.get(
    "/{website_id}",
    response_model=WebsiteResponse,
    summary="Get a specific domain",
)
async def get_website(
    website_id: uuid.UUID,
    db: DBSession,
    user: CurrentUser,
):
    website = await _get_user_website(website_id, user.id, db)
    return WebsiteResponse.model_validate(website)


@router.patch(
    "/{website_id}",
    response_model=WebsiteResponse,
    summary="Update domain settings",
)
async def update_website(
    website_id: uuid.UUID,
    payload: WebsiteUpdate,
    db: DBSession,
    user: CurrentUser,
):
    website = await _get_user_website(website_id, user.id, db)

    if payload.display_name is not None:
        website.display_name = payload.display_name
    if payload.monitoring_enabled is not None:
        website.monitoring_enabled = payload.monitoring_enabled
    if payload.is_active is not None:
        website.is_active = payload.is_active

    return WebsiteResponse.model_validate(website)


@router.delete(
    "/{website_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove a domain",
)
async def delete_website(
    website_id: uuid.UUID,
    db: DBSession,
    user: CurrentUser,
):
    website = await _get_user_website(website_id, user.id, db)
    await db.delete(website)


async def _get_user_website(
    website_id: uuid.UUID,
    user_id: uuid.UUID,
    db: DBSession,
) -> Website:
    """Helper to fetch a website belonging to the authenticated user."""
    stmt = select(Website).where(
        Website.id == website_id,
        Website.user_id == user_id,
    )
    result = await db.execute(stmt)
    website = result.scalar_one_or_none()

    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Website not found",
        )

    return website
