"""Scan Report Pydantic Schemas."""

import uuid
from datetime import datetime
from typing import Optional, Any

from pydantic import BaseModel, Field


# ─── Sub-Report Schemas ───────────────────────────────────────────

class SSLFinding(BaseModel):
    valid: bool
    issuer: Optional[str] = None
    subject: Optional[str] = None
    not_before: Optional[str] = None
    not_after: Optional[str] = None
    days_until_expiry: Optional[int] = None
    protocol_version: Optional[str] = None
    serial_number: Optional[str] = None
    score: int = 0
    issues: list[str] = Field(default_factory=list)


class HeaderFinding(BaseModel):
    header_name: str
    present: bool
    value: Optional[str] = None
    expected: str
    severity: str  # critical | high | medium | low
    score: int = 0
    description: str = ""


class HeadersReport(BaseModel):
    headers_checked: int
    headers_present: int
    headers_missing: int
    score: int = 0
    findings: list[HeaderFinding] = Field(default_factory=list)


class SensitiveFileFinding(BaseModel):
    path: str
    exposed: bool
    status_code: Optional[int] = None
    severity: str = "critical"
    description: str = ""


class SensitiveFilesReport(BaseModel):
    files_checked: int
    files_exposed: int
    score: int = 0
    findings: list[SensitiveFileFinding] = Field(default_factory=list)


# ─── Full Scan Report ────────────────────────────────────────────

class ScanReportResponse(BaseModel):
    id: uuid.UUID
    website_id: uuid.UUID
    domain: Optional[str] = None
    overall_score: int
    grade: str = ""  # A+ / A / B / C / D / F
    ssl_report: SSLFinding
    headers_report: HeadersReport
    sensitive_files_report: SensitiveFilesReport
    remediation: list[dict[str, Any]] = Field(default_factory=list)
    scan_type: str
    scan_duration_ms: Optional[float]
    created_at: datetime

    model_config = {"from_attributes": True}


class ScanTriggerRequest(BaseModel):
    website_id: uuid.UUID


class ScanHistoryResponse(BaseModel):
    scans: list[ScanReportResponse]
    total: int
