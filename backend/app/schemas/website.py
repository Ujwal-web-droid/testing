"""Website Pydantic Schemas."""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class WebsiteCreate(BaseModel):
    domain: str = Field(
        min_length=3, max_length=255,
        examples=["example.com"],
        description="Domain name without protocol (e.g., example.com)",
    )
    display_name: Optional[str] = None
    monitoring_enabled: bool = True


class WebsiteUpdate(BaseModel):
    display_name: Optional[str] = None
    monitoring_enabled: Optional[bool] = None
    is_active: Optional[bool] = None


class WebsiteResponse(BaseModel):
    id: uuid.UUID
    domain: str
    display_name: Optional[str]
    is_active: bool
    monitoring_enabled: bool
    last_score: Optional[int]
    last_scanned_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class WebsiteListResponse(BaseModel):
    websites: list[WebsiteResponse]
    total: int
