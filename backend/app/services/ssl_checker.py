"""
SSL/TLS Certificate Checker.
Connects to the target domain on port 443, retrieves the certificate,
and analyzes validity, expiry, issuer, and protocol version.
"""

import ssl
import socket
import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional

from cryptography import x509
from cryptography.hazmat.backends import default_backend

logger = logging.getLogger(__name__)


async def check_ssl(domain: str, port: int = 443) -> dict:
    """
    Perform async SSL/TLS analysis on a domain.
    
    Returns a dict with:
      - valid (bool)
      - issuer, subject, not_before, not_after
      - days_until_expiry
      - protocol_version
      - score (0-30)
      - issues (list of strings)
    """
    result = {
        "valid": False,
        "issuer": None,
        "subject": None,
        "not_before": None,
        "not_after": None,
        "days_until_expiry": None,
        "protocol_version": None,
        "serial_number": None,
        "score": 0,
        "issues": [],
    }

    try:
        # Run the blocking SSL check in a thread executor
        cert_info = await asyncio.get_event_loop().run_in_executor(
            None, _fetch_certificate, domain, port
        )

        if cert_info is None:
            result["issues"].append("Could not establish SSL connection")
            return result

        cert_der, protocol_version = cert_info

        # Parse the DER certificate with cryptography library
        cert = x509.load_der_x509_certificate(cert_der, default_backend())

        # Extract certificate details
        result["subject"] = _get_common_name(cert.subject)
        result["issuer"] = _get_common_name(cert.issuer)
        result["not_before"] = cert.not_valid_before_utc.isoformat()
        result["not_after"] = cert.not_valid_after_utc.isoformat()
        result["serial_number"] = str(cert.serial_number)
        result["protocol_version"] = protocol_version

        # Calculate days until expiry
        now = datetime.now(timezone.utc)
        expiry = cert.not_valid_after_utc
        days_left = (expiry - now).days
        result["days_until_expiry"] = days_left

        # ─── Scoring Logic (max 30 points) ───────────────────────
        score = 0

        # Certificate is currently valid
        if cert.not_valid_before_utc <= now <= cert.not_valid_after_utc:
            result["valid"] = True
            score += 15  # Base validity
        else:
            result["issues"].append("Certificate has expired or is not yet valid")

        # Expiry proximity scoring
        if days_left > 30:
            score += 10  # Healthy expiry window
        elif days_left > 14:
            score += 5
            result["issues"].append(f"Certificate expires in {days_left} days — renewal recommended")
        elif days_left > 0:
            score += 2
            result["issues"].append(f"Certificate expires in {days_left} days — URGENT renewal needed")
        else:
            result["issues"].append("Certificate has expired!")

        # TLS version scoring
        if protocol_version and "TLSv1.3" in protocol_version:
            score += 5  # Best protocol
        elif protocol_version and "TLSv1.2" in protocol_version:
            score += 3  # Acceptable
        else:
            result["issues"].append(f"Weak TLS version: {protocol_version}")

        result["score"] = min(score, 30)  # Cap at 30

    except Exception as e:
        logger.error(f"SSL check failed for {domain}: {e}")
        result["issues"].append(f"SSL check error: {str(e)}")

    return result


def _fetch_certificate(domain: str, port: int) -> Optional[tuple]:
    """
    Blocking function to connect via SSL and retrieve the DER-encoded certificate.
    Returns (cert_der_bytes, protocol_version_string) or None.
    """
    context = ssl.create_default_context()
    # Allow connection even to analyze — we report issues, not block
    context.check_hostname = True
    context.verify_mode = ssl.CERT_REQUIRED

    try:
        with socket.create_connection((domain, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as tls_sock:
                cert_der = tls_sock.getpeercert(binary_form=True)
                protocol_version = tls_sock.version()
                return cert_der, protocol_version
    except ssl.SSLCertVerificationError as e:
        # Try again without verification to still get cert details
        context_no_verify = ssl.create_default_context()
        context_no_verify.check_hostname = False
        context_no_verify.verify_mode = ssl.CERT_NONE
        try:
            with socket.create_connection((domain, port), timeout=10) as sock:
                with context_no_verify.wrap_socket(sock, server_hostname=domain) as tls_sock:
                    cert_der = tls_sock.getpeercert(binary_form=True)
                    protocol_version = tls_sock.version()
                    return cert_der, protocol_version
        except Exception:
            return None
    except Exception:
        return None


def _get_common_name(name: x509.Name) -> str:
    """Extract the Common Name (CN) from an x509 Name object."""
    try:
        cn = name.get_attributes_for_oid(x509.oid.NameOID.COMMON_NAME)
        if cn:
            return cn[0].value
        # Fallback to Organization
        org = name.get_attributes_for_oid(x509.oid.NameOID.ORGANIZATION_NAME)
        return org[0].value if org else "Unknown"
    except Exception:
        return "Unknown"
