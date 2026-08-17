"use client";

import { useState, useEffect, use } from "react";
import { sealApi, type SealStatus } from "@/lib/api";
import { Shield, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";

export default function SealVerificationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [sealData, setSealData] = useState<SealStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    sealApi.status(token).then(setSealData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--canvas)" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={32} color="var(--brand-primary)" className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading verification data…</p>
        </div>
      </div>
    );
  }

  if (error || !sealData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--canvas)" }}>
        <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 400 }}>
          <Shield size={40} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ marginBottom: 8 }}>Seal Not Found</h2>
          <p>This trust seal is either inactive or does not exist.</p>
        </div>
      </div>
    );
  }

  const scoreColor = sealData.score >= 80 ? "var(--success)" : sealData.score >= 50 ? "var(--warning)" : "var(--danger)";
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (sealData.score / 100) * circumference;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--canvas)", padding: 24 }}>
      <div className="card animate-scale-in" style={{ padding: 48, width: "100%", maxWidth: 460, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--brand-deep)" }}>WebGuard <span style={{ color: "var(--brand-primary)" }}>AI</span></span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>Verified Compliance Certificate</p>

        {/* Score Ring */}
        <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 20px" }}>
          <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="75" cy="75" r={radius} fill="none" stroke="var(--canvas-inset)" strokeWidth="10" />
            <circle cx="75" cy="75" r={radius} fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 38, fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em" }}>{sealData.score}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>of 100</span>
          </div>
        </div>

        <h2 style={{ fontSize: 20, marginBottom: 4 }}>{sealData.domain}</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
          <span className={`badge ${sealData.score >= 80 ? "badge-success" : sealData.score >= 50 ? "badge-warning" : "badge-danger"}`}>
            Grade {sealData.grade}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{sealData.label}</span>
        </div>

        <div style={{ background: "var(--canvas-inset)", borderRadius: "var(--radius-md)", padding: 14, marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Last Verified</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            {sealData.last_scanned ? new Date(sealData.last_scanned).toLocaleString() : "Pending"}
          </div>
        </div>

        <div className="badge badge-success" style={{ padding: "8px 20px", fontSize: 13 }}>
          <CheckCircle2 size={14} /> Verified by WebGuard AI
        </div>

        <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-muted)" }}>
          This page confirms that {sealData.domain} is actively monitored for security compliance.
        </p>
      </div>
    </div>
  );
}
