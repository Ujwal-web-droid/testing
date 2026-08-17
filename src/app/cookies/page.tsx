"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Cookie, CheckCircle2, Sliders, ShieldCheck } from "lucide-react";

export default function CookiePolicyPage() {
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
            <Cookie size={13} /> Browser Storage Policy
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Cookie Policy
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0 }}>
            <strong>Effective Date:</strong> August 16, 2026
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40, lineHeight: 1.75, fontSize: 15, color: "var(--text-secondary)" }}>
          
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              1. What Are Cookies?
            </h2>
            <p>
              Cookies and local storage tokens are small text files stored securely on your browser when you visit websites. They enable the web platform to remember your login session, persist your dashboard preferences, and safeguard your authentication state across page requests.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldCheck size={20} color="var(--brand-primary)" /> 2. How WebGuard AI Uses Cookies
            </h2>
            <p>
              We believe in minimal, strictly functional cookie usage. We categorize our cookies as follows:
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 16 }}>
              <div className="card" style={{ padding: 20, background: "var(--canvas-raised)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <strong style={{ fontSize: 15, color: "var(--text-primary)" }}>Essential Authentication Cookies (Required)</strong>
                </div>
                <p style={{ fontSize: 13.5, margin: 0, color: "var(--text-secondary)" }}>
                  Provided via Supabase SSR (<code style={{ fontSize: 12 }}>sb-access-token</code>, <code style={{ fontSize: 12 }}>sb-refresh-token</code>) to verify your authenticated identity, secure your dashboard sessions, and prevent cross-site request forgery (CSRF).
                </p>
              </div>

              <div className="card" style={{ padding: 20, background: "var(--canvas-raised)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <CheckCircle2 size={16} color="var(--brand-primary)" />
                  <strong style={{ fontSize: 15, color: "var(--text-primary)" }}>Preference &amp; UI State Cookies</strong>
                </div>
                <p style={{ fontSize: 13.5, margin: 0, color: "var(--text-secondary)" }}>
                  Used to remember your UI preferences, such as Trust Seal customizer configurations and sidebar state.
                </p>
              </div>
            </div>

            <p style={{ marginTop: 20, fontWeight: 600, color: "var(--text-primary)" }}>
              🚫 Zero Third-Party Advertising Trackers: WebGuard AI does not use invasive advertising cookies or cross-site tracking networks.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Sliders size={20} color="var(--brand-primary)" /> 3. Managing Cookies
            </h2>
            <p>
              You have full control over your browser&apos;s cookies. You can configure your browser to block or alert you about cookies in your browser settings (e.g. Chrome, Firefox, Safari, Edge). Please note that disabling essential authentication cookies will prevent you from logging into your WebGuard AI Dashboard.
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
            <Link href="/terms" style={{ color: "var(--text-secondary)" }}>Terms &amp; Conditions</Link>
            <Link href="/compliance" style={{ color: "var(--text-secondary)" }}>Security Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
