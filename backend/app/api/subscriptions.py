"""
Subscription Routes — Plan management.
"""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import DBSession, CurrentUser
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import SubscriptionResponse, SubscriptionUpdate

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


VALID_PLANS = {"free", "starter", "pro", "agency"}


@router.get(
    "/current",
    response_model=SubscriptionResponse,
    summary="Get current subscription",
)
async def get_subscription(db: DBSession, user: CurrentUser):
    stmt = select(Subscription).where(Subscription.user_id == user.id)
    result = await db.execute(stmt)
    subscription = result.scalar_one_or_none()

    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found",
        )

    return SubscriptionResponse.model_validate(subscription)


@router.patch(
    "/update",
    response_model=SubscriptionResponse,
    summary="Update subscription plan",
)
async def update_subscription(
    payload: SubscriptionUpdate,
    db: DBSession,
    user: CurrentUser,
):
    """
    Update the user's plan. In production, this would integrate with
    Stripe for payment processing. Here we update the plan directly.
    """
    if payload.plan not in VALID_PLANS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan. Choose from: {', '.join(VALID_PLANS)}",
        )

    stmt = select(Subscription).where(Subscription.user_id == user.id)
    result = await db.execute(stmt)
    subscription = result.scalar_one_or_none()

    if not subscription:
        subscription = Subscription(user_id=user.id, plan=payload.plan, status="active")
        db.add(subscription)
    else:
        subscription.plan = payload.plan

    # Also update the user's plan field
    user_stmt = select(User).where(User.id == user.id)
    user_result = await db.execute(user_stmt)
    user_obj = user_result.scalar_one()
    user_obj.plan = payload.plan

    await db.flush()
    return SubscriptionResponse.model_validate(subscription)
