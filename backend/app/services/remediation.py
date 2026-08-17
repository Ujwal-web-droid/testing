"""
Remediation Guide Generator.
For each failed check, provides step-by-step fix instructions
with platform-specific code snippets (Apache, Nginx, Express, Cloudflare).
"""

from typing import Any


def generate_remediation(
    ssl_report: dict,
    headers_report: dict,
    sensitive_files_report: dict,
) -> list[dict[str, Any]]:
    """
    Generate actionable fix instructions based on scan findings.
    Returns a list of remediation items, each with severity, description,
    and platform-specific code snippets.
    """
    items: list[dict[str, Any]] = []

    # ─── SSL Issues ───────────────────────────────────────────────
    if not ssl_report.get("valid", False):
        items.append({
            "category": "ssl",
            "title": "SSL Certificate Invalid or Expired",
            "severity": "critical",
            "description": (
                "Your SSL certificate is either expired, self-signed, or misconfigured. "
                "Visitors will see a security warning in their browser."
            ),
            "fixes": {
                "lets_encrypt": {
                    "label": "Let's Encrypt (Free SSL)",
                    "steps": [
                        "Install Certbot: sudo apt install certbot python3-certbot-nginx",
                        "Generate certificate: sudo certbot --nginx -d yourdomain.com",
                        "Auto-renewal is configured automatically by Certbot",
                    ],
                },
                "cloudflare": {
                    "label": "Cloudflare (Free SSL)",
                    "steps": [
                        "Sign up at cloudflare.com and add your domain",
                        "Update your nameservers to Cloudflare's",
                        "Go to SSL/TLS → set mode to 'Full (Strict)'",
                        "Enable 'Always Use HTTPS' under Edge Certificates",
                    ],
                },
            },
        })

    days = ssl_report.get("days_until_expiry")
    if days is not None and 0 < days <= 30:
        items.append({
            "category": "ssl",
            "title": f"SSL Certificate Expires in {days} Days",
            "severity": "high" if days <= 14 else "medium",
            "description": (
                f"Your SSL certificate will expire in {days} days. "
                "Renew it immediately to avoid browser security warnings."
            ),
            "fixes": {
                "lets_encrypt": {
                    "label": "Let's Encrypt Renewal",
                    "steps": [
                        "Run: sudo certbot renew --dry-run (test first)",
                        "Run: sudo certbot renew (actual renewal)",
                        "Verify: sudo certbot certificates",
                    ],
                },
            },
        })

    # ─── Missing Security Headers ─────────────────────────────────
    header_findings = headers_report.get("findings", [])
    for finding in header_findings:
        if not finding.get("present", True):
            header_name = finding["header_name"]
            fix = HEADER_FIX_MAP.get(header_name)
            if fix:
                items.append({
                    "category": "headers",
                    "title": f"Missing Header: {header_name}",
                    "severity": finding.get("severity", "medium"),
                    "description": finding.get("description", ""),
                    "fixes": fix,
                })

    # ─── Exposed Sensitive Files ──────────────────────────────────
    file_findings = sensitive_files_report.get("findings", [])
    for finding in file_findings:
        if finding.get("exposed", False) and finding.get("severity") != "info":
            path = finding["path"]
            items.append({
                "category": "sensitive_files",
                "title": f"Exposed File: {path}",
                "severity": finding.get("severity", "critical"),
                "description": finding.get("description", ""),
                "fixes": {
                    "apache": {
                        "label": "Apache (.htaccess)",
                        "code": f"""# Add to .htaccess in your web root
<FilesMatch "{_escape_path(path)}">
    Order Allow,Deny
    Deny from all
</FilesMatch>""",
                    },
                    "nginx": {
                        "label": "Nginx",
                        "code": f"""# Add to your Nginx server block
location {path} {{
    deny all;
    return 404;
}}""",
                    },
                    "general": {
                        "label": "General",
                        "steps": [
                            f"Delete or move {path} outside your web root",
                            "Add the file pattern to your .gitignore",
                            "Verify: curl -I https://yourdomain.com{path} (should return 403/404)",
                        ],
                    },
                },
            })

    # Sort by severity
    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    items.sort(key=lambda x: severity_order.get(x["severity"], 4))

    return items


def _escape_path(path: str) -> str:
    """Escape special regex characters in a file path."""
    return path.replace(".", r"\.").lstrip("/")


# ─── Header Fix Snippets ─────────────────────────────────────────

HEADER_FIX_MAP: dict[str, dict] = {
    "Content-Security-Policy": {
        "apache": {
            "label": "Apache (.htaccess)",
            "code": '# Add to .htaccess\nHeader set Content-Security-Policy "default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; font-src \'self\';"',
        },
        "nginx": {
            "label": "Nginx",
            "code": "# Add to your server block\nadd_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';\" always;",
        },
        "express": {
            "label": "Node.js (Express/Helmet)",
            "code": """// npm install helmet
const helmet = require('helmet');
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
  },
}));""",
        },
        "cloudflare": {
            "label": "Cloudflare",
            "steps": [
                "Go to Rules → Transform Rules → Modify Response Header",
                "Create a rule that adds Content-Security-Policy header",
                "Set value: default-src 'self'; script-src 'self';",
            ],
        },
    },
    "Strict-Transport-Security": {
        "apache": {
            "label": "Apache (.htaccess)",
            "code": '# Add to .htaccess\nHeader always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"',
        },
        "nginx": {
            "label": "Nginx",
            "code": '# Add to your server block\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;',
        },
        "express": {
            "label": "Node.js (Express/Helmet)",
            "code": """const helmet = require('helmet');
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
}));""",
        },
        "cloudflare": {
            "label": "Cloudflare",
            "steps": [
                "Go to SSL/TLS → Edge Certificates",
                "Enable 'HTTP Strict Transport Security (HSTS)'",
                "Set max-age to 12 months, enable includeSubDomains",
            ],
        },
    },
    "X-Frame-Options": {
        "apache": {
            "label": "Apache (.htaccess)",
            "code": '# Add to .htaccess\nHeader always set X-Frame-Options "SAMEORIGIN"',
        },
        "nginx": {
            "label": "Nginx",
            "code": '# Add to your server block\nadd_header X-Frame-Options "SAMEORIGIN" always;',
        },
        "express": {
            "label": "Node.js (Express/Helmet)",
            "code": """const helmet = require('helmet');
app.use(helmet.frameguard({ action: 'sameorigin' }));""",
        },
        "wordpress": {
            "label": "WordPress",
            "steps": [
                "Add to wp-config.php or functions.php:",
                "header('X-Frame-Options: SAMEORIGIN');",
            ],
        },
    },
    "X-Content-Type-Options": {
        "apache": {
            "label": "Apache (.htaccess)",
            "code": '# Add to .htaccess\nHeader always set X-Content-Type-Options "nosniff"',
        },
        "nginx": {
            "label": "Nginx",
            "code": '# Add to your server block\nadd_header X-Content-Type-Options "nosniff" always;',
        },
        "express": {
            "label": "Node.js (Express/Helmet)",
            "code": """const helmet = require('helmet');
app.use(helmet.noSniff());""",
        },
    },
    "X-XSS-Protection": {
        "apache": {
            "label": "Apache (.htaccess)",
            "code": '# Add to .htaccess\nHeader always set X-XSS-Protection "1; mode=block"',
        },
        "nginx": {
            "label": "Nginx",
            "code": '# Add to your server block\nadd_header X-XSS-Protection "1; mode=block" always;',
        },
        "express": {
            "label": "Node.js (Express/Helmet)",
            "code": """const helmet = require('helmet');
app.use(helmet.xssFilter());""",
        },
    },
    "Referrer-Policy": {
        "apache": {
            "label": "Apache (.htaccess)",
            "code": '# Add to .htaccess\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"',
        },
        "nginx": {
            "label": "Nginx",
            "code": '# Add to your server block\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;',
        },
        "express": {
            "label": "Node.js (Express/Helmet)",
            "code": """const helmet = require('helmet');
app.use(helmet.referrerPolicy({
  policy: 'strict-origin-when-cross-origin',
}));""",
        },
    },
    "Permissions-Policy": {
        "apache": {
            "label": "Apache (.htaccess)",
            "code": '# Add to .htaccess\nHeader always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"',
        },
        "nginx": {
            "label": "Nginx",
            "code": '# Add to your server block\nadd_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;',
        },
        "express": {
            "label": "Node.js (Express)",
            "code": """// Helmet doesn't have built-in Permissions-Policy yet
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});""",
        },
    },
}
