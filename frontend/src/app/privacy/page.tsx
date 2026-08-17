"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Database, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh", color: "var(--text-primary)" }}>
      {/* ─── Top Navigation ──────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255, 255, 255, 0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--canvas-border)" }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={18} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--brand-deep)" }}>
              WebGuard <span style={{ color: "var(--brand-primary)" }}>AI</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header style={{ padding: "60px 0 40px", borderBottom: "1px solid var(--canvas-border)", background: "var(--canvas-subtle)" }}>
        <div className="section-container" style={{ maxWidth: 840 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: "uppercase", background: "rgba(37, 99, 235, 0.1)", color: "var(--brand-primary)", marginBottom: 16 }}>
            <Lock size={13} /> Legal &amp; Compliance
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0 }}>
            <strong>Effective Date:</strong> August 16, 2026 &nbsp;·&nbsp; <strong>Last Updated:</strong> August 16, 2026
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40, lineHeight: 1.75, fontSize: 15, color: "var(--text-secondary)" }}>
          
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Eye size={20} color="var(--brand-primary)" /> 1. Information We Collect
            </h2>
            <p>
              At <strong>WebGuard AI</strong>, we collect and process only the data strictly necessary to deliver our automated security auditing, vulnerability assessment, and remediation services:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>
                <strong>Account Data:</strong> When you register via email or Google OAuth, we store your email address, user ID, account credentials, and billing profile via Supabase.
              </li>
              <li>
                <strong>Target Domain &amp; URL Data:</strong> Hostnames, domain names, and URLs you submit for compliance and security auditing.
              </li>
              <li>
                <strong>Security Audit Logs &amp; Reports:</strong> HTTP response headers, SSL/TLS certificate validity metadata, open directory probes, compliance scores, and remediation histories.
              </li>
              <li>
                <strong>Technical Telemetry:</strong> IP address, browser user-agent, operating system, and diagnostic session metadata collected solely for application security and rate limiting.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={20} color="var(--brand-primary)" /> 2. How We Use Your Information
            </h2>
            <p>We use the collected information exclusively for the following operational and security purposes:</p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>To execute automated non-invasive HTTP security audits and generate real-time compliance reports.</li>
              <li>To issue real-time email and webhook alerts when an SSL certificate is nearing expiration or critical headers are missing.</li>
              <li>To tailor and generate framework-specific AI fix guides (for Cursor, Bolt, Next.js, WordPress, and Nginx).</li>
              <li>To render dynamic Trust Seal verification badges on authorized domains.</li>
              <li>We <strong>NEVER</strong> sell, rent, or monetize your scanned data or personal information to third-party advertisers.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Database size={20} color="var(--brand-primary)" /> 3. Data Security &amp; Storage
            </h2>
            <p>
              Your security and privacy are fundamental to our architecture. We employ enterprise-grade security controls:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>
                <strong>Encryption in Transit:</strong> All HTTP traffic and API requests are enforced over TLS 1.3 with Strict Transport Security (HSTS).
              </li>
              <li>
                <strong>Encrypted Database Storage:</strong> All user authentication and domain records are hosted in encrypted PostgreSQL databases managed by Supabase with Row Level Security (RLS) policies.
              </li>
              <li>
                <strong>Secure Cloud Infrastructure:</strong> Backend scanner microservices run in isolated containerized environments with zero public exposure of sensitive environment credentials.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle2 size={20} color="var(--brand-primary)" /> 4. Your Rights &amp; Data Control
            </h2>
            <p>
              Depending on your location (including GDPR and CCPA jurisdictions), you hold full sovereignty over your data:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Right to Access:</strong> You may export all your scan logs and domain metrics at any time from your Dashboard.</li>
              <li><strong>Right to Erasure:</strong> You can delete any connected website domain, scan history, or request full account termination.</li>
              <li><strong>Contact Privacy Team:</strong> For privacy inquiries or data deletion requests, contact us at <code style={{ fontSize: 13, background: "var(--canvas-inset)", padding: "2px 6px", borderRadius: 4 }}>privacy@webguard.ai</code>.</li>
            </ul>
          </section>

        </div>
      </main>

      {/* ─── Simple Footer ──────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--canvas-border)", padding: "32px 0", background: "var(--canvas-inset)" }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>&copy; 2026 WebGuard AI. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <Link href="/terms" style={{ color: "var(--text-secondary)" }}>Terms &amp; Conditions</Link>
            <Link href="/cookies" style={{ color: "var(--text-secondary)" }}>Cookie Policy</Link>
            <Link href="/compliance" style={{ color: "var(--text-secondary)" }}>Security Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
