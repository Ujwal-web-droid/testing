"""Scan Result ORM Model."""

import uuid
from datetime import datetime

from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ScanResult(Base):
    __tablename__ = "scan_results"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    website_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("websites.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    overall_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # ─── Detailed Reports (JSONB) ─────────────────────────────────
    ssl_report: Mapped[dict] = mapped_column(JSONB, default=dict)
    headers_report: Mapped[dict] = mapped_column(JSONB, default=dict)
    sensitive_files_report: Mapped[dict] = mapped_column(JSONB, default=dict)
    full_report: Mapped[dict] = mapped_column(JSONB, default=dict)

    # ─── Metadata ─────────────────────────────────────────────────
    scan_type: Mapped[str] = mapped_column(
        String(20), default="manual"  # manual | scheduled | api
    )
    scan_duration_ms: Mapped[float] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    # Relationships
    website = relationship("Website", back_populates="scan_results")

    def __repr__(self) -> str:
        return f"<ScanResult {self.id} score={self.overall_score}>"
