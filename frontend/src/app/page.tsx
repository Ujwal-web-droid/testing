"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ScanSearch,
  Wrench,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  Check,
  Loader2,
  Lock,
  ShieldCheck,
  FileWarning,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [scanDomain, setScanDomain] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleQuickScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanDomain.trim()) return;
    setScanning(true);
    setError("");
    setScanResult(null);
    try {
      const domain = scanDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const res = await fetch(`/api/quick-scan?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Scan failed");
      }
      setScanResult(data);
    } catch (err: any) {
      setError(err.message || "Scan failed. Please check the domain and try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      {/* ─── Navigation ──────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--canvas-border)",
        }}
      >
        <div
          className="section-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>
              Features
            </a>
            <a href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>
              Pricing
            </a>
            <Link
              href="/dashboard"
              className="btn btn-primary btn-sm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
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
              Dashboard <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section style={{ paddingTop: 130, paddingBottom: 72, textAlign: "center" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 24px" }} className="animate-fade-in">
          <div
            className="badge badge-info"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "var(--brand-light)",
              color: "var(--brand-primary)",
              border: "1px solid rgba(37,99,235,0.2)",
              fontSize: 12.5,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <Zap size={13} /> Safe &amp; Lightning-fast · No port scanning
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 16,
              letterSpacing: "-0.03em",
              color: "var(--brand-deep)",
            }}
          >
            Your Website&apos;s Security Score<br />
            <span style={{ color: "var(--brand-primary)" }}>in Under 10 Seconds</span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            Automated compliance auditing, header hardening analysis, and a public trust seal for your e-commerce store — all from a single API call.
          </p>

          {/* Quick Scan Input */}
          <form onSubmit={handleQuickScan} style={{ maxWidth: 520, margin: "0 auto 20px" }}>
            <div
              style={{
                display: "flex",
                boxShadow: "var(--shadow-lg)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--canvas-border)",
                background: "var(--canvas-raised)",
              }}
            >
              <input
                type="text"
                placeholder="Enter your domain (e.g., shopify.com)"
                value={scanDomain}
                onChange={(e) => setScanDomain(e.target.value)}
                style={{
                  flex: 1,
                  height: 52,
                  fontSize: 15,
                  padding: "0 18px",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  background: "transparent",
                }}
              />
              <button
                type="submit"
                disabled={scanning}
                style={{
                  height: 52,
                  padding: "0 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "var(--brand-primary)",
                  border: "none",
                  cursor: scanning ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {scanning ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Scanning…
                  </>
                ) : (
                  <>
                    <ScanSearch size={16} /> Free Scan
                  </>
                )}
              </button>
            </div>
          </form>

          {error && <p style={{ color: "var(--danger)", fontSize: 13, fontWeight: 500, marginTop: 8 }}>{error}</p>}

          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
            <Check size={13} style={{ display: "inline", verticalAlign: "middle", color: "var(--success)" }} /> No signup required &nbsp;·&nbsp;
            <Check size={13} style={{ display: "inline", verticalAlign: "middle", color: "var(--success)" }} /> Safe &amp; non-invasive &nbsp;·&nbsp;
            <Check size={13} style={{ display: "inline", verticalAlign: "middle", color: "var(--success)" }} /> Results in seconds
          </p>

          {/* Quick Scan Result */}
          {scanResult && (
            <div
              className="animate-fade-in"
              style={{
                marginTop: 36,
                padding: 28,
                textAlign: "left",
                background: "var(--canvas-raised)",
                border: "1px solid var(--canvas-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-deep)", marginBottom: 4 }}>{scanResult.domain}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Scanned in {(scanResult.scan_duration_ms / 1000).toFixed(1)}s</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 900,
                      color: scanResult.overall_score >= 80 ? "var(--success)" : scanResult.overall_score >= 50 ? "var(--warning)" : "var(--danger)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {scanResult.overall_score}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>out of 100</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                <ResultMiniCard icon={<Lock size={18} />} title="SSL/TLS" score={scanResult.ssl?.score || 0} max={30} />
                <ResultMiniCard icon={<ShieldCheck size={18} />} title="Headers" score={scanResult.headers?.score || 0} max={50} />
                <ResultMiniCard icon={<FileWarning size={18} />} title="File Safety" score={scanResult.sensitive_files?.score || 0} max={20} />
              </div>
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Link
                  href="/dashboard"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 20px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--brand-primary)",
                    color: "#FFFFFF",
                    fontSize: 13.5,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Get Full Report &amp; Fix Guide <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "80px 0", background: "var(--canvas-raised)", borderTop: "1px solid var(--canvas-border)", borderBottom: "1px solid var(--canvas-border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em", color: "var(--brand-deep)" }}>
              Everything You Need to <span style={{ color: "var(--brand-primary)" }}>Secure &amp; Certify</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>
              From instant scanning to automated monitoring — we handle the complexity so you can focus on selling.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <FeatureCard icon={<ScanSearch size={22} />} title="Lightning Scanner" description="Checks SSL validity, 7+ security headers, and 15+ sensitive file exposures in under 10 seconds. No port scanning, no IP bans." />
            <FeatureCard icon={<Wrench size={22} />} title="One-Click Fix Guide" description="Get step-by-step code snippets for Apache, Nginx, Express, Cloudflare, and WordPress. Copy-paste fixes — no expertise required." />
            <FeatureCard icon={<BadgeCheck size={22} />} title="Trust Seal Widget" description="Embed a dynamic, verified trust badge on your site. Linked to a live public compliance dashboard — boost customer confidence." />
            <FeatureCard icon={<BarChart3 size={22} />} title="Compliance Dashboard" description="Track security scores over time. Visual charts, trend analysis, and historical scan data — all in one clean interface." />
            <FeatureCard icon={<Bell size={22} />} title="Automated Monitoring" description="Daily cron scans detect SSL expiry, score drops, and new vulnerabilities. Get instant alerts via email and WhatsApp." />
            <FeatureCard icon={<Building2 size={22} />} title="Agency Dashboard" description="Manage up to 50 client domains from a single account. White-label seal branding and API access included." />
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "96px 0 80px", background: "var(--canvas)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 60px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                background: "rgba(37, 99, 235, 0.1)",
                color: "var(--brand-primary)",
                border: "1px solid rgba(37, 99, 235, 0.25)",
                marginBottom: 16,
              }}
            >
              <Zap size={13} /> Predictable SaaS Pricing
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, marginBottom: 14, letterSpacing: "-0.03em", color: "var(--brand-deep)" }}>
              Simple, <span style={{ color: "var(--warning)" }}>Transparent</span> Pricing
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
              High-performance security for developers and agencies. No hidden fees.
            </p>
          </div>

          {/* 3-Column Pricing Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "stretch" }}>
            
            {/* TIER 1: FREE PLAN */}
            <div
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "var(--canvas-raised)",
                border: "1px solid var(--canvas-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "var(--text-primary)" }}>Free Plan</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", minHeight: 38, marginBottom: 20 }}>
                  Essential vulnerability check to test your website&apos;s baseline defense.
                </p>
                <div style={{ paddingBottom: 20, marginBottom: 24, borderBottom: "1px solid var(--canvas-border)" }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>$0</span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}> / month</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> 1 domain
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> 1 total scan (manual run only)
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> Basic security report
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>✕</span> No automated monitoring
                  </li>
                </ul>
              </div>
              <Link
                href="/signup?plan=free"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  padding: "12px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--canvas-border)",
                  background: "var(--canvas-inset)",
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Get Started Free
              </Link>
            </div>

            {/* TIER 2: PRO PLAN (HIGHLIGHTED) */}
            <div
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "var(--canvas-raised)",
                border: "2px solid var(--brand-primary)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "0 20px 40px -15px rgba(37, 99, 235, 0.25)",
                position: "relative",
                transform: "translateY(-6px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--brand-primary)",
                  color: "white",
                  padding: "5px 18px",
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Zap size={12} fill="currentColor" /> MOST POPULAR
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Pro Plan</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "rgba(37, 99, 235, 0.1)", color: "var(--brand-primary)" }}>Best Value</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", minHeight: 38, marginBottom: 20 }}>
                  Complete hands-off protection and real-time trust seal for fast-growing sites.
                </p>
                <div style={{ paddingBottom: 20, marginBottom: 24, borderBottom: "1px solid var(--canvas-border)" }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>$39</span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}> / month</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} /> <strong>Up to 3 domains</strong>
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} /> Unlimited manual scans
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} /> Daily automated monitoring
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} /> Embeddable Trust Seal widget
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} /> One-click fix guides &amp; AI prompts
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} /> Instant email alerts
                  </li>
                </ul>
              </div>
              <Link
                href="/signup?plan=pro"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 20px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--brand-primary)",
                  color: "#FFFFFF",
                  fontSize: 13.5,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                }}
              >
                Start Pro Trial <ChevronRight size={15} />
              </Link>
            </div>

            {/* TIER 3: AGENCY PLAN */}
            <div
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "var(--canvas-raised)",
                border: "1px solid var(--canvas-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "var(--text-primary)" }}>Agency Plan</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", minHeight: 38, marginBottom: 20 }}>
                  Built for agencies and dev shops managing multiple client web applications.
                </p>
                <div style={{ paddingBottom: 20, marginBottom: 24, borderBottom: "1px solid var(--canvas-border)" }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>$99</span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}> / month</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> <strong>Up to 15 domains</strong>
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> Unlimited scans
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> Daily automated monitoring
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> White-label PDF reports
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> Client management dashboard
                  </li>
                  <li style={{ fontSize: 13.5, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} /> Priority support &amp; alerts
                  </li>
                </ul>
              </div>
              <Link
                href="/signup?plan=agency"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  padding: "12px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--canvas-border)",
                  background: "var(--canvas-inset)",
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Get Agency Plan
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

function ResultMiniCard({ icon, title, score, max }: { icon: React.ReactNode; title: string; score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--danger)";
  return (
    <div style={{ background: "var(--canvas-inset)", borderRadius: "var(--radius-lg)", padding: 16, textAlign: "center", border: "1px solid var(--canvas-border)" }}>
      <div style={{ color: "var(--brand-primary)", marginBottom: 6, display: "flex", justifyContent: "center" }}>{icon}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{score}<span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/{max}</span></div>
      <div style={{ marginTop: 8, height: 4, background: "var(--canvas-border)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div
      style={{
        padding: 28,
        borderRadius: "var(--radius-xl)",
        background: "var(--canvas-raised)",
        border: "1px solid var(--canvas-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "var(--brand-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--brand-primary)",
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-deep)", marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{description}</p>
    </div>
  );
}
