"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Code2, Copy, Check, Terminal } from "lucide-react";

export default function ApiDocsPage() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const quickScanCurl = `curl -X GET "https://api.webguard.ai/api/quick-scan?domain=evostackr.in"`;

  const quickScanJson = `{
  "domain": "evostackr.in",
  "overall_score": 53,
  "grade": "D",
  "ssl": {
    "valid": true,
    "days_until_expiry": 89,
    "issuer": "Let's Encrypt"
  },
  "headers": {
    "headers_checked": 7,
    "headers_present": 2,
    "score": 13
  }
}`;

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
            <Link href="/docs" className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Docs
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
            <Code2 size={13} /> Developer API
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            REST API Reference
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Programmatically trigger security audits and retrieve compliance scores.
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          
          {/* Endpoint 1: Quick Scan */}
          <div className="card" style={{ padding: 28, background: "var(--canvas-raised)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span className="badge badge-info" style={{ fontWeight: 800 }}>GET</span>
              <code style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>/api/quick-scan</code>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 16px 0" }}>
              Runs a lightweight public security audit for any domain without authentication.
            </p>

            {/* Request Snippet */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Request Example</span>
                <button onClick={() => handleCopy(quickScanCurl, "curl")} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "2px 8px" }}>
                  {copiedKey === "curl" ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <div className="code-block" style={{ fontSize: 12.5 }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{quickScanCurl}</pre>
              </div>
            </div>

            {/* Response Snippet */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Response JSON (200 OK)
              </span>
              <div className="code-block" style={{ fontSize: 12.5 }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{quickScanJson}</pre>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--canvas-border)", padding: "32px 0", background: "var(--canvas-inset)" }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>&copy; 2026 WebGuard AI. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <Link href="/docs" style={{ color: "var(--text-secondary)" }}>Docs</Link>
            <Link href="/guides" style={{ color: "var(--text-secondary)" }}>Guides</Link>
            <Link href="/privacy" style={{ color: "var(--text-secondary)" }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
