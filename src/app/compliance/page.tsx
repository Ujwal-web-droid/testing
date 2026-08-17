"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, ShieldCheck, Lock, Server, KeyRound, Bug, CheckCircle2 } from "lucide-react";

export default function SecurityCompliancePage() {
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, textTransform: "uppercase", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.25)", marginBottom: 16 }}>
            <ShieldCheck size={13} /> Enterprise Security Standards
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Security &amp; Compliance
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0 }}>
            How WebGuard AI safeguards your organization&apos;s infrastructure, audit telemetry, and application credentials.
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40, lineHeight: 1.75, fontSize: 15, color: "var(--text-secondary)" }}>
          
          {/* 1. Infrastructure Security */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Server size={20} color="var(--brand-primary)" /> 1. Infrastructure &amp; Cloud Security
            </h2>
            <p>
              WebGuard AI operates on high-availability, SOC 2 compliant cloud infrastructure. Our defense-in-depth architecture includes:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginTop: 16 }}>
              <div className="card" style={{ padding: "16px 20px", background: "var(--canvas-raised)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <strong style={{ fontSize: 14.5, color: "var(--text-primary)" }}>End-to-End TLS 1.3 Transport Encryption</strong>
                </div>
                <p style={{ fontSize: 13, margin: 0, color: "var(--text-secondary)" }}>
                  All communications between clients, Edge nodes, and database clusters are encrypted using TLS 1.3 with modern cipher suites and HSTS preloading.
                </p>
              </div>

              <div className="card" style={{ padding: "16px 20px", background: "var(--canvas-raised)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <strong style={{ fontSize: 14.5, color: "var(--text-primary)" }}>PostgreSQL Row Level Security (RLS)</strong>
                </div>
                <p style={{ fontSize: 13, margin: 0, color: "var(--text-secondary)" }}>
                  Strict RLS policies ensure that domain records, audit histories, and alert tokens are isolated and strictly accessible only by the authenticated owner.
                </p>
              </div>

              <div className="card" style={{ padding: "16px 20px", background: "var(--canvas-raised)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <strong style={{ fontSize: 14.5, color: "var(--text-primary)" }}>Zero-Credential Storage for Targets</strong>
                </div>
                <p style={{ fontSize: 13, margin: 0, color: "var(--text-secondary)" }}>
                  We never ask for or store target server SSH keys, root passwords, or admin credentials. Our auditing runs completely non-invasively through standard public HTTP/TLS protocol inspection.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Data Protection Standards */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={20} color="var(--brand-primary)" /> 2. Data Protection &amp; Privacy Adherence
            </h2>
            <p>
              We design our data pipelines in strict accordance with modern global security and privacy frameworks:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>GDPR &amp; CCPA Compliance:</strong> Full user sovereignty with one-click data deletion and automated report exports.</li>
              <li><strong>Automated Data Retention:</strong> Scan logs older than 90 days are archived or purged according to enterprise retention settings.</li>
              <li><strong>Principle of Least Privilege:</strong> Internal access to production infrastructure is strictly restricted with Multi-Factor Authentication (MFA).</li>
            </ul>
          </section>

          {/* 3. Responsible Disclosure Policy */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Bug size={20} color="var(--brand-primary)" /> 3. Responsible Disclosure Policy
            </h2>
            <p>
              We welcome security researchers and ethical hackers to report vulnerabilities found within WebGuard AI&apos;s own services.
            </p>
            <div style={{ padding: "20px 24px", background: "var(--canvas-inset)", border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-lg)", marginTop: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginTop: 0, marginBottom: 8 }}>
                Guidelines for Researchers:
              </h3>
              <ul style={{ paddingLeft: 18, margin: "0 0 16px 0", fontSize: 13.5, display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Do not access or modify data belonging to other customers.</li>
                <li>Do not perform denial-of-service (DoS/DDoS) attacks against our production clusters.</li>
                <li>Give us reasonable time to remediate issues before making public disclosures.</li>
              </ul>
              <p style={{ fontSize: 13.5, margin: 0 }}>
                Please submit any findings to our dedicated security team at <code style={{ fontSize: 13, background: "var(--canvas-raised)", padding: "2px 8px", borderRadius: 4, color: "var(--brand-primary)" }}>security@webguard.ai</code> with proof-of-concept steps.
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* ─── Simple Footer ──────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--canvas-border)", padding: "32px 0", background: "var(--canvas-inset)" }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>&copy; 2026 WebGuard AI. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <Link href="/privacy" style={{ color: "var(--text-secondary)" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: "var(--text-secondary)" }}>Terms &amp; Conditions</Link>
            <Link href="/cookies" style={{ color: "var(--text-secondary)" }}>Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
