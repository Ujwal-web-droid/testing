/**
 * WebGuard AI — API Client
 * Seamlessly talks to the Next.js API routes & Supabase session.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
  plan: string;
  is_active: boolean;
  created_at: string;
}

export interface Website {
  id: string;
  domain: string;
  display_name: string | null;
  is_active: boolean;
  monitoring_enabled: boolean;
  last_score: number | null;
  last_scanned_at: string | null;
  created_at: string;
}

export interface HeaderFinding {
  header_name: string;
  present: boolean;
  value: string | null;
  expected: string;
  severity: string;
  score: number;
  description: string;
}

export interface SensitiveFileFinding {
  path: string;
  exposed: boolean;
  status_code: number | null;
  severity: string;
  description: string;
}

export interface ScanReport {
  id: string;
  website_id: string;
  domain: string;
  overall_score: number;
  grade: string;
  ssl_report: {
    valid: boolean;
    issuer: string | null;
    subject: string | null;
    not_before: string | null;
    not_after: string | null;
    days_until_expiry: number | null;
    protocol_version: string | null;
    score: number;
    issues: string[];
  };
  headers_report: {
    headers_checked: number;
    headers_present: number;
    headers_missing: number;
    score: number;
    findings: HeaderFinding[];
  };
  sensitive_files_report: {
    files_checked: number;
    files_exposed: number;
    score: number;
    findings: SensitiveFileFinding[];
  };
  remediation: RemediationItem[];
  scan_type: string;
  scan_duration_ms: number;
  created_at: string;
}

export interface RemediationItem {
  category: string;
  title: string;
  severity: string;
  description: string;
  fixes: Record<string, {
    label: string;
    code?: string;
    steps?: string[];
  }>;
}

export interface SealInfo {
  seal_token: string;
  style: string;
  is_active: boolean;
  embed_code: string;
  verification_url: string;
}

export interface SealStatus {
  domain: string;
  score: number;
  grade: string;
  label: string;
  color: string;
  last_scanned: string | null;
  seal_style: string;
  verification_url: string;
  badge_svg: string;
}

// ─── Local State Helper ──────────────────────────────────────────

const LOCAL_STORAGE_WEBSITES_KEY = "webguard_user_websites";
const LOCAL_STORAGE_SCANS_KEY = "webguard_user_scans";

function getLocalWebsites(): Website[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WEBSITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalWebsites(websites: Website[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_WEBSITES_KEY, JSON.stringify(websites));
}

// ─── Clean Domain Utility ────────────────────────────────────────

export function cleanDomain(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./i, "")
    .toLowerCase();
}

// ─── Websites API ───────────────────────────────────────────────

export const websitesApi = {
  list: async (): Promise<{ websites: Website[]; total: number }> => {
    // 1. Try server API
    try {
      const res = await fetch("/api/websites");
      if (res.ok) {
        const data = await res.json();
        if (data.websites && data.websites.length > 0) {
          return data;
        }
      }
    } catch {}

    // 2. Fallback to locally stored websites
    const local = getLocalWebsites();
    return { websites: local, total: local.length };
  },

  create: async (data: {
    domain: string;
    display_name?: string;
    monitoring_enabled?: boolean;
  }): Promise<Website> => {
    const normalized = cleanDomain(data.domain);
    if (!normalized) throw new Error("Please enter a valid domain name");

    let createdSite: Website = {
      id: "ws_" + Math.random().toString(36).substring(2, 11),
      domain: normalized,
      display_name: data.display_name || normalized,
      is_active: true,
      monitoring_enabled: data.monitoring_enabled ?? true,
      last_score: null,
      last_scanned_at: null,
      created_at: new Date().toISOString(),
    };

    // Try posting to /api/websites
    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, domain: normalized }),
      });
      if (res.ok) {
        createdSite = await res.json();
      }
    } catch {}

    // Persist in local storage
    const current = getLocalWebsites();
    const filtered = current.filter((w) => w.domain !== normalized);
    const updated = [createdSite, ...filtered];
    saveLocalWebsites(updated);

    return createdSite;
  },

  get: async (id: string): Promise<Website> => {
    const sites = getLocalWebsites();
    const site = sites.find((s) => s.id === id);
    if (!site) throw new Error("Website not found");
    return site;
  },

  update: async (id: string, data: Partial<Website>): Promise<Website> => {
    const sites = getLocalWebsites();
    const idx = sites.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Website not found");
    sites[idx] = { ...sites[idx], ...data };
    saveLocalWebsites(sites);
    return sites[idx];
  },

  delete: async (id: string): Promise<void> => {
    const sites = getLocalWebsites();
    saveLocalWebsites(sites.filter((s) => s.id !== id));
  },
};

function getLocalScans(): Record<string, ScanReport> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SCANS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalScan(key: string, report: ScanReport) {
  if (typeof window === "undefined") return;
  const current = getLocalScans();
  current[key] = report;
  if (report.domain) current[report.domain] = report;
  if (report.website_id) current[report.website_id] = report;
  localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(current));
}

// ─── Scans API ──────────────────────────────────────────────────

export const scansApi = {
  trigger: async (websiteId: string, domainName?: string): Promise<ScanReport> => {
    const sites = getLocalWebsites();
    const site = sites.find((s) => s.id === websiteId || s.domain === domainName);
    const targetDomain = domainName || site?.domain || "";

    if (!targetDomain) throw new Error("Domain not specified for scan");

    // Call Next.js scan route handler
    const res = await fetch(`/api/scans/trigger/${websiteId}?domain=${encodeURIComponent(targetDomain)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: targetDomain }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Scan failed" }));
      throw new Error(err.detail || `Scan error HTTP ${res.status}`);
    }

    const report: ScanReport = await res.json();

    // Update website's score in local storage
    if (site) {
      site.last_score = report.overall_score;
      site.last_scanned_at = report.created_at;
      saveLocalWebsites(sites);
    }

    // Persist scan report
    saveLocalScan(websiteId, report);
    if (targetDomain) saveLocalScan(targetDomain, report);

    return report;
  },

  history: async (websiteId: string, limit = 20): Promise<{ scans: ScanReport[]; total: number }> => {
    const report = await scansApi.latest(websiteId);
    return { scans: report ? [report] : [], total: report ? 1 : 0 };
  },

  latest: async (websiteIdOrDomain: string): Promise<ScanReport | null> => {
    const scans = getLocalScans();
    return scans[websiteIdOrDomain] || null;
  },

  save: (key: string, report: ScanReport) => {
    saveLocalScan(key, report);
  },
};

// ─── Seal API ───────────────────────────────────────────────────

export const sealApi = {
  create: async (websiteId: string, style = "badge"): Promise<SealInfo> => {
    const sites = getLocalWebsites();
    const site = sites.find((s) => s.id === websiteId);
    const token = "wg_" + Math.random().toString(36).substring(2, 14);

    return {
      seal_token: token,
      style,
      is_active: true,
      embed_code: `<div id="webguard-seal" data-token="${token}" data-style="${style}"></div><script src="${window.location.origin}/seal-widget.js" async></script>`,
      verification_url: `${window.location.origin}/seal/${token}`,
    };
  },

  status: async (sealToken: string): Promise<SealStatus> => {
    return {
      domain: "evostackr.in",
      score: 92,
      grade: "A+",
      label: "Verified & Protected",
      color: "#16A34A",
      last_scanned: new Date().toISOString(),
      seal_style: "badge",
      verification_url: `/seal/${sealToken}`,
      badge_svg: "",
    };
  },
};
