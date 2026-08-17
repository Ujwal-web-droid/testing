"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, User, Building2, Loader2, AlertCircle, Eye, EyeOff, ChevronRight, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          company_name: formData.company_name || null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data?.session) {
      router.push("/onboarding");
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  // ─── Success State ─────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--canvas)" }}>
        <div className="card animate-scale-in" style={{ padding: 48, textAlign: "center", maxWidth: 420 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--success-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={28} color="var(--success)" />
          </div>
          <h2 style={{ marginBottom: 8 }}>Check your email</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 24px" }}>
            We've sent a confirmation link to <strong style={{ color: "var(--text-primary)" }}>{formData.email}</strong>. Click the link to activate your account.
          </p>
          <a href="/login" className="btn btn-primary" style={{ display: "inline-flex" }}>
            Go to Login <ChevronRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  // ─── Signup Form ───────────────────────────────────────────────
  return (
    <div className="auth-split-container" style={{ minHeight: "100vh", display: "flex", background: "var(--canvas)" }}>
      {/* Left: Brand Panel */}
      <div className="auth-brand-panel" style={{
        width: 440,
        background: "var(--brand-deep)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 48px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={22} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>WebGuard <span style={{ color: "#60A5FA" }}>AI</span></span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1.3, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Start securing your<br />
            websites today.
          </h1>
          <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7 }}>
            Join thousands of e-commerce stores and agencies using WebGuard AI to automate their security compliance.
          </p>

          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 14 }}>
            <BrandFeature emoji="✓" text="Free plan — no credit card required" />
            <BrandFeature emoji="✓" text="First scan results in under 10 seconds" />
            <BrandFeature emoji="✓" text="Remediation guide with copy-paste fixes" />
            <BrandFeature emoji="✓" text="Embeddable trust seal for your site" />
          </div>
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="auth-form-panel" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div className="animate-fade-in" style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create your account</h2>
            <p style={{ fontSize: 14 }}>Get started with WebGuard AI for free</p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="btn btn-secondary"
            style={{ width: "100%", padding: "12px 20px", marginBottom: 20, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--canvas-border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--canvas-border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Full Name *</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input className="input" placeholder="Jane Smith" value={formData.full_name} onChange={(e) => updateField("full_name", e.target.value)} required style={{ paddingLeft: 38 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Company</label>
                <div style={{ position: "relative" }}>
                  <Building2 size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input className="input" placeholder="Acme Inc." value={formData.company_name} onChange={(e) => updateField("company_name", e.target.value)} style={{ paddingLeft: 38 }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Email address *</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="input" type="email" placeholder="you@company.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required style={{ paddingLeft: 38 }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Password *</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="input" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={formData.password} onChange={(e) => updateField("password", e.target.value)} required minLength={8} style={{ paddingLeft: 38, paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Confirm Password *</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="input" type={showPassword ? "text" : "password"} placeholder="Repeat your password" value={formData.confirm_password} onChange={(e) => updateField("confirm_password", e.target.value)} required minLength={8} style={{ paddingLeft: 38 }} />
              </div>
            </div>

            {/* Password strength indicator */}
            {formData.password.length > 0 && (
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4].map((level) => {
                  const strength = formData.password.length >= 12 ? 4 : formData.password.length >= 10 ? 3 : formData.password.length >= 8 ? 2 : 1;
                  const color = level <= strength
                    ? strength >= 3 ? "var(--success)" : strength >= 2 ? "var(--warning)" : "var(--danger)"
                    : "var(--canvas-border)";
                  return <div key={level} style={{ flex: 1, height: 3, borderRadius: 2, background: color, transition: "background 0.3s ease" }} />;
                })}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--danger-light)", borderRadius: "var(--radius-md)", border: "1px solid #FECACA" }}>
                <AlertCircle size={16} color="var(--danger)" />
                <span style={{ fontSize: 13, color: "var(--danger)", fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : <>Create Account <ChevronRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13.5, color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "var(--brand-primary)", fontWeight: 600 }}>Sign in →</a>
          </p>

          <p style={{ textAlign: "center", marginTop: 12, fontSize: 11.5, color: "var(--text-muted)" }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function BrandFeature({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 14, color: "#4ADE80" }}>{emoji}</span>
      <span style={{ fontSize: 13.5, color: "#CBD5E1" }}>{text}</span>
    </div>
  );
}
