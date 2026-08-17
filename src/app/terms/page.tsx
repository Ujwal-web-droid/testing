"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Scale, AlertTriangle, CreditCard, ShieldAlert } from "lucide-react";

export default function TermsAndConditionsPage() {
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
            <Scale size={13} /> User Agreement
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0 }}>
            <strong>Effective Date:</strong> August 16, 2026 &nbsp;·&nbsp; <strong>Version:</strong> 1.0.0
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40, lineHeight: 1.75, fontSize: 15, color: "var(--text-secondary)" }}>
          
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or registering for an account on <strong>WebGuard AI</strong> (&quot;the Service&quot;), you agree to be bound by these Terms &amp; Conditions, our Privacy Policy, and any applicable local or international laws. If you disagree with any part of these terms, you must immediately discontinue use of the platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              2. Description of Service
            </h2>
            <p>
              WebGuard AI provides automated, non-invasive website security auditing tools, including SSL/TLS certificate monitoring, HTTP security header evaluation, public sensitive file probing, dynamic Trust Seal generation, and automated AI remediation guides for developers and agencies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={20} color="var(--warning)" /> 3. Authorized Use &amp; User Responsibilities
            </h2>
            <p>
              Security testing carries strict ethical and legal boundaries. By using WebGuard AI, you explicitly affirm and warrant that:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>
                <strong>Ownership &amp; Authorization:</strong> You only initiate security scans against web domains, servers, or web applications that you own, operate, or have received explicit, written permission from the owner to test.
              </li>
              <li>
                <strong>No Malicious Activity:</strong> You will not use WebGuard AI for unauthorized penetration testing, vulnerability exploitation, distributed denial-of-service (DDoS) attempts, or any malicious purposes.
              </li>
              <li>
                <strong>Account Responsibility:</strong> You are solely responsible for maintaining the confidentiality of your authentication credentials and all actions taken under your account.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <CreditCard size={20} color="var(--brand-primary)" /> 4. Subscriptions, Billing &amp; Cancellations
            </h2>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>
                <strong>Recurring Billing:</strong> Paid subscriptions (Pro Plan at $39/month, Agency Plan at $99/month) are billed automatically in advance on a recurring monthly or annual billing cycle.
              </li>
              <li>
                <strong>Cancellation:</strong> You may cancel your subscription at any time directly through your account dashboard. Your access will remain active until the end of your paid billing period.
              </li>
              <li>
                <strong>Refund Policy:</strong> Due to the immediate allocation of automated scanning infrastructure and computational resources, fees are non-refundable for active billing cycles.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldAlert size={20} color="var(--danger)" /> 5. Limitation of Liability &amp; Disclaimers
            </h2>
            <p>
              WebGuard AI conducts external, lightweight HTTP/TLS surface audits and does not guarantee that your website is 100% immune from all cyber threats, zero-day vulnerabilities, or internal server breaches. The Service and AI remediation code patches are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.
            </p>
            <p style={{ marginTop: 12 }}>
              To the maximum extent permitted by law, WebGuard AI shall not be liable for any indirect, incidental, or consequential damages resulting from website configurations, third-party hosting failures, or security incidents.
            </p>
          </section>

        </div>
      </main>

      {/* ─── Simple Footer ──────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--canvas-border)", padding: "32px 0", background: "var(--canvas-inset)" }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>&copy; 2026 WebGuard AI. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <Link href="/privacy" style={{ color: "var(--text-secondary)" }}>Privacy Policy</Link>
            <Link href="/cookies" style={{ color: "var(--text-secondary)" }}>Cookie Policy</Link>
            <Link href="/compliance" style={{ color: "var(--text-secondary)" }}>Security Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
