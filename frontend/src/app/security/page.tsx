"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, ShieldAlert, CheckCircle2, Lock, Send, Check, X, KeyRound, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

export default function SecurityDisclosurePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", severity: "high", target: "", description: "", poc: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 600);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", severity: "high", target: "", description: "", poc: "" });
    setSubmitted(false);
  };

  const inScope = [
    "Remote Code Execution (RCE) or command injection.",
    "Authentication bypass or tenant data isolation failures.",
    "SQL/NoSQL Injection or Server-Side Request Forgery (SSRF).",
    "Cross-Site Scripting (XSS) in authenticated portals.",
    "MCP Server privilege escalation vulnerabilities.",
  ];

  const outScope = [
    "Volumetric Denial of Service (DoS / DDoS) attacks.",
    "Social engineering, phishing, or physical attacks.",
    "Missing DNSSEC or SPF/DMARC informational records.",
    "Self-XSS or issues requiring rooted client devices.",
    "Scanner probes against customer domains without permission.",
  ];

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 8,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: "var(--canvas)",
    border: "1.5px solid var(--canvas-border)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontSize: 14, outline: "none",
  };

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ─── Navigation ──────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--canvas-border)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
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

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-secondary)",
                background: "var(--canvas-inset)",
                border: "1px solid var(--canvas-border)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <Link
              href="/dashboard"
              style={{
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "#FFFFFF",
                background: "var(--brand-primary)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Header ─────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--canvas-border)", background: "var(--canvas-raised)", padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "var(--warning-light)",
              border: "1px solid rgba(217,119,6,0.25)",
              color: "var(--warning)",
              fontSize: 12.5,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <ShieldAlert size={14} /> Responsible Vulnerability Disclosure &amp; Bug Bounty
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 14 }}>
            Report a Security Bug
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            We take security seriously. If you discover a vulnerability in WebGuard AI, we appreciate your help disclosing it responsibly.
          </p>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: 1040, width: "100%", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Policy Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 36 }}>
          {[
            { icon: <Lock size={20} color="var(--brand-primary)" />, bg: "var(--brand-light)", border: "rgba(37,99,235,0.2)", title: "Safe Harbor Protection", desc: "We pledge not to pursue legal action against researchers who adhere to good-faith responsible disclosure guidelines." },
            { icon: <Sparkles size={20} color="var(--success)" />, bg: "var(--success-light)", border: "rgba(22,163,74,0.2)", title: "Rapid SLA Response", desc: "Our security engineering team commits to acknowledging all valid reports within 12 hours and triaging within 24 hours." },
            { icon: <KeyRound size={20} color="var(--warning)" />, bg: "var(--warning-light)", border: "rgba(217,119,6,0.2)", title: "PGP Encrypted Intake", desc: "For highly sensitive zero-day issues, you can submit encrypted reports directly to security@webguard.ai." },
          ].map((card, i) => (
            <div key={i} style={{ padding: 24, borderRadius: "var(--radius-xl)", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", boxShadow: "var(--shadow-xs)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: card.bg, border: `1px solid ${card.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-deep)", marginBottom: 6 }}>{card.title}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Scope Boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 36 }}>
          {/* In-Scope */}
          <div style={{ padding: 28, borderRadius: "var(--radius-2xl)", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", boxShadow: "var(--shadow-xs)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--success)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Check size={16} color="var(--success)" /> In-Scope Vulnerabilities
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {inScope.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--success)", fontWeight: 800, flexShrink: 0 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Out-of-Scope */}
          <div style={{ padding: 28, borderRadius: "var(--radius-2xl)", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", boxShadow: "var(--shadow-xs)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--danger)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <X size={16} color="var(--danger)" /> Out-of-Scope Vulnerabilities
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {outScope.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--danger)", fontWeight: 800, flexShrink: 0 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reporting Form */}
        <div style={{ background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-2xl)", padding: "36px 32px", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--brand-deep)", marginBottom: 6 }}>
              Submit a Confidential Vulnerability Report
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Please include sufficient detail and reproduction steps so our security engineers can triage the finding.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Researcher Name / Alias</label>
                  <input type="text" required placeholder="Security Researcher" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Contact Email</label>
                  <input type="email" required placeholder="researcher@domain.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Estimated Severity</label>
                  <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="critical">Critical (CVSS 9.0 – 10.0)</option>
                    <option value="high">High (CVSS 7.0 – 8.9)</option>
                    <option value="medium">Medium (CVSS 4.0 – 6.9)</option>
                    <option value="low">Low (CVSS 0.1 – 3.9)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Target Endpoint or Component</label>
                  <input type="text" required placeholder="/api/quick-scan or MCP Server" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Vulnerability Summary &amp; Impact</label>
                <textarea required rows={4} placeholder="Explain the security flaw, how it occurs, and potential attack vector..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, resize: "vertical" as const }} />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Step-by-Step Reproduction / Proof of Concept (PoC)</label>
                <textarea required rows={4} placeholder="1. Send HTTP POST to endpoint... 2. Observe response payload..." value={formData.poc} onChange={(e) => setFormData({ ...formData, poc: e.target.value })} style={{ ...inputStyle, fontFamily: "monospace", resize: "vertical" as const }} />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 32px",
                  background: "var(--brand-primary)",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "var(--radius-lg)",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                }}
              >
                {loading ? (
                  <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "cyberSpin 0.6s linear infinite" }} /> Encrypting &amp; Submitting...</>
                ) : (
                  <><Send size={16} /> Submit Confidential Report</>
                )}
              </button>
            </form>
          ) : (
            <div style={{ padding: "36px 20px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--success-light)", border: "1px solid rgba(22,163,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <CheckCircle2 size={32} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--brand-deep)", marginBottom: 8 }}>Report Received Securely</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.6 }}>
                Thank you for helping keep WebGuard AI safe, <strong style={{ color: "var(--brand-deep)" }}>{formData.name}</strong>. Our security triage team will review your report within 12 hours.
              </p>
              <button onClick={handleReset} type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "var(--canvas-inset)", color: "var(--brand-deep)", fontSize: 13.5, fontWeight: 600, border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                Submit Another Report
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
