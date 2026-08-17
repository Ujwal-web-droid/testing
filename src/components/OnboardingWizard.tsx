"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { websitesApi, scansApi, type ScanReport } from "@/lib/api";
import {
  Shield,
  Code2,
  Rocket,
  Building2,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
  FileWarning,
  Sparkles,
  Zap,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export type UserRole = "developer" | "founder" | "agency";

interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  popular?: boolean;
}

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("developer");
  const [domain, setDomain] = useState("");
  const [domainError, setDomainError] = useState("");
  
  // Real Scan States
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanReport | null>(null);
  const [scanError, setScanError] = useState("");

  const roles: RoleOption[] = [
    {
      id: "developer",
      title: "Indie Developer",
      subtitle: "Automate security headers, CSP configs, and MCP IDE tooling for personal projects.",
      icon: <Code2 size={24} color="var(--brand-primary)" />,
    },
    {
      id: "founder",
      title: "Startup Founder",
      subtitle: "Display real-time trust seals, protect checkout pages, and pass enterprise compliance audits.",
      icon: <Rocket size={24} color="var(--brand-primary)" />,
      popular: true,
    },
    {
      id: "agency",
      title: "Agency Owner",
      subtitle: "Manage client portfolios, automate white-label PDF audit reports, and offer security retaining.",
      icon: <Building2 size={24} color="var(--brand-primary)" />,
    },
  ];

  // Validate domain format
  const validateDomain = (value: string): boolean => {
    const cleaned = value.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./i, "");
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!cleaned) {
      setDomainError("Please enter a domain URL.");
      return false;
    }
    if (!domainRegex.test(cleaned) && !cleaned.includes("localhost")) {
      setDomainError("Please enter a valid domain format (e.g., example.com or app.store.io)");
      return false;
    }
    setDomainError("");
    return true;
  };

  const cleanDomain = domain.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./i, "").toLowerCase();

  // Execute REAL security scan & save domain to website catalog
  const executeRealScan = async (targetDomain: string) => {
    setScanning(true);
    setScanError("");
    setScanResult(null);

    try {
      // 1. Create or get website via websitesApi
      const site = await websitesApi.create({
        domain: targetDomain,
        display_name: targetDomain,
        monitoring_enabled: true,
      });

      // 2. Perform live real scan via scansApi / scan trigger
      const report = await scansApi.trigger(site.id, targetDomain);

      setScanResult(report);
    } catch (err: any) {
      setScanError(err.message || "Failed to complete live scan. Make sure the domain is accessible.");
    } finally {
      setScanning(false);
    }
  };

  const handleNextStep2 = () => {
    if (validateDomain(domain)) {
      setStep(3);
      executeRealScan(cleanDomain);
    }
  };

  const sslData = scanResult?.ssl_report;
  const headersData = scanResult?.headers_report;
  const filesData = scanResult?.sensitive_files_report;

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ─── Top Bar (Light Theme) ────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--canvas-border)",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(12px)",
          padding: "16px 24px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-secondary)",
              background: "var(--canvas-inset)",
              border: "1px solid var(--canvas-border)",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Step {step} of 3
          </span>
        </div>
      </header>

      {/* ─── Main Wizard Container ────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px 80px" }}>
        <div style={{ width: "100%", maxWidth: 680 }}>
          {/* Progress Step Indicator */}
          <div style={{ marginBottom: 36, position: "relative" }}>
            <div style={{ position: "absolute", top: 18, left: "10%", right: "10%", height: 2, background: "var(--canvas-border)", zIndex: 0 }} />
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "10%",
                height: 2,
                background: "var(--brand-primary)",
                zIndex: 0,
                transition: "width 0.4s ease",
                width: step === 1 ? "0%" : step === 2 ? "40%" : "80%",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
              {/* Step 1 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    transition: "all 0.3s",
                    background: step >= 1 ? "var(--brand-primary)" : "var(--canvas-inset)",
                    color: step >= 1 ? "#FFFFFF" : "var(--text-muted)",
                    border: step >= 1 ? "none" : "1px solid var(--canvas-border)",
                    boxShadow: step >= 1 ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                  }}
                >
                  {step > 1 ? <Check size={18} color="white" /> : "1"}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step >= 1 ? "var(--brand-deep)" : "var(--text-muted)", marginTop: 8 }}>
                  Role &amp; Goals
                </span>
              </div>

              {/* Step 2 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    transition: "all 0.3s",
                    background: step >= 2 ? "var(--brand-primary)" : "var(--canvas-raised)",
                    color: step >= 2 ? "#FFFFFF" : "var(--text-muted)",
                    border: step >= 2 ? "none" : "1.5px solid var(--canvas-border)",
                    boxShadow: step >= 2 ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                  }}
                >
                  {step > 2 ? <Check size={18} color="white" /> : "2"}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step >= 2 ? "var(--brand-deep)" : "var(--text-muted)", marginTop: 8 }}>
                  Target Domain
                </span>
              </div>

              {/* Step 3 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    transition: "all 0.3s",
                    background: step === 3 ? "var(--brand-primary)" : "var(--canvas-raised)",
                    color: step === 3 ? "#FFFFFF" : "var(--text-muted)",
                    border: step === 3 ? "none" : "1.5px solid var(--canvas-border)",
                    boxShadow: step === 3 ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                  }}
                >
                  3
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step === 3 ? "var(--brand-deep)" : "var(--text-muted)", marginTop: 8 }}>
                  Live Security Audit
                </span>
              </div>
            </div>
          </div>

          {/* ─── STEP 1: ROLE SELECTION ─────────────────────────────── */}
          {step === 1 && (
            <div
              style={{
                background: "var(--canvas-raised)",
                border: "1px solid var(--canvas-border)",
                borderRadius: "var(--radius-2xl)",
                padding: "40px 36px",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--brand-light)",
                    border: "1px solid rgba(37,99,235,0.2)",
                    color: "var(--brand-primary)",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  <Sparkles size={13} /> Welcome to WebGuard AI
                </div>
                <h1 style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em", marginBottom: 8 }}>
                  How will you use WebGuard AI?
                </h1>
                <p style={{ fontSize: 14.5, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                  We&apos;ll customize your scanning templates, fix guides, and alert preferences accordingly.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      style={{
                        padding: "18px 20px",
                        borderRadius: "var(--radius-xl)",
                        border: isSelected ? "2px solid var(--brand-primary)" : "1.5px solid var(--canvas-border)",
                        background: isSelected ? "var(--brand-subtle)" : "var(--canvas-raised)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        transition: "all 0.15s ease",
                        boxShadow: isSelected ? "0 4px 14px rgba(37,99,235,0.12)" : "var(--shadow-xs)",
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: isSelected ? "var(--brand-light)" : "var(--canvas-inset)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {r.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-deep)", margin: 0 }}>
                            {r.title}
                          </h3>
                          {r.popular && (
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                background: "var(--brand-primary)",
                                color: "#FFFFFF",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-full)",
                              }}
                            >
                              Popular
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, marginBottom: 0, lineHeight: 1.5 }}>
                          {r.subtitle}
                        </p>
                      </div>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: isSelected ? "2px solid var(--brand-primary)" : "2px solid var(--canvas-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--brand-primary)" }} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 28px",
                    background: "var(--brand-primary)",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                  }}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: ADD TARGET DOMAIN ──────────────────────────── */}
          {step === 2 && (
            <div
              style={{
                background: "var(--canvas-raised)",
                border: "1px solid var(--canvas-border)",
                borderRadius: "var(--radius-2xl)",
                padding: "40px 36px",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--brand-light)",
                    border: "1px solid rgba(37,99,235,0.2)",
                    color: "var(--brand-primary)",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  <Globe size={13} /> Step 2: First Target
                </div>
                <h2 style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em", marginBottom: 8 }}>
                  What domain would you like to protect?
                </h2>
                <p style={{ fontSize: 14.5, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto", lineHeight: 1.6 }}>
                  Enter your production or staging domain for a live real-time security audit.
                </p>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-deep)", marginBottom: 8 }}>
                  Target Website URL
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
                    <Globe size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="example.com or app.mybrand.io"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      if (domainError) validateDomain(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNextStep2();
                    }}
                    style={{
                      width: "100%",
                      paddingLeft: 46,
                      paddingRight: 16,
                      paddingTop: 13,
                      paddingBottom: 13,
                      background: "var(--canvas)",
                      border: domainError ? "1.5px solid var(--danger)" : "1.5px solid var(--canvas-border)",
                      borderRadius: "var(--radius-lg)",
                      fontSize: 15,
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                  />
                </div>
                {domainError ? (
                  <p style={{ fontSize: 13, color: "var(--danger)", fontWeight: 500, marginTop: 8, marginBottom: 0 }}>{domainError}</p>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, marginBottom: 0 }}>
                    We will execute identical deep checks (SSL/TLS 30pts, Headers 50pts, File Protection 20pts).
                  </p>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "12px 20px",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    background: "var(--canvas-inset)",
                    border: "1px solid var(--canvas-border)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 28px",
                    background: "var(--brand-primary)",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                  }}
                >
                  Run Live Security Audit <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: LIVE REAL SCAN RESULTS ─────────────────────── */}
          {step === 3 && (
            <div
              style={{
                background: "var(--canvas-raised)",
                border: "1px solid var(--canvas-border)",
                borderRadius: "var(--radius-2xl)",
                padding: "40px 36px",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              {scanning ? (
                /* Real Scanning In-Progress State */
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: "var(--brand-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Loader2 size={32} color="var(--brand-primary)" className="animate-spin" />
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: 100,
                      background: "var(--brand-light)",
                      color: "var(--brand-primary)",
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    <Zap size={13} /> Executing Real Backend Probes
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--brand-deep)", marginBottom: 6 }}>
                    Scanning {cleanDomain}
                  </h3>
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto" }}>
                    Querying TLS certificates, evaluating CSP &amp; HSTS security headers, and scanning file exposures...
                  </p>
                </div>
              ) : scanError ? (
                /* Scan Error / Host Unreachable */
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "var(--danger-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <AlertTriangle size={28} color="var(--danger)" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--brand-deep)", marginBottom: 6 }}>
                    Unable to complete audit
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 24px", lineHeight: 1.6 }}>
                    {scanError}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <button
                      onClick={() => setStep(2)}
                      style={{
                        padding: "10px 18px",
                        background: "var(--canvas-inset)",
                        color: "var(--brand-deep)",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "1px solid var(--canvas-border)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                      }}
                    >
                      Change Domain
                    </button>
                    <button
                      onClick={() => executeRealScan(cleanDomain)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 20px",
                        background: "var(--brand-primary)",
                        color: "#FFFFFF",
                        fontSize: 13,
                        fontWeight: 700,
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                      }}
                    >
                      <RefreshCw size={14} /> Retry Scan
                    </button>
                  </div>
                </div>
              ) : scanResult ? (
                /* Actual Live Scan Result */
                <div>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 14px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--success-light)",
                        border: "1px solid rgba(22,163,74,0.2)",
                        color: "var(--success)",
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      <CheckCircle2 size={14} /> Real Audit Complete (in {(scanResult.scan_duration_ms / 1000).toFixed(1)}s)
                    </div>
                    <h3 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                      Live Security Score: {scanResult.overall_score}/100
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
                      Audit completed for <strong style={{ color: "var(--brand-deep)", fontFamily: "monospace" }}>{scanResult.domain}</strong>
                    </p>
                  </div>

                  {/* Score Highlight Box */}
                  <div
                    style={{
                      background: "var(--canvas-inset)",
                      border: "1px solid var(--canvas-border)",
                      borderRadius: "var(--radius-xl)",
                      padding: "20px 24px",
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 16,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                        Calculated Security Grade
                      </span>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: "var(--brand-deep)", marginTop: 2, marginBottom: 0 }}>
                        Grade {scanResult.grade} &nbsp;·&nbsp;
                        {scanResult.overall_score >= 80 ? " Strong Defense" : scanResult.overall_score >= 50 ? " Hardening Needed" : " Critical Exposure"}
                      </h4>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontSize: 36,
                          fontWeight: 900,
                          color: scanResult.overall_score >= 80 ? "var(--success)" : scanResult.overall_score >= 50 ? "var(--warning)" : "var(--danger)",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {scanResult.overall_score}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: scanResult.overall_score >= 80 ? "var(--success)" : scanResult.overall_score >= 50 ? "var(--warning)" : "var(--danger)",
                          background: scanResult.overall_score >= 80 ? "var(--success-light)" : scanResult.overall_score >= 50 ? "var(--warning-light)" : "var(--danger-light)",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--canvas-border)",
                        }}
                      >
                        {scanResult.grade}
                      </span>
                    </div>
                  </div>

                  {/* Real Breakdown Grid (Matching Dashboard Exactly) */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                    {/* SSL / TLS */}
                    <div style={{ background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-lg)", padding: "14px 12px", textAlign: "center" }}>
                      <Lock size={18} color={sslData?.valid ? "var(--success)" : "var(--danger)"} style={{ margin: "0 auto 6px" }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-deep)" }}>SSL/TLS</div>
                      <div style={{ fontSize: 13, color: sslData?.valid ? "var(--success)" : "var(--danger)", fontWeight: 700, marginTop: 2 }}>
                        {sslData?.score ?? 0}/30
                      </div>
                    </div>

                    {/* Security Headers */}
                    <div style={{ background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-lg)", padding: "14px 12px", textAlign: "center" }}>
                      <ShieldCheck size={18} color={(headersData?.score ?? 0) >= 35 ? "var(--success)" : (headersData?.score ?? 0) >= 20 ? "var(--warning)" : "var(--danger)"} style={{ margin: "0 auto 6px" }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-deep)" }}>Security Headers</div>
                      <div style={{ fontSize: 13, color: (headersData?.score ?? 0) >= 35 ? "var(--success)" : "var(--warning)", fontWeight: 700, marginTop: 2 }}>
                        {headersData?.score ?? 0}/50
                      </div>
                    </div>

                    {/* File Safety */}
                    <div style={{ background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-lg)", padding: "14px 12px", textAlign: "center" }}>
                      <FileWarning size={18} color={(filesData?.score ?? 0) >= 15 ? "var(--success)" : "var(--danger)"} style={{ margin: "0 auto 6px" }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-deep)" }}>File Safety</div>
                      <div style={{ fontSize: 13, color: (filesData?.score ?? 0) >= 15 ? "var(--success)" : "var(--danger)", fontWeight: 700, marginTop: 2 }}>
                        {filesData?.score ?? 0}/20
                      </div>
                    </div>
                  </div>

                  {/* Header Findings Real Highlights */}
                  {headersData?.findings && headersData.findings.length > 0 && (
                    <div style={{ marginBottom: 28, background: "var(--canvas)", border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-lg)", padding: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "block", marginBottom: 10 }}>
                        Live Header Checks
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {headersData.findings.map((h, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              padding: "3px 8px",
                              borderRadius: 6,
                              background: h.present ? "var(--success-light)" : "var(--canvas-inset)",
                              color: h.present ? "var(--success)" : "var(--text-muted)",
                              border: h.present ? "1px solid rgba(22,163,74,0.25)" : "1px solid var(--canvas-border)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            {h.present ? "✓" : "✕"} {h.header_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <ArrowLeft size={15} /> Scan Different Domain
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "13px 32px",
                        background: "var(--brand-primary)",
                        color: "#FFFFFF",
                        fontSize: 14,
                        fontWeight: 700,
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                      }}
                    >
                      <Zap size={16} /> Open Full Dashboard
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--canvas-border)", padding: "16px 24px", textAlign: "center", fontSize: 12.5, color: "var(--text-muted)", background: "var(--canvas-inset)" }}>
        &copy; {new Date().getFullYear()} WebGuard AI. Automated SaaS Security &amp; Compliance.
      </footer>
    </div>
  );
}
