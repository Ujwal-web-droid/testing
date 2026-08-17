"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Terminal, Sparkles, Globe, Server, Check, Copy } from "lucide-react";

export default function FixGuidesPage() {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const nextSnippet = `// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self' https: data: 'unsafe-inline';" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ],
      },
    ];
  },
};`;

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
              <ArrowLeft size={14} /> Home
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
            <Terminal size={13} /> Remediation Library
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Security Hardening Fix Guides
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Copy-paste configurations to immediately eliminate security header warnings on any tech stack.
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          
          {/* Guide 1: Next.js / AI Builder */}
          <div className="card" style={{ padding: 28, background: "var(--canvas-raised)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Sparkles size={20} color="var(--brand-primary)" />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Next.js / AI Builder (Cursor, Bolt, v0)
              </h2>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: "0 0 16px 0" }}>
              Add secure response headers to your <code style={{ fontSize: 12 }}>next.config.mjs</code> or ask your AI coding assistant.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>next.config.mjs</span>
              <button onClick={() => handleCopy(nextSnippet, "next")} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "2px 8px" }}>
                {copiedKey === "next" ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Code</>}
              </button>
            </div>
            <div className="code-block" style={{ fontSize: 12.5 }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{nextSnippet}</pre>
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
            <Link href="/api-docs" style={{ color: "var(--text-secondary)" }}>API Reference</Link>
            <Link href="/status" style={{ color: "var(--text-secondary)" }}>Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
