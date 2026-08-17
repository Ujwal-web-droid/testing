"""
Scan Routes — Trigger scans and retrieve scan history.
"""

import uuid
from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import DBSession, CurrentUser
from app.models.website import Website
from app.models.scan_result import ScanResult
from app.services.scanner_engine import run_scan
from app.services.score_calculator import score_to_grade

router = APIRouter(prefix="/scans", tags=["Scans"])


@router.post(
    "/trigger/{website_id}",
    summary="Trigger a new security scan",
    status_code=status.HTTP_200_OK,
)
async def trigger_scan(
    website_id: uuid.UUID,
    db: DBSession,
    user: CurrentUser,
):
    """Run a full security scan on a connected domain."""
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

    if not website.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Website is deactivated",
        )

    # Run the scan
    report = await run_scan(
        domain=website.domain,
        website_id=website.id,
        db=db,
        scan_type="manual",
    )

    return report


@router.get(
    "/history/{website_id}",
    summary="Get scan history for a domain",
)
async def get_scan_history(
    website_id: uuid.UUID,
    db: DBSession,
    user: CurrentUser,
    limit: int = 20,
    offset: int = 0,
):
    """Retrieve historical scan results for a domain."""
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

    # Fetch scan history
    scans_stmt = (
        select(ScanResult)
        .where(ScanResult.website_id == website_id)
        .order_by(ScanResult.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    scans_result = await db.execute(scans_stmt)
    scans = scans_result.scalars().all()

    return {
        "scans": [
            {
                "id": str(scan.id),
                "website_id": str(scan.website_id),
                "domain": website.domain,
                "overall_score": scan.overall_score,
                "grade": score_to_grade(scan.overall_score),
                "ssl_report": scan.ssl_report,
                "headers_report": scan.headers_report,
                "sensitive_files_report": scan.sensitive_files_report,
                "remediation": scan.full_report.get("remediation", []),
                "scan_type": scan.scan_type,
                "scan_duration_ms": scan.scan_duration_ms,
                "created_at": scan.created_at.isoformat(),
            }
            for scan in scans
        ],
        "total": len(scans),
    }


@router.get(
    "/latest/{website_id}",
    summary="Get the latest scan result",
)
async def get_latest_scan(
    website_id: uuid.UUID,
    db: DBSession,
    user: CurrentUser,
):
    """Get the most recent scan result for a domain."""
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

    scan_stmt = (
        select(ScanResult)
        .where(ScanResult.website_id == website_id)
        .order_by(ScanResult.created_at.desc())
        .limit(1)
    )
    scan_result = await db.execute(scan_stmt)
    scan = scan_result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No scan results found. Trigger a scan first.",
        )

    return {
        "id": str(scan.id),
        "website_id": str(scan.website_id),
        "domain": website.domain,
        "overall_score": scan.overall_score,
        "grade": score_to_grade(scan.overall_score),
        "ssl_report": scan.ssl_report,
        "headers_report": scan.headers_report,
        "sensitive_files_report": scan.sensitive_files_report,
        "remediation": scan.full_report.get("remediation", []),
        "scan_type": scan.scan_type,
        "scan_duration_ms": scan.scan_duration_ms,
        "created_at": scan.created_at.isoformat(),
    }
