"""
Scanner Engine Orchestrator.
Runs all three checks (SSL, Headers, Sensitive Files) in parallel
and assembles a unified scan report with scoring and remediation.
"""

import asyncio
import time
import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.website import Website
from app.models.scan_result import ScanResult
from app.services.ssl_checker import check_ssl
from app.services.header_analyzer import analyze_headers
from app.services.sensitive_files import check_sensitive_files
from app.services.score_calculator import calculate_overall_score, score_to_grade
from app.services.remediation import generate_remediation

logger = logging.getLogger(__name__)


async def run_scan(
    domain: str,
    website_id: uuid.UUID,
    db: AsyncSession,
    scan_type: str = "manual",
) -> dict:
    """
    Orchestrate a full security scan on a domain.
    
    1. Runs SSL, Header, and Sensitive File checks in parallel
    2. Calculates overall score
    3. Generates remediation advice
    4. Persists results to database
    5. Updates the website's last_score
    
    Returns the complete scan report as a dict.
    """
    start_time = time.monotonic()

    # ─── Run All Checks in Parallel ───────────────────────────────
    ssl_result, headers_result, files_result = await asyncio.gather(
        check_ssl(domain),
        analyze_headers(domain),
        check_sensitive_files(domain),
        return_exceptions=True,
    )

    # Handle individual check failures gracefully
    if isinstance(ssl_result, Exception):
        logger.error(f"SSL check failed for {domain}: {ssl_result}")
        ssl_result = {"valid": False, "score": 0, "issues": [str(ssl_result)]}

    if isinstance(headers_result, Exception):
        logger.error(f"Header check failed for {domain}: {headers_result}")
        headers_result = {"headers_checked": 0, "headers_present": 0, "headers_missing": 0, "score": 0, "findings": []}

    if isinstance(files_result, Exception):
        logger.error(f"Sensitive file check failed for {domain}: {files_result}")
        files_result = {"files_checked": 0, "files_exposed": 0, "score": 20, "findings": []}

    # ─── Calculate Score ──────────────────────────────────────────
    overall_score = calculate_overall_score(
        ssl_score=ssl_result.get("score", 0),
        headers_score=headers_result.get("score", 0),
        sensitive_files_score=files_result.get("score", 0),
    )
    grade = score_to_grade(overall_score)

    # ─── Calculate Scan Duration ──────────────────────────────────
    scan_duration_ms = (time.monotonic() - start_time) * 1000

    # ─── Generate Remediation Advice ──────────────────────────────
    remediation = generate_remediation(ssl_result, headers_result, files_result)

    # ─── Assemble Full Report ─────────────────────────────────────
    full_report = {
        "domain": domain,
        "overall_score": overall_score,
        "grade": grade,
        "ssl": ssl_result,
        "headers": headers_result,
        "sensitive_files": files_result,
        "remediation": remediation,
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "scan_duration_ms": round(scan_duration_ms, 2),
    }

    # ─── Persist to Database ──────────────────────────────────────
    scan_result = ScanResult(
        website_id=website_id,
        overall_score=overall_score,
        ssl_report=ssl_result,
        headers_report=headers_result,
        sensitive_files_report=files_result,
        full_report=full_report,
        scan_type=scan_type,
        scan_duration_ms=round(scan_duration_ms, 2),
    )
    db.add(scan_result)

    # Update website's last scan info
    stmt = select(Website).where(Website.id == website_id)
    result = await db.execute(stmt)
    website = result.scalar_one_or_none()
    if website:
        website.last_score = overall_score
        website.last_scanned_at = datetime.now(timezone.utc)

    await db.flush()  # Ensure scan_result gets an ID

    logger.info(
        f"Scan complete for {domain}: score={overall_score} grade={grade} "
        f"duration={scan_duration_ms:.0f}ms"
    )

    # Return serializable report
    full_report["id"] = str(scan_result.id)
    full_report["website_id"] = str(website_id)
    full_report["scan_type"] = scan_type

    return full_report
