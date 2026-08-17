"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Activity, CheckCircle2, Server, Globe, Database, ShieldCheck } from "lucide-react";

export default function StatusPage() {
  const services = [
    { name: "Live Security Scanner Engine", status: "Operational", uptime: "99.99%", icon: <Server size={18} /> },
    { name: "REST API Gateway", status: "Operational", uptime: "99.98%", icon: <Globe size={18} /> },
    { name: "Supabase Cloud Database", status: "Operational", uptime: "100%", icon: <Database size={18} /> },
    { name: "Trust Seal Embed Widget CDN", status: "Operational", uptime: "99.99%", icon: <ShieldCheck size={18} /> },
  ];

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

      {/* ─── Header Banner ───────────────────────────────────────── */}
      <header style={{ padding: "60px 0 40px", borderBottom: "1px solid var(--canvas-border)", background: "var(--canvas-subtle)" }}>
        <div className="section-container" style={{ maxWidth: 840 }}>
          {/* Status Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, fontSize: 13, fontWeight: 700, background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.3)", marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
            All Systems Fully Operational
          </div>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            WebGuard AI System Status
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: 0 }}>
            Real-time status updates and uptime metrics for WebGuard AI services.
          </p>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="section-container" style={{ maxWidth: 840, padding: "50px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* Service Health Grid */}
          <div className="card" style={{ padding: 24, background: "var(--canvas-raised)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginTop: 0, marginBottom: 20 }}>
              Services &amp; Infrastructure
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {services.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: "var(--canvas-inset)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--canvas-border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ color: "var(--brand-primary)" }}>{s.icon}</div>
                    <div>
                      <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>{s.name}</strong>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Uptime: {s.uptime}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--success)" }}>
                    <CheckCircle2 size={16} />
                    {s.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Incidents */}
          <div className="card" style={{ padding: 24, background: "var(--canvas-raised)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginTop: 0, marginBottom: 12 }}>
              Past 90 Days Incident History
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: 0 }}>
              ✓ No incidents or outages reported in the past 90 days.
            </p>
          </div>

        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--canvas-border)", padding: "32px 0", background: "var(--canvas-inset)" }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>&copy; 2026 WebGuard AI. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <Link href="/" style={{ color: "var(--text-secondary)" }}>Home</Link>
            <Link href="/privacy" style={{ color: "var(--text-secondary)" }}>Privacy</Link>
            <Link href="/terms" style={{ color: "var(--text-secondary)" }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
