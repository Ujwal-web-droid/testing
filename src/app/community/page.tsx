"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, MessageSquare, Users, ExternalLink, Sparkles, Bell, Terminal, Flame, Award, CheckCircle2, Code2, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function CommunityPage() {
  const channels = [
    { name: "#announcements", icon: <Bell size={18} color="var(--brand-primary)" />, desc: "Real-time updates on new scanner rules, MCP releases, and zero-day threat patches." },
    { name: "#feature-requests", icon: <Flame size={18} color="var(--warning)" />, desc: "Vote on upcoming platform features, suggest new framework templates, and share product feedback." },
    { name: "#mcp-and-ai-tools", icon: <Terminal size={18} color="var(--brand-primary)" />, desc: "Discuss Model Context Protocol integration in Cursor, Windsurf, Claude Desktop, and Antigravity." },
    { name: "#general-help", icon: <MessageSquare size={18} color="var(--success)" />, desc: "Ask questions, debug tricky CSP violations, and get guidance from our engineers and community." },
    { name: "#showcase-and-wins", icon: <Award size={18} color="var(--brand-primary)" />, desc: "Share your 100/100 audit scores, Trust Seal implementations, and agency security client wins." },
  ];

  const perks = [
    "Direct access to WebGuard AI core engineers and security researchers.",
    "Early beta access to new scanner probes and AI remediation templates.",
    "Weekly security office hours and live vulnerability breakdown sessions.",
    "Exclusive agency lead generation and compliance consulting network.",
  ];

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
              background: "var(--brand-light)",
              border: "1px solid rgba(37,99,235,0.2)",
              color: "var(--brand-primary)",
              fontSize: 12.5,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <Users size={14} /> 5,000+ Developers &amp; Security Engineers
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 14 }}>
            Join the WebGuard AI Community
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Connect directly with developers, security architects, and agencies automating modern web security and compliance.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 26px",
                background: "var(--brand-primary)",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: "var(--radius-lg)",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
            >
              <MessageSquare size={16} /> Join Discord Community <ExternalLink size={14} style={{ opacity: 0.8 }} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                background: "var(--canvas-inset)",
                color: "var(--brand-deep)",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--canvas-border)",
                textDecoration: "none",
              }}
            >
              <Code2 size={16} /> Explore GitHub Repos
            </a>
          </div>
        </div>
      </header>

      {/* ─── Main Grid ───────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32 }}>

          {/* Left: Discord Channels */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--canvas-border)", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--brand-deep)", display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare size={18} color="var(--brand-primary)" /> Featured Discord Channels
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "monospace" }}>#webguard-hq</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {channels.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    padding: 20,
                    borderRadius: "var(--radius-xl)",
                    background: "var(--canvas-raised)",
                    border: "1px solid var(--canvas-border)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "var(--canvas-inset)",
                      border: "1px solid var(--canvas-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {ch.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-deep)", fontFamily: "monospace", marginBottom: 4 }}>
                      {ch.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                      {ch.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Perks + Code of Conduct */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Perks */}
            <div style={{ padding: 28, borderRadius: "var(--radius-2xl)", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand-deep)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} color="var(--warning)" /> Why Join Us?
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {perks.map((perk, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code of Conduct */}
            <div style={{ padding: 24, borderRadius: "var(--radius-2xl)", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", boxShadow: "var(--shadow-xs)" }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand-deep)", marginBottom: 8 }}>
                Community Code of Conduct
              </h4>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                We are committed to providing a friendly, safe, and welcoming environment. Respect fellow developers and report vulnerabilities responsibly.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
