"""Website (Domain) ORM Model."""

import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Website(Base):
    __tablename__ = "websites"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    domain: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    display_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    monitoring_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    last_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    last_scanned_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    owner = relationship("User", back_populates="websites")
    scan_results = relationship(
        "ScanResult", back_populates="website", cascade="all, delete-orphan",
        order_by="ScanResult.created_at.desc()"
    )
    trust_seal = relationship(
        "TrustSeal", back_populates="website", uselist=False, cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Website {self.domain}>"
