import React from "react";
import Link from "next/link";
import { Shield, ExternalLink } from "lucide-react";

export interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const colHeadingStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--brand-deep)",
    marginBottom: 16,
  };

  const linkStyle: React.CSSProperties = {
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: 13.5,
    transition: "color 0.15s ease",
  };

  return (
    <footer
      className={className}
      style={{
        borderTop: "1px solid var(--canvas-border)",
        backgroundColor: "var(--canvas-inset)",
        color: "var(--text-secondary)",
        padding: "64px 0 32px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* ─── 5-Column Grid ──────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "40px 32px",
            marginBottom: 48,
          }}
        >
          {/* Column 1: Brand */}
          <div style={{ maxWidth: 280 }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--brand-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                }}
              >
                <Shield size={18} color="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--brand-deep)", letterSpacing: "-0.02em" }}>
                WebGuard <span style={{ color: "var(--brand-primary)" }}>AI</span>
              </span>
            </Link>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Next-gen security and compliance automation for modern web applications and agencies.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 style={colHeadingStyle}>Product</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Features", href: "#features" },
                { label: "Security Scanner", href: "/" },
                { label: "Trust Seal", href: "/dashboard" },
                { label: "Pricing", href: "#pricing" },
                { label: "MCP Integration", href: "/dashboard" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 style={colHeadingStyle}>Resources</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Documentation", href: "/docs" },
                { label: "API Reference", href: "/api-docs" },
                { label: "Fix Guides", href: "/guides" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/status"
                  style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: 6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  Status
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "var(--success)",
                      boxShadow: "0 0 6px var(--success)",
                      display: "inline-block",
                    }}
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 style={colHeadingStyle}>Support</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Help Center", href: "/help" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/community"
                  style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: 5 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  Community / Discord
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  style={{ ...linkStyle, color: "var(--warning)", fontWeight: 600 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#B45309")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--warning)")}
                >
                  Report Security Bug
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Compliance */}
          <div>
            <h4 style={colHeadingStyle}>Legal &amp; Compliance</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Security Compliance", href: "/compliance" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Sub-Footer Row ─────────────────────────────────────── */}
        <div
          style={{
            paddingTop: 24,
            borderTop: "1px solid var(--canvas-border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} WebGuard AI. All rights reserved.
          </p>

          {/* Live Status Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              background: "var(--success-light)",
              border: "1px solid rgba(22,163,74,0.2)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--success)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "var(--success)",
                boxShadow: "0 0 6px var(--success)",
              }}
            />
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
