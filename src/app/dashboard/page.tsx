"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { websitesApi, scansApi, type Website, type ScanReport } from "@/lib/api";
import {
  Shield, LayoutDashboard, Globe, ScanSearch, BadgeCheck, Settings, LogOut,
  Plus, Play, Clock, CheckCircle2, XCircle, AlertTriangle, ChevronDown,
  Lock, ShieldCheck, FileWarning, Wrench, Copy, ExternalLink, Loader2,
  TrendingUp, TrendingDown, Minus, Search, Menu, X, Sparkles, Terminal, Server, Code2, Check
} from "lucide-react";

// ─── Scan Step Messages ──────────────────────────────────────────
const SCAN_STEPS = [
  { text: "Initializing secure handshake…", icon: "🔐" },
  { text: "Validating SSL/TLS certificate…", icon: "🔒" },
  { text: "Analyzing security response headers…", icon: "🛡️" },
  { text: "Checking Content-Security-Policy…", icon: "📋" },
  { text: "Probing for exposed sensitive files…", icon: "📂" },
  { text: "Calculating compliance score…", icon: "📊" },
  { text: "Generating remediation report…", icon: "🔧" },
];

type NavTab = "dashboard" | "scan" | "seal" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedSite, setSelectedSite] = useState<Website | null>(null);
  const [scanResult, setScanResult] = useState<ScanReport | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load user session and websites on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || "");
        loadWebsites();
      }
    });
  }, []);

  // Scan step rotation
  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setScanStep((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [scanning]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, type = "success") => setToast({ message, type });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const loadSiteScan = async (site: Website) => {
    try {
      const latest = await scansApi.latest(site.id) || await scansApi.latest(site.domain);
      if (latest) {
        setScanResult(latest);
      }
    } catch {}
  };

  const loadWebsites = async () => {
    try {
      const data = await websitesApi.list();
      setWebsites(data.websites);
      if (data.websites.length > 0) {
        const first = data.websites[0];
        setSelectedSite(first);
        loadSiteScan(first);
      }
    } catch {}
  };

  const selectWebsite = (site: Website) => {
    setSelectedSite(site);
    setActiveTab("dashboard");
    loadSiteScan(site);
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setLoading(true);
    try {
      const site = await websitesApi.create({ domain: newDomain });
      setWebsites((prev) => [site, ...prev]);
      setSelectedSite(site);
      setNewDomain("");
      showToast("Domain added successfully");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const triggerScan = async () => {
    if (!selectedSite) return;
    setScanning(true);
    setScanStep(0);
    setScanResult(null);
    setActiveTab("scan");
    try {
      const result = await scansApi.trigger(selectedSite.id, selectedSite.domain);
      setScanResult(result);
      loadWebsites();
      showToast(`Scan complete — Score: ${result.overall_score}/100`);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setScanning(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD SHELL (middleware protects this route — no auth gate needed)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>

      {/* ─── Mobile Backdrop Overlay ────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Responsive Sidebar Drawer ──────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <div className="sidebar-brand" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>WebGuard AI</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Security Platform</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-ghost btn-sm"
            style={{
              color: "rgba(255,255,255,0.6)",
              padding: 6,
              cursor: "pointer",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section">Main</div>
          <SidebarLink
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarLink
            icon={<ScanSearch size={18} />}
            label="Scan Results"
            active={activeTab === "scan"}
            onClick={() => setActiveTab("scan")}
          />
          <SidebarLink
            icon={<BadgeCheck size={18} />}
            label="Trust Seal"
            active={activeTab === "seal"}
            onClick={() => setActiveTab("seal")}
          />

          <div className="sidebar-section" style={{ marginTop: 16 }}>Domains</div>
          {websites.map((site) => (
            <button
              key={site.id}
              onClick={() => selectWebsite(site)}
              className={`sidebar-link ${selectedSite?.id === site.id ? "sidebar-link-active" : ""}`}
            >
              <Globe size={16} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{site.domain}</span>
              {site.last_score !== null && (
                <span style={{ fontSize: 11, fontWeight: 700, color: site.last_score >= 80 ? "#4ADE80" : site.last_score >= 50 ? "#FBBF24" : "#F87171" }}>
                  {site.last_score}
                </span>
              )}
            </button>
          ))}

          <form onSubmit={addDomain} style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                style={{ flex: 1, padding: "7px 10px", fontSize: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, color: "white", outline: "none" }}
                placeholder="Add domain…"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <button type="submit" disabled={loading} style={{ padding: "6px 10px", background: "var(--brand-primary)", border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center" }}>
                <Plus size={14} />
              </button>
            </div>
          </form>
        </div>

        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={handleSignOut} className="sidebar-link" style={{ color: "rgba(255,255,255,0.5)" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ───────────────────────────────────────── */}
      <div className={`main-content ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        {/* Top Header */}
        <div className="top-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-ghost btn-sm"
              style={{
                padding: 6,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
              }}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: 15, margin: 0 }}>
                {activeTab === "dashboard" && "Command Center"}
                {activeTab === "scan" && "Scan Results"}
                {activeTab === "seal" && "Trust Seal Customizer"}
                {activeTab === "settings" && "Settings"}
              </h2>
              {selectedSite && (
                <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: 0 }}>{selectedSite.domain}</p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {selectedSite && (
              <button onClick={triggerScan} className="btn btn-primary btn-sm" disabled={scanning}>
                {scanning ? <><Loader2 size={14} className="animate-spin" /> Scanning…</> : <><Play size={14} /> Run Scan</>}
              </button>
            )}
          </div>
        </div>

        <div className="page-content">
          {!selectedSite ? (
            <EmptyState />
          ) : (
            <>
              {activeTab === "dashboard" && <DashboardView site={selectedSite} scanResult={scanResult} scanning={scanning} scanStep={scanStep} onScan={triggerScan} />}
              {activeTab === "scan" && <ScanResultsView scanResult={scanResult} scanning={scanning} scanStep={scanStep} site={selectedSite} showToast={showToast} />}
              {activeTab === "seal" && (
                <TrustSealCustomizer
                  site={selectedSite}
                  scanResult={scanResult}
                  showToast={showToast}
                  onFixIssues={() => setActiveTab("scan")}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ background: toast.type === "error" ? "var(--danger)" : "var(--brand-deep)" }}>
          {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} color="#4ADE80" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR LINK COMPONENT
// ═══════════════════════════════════════════════════════════════

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}>
      {icon}
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════

function EmptyState() {
  return (
    <div className="card animate-fade-in" style={{ padding: 60, textAlign: "center" }}>
      <Globe size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
      <h2 style={{ marginBottom: 8 }}>Add Your First Domain</h2>
      <p style={{ maxWidth: 400, margin: "0 auto" }}>Enter a website domain in the sidebar to start monitoring its security compliance.</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD VIEW — Hero Score + Stats
// ═══════════════════════════════════════════════════════════════

function DashboardView({ site, scanResult, scanning, scanStep, onScan }: { site: Website; scanResult: ScanReport | null; scanning: boolean; scanStep: number; onScan: () => void }) {
  const score = scanResult?.overall_score ?? site.last_score ?? 0;
  const grade = scanResult?.grade ?? getGrade(score);
  const hasData = score > 0 || scanResult !== null;

  return (
    <div className="animate-fade-in">
      {/* Hero Score Card */}
      <div
        className="card hero-score-card"
        style={{
          padding: "28px 32px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 36,
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--canvas-border)",
          boxShadow: "var(--shadow-md)",
          background: "linear-gradient(135deg, var(--canvas-raised) 0%, #FFFFFF 100%)",
        }}
      >
        {/* Ambient background glow accent */}
        <div
          style={{
            position: "absolute",
            top: -40,
            left: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: score >= 80
              ? "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)"
              : score >= 50
              ? "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <ScoreRing score={score} size={156} strokeWidth={11} />

        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{site.domain}</h1>
            <span className={`badge ${score >= 80 ? "badge-success" : score >= 50 ? "badge-warning" : "badge-danger"}`} style={{ padding: "4px 12px", fontSize: 12 }}>
              Grade {grade}
            </span>
            <span className="badge badge-info" style={{ fontSize: 11 }}>
              🛡️ Live Monitored
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-secondary)", marginBottom: 16 }}>
            {hasData ? (
              score >= 80
                ? "Your website is well-protected. All critical security measures and SSL protocols are in place."
                : score >= 50
                ? "Your website has security gaps that lower your trust rating. Review the remediation guide below."
                : "Your website has critical vulnerabilities (exposed files or missing headers) requiring immediate action."
            ) : (
              "Run your first scan to analyze SSL encryption, security response headers, and file exposures."
            )}
          </p>
          {!hasData && (
            <button onClick={onScan} className="btn btn-primary" disabled={scanning}>
              {scanning ? <><Loader2 size={16} className="animate-spin" /> Scanning…</> : <><ScanSearch size={16} /> Run First Scan</>}
            </button>
          )}
        </div>
      </div>

      {/* Scanning State */}
      {scanning && <ScanningIndicator step={scanStep} />}

      {/* Stat Cards */}
      {hasData && !scanning && (
        <div className="stat-cards-grid animate-fade-in-d1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 24 }}>
          <StatCard icon={<Lock size={20} />} label="SSL/TLS" value={`${scanResult?.ssl_report.score ?? 0}/30`} color={getScoreColor(scanResult?.ssl_report.score ?? 0, 30)} />
          <StatCard icon={<ShieldCheck size={20} />} label="Security Headers" value={`${scanResult?.headers_report.score ?? 0}/50`} color={getScoreColor(scanResult?.headers_report.score ?? 0, 50)} />
          <StatCard icon={<FileWarning size={20} />} label="File Safety" value={`${scanResult?.sensitive_files_report.score ?? 0}/20`} color={getScoreColor(scanResult?.sensitive_files_report.score ?? 0, 20)} />
          <StatCard icon={<Clock size={20} />} label="Scan Time" value={`${((scanResult?.scan_duration_ms ?? 0) / 1000).toFixed(1)}s`} color="var(--info)" />
        </div>
      )}

      {/* Quick Findings Summary */}
      {scanResult && !scanning && (
        <div className="card animate-fade-in-d2" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} color="var(--warning)" /> Key Findings
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* SSL */}
            <FindingSummaryRow
              label="SSL Certificate"
              status={scanResult.ssl_report.valid}
              detail={scanResult.ssl_report.valid ? `Valid · Expires in ${scanResult.ssl_report.days_until_expiry} days` : "Invalid or expired"}
            />
            {/* Headers */}
            {scanResult.headers_report.findings.slice(0, 5).map((f, i) => (
              <FindingSummaryRow key={i} label={f.header_name} status={f.present} detail={f.present ? `Set to: ${f.value?.substring(0, 40)}…` : "Not configured"} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCAN RESULTS VIEW — Full Report + Remediation
// ═══════════════════════════════════════════════════════════════

function ScanResultsView({
  scanResult,
  scanning,
  scanStep,
  site,
  showToast,
}: {
  scanResult: ScanReport | null;
  scanning: boolean;
  scanStep: number;
  site: Website;
  showToast?: (m: string, t?: string) => void;
}) {
  if (scanning) return <ScanningIndicator step={scanStep} />;

  if (!scanResult) {
    return (
      <div className="card animate-fade-in" style={{ padding: 48, textAlign: "center" }}>
        <Search size={40} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
        <h2 style={{ marginBottom: 8 }}>No Scan Results Yet</h2>
        <p>Run a scan to analyze {site.domain}'s security posture.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* SSL Section */}
      <div className="card" style={{ marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--canvas-border)", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lock size={18} color="var(--brand-primary)" />
            <h3 style={{ margin: 0 }}>SSL/TLS Certificate</h3>
          </div>
          <span className={`badge ${scanResult.ssl_report.valid ? "badge-pass" : "badge-critical"}`}>
            {scanResult.ssl_report.valid ? "Valid" : "Invalid"}
          </span>
        </div>
        <div style={{ padding: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
          <MiniStat label="Issuer" value={scanResult.ssl_report.issuer || "N/A"} />
          <MiniStat label="Expires In" value={scanResult.ssl_report.days_until_expiry !== null ? `${scanResult.ssl_report.days_until_expiry} days` : "N/A"} />
          <MiniStat label="TLS Version" value={scanResult.ssl_report.protocol_version || "N/A"} />
          <MiniStat label="Score" value={`${scanResult.ssl_report.score}/30`} />
        </div>
      </div>

      {/* Headers Section */}
      <div className="card" style={{ marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--canvas-border)", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldCheck size={18} color="var(--brand-primary)" />
            <h3 style={{ margin: 0 }}>Security Headers</h3>
          </div>
          <span className="badge badge-info">{scanResult.headers_report.headers_present}/{scanResult.headers_report.headers_checked} present</span>
        </div>
        <div style={{ padding: "6px 12px" }}>
          {scanResult.headers_report.findings.map((finding, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 6px", borderBottom: i < scanResult.headers_report.findings.length - 1 ? "1px solid var(--canvas-border)" : "none", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
                {finding.present ? <CheckCircle2 size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{finding.header_name}</div>
                  {finding.value && <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{finding.value}</div>}
                </div>
              </div>
              <span className={`badge badge-${finding.present ? "pass" : finding.severity}`}>
                {finding.present ? "Configured" : finding.severity.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sensitive Files Section */}
      <div className="card" style={{ marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--canvas-border)", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileWarning size={18} color="var(--brand-primary)" />
            <h3 style={{ margin: 0 }}>Sensitive File Exposure</h3>
          </div>
          <span className={`badge ${scanResult.sensitive_files_report.files_exposed === 0 ? "badge-pass" : "badge-danger"}`}>
            {scanResult.sensitive_files_report.files_exposed === 0 ? "All Secure" : `${scanResult.sensitive_files_report.files_exposed} exposed`}
          </span>
        </div>
        <div style={{ padding: "6px 12px" }}>
          {scanResult.sensitive_files_report.findings.filter(f => f.severity !== "info").map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 6px", borderBottom: "1px solid var(--canvas-border)", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {f.exposed ? <XCircle size={16} color="var(--danger)" /> : <CheckCircle2 size={16} color="var(--success)" />}
                <code style={{ fontSize: 12.5, border: "none", padding: 0, background: "none" }}>{f.path}</code>
              </div>
              <span className={`badge badge-${f.exposed ? "danger" : "pass"}`}>
                {f.exposed ? "Exposed" : "Protected"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Remediation Guide */}
      {scanResult.remediation && scanResult.remediation.length > 0 && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--canvas-border)" }}>
            <Wrench size={18} color="var(--brand-primary)" />
            <h3 style={{ margin: 0 }}>How to Fix ({scanResult.remediation.length} items)</h3>
          </div>
          <div>
            {scanResult.remediation.map((item, i) => (
              <RemediationCard
                key={i}
                item={item}
                domain={site.domain}
                showToast={showToast}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TRUST SEAL CUSTOMIZER — Split Screen
// ═══════════════════════════════════════════════════════════════

function TrustSealCustomizer({
  site,
  scanResult,
  showToast,
  onFixIssues,
}: {
  site: Website;
  scanResult: ScanReport | null;
  showToast: (m: string, t?: string) => void;
  onFixIssues?: () => void;
}) {
  const [sealStyle, setSealStyle] = useState<"badge" | "banner" | "minimal">("badge");
  const [sealTheme, setSealTheme] = useState<"light" | "dark">("dark");
  const [sealSize, setSealSize] = useState<"sm" | "md" | "lg">("md");
  const [copied, setCopied] = useState(false);

  // ─── Real-Time Dynamic Data Binding from Selected Domain ─────
  const rawScore = scanResult?.overall_score ?? site.last_score ?? null;
  const hasScan = rawScore !== null;
  const score = hasScan ? rawScore : 0;
  const grade = scanResult?.grade ?? getGrade(score);
  const isCompliant = hasScan && score >= 80;

  // Dynamic Theme & Status Determination
  const scoreColor = !hasScan
    ? "#64748B"
    : isCompliant
    ? "#16A34A"
    : score >= 50
    ? "#D97706"
    : "#DC2626";

  const statusText = !hasScan
    ? "Audit Pending"
    : isCompliant
    ? "Secure & Compliant"
    : score >= 50
    ? "Action Required"
    : "Vulnerable";

  const embedCode = `<!-- WebGuard AI Trust Seal -->
<div id="webguard-seal"
     data-domain="${site.domain}"
     data-token="YOUR_SEAL_TOKEN"
     data-style="${sealStyle}"
     data-theme="${sealTheme}"
     data-size="${sealSize}">
</div>
<script src="https://cdn.webguard.ai/seal-widget.js" async></script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      showToast("Embed code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy", "error");
    }
  };

  const sizeMap = { sm: 0.85, md: 1, lg: 1.2 };
  const scale = sizeMap[sealSize];

  return (
    <div className="animate-fade-in customizer-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, alignItems: "start" }}>
      {/* Left: Controls */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <BadgeCheck size={18} color="var(--brand-primary)" /> Customize Seal
        </h3>

        {/* Style */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Widget Style</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["badge", "banner", "minimal"] as const).map((s) => (
              <button key={s} onClick={() => setSealStyle(s)} className={`btn btn-sm ${sealStyle === s ? "btn-primary" : "btn-secondary"}`} style={{ flex: 1, textTransform: "capitalize" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Theme</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["light", "dark"] as const).map((t) => (
              <button key={t} onClick={() => setSealTheme(t)} className={`btn btn-sm ${sealTheme === t ? "btn-primary" : "btn-secondary"}`} style={{ flex: 1, textTransform: "capitalize" }}>
                {t === "light" ? "☀️ Light" : "🌙 Dark"}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Size</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["sm", "md", "lg"] as const).map((sz) => (
              <button key={sz} onClick={() => setSealSize(sz)} className={`btn btn-sm ${sealSize === sz ? "btn-primary" : "btn-secondary"}`} style={{ flex: 1 }}>
                {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Domain Info */}
        <div style={{ background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", padding: 14 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Connected Domain</div>
          <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Globe size={14} /> {site.domain}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor }}>
              {hasScan ? `${score}/100` : "No Scan"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Preview + Code */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ─── Conditional Compliance Alert Box ─────────────────── */}
        {!hasScan ? (
          <div style={{ padding: "16px 20px", background: "rgba(100, 116, 139, 0.08)", border: "1px solid rgba(100, 116, 139, 0.25)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)" }}>
                  Domain Not Audited Yet
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
                  Run a security scan for {site.domain} to calculate its live compliance score and activate the Trust Seal.
                </div>
              </div>
              <button onClick={onFixIssues} className="btn btn-primary btn-sm">
                Run Audit Now
              </button>
            </div>
          </div>
        ) : !isCompliant ? (
          <div style={{ padding: "18px 20px", background: "rgba(217, 119, 6, 0.08)", border: "1px solid rgba(217, 119, 6, 0.3)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <AlertTriangle size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--warning)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>Score is {score}/100 (Grade {grade}) — Action Required</span>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: "4px 0 12px", lineHeight: 1.55 }}>
                  Your website score is below 80. Websites must achieve a score of <strong>80 or higher</strong> to unlock and display the <strong>Green Verified Trust Seal</strong> on their storefront. Fix the identified issues in the scan results to qualify.
                </p>
                <button
                  onClick={onFixIssues}
                  className="btn btn-sm"
                  style={{
                    background: "var(--warning)",
                    color: "white",
                    border: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 600,
                    fontSize: 12,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Wrench size={14} /> View Fixes in Remediation Guide
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "16px 20px", background: "rgba(22, 163, 74, 0.08)", border: "1px solid rgba(22, 163, 74, 0.25)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ShieldCheck size={22} color="var(--success)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--success)" }}>
                  ✓ Green Verified Trust Seal Active (Score: {score}/100 · Grade {grade})
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
                  {site.domain} meets all high-trust compliance standards. Your storefront can now display the official WebGuard Verified seal.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Preview */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <ExternalLink size={16} color="var(--text-muted)" /> Live Widget Preview
            </h3>
            <span
              className={`badge ${isCompliant ? "badge-success" : hasScan ? "badge-warning" : "badge-neutral"}`}
              style={{ fontSize: 11, padding: "3px 10px" }}
            >
              {isCompliant ? "✓ Green Verified State" : hasScan ? "⚠️ Below 80 (Pending Compliance)" : "⏳ Pending Scan"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              background: sealTheme === "dark" ? "#090D16" : "#F1F5F9",
              backgroundImage: sealTheme === "dark"
                ? `radial-gradient(circle at center, ${isCompliant ? "rgba(16, 185, 129, 0.08)" : "rgba(217, 119, 6, 0.08)"} 0%, transparent 65%)`
                : `radial-gradient(circle at center, ${isCompliant ? "rgba(16, 185, 129, 0.05)" : "rgba(217, 119, 6, 0.05)"} 0%, transparent 65%)`,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--canvas-border)",
              minHeight: 160,
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ transform: `scale(${scale})`, transformOrigin: "center", transition: "transform 0.2s ease" }}>
              {sealStyle === "badge" && (
                <SealPreviewBadge
                  score={score}
                  grade={grade}
                  statusText={statusText}
                  isCompliant={isCompliant}
                  color={scoreColor}
                  theme={sealTheme}
                  domain={site.domain}
                />
              )}
              {sealStyle === "banner" && (
                <SealPreviewBanner
                  score={score}
                  grade={grade}
                  statusText={statusText}
                  isCompliant={isCompliant}
                  color={scoreColor}
                  theme={sealTheme}
                  domain={site.domain}
                />
              )}
              {sealStyle === "minimal" && (
                <SealPreviewMinimal
                  score={score}
                  grade={grade}
                  statusText={statusText}
                  isCompliant={isCompliant}
                  color={scoreColor}
                  theme={sealTheme}
                />
              )}
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="code-block-header">
            <span>HTML Embed Code</span>
            <button onClick={copyToClipboard} className="btn btn-sm" style={{ background: copied ? "var(--success)" : "rgba(255,255,255,0.1)", color: "white", border: "none", fontSize: 12, padding: "4px 12px" }}>
              {copied ? <><CheckCircle2 size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
          <div className="code-block" style={{ borderRadius: "0 0 var(--radius-xl) var(--radius-xl)" }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{embedCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SEAL PREVIEW COMPONENTS (DYNAMIC REAL-TIME BINDING)
// ═══════════════════════════════════════════════════════════════

function SealPreviewBadge({
  score,
  grade,
  statusText,
  isCompliant,
  color,
  theme,
  domain,
}: any) {
  const bg = theme === "dark" ? "#0F172A" : "#FFFFFF";
  const text = theme === "dark" ? "#F8FAFC" : "#0F172A";
  const sub = theme === "dark" ? "#94A3B8" : "#475569";
  const borderColor = `${color}45`;

  const gradientBg = isCompliant
    ? "linear-gradient(135deg, #16A34A 0%, #15803D 100%)"
    : score >= 50
    ? "linear-gradient(135deg, #D97706 0%, #B45309 100%)"
    : "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 20px",
        background: bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 14,
        boxShadow: theme === "dark"
          ? `0 4px 20px rgba(0,0,0,0.4), 0 0 15px ${color}20`
          : `0 4px 16px rgba(0,0,0,0.06), 0 0 12px ${color}15`,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: gradientBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 900,
          color: "#FFFFFF",
          boxShadow: `0 2px 8px ${color}40`,
        }}
      >
        {grade}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: text, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 5 }}>
          <span>{isCompliant ? "WebGuard Verified" : "WebGuard Seal"}</span>
          <span style={{ fontSize: 11, color }}>{isCompliant ? "✓" : "⚠️"}</span>
        </div>
        <div style={{ fontSize: 11, color: sub, marginTop: 2, fontWeight: 500 }}>
          Score: <strong style={{ color, fontWeight: 700 }}>{score}/100</strong> · {statusText}
        </div>
      </div>
    </div>
  );
}

function SealPreviewBanner({
  score,
  grade,
  statusText,
  isCompliant,
  color,
  theme,
  domain,
}: any) {
  const bg = theme === "dark" ? "#0F172A" : "#FFFFFF";
  const text = theme === "dark" ? "#F8FAFC" : "#0F172A";
  const sub = theme === "dark" ? "#94A3B8" : "#475569";
  const borderColor = `${color}40`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 24px",
        background: bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 16,
        maxWidth: 420,
        boxShadow: theme === "dark"
          ? `0 4px 24px rgba(0,0,0,0.4), 0 0 16px ${color}18`
          : `0 4px 18px rgba(0,0,0,0.06), 0 0 12px ${color}10`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", minWidth: 54 }}>
        <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>GRADE {grade}</div>
      </div>
      <div style={{ borderLeft: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, paddingLeft: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: text, display: "flex", alignItems: "center", gap: 6 }}>
          <span>{isCompliant ? "🛡️ WebGuard AI Verified" : "⚠️ WebGuard Audit Pending"}</span>
        </div>
        <div style={{ fontSize: 11.5, color: sub, marginTop: 3 }}>
          {domain || "evostackr.in"} · <span style={{ color, fontWeight: 600 }}>{statusText}</span>
        </div>
      </div>
    </div>
  );
}

function SealPreviewMinimal({
  score,
  grade,
  statusText,
  isCompliant,
  color,
  theme,
}: any) {
  const bg = theme === "dark" ? "#0F172A" : "#FFFFFF";
  const text = theme === "dark" ? "#E2E8F0" : "#0F172A";
  const borderColor = `${color}40`;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 18px",
        background: bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 100,
        fontFamily: "'Inter', sans-serif",
        fontSize: 12.5,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <span style={{ color, fontWeight: 800, background: `${color}18`, padding: "2px 8px", borderRadius: 10 }}>{grade}</span>
      <span style={{ color: text, fontWeight: 600 }}>WebGuard {statusText}</span>
      <span style={{ color, fontWeight: 700 }}>{score}/100</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ScoreRing({ score, size = 160, strokeWidth = 12 }: { score: number; size?: number; strokeWidth?: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Smooth animated count-up effect
  useEffect(() => {
    setIsMounted(true);
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    if (end === 0) {
      setDisplayScore(0);
      return;
    }
    const duration = 1200; // ms
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth * 2 - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = isMounted
    ? circumference - (score / 100) * circumference
    : circumference;

  // Dynamic Theme Colors
  const isHigh = score >= 80;
  const isMid = score >= 50 && score < 80;
  const gradientId = `gauge-grad-${isHigh ? "high" : isMid ? "mid" : "low"}`;
  const glowId = `gauge-glow-${isHigh ? "high" : isMid ? "mid" : "low"}`;

  const primaryColor = isHigh ? "#10B981" : isMid ? "#F59E0B" : "#EF4444";
  const secondaryColor = isHigh ? "#059669" : isMid ? "#D97706" : "#DC2626";
  const glowColor = isHigh ? "rgba(16, 185, 129, 0.4)" : isMid ? "rgba(245, 158, 11, 0.4)" : "rgba(239, 68, 68, 0.4)";
  const ambientBg = isHigh ? "rgba(16, 185, 129, 0.08)" : isMid ? "rgba(245, 158, 11, 0.08)" : "rgba(239, 68, 68, 0.08)";

  // Leading dot coordinate calculation
  const angle = (score / 100) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const center = size / 2;
  const dotX = center + radius * Math.cos(rad);
  const dotY = center + radius * Math.sin(rad);

  return (
    <div
      className="cyber-gauge-wrapper"
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at center, ${ambientBg} 0%, transparent 72%)`,
        borderRadius: "50%",
        padding: 8,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          {/* Gradient Definitions */}
          <linearGradient id="gauge-grad-high" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gauge-grad-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="gauge-grad-low" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="gauge-glow-high" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gauge-glow-mid" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gauge-glow-low" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Outer Rotating Tech Compass Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + strokeWidth + 4}
          fill="none"
          stroke="var(--canvas-border)"
          strokeWidth="1"
          strokeDasharray="4 8"
          style={{
            transformOrigin: "center",
            animation: "cyberSpin 24s linear infinite",
            opacity: 0.6,
          }}
        />

        {/* 2. Inner Track Background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--canvas-inset)"
          strokeWidth={strokeWidth}
          style={{ opacity: 0.9 }}
        />

        {/* 3. Concentric Micro Tick Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2 - 3}
          fill="none"
          stroke="var(--canvas-border)"
          strokeWidth="1.5"
          strokeDasharray="1 7"
          style={{ opacity: 0.7 }}
        />

        {/* 4. Glowing Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          filter={`url(#${glowId})`}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* 5. Leading Glowing Pointer Dot */}
        {score > 0 && (
          <g>
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2 + 2}
              fill={primaryColor}
              filter={`url(#${glowId})`}
              style={{
                transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 4}
              fill="#FFFFFF"
            />
          </g>
        )}
      </svg>

      {/* Center Digital Telemetry Display */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: primaryColor,
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: primaryColor,
              display: "inline-block",
              boxShadow: `0 0 6px ${primaryColor}`,
            }}
          />
          SCORE
        </div>

        <div
          style={{
            fontSize: size * 0.27,
            fontWeight: 900,
            lineHeight: 1,
            color: "var(--brand-deep)",
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 2px 10px ${glowColor}`,
          }}
        >
          {displayScore}
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-muted)",
            marginTop: 4,
            letterSpacing: "0.02em",
          }}
        >
          OUT OF 100
        </div>
      </div>
    </div>
  );
}

function ScanningIndicator({ step }: { step: number }) {
  const currentStep = SCAN_STEPS[step];
  return (
    <div className="card animate-scale-in" style={{ padding: 48, textAlign: "center", marginBottom: 24 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid var(--canvas-border)", borderTopColor: "var(--brand-primary)", margin: "0 auto 20px" }} className="animate-spin" />
      <h3 style={{ marginBottom: 6, fontSize: 16 }}>{currentStep.icon} {currentStep.text}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>This usually takes 5–10 seconds</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
        {SCAN_STEPS.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === step ? "var(--brand-primary)" : "var(--canvas-border)", transition: "background 0.3s ease" }} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
      </div>
      <div className="stat-card-value" style={{ color }}>{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

function FindingSummaryRow({ label, status, detail }: { label: string; status: boolean; detail: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {status ? <CheckCircle2 size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      </div>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{detail}</span>
    </div>
  );
}

function RemediationCard({
  item,
  domain,
  showToast,
}: {
  item: any;
  domain?: string;
  showToast?: (m: string, t?: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const severityLabel: Record<string, string> = { critical: "Urgent Fix Required", high: "Important", medium: "Recommended", low: "Nice to Have" };

  return (
    <div style={{ borderBottom: "1px solid var(--canvas-border)" }}>
      <button onClick={() => setExpanded(!expanded)} className="accordion-trigger">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className={`badge badge-${item.severity}`}>{item.severity}</span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{severityLabel[item.severity] || ""}</div>
          </div>
        </div>
        <ChevronDown size={16} className={`accordion-chevron ${expanded ? "accordion-chevron-open" : ""}`} />
      </button>

      {expanded && (
        <div className="accordion-content animate-fade-in">
          <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16, color: "var(--text-secondary)" }}>{item.description}</p>
          {Object.entries(item.fixes || {}).map(([platform, fix]: [string, any]) => (
            <div key={platform} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-primary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                {fix.label || platform}
              </div>
              {fix.code && (
                <div className="code-block" style={{ marginBottom: 8 }}>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{fix.code}</pre>
                </div>
              )}
              {fix.steps && (
                <ol style={{ paddingLeft: 20, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {fix.steps.map((step: string, j: number) => (
                    <li key={j} style={{ marginBottom: 4 }}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          ))}
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{
              marginTop: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            <Wrench size={14} /> Apply Fix Guide (Choose Your Stack)
          </button>
        </div>
      )}

      {/* ─── Platform-Aware Interactive Fix Modal ─────────────── */}
      {modalOpen && (
        <PlatformFixModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          item={item}
          domain={domain || "yourdomain.com"}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLATFORM-AWARE INTERACTIVE FIX MODAL
// ═══════════════════════════════════════════════════════════════

type FixPlatform = "ai" | "wordpress" | "custom";

function PlatformFixModal({
  isOpen,
  onClose,
  item,
  domain,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  domain: string;
  showToast?: (m: string, t?: string) => void;
}) {
  const [activePlatform, setActivePlatform] = useState<FixPlatform>("ai");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, key: string, label = "Snippet") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (showToast) showToast(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      if (showToast) showToast("Failed to copy", "error");
    }
  };

  // 1. AI Builder Prompt
  const aiPrompt = `Update my vercel.json, next.config.js, or server middleware to include secure HTTP response headers to resolve the '${item.title}' vulnerability:

Content-Security-Policy: default-src 'self' https: data: 'unsafe-inline';
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()

Please ensure all existing API and page routes continue functioning seamlessly without breaking styles or third-party assets.`;

  // 2. Next.js Config Snippet
  const nextConfigSnippet = `// next.config.mjs or next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self' https: data: 'unsafe-inline';" },
        ],
      },
    ];
  },
};
export default nextConfig;`;

  // 3. Vercel Config Snippet
  const vercelJsonSnippet = `{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self' https: data: 'unsafe-inline';" }
      ]
    }
  ]
}`;

  // 4. WordPress .htaccess Snippet
  const htaccessSnippet = `# WebGuard Security Headers
<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';"
</IfModule>`;

  // 5. Nginx Server Block
  const nginxSnippet = `# /etc/nginx/sites-available/default
server {
    listen 443 ssl http2;
    server_name ${domain};

    # WebGuard AI Recommended Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline';" always;

    # ... remaining server configuration
}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 10px",
        animation: "fadeIn 0.2s ease-out both",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 640,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          background: "var(--canvas-raised)",
          borderRadius: "var(--radius-xl)",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 18px 12px",
            borderBottom: "1px solid var(--canvas-border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            background: "var(--canvas-inset)",
            flexShrink: 0,
            gap: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span className={`badge badge-${item.severity}`} style={{ fontSize: 10, padding: "2px 8px" }}>
                {item.severity.toUpperCase()}
              </span>
              <h3 style={{ margin: 0, fontSize: 15, lineHeight: 1.3, wordBreak: "break-word" }}>{item.title}</h3>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
              Select your hosting/platform below to get tailored instructions for <strong>{domain}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: 6, color: "var(--text-muted)", borderRadius: 6, flexShrink: 0 }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Segmented Platform Tab Selector (Mobile-First 3-Col Grid) ─── */}
        <div
          style={{
            padding: "10px 14px",
            background: "var(--canvas-subtle)",
            borderBottom: "1px solid var(--canvas-border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
              background: "var(--canvas-inset)",
              padding: 3,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--canvas-border)",
            }}
          >
            <button
              onClick={() => setActivePlatform("ai")}
              className={`btn btn-sm ${activePlatform === "ai" ? "btn-primary" : "btn-ghost"}`}
              style={{
                padding: "8px 4px",
                fontSize: 11.5,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                borderRadius: "var(--radius-md)",
                border: "none",
                color: activePlatform === "ai" ? "#FFFFFF" : "var(--text-secondary)",
              }}
            >
              <Sparkles size={13} />
              <span>AI Stack</span>
            </button>

            <button
              onClick={() => setActivePlatform("wordpress")}
              className={`btn btn-sm ${activePlatform === "wordpress" ? "btn-primary" : "btn-ghost"}`}
              style={{
                padding: "8px 4px",
                fontSize: 11.5,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                borderRadius: "var(--radius-md)",
                border: "none",
                color: activePlatform === "wordpress" ? "#FFFFFF" : "var(--text-secondary)",
              }}
            >
              <Globe size={13} />
              <span>WordPress</span>
            </button>

            <button
              onClick={() => setActivePlatform("custom")}
              className={`btn btn-sm ${activePlatform === "custom" ? "btn-primary" : "btn-ghost"}`}
              style={{
                padding: "8px 4px",
                fontSize: 11.5,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                borderRadius: "var(--radius-md)",
                border: "none",
                color: activePlatform === "custom" ? "#FFFFFF" : "var(--text-secondary)",
              }}
            >
              <Server size={13} />
              <span>Custom VPS</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: "16px 16px 20px", overflowY: "auto", flex: 1 }}>
          {/* ─── TAB 1: AI BUILDER (Cursor / Bolt / Lovable / Next.js) ─── */}
          {activePlatform === "ai" && (
            <div className="animate-fade-in">
              <div
                style={{
                  padding: "12px 14px",
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)",
                  border: "1px solid rgba(37, 99, 235, 0.25)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <Sparkles size={16} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)" }}>
                    Instant AI Assistant Fix (Cursor / Bolt / v0 / Lovable)
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.45 }}>
                    Copy the prompt below and paste it directly into your AI chat or code editor.
                  </div>
                </div>
              </div>

              {/* AI Prompt Box */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
                    🤖 Copy &amp; Paste Prompt for AI
                  </label>
                  <button
                    onClick={() => handleCopy(aiPrompt, "ai-prompt", "AI Prompt")}
                    className="btn btn-sm"
                    style={{
                      background: copiedKey === "ai-prompt" ? "var(--success)" : "var(--brand-primary)",
                      color: "white",
                      border: "none",
                      fontSize: 11.5,
                      padding: "5px 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      borderRadius: 6,
                    }}
                  >
                    {copiedKey === "ai-prompt" ? <><Check size={12} /> Copied Prompt!</> : <><Copy size={12} /> Copy AI Prompt</>}
                  </button>
                </div>
                <div
                  className="code-block"
                  style={{
                    padding: "12px 14px",
                    background: "var(--canvas-inset)",
                    border: "1px solid var(--canvas-border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: "var(--text-primary)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {aiPrompt}
                </div>
              </div>

              {/* Framework Config Option */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
                  Or paste manually into your config file:
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>next.config.mjs</span>
                    <button
                      onClick={() => handleCopy(nextConfigSnippet, "next-config", "Next.js snippet")}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 11, padding: "2px 6px" }}
                    >
                      {copiedKey === "next-config" ? "✓ Copied" : "Copy Code"}
                    </button>
                  </div>
                  <div className="code-block" style={{ fontSize: 11.5 }}>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{nextConfigSnippet}</pre>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>vercel.json</span>
                    <button
                      onClick={() => handleCopy(vercelJsonSnippet, "vercel-json", "Vercel JSON")}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 11, padding: "2px 6px" }}
                    >
                      {copiedKey === "vercel-json" ? "✓ Copied" : "Copy Code"}
                    </button>
                  </div>
                  <div className="code-block" style={{ fontSize: 11.5 }}>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{vercelJsonSnippet}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: WORDPRESS / WOOCOMMERCE ───────────────────────── */}
          {activePlatform === "wordpress" && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: 18 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", color: "var(--text-primary)" }}>
                  Method 1: Install WordPress Security Plugin (Recommended)
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, padding: "10px 12px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, flexShrink: 0 }}>1</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                      Log in to <strong>WordPress Admin Panel</strong> ➔ <strong>Plugins ➔ Add New</strong>.
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, padding: "10px 12px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, flexShrink: 0 }}>2</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                      Search and install <strong>&quot;Really Simple SSL&quot;</strong> or <strong>&quot;HTTP Headers&quot;</strong> and activate it.
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, padding: "10px 12px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, flexShrink: 0 }}>3</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                      Go to settings ➔ Security Headers tab ➔ Enable <strong>{item.title}</strong>.
                    </div>
                  </div>
                </div>
              </div>

              {/* Method 2: .htaccess */}
              <div style={{ marginTop: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Method 2: Plugin-Free (.htaccess / cPanel)
                  </h4>
                  <button
                    onClick={() => handleCopy(htaccessSnippet, "htaccess", ".htaccess snippet")}
                    className="btn btn-sm"
                    style={{
                      background: copiedKey === "htaccess" ? "var(--success)" : "var(--brand-primary)",
                      color: "white",
                      border: "none",
                      fontSize: 11.5,
                      padding: "4px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    {copiedKey === "htaccess" ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy .htaccess</>}
                  </button>
                </div>
                <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "0 0 6px" }}>
                  Paste this snippet into your root <code>.htaccess</code> file:
                </p>
                <div className="code-block" style={{ fontSize: 11.5 }}>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{htaccessSnippet}</pre>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: CUSTOM VPS / NGINX / APACHE ───────────────────── */}
          {activePlatform === "custom" && (
            <div className="animate-fade-in">
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, padding: "10px 12px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, flexShrink: 0 }}>1</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                    SSH into your server: <code style={{ fontSize: 11.5 }}>ssh root@{domain}</code>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, padding: "10px 12px", background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, flexShrink: 0 }}>2</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                    Open config: <code style={{ fontSize: 11.5 }}>sudo nano /etc/nginx/sites-available/default</code>
                  </div>
                </div>
              </div>

              {/* Nginx Block */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Nginx Server Block</span>
                  <button
                    onClick={() => handleCopy(nginxSnippet, "nginx", "Nginx configuration")}
                    className="btn btn-sm"
                    style={{
                      background: copiedKey === "nginx" ? "var(--success)" : "var(--brand-primary)",
                      color: "white",
                      border: "none",
                      fontSize: 11.5,
                      padding: "4px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    {copiedKey === "nginx" ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Nginx Code</>}
                  </button>
                </div>
                <div className="code-block" style={{ fontSize: 11.5 }}>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{nginxSnippet}</pre>
                </div>
              </div>

              {/* Test & Reload Command */}
              <div style={{ padding: "10px 12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>
                  Step 3: Test &amp; Reload Web Server
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--canvas-inset)", padding: "6px 10px", borderRadius: 6 }}>
                  <code style={{ fontSize: 11, border: "none", padding: 0, background: "none" }}>sudo nginx -t &amp;&amp; sudo systemctl reload nginx</code>
                  <button
                    onClick={() => handleCopy("sudo nginx -t && sudo systemctl reload nginx", "reload-cmd", "Command")}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, padding: "2px 6px" }}
                  >
                    {copiedKey === "reload-cmd" ? "✓" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "12px 18px",
            background: "var(--canvas-inset)",
            borderTop: "1px solid var(--canvas-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
            Apply fixes &amp; rerun scan to verify.
          </span>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: "5px 14px" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Utility Functions ───────────────────────────────────────────
function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function getScoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "var(--success)";
  if (pct >= 50) return "var(--warning)";
  return "var(--danger)";
}
