"""
Notification Service.
Sends email and WhatsApp alerts when scan results change significantly.
"""

import logging
from typing import Optional

import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import settings

logger = logging.getLogger(__name__)


async def send_email_alert(
    to_email: str,
    subject: str,
    domain: str,
    old_score: Optional[int],
    new_score: int,
    issues: list[str],
) -> bool:
    """
    Send an email alert when a scan detects significant changes.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP not configured — skipping email alert")
        return False

    html_body = _build_email_html(domain, old_score, new_score, issues)

    message = MIMEMultipart("alternative")
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    message["To"] = to_email
    message["Subject"] = subject

    # Plain text fallback
    plain_text = (
        f"WebGuard AI Alert for {domain}\n\n"
        f"Score changed: {old_score or 'N/A'} → {new_score}/100\n\n"
        f"Issues found:\n" + "\n".join(f"• {issue}" for issue in issues)
    )
    message.attach(MIMEText(plain_text, "plain"))
    message.attach(MIMEText(html_body, "html"))

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=False,
            start_tls=True,
        )
        logger.info(f"Email alert sent to {to_email} for {domain}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


async def send_whatsapp_alert(
    to_number: str,
    domain: str,
    old_score: Optional[int],
    new_score: int,
    issues: list[str],
) -> bool:
    """
    Send a WhatsApp alert via Twilio API.
    """
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        logger.warning("Twilio not configured — skipping WhatsApp alert")
        return False

    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        issues_text = "\n".join(f"⚠️ {issue}" for issue in issues[:5])
        body = (
            f"🛡️ *WebGuard AI Alert*\n\n"
            f"Domain: {domain}\n"
            f"Score: {old_score or 'N/A'} → *{new_score}/100*\n\n"
            f"{issues_text}\n\n"
            f"View full report: {settings.SEAL_PUBLIC_BASE_URL}"
        )

        message = client.messages.create(
            body=body,
            from_=settings.TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{to_number}",
        )
        logger.info(f"WhatsApp alert sent to {to_number}: {message.sid}")
        return True
    except Exception as e:
        logger.error(f"Failed to send WhatsApp to {to_number}: {e}")
        return False


def _build_email_html(
    domain: str,
    old_score: Optional[int],
    new_score: int,
    issues: list[str],
) -> str:
    """Build a styled HTML email body."""
    score_color = "#22c55e" if new_score >= 80 else "#eab308" if new_score >= 50 else "#ef4444"
    issues_html = "".join(f"<li style='margin:4px 0;'>{issue}</li>" for issue in issues)

    return f"""
    <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:600px; margin:0 auto; background:#0f172a; color:#f8fafc; border-radius:12px; overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e293b,#0f172a); padding:32px; text-align:center;">
            <h1 style="margin:0; font-size:24px; color:#f8fafc;">🛡️ WebGuard AI Alert</h1>
            <p style="color:#94a3b8; margin:8px 0 0;">Security status change detected</p>
        </div>
        <div style="padding:24px;">
            <div style="background:#1e293b; border-radius:8px; padding:20px; margin-bottom:16px;">
                <h2 style="margin:0 0 8px; font-size:18px;">{domain}</h2>
                <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:14px; color:#94a3b8;">Score:</span>
                    <span style="font-size:14px; color:#94a3b8; text-decoration:line-through;">{old_score or 'N/A'}</span>
                    <span style="font-size:14px; color:#94a3b8;">→</span>
                    <span style="font-size:28px; font-weight:bold; color:{score_color};">{new_score}/100</span>
                </div>
            </div>
            <div style="background:#1e293b; border-radius:8px; padding:20px;">
                <h3 style="margin:0 0 12px; font-size:16px;">Issues Found</h3>
                <ul style="padding-left:20px; margin:0; color:#cbd5e1;">
                    {issues_html}
                </ul>
            </div>
            <div style="text-align:center; margin-top:24px;">
                <a href="{settings.SEAL_PUBLIC_BASE_URL}" 
                   style="background:linear-gradient(135deg,#6366f1,#8b5cf6); color:white; padding:12px 32px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">
                    View Full Report →
                </a>
            </div>
        </div>
        <div style="padding:16px; text-align:center; border-top:1px solid #1e293b;">
            <p style="margin:0; font-size:12px; color:#64748b;">WebGuard AI — Automated Website Security Monitoring</p>
        </div>
    </div>
    """
