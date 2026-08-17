"""
Background Scheduler.
Runs daily scans on all monitored websites and sends alerts
when scores drop or critical issues are detected.
"""

import logging
from datetime import datetime, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select

from app.config import settings
from app.database import async_session_factory
from app.models.website import Website
from app.models.user import User
from app.services.scanner_engine import run_scan
from app.services.notification import send_email_alert

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def start_scheduler():
    """Initialize and start the background scheduler."""
    if not settings.SCHEDULER_ENABLED:
        logger.info("Scheduler is disabled")
        return

    scheduler.add_job(
        daily_scan_job,
        trigger=CronTrigger(
            hour=settings.SCHEDULER_CRON_HOUR,
            minute=settings.SCHEDULER_CRON_MINUTE,
        ),
        id="daily_scan",
        name="Daily Website Compliance Scan",
        replace_existing=True,
    )

    scheduler.start()
    logger.info(
        f"Scheduler started — daily scans at "
        f"{settings.SCHEDULER_CRON_HOUR:02d}:{settings.SCHEDULER_CRON_MINUTE:02d} UTC"
    )


def stop_scheduler():
    """Gracefully shut down the scheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped")


async def daily_scan_job():
    """
    Scheduled job: scan all monitored websites.
    
    For each website:
    1. Run a full scan
    2. Compare new score with previous score
    3. Send alerts if score dropped significantly or critical issues found
    """
    logger.info("Starting daily scheduled scan...")

    async with async_session_factory() as db:
        # Fetch all active, monitoring-enabled websites with their owners
        stmt = (
            select(Website, User)
            .join(User, Website.user_id == User.id)
            .where(Website.is_active == True)
            .where(Website.monitoring_enabled == True)
        )
        result = await db.execute(stmt)
        rows = result.all()

        if not rows:
            logger.info("No websites to scan")
            return

        logger.info(f"Scanning {len(rows)} websites...")

        for website, user in rows:
            try:
                old_score = website.last_score

                # Run the scan
                report = await run_scan(
                    domain=website.domain,
                    website_id=website.id,
                    db=db,
                    scan_type="scheduled",
                )

                new_score = report["overall_score"]

                # ─── Alert Conditions ─────────────────────────────
                should_alert = False
                alert_reasons: list[str] = []

                # Score dropped by >= 10 points
                if old_score is not None and (old_score - new_score) >= 10:
                    should_alert = True
                    alert_reasons.append(
                        f"Score dropped from {old_score} to {new_score} (-{old_score - new_score} points)"
                    )

                # SSL certificate expiring within 14 days
                ssl_report = report.get("ssl", {})
                days_left = ssl_report.get("days_until_expiry")
                if days_left is not None and days_left <= 14:
                    should_alert = True
                    alert_reasons.append(
                        f"SSL certificate expires in {days_left} days"
                    )

                # Any new critical sensitive files exposed
                files_report = report.get("sensitive_files", {})
                exposed_files = [
                    f for f in files_report.get("findings", [])
                    if f.get("exposed") and f.get("severity") == "critical"
                ]
                if exposed_files:
                    should_alert = True
                    for f in exposed_files:
                        alert_reasons.append(
                            f"Critical file exposed: {f['path']}"
                        )

                # ─── Send Alerts ──────────────────────────────────
                if should_alert:
                    await send_email_alert(
                        to_email=user.email,
                        subject=f"⚠️ WebGuard Alert: {website.domain} needs attention",
                        domain=website.domain,
                        old_score=old_score,
                        new_score=new_score,
                        issues=alert_reasons,
                    )
                    logger.warning(
                        f"Alert sent for {website.domain}: {', '.join(alert_reasons)}"
                    )
                else:
                    logger.info(
                        f"Scan OK for {website.domain}: score={new_score}"
                    )

            except Exception as e:
                logger.error(f"Scheduled scan failed for {website.domain}: {e}")
                continue

        await db.commit()
        logger.info("Daily scheduled scan complete")
