"""Subscription Pydantic Schemas."""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SubscriptionResponse(BaseModel):
    id: uuid.UUID
    plan: str
    status: str
    current_period_start: Optional[datetime]
    current_period_end: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class SubscriptionUpdate(BaseModel):
    plan: str  # free | starter | pro | agency
