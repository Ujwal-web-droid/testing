"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, BookOpen, Terminal, Sparkles, CheckCircle2, ChevronRight, Lock, Code2 } from "lucide-react";

export default function DocsPage() {
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
            <Link href="/api-docs" className="btn btn-ghost btn-sm">
              API Docs
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
            <BookOpen size={13} /> Official Documentation
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            WebGuard AI Documentation
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Learn how to automate HTTP security header compliance, monitor SSL/TLS certificates, and embed dynamic trust seals on your websites.
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          
          {/* Quick Start Card */}
          <div className="card" style={{ padding: 28, background: "var(--canvas-raised)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginTop: 0, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="var(--brand-primary)" /> Quick Start Guide
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              Audit your domain in seconds without installing any server agents or dependencies.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>1</span>
                <span style={{ fontSize: 13.5, color: "var(--text-primary)" }}>Enter your website domain (e.g. <code>example.com</code>) in the Quick Scan box or Dashboard.</span>
              </div>
              <div style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>2</span>
                <span style={{ fontSize: 13.5, color: "var(--text-primary)" }}>Review your real-time compliance score (0–100), SSL expiry tally, and header findings.</span>
              </div>
              <div style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>3</span>
                <span style={{ fontSize: 13.5, color: "var(--text-primary)" }}>Click <strong>Apply Fix Guide</strong> to get tailored AI prompts and config snippets for your stack.</span>
              </div>
            </div>
          </div>

          {/* Core Modules Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <Link href="/api-docs" className="card card-interactive" style={{ padding: 24, textDecoration: "none" }}>
              <Code2 size={24} color="var(--brand-primary)" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>REST API Reference</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Integrate automated scans into your CI/CD pipelines and webhooks.
              </p>
            </Link>

            <Link href="/guides" className="card card-interactive" style={{ padding: 24, textDecoration: "none" }}>
              <Terminal size={24} color="var(--brand-primary)" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Remediation Guides</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Step-by-step fix guides for Next.js, Vercel, WordPress, and Nginx.
              </p>
            </Link>
          </div>

        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--canvas-border)", padding: "32px 0", background: "var(--canvas-inset)" }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>&copy; 2026 WebGuard AI. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <Link href="/privacy" style={{ color: "var(--text-secondary)" }}>Privacy</Link>
            <Link href="/terms" style={{ color: "var(--text-secondary)" }}>Terms</Link>
            <Link href="/status" style={{ color: "var(--text-secondary)" }}>Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
