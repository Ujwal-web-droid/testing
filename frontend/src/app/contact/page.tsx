"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Send, CheckCircle2, Mail, HelpCircle, Sparkles, MessageSquare, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "general", message: "" });
    setSubmitted(false);
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

      {/* ─── Main Content ────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: 760, width: "100%", margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
            <Sparkles size={14} /> 24/7 Security Support
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 40px)", fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 12 }}>
            Contact WebGuard AI Support
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Have a question about our scanner, MCP integration, or enterprise billing? We&apos;re here to help.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: "var(--canvas-raised)",
            border: "1px solid var(--canvas-border)",
            borderRadius: "var(--radius-2xl)",
            padding: "36px 32px",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 20 }}>
                {/* Name */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 8 }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "var(--canvas)",
                      border: "1.5px solid var(--canvas-border)",
                      borderRadius: "var(--radius-lg)",
                      color: "var(--text-primary)",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 8 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "var(--canvas)",
                      border: "1.5px solid var(--canvas-border)",
                      borderRadius: "var(--radius-lg)",
                      color: "var(--text-primary)",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 8 }}>
                  Subject / Issue Type
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--canvas)",
                    border: "1.5px solid var(--canvas-border)",
                    borderRadius: "var(--radius-lg)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="general">General Query</option>
                  <option value="scanner">Security Scanner Issue</option>
                  <option value="mcp">MCP Server &amp; IDE Integration</option>
                  <option value="billing">Billing &amp; Subscription Plan</option>
                  <option value="custom">Enterprise / Custom Feature Request</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 8 }}>
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your issue, framework stack, or question in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "var(--canvas)",
                    border: "1.5px solid var(--canvas-border)",
                    borderRadius: "var(--radius-lg)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              {/* Submit */}
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
                  <>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "cyberSpin 0.6s linear infinite" }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ── Success State ── */
            <div style={{ padding: "36px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--success-light)",
                  border: "1px solid rgba(22,163,74,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <CheckCircle2 size={32} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--brand-deep)", marginBottom: 8 }}>
                Message Sent Successfully!
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.6 }}>
                Thank you, <strong style={{ color: "var(--brand-deep)" }}>{formData.name}</strong>. Our security engineering team will reply to <span style={{ color: "var(--brand-primary)", fontWeight: 600 }}>{formData.email}</span> within 24 hours.
              </p>
              <button
                onClick={handleReset}
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  background: "var(--canvas-inset)",
                  color: "var(--brand-deep)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  border: "1px solid var(--canvas-border)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                }}
              >
                <MessageSquare size={14} /> Send Another Message
              </button>
            </div>
          )}
        </div>

        {/* Quick Contact Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 24 }}>
          <div style={{ padding: 20, borderRadius: "var(--radius-xl)", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--brand-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Mail size={20} color="var(--brand-primary)" />
            </div>
            <div>
              <h4 style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 2 }}>Direct Email</h4>
              <span style={{ fontSize: 13.5, color: "var(--text-secondary)", fontFamily: "monospace" }}>support@webguard.ai</span>
            </div>
          </div>

          <div style={{ padding: 20, borderRadius: "var(--radius-xl)", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow-xs)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--success-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <HelpCircle size={20} color="var(--success)" />
            </div>
            <div>
              <h4 style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 2 }}>Help Center</h4>
              <Link href="/help" style={{ fontSize: 13.5, color: "var(--brand-primary)", textDecoration: "none", fontWeight: 600 }}>
                Browse FAQs &amp; Guides →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
