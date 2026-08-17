"""Trust Seal ORM Model."""

import uuid
import secrets
from datetime import datetime

from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB, ENUM
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def generate_seal_token() -> str:
    """Generate a cryptographically secure 32-char token."""
    return secrets.token_urlsafe(24)


class TrustSeal(Base):
    __tablename__ = "trust_seals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    website_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("websites.id", ondelete="CASCADE"),
        unique=True, nullable=False,
    )
    seal_token: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, default=generate_seal_token, index=True
    )
    style: Mapped[str] = mapped_column(
        ENUM("badge", "banner", "minimal", name="seal_style", create_type=True),
        default="badge",
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    config: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    website = relationship("Website", back_populates="trust_seal")

    def __repr__(self) -> str:
        return f"<TrustSeal {self.seal_token[:8]}...>"
