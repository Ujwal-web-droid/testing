import * as tls from "node:tls";

export interface HeaderFinding {
  header_name: string;
  present: boolean;
  value: string | null;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
}

export interface SSLReport {
  valid: boolean;
  issuer: string | null;
  subject: string | null;
  valid_from: string | null;
  valid_to: string | null;
  days_until_expiry: number | null;
  protocol_version: string | null;
  score: number;
}

export interface ScanReport {
  target_url: string;
  domain: string;
  overall_score: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  ssl_report: SSLReport;
  headers_report: {
    headers_checked: number;
    headers_present: number;
    score: number;
    findings: HeaderFinding[];
  };
  sensitive_files_report: {
    files_probed: number;
    files_exposed: number;
    score: number;
    findings: Array<{ path: string; exposed: boolean; status_code?: number }>;
  };
  summary: {
    passed_checks: number;
    failed_checks: number;
    action_required: boolean;
  };
  scanned_at: string;
}

const CRITICAL_HEADERS = [
  { name: "Content-Security-Policy", severity: "high" as const, desc: "Restricts unauthorized script execution and prevents XSS attacks." },
  { name: "Strict-Transport-Security", severity: "high" as const, desc: "Forces modern browsers to only connect over secure HTTPS." },
  { name: "X-Frame-Options", severity: "medium" as const, desc: "Prevents clickjacking attacks by disabling unauthorized iframe embedding." },
  { name: "X-Content-Type-Options", severity: "medium" as const, desc: "Stops MIME-type sniffing vulnerabilities." },
  { name: "Referrer-Policy", severity: "low" as const, desc: "Controls amount of referrer data sent in outgoing HTTP requests." },
  { name: "Permissions-Policy", severity: "low" as const, desc: "Restricts access to browser features like camera, microphone, and geolocation." },
];

const SENSITIVE_PROBES = [
  "/.env",
  "/.git/HEAD",
  "/wp-config.php",
  "/config.json",
  "/docker-compose.yml",
];

export async function scanTargetUrl(rawUrl: string): Promise<ScanReport> {
  let urlStr = rawUrl.trim();
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = "https://" + urlStr;
  }

  const parsed = new URL(urlStr);
  const domain = parsed.hostname.replace(/^www\./i, "");

  // 1. SSL/TLS Verification
  const sslReport = await checkSSL(domain);

  // 2. HTTP Security Headers Check
  const headersReport = await checkHeaders(urlStr);

  // 3. Sensitive Path Probing
  const sensitiveFilesReport = await checkSensitiveFiles(urlStr);

  // 4. Overall Weighted Score (Max 100)
  const overallScore = Math.min(
    100,
    Math.max(0, sslReport.score + headersReport.score + sensitiveFilesReport.score)
  );

  const grade = getGrade(overallScore);

  let passed = 0;
  let failed = 0;

  if (sslReport.valid) passed++; else failed++;
  for (const h of headersReport.findings) {
    if (h.present) passed++; else failed++;
  }
  for (const f of sensitiveFilesReport.findings) {
    if (!f.exposed) passed++; else failed++;
  }

  return {
    target_url: urlStr,
    domain,
    overall_score: overallScore,
    grade,
    ssl_report: sslReport,
    headers_report: headersReport,
    sensitive_files_report: sensitiveFilesReport,
    summary: {
      passed_checks: passed,
      failed_checks: failed,
      action_required: overallScore < 80,
    },
    scanned_at: new Date().toISOString(),
  };
}

async function checkSSL(domain: string): Promise<SSLReport> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: domain,
        port: 443,
        servername: domain,
        timeout: 5000,
        rejectUnauthorized: false,
      },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          const authorized = socket.authorized;
          const protocol = socket.getProtocol();

          if (!cert || Object.keys(cert).length === 0) {
            socket.destroy();
            return resolve({
              valid: false,
              issuer: null,
              subject: null,
              valid_from: null,
              valid_to: null,
              days_until_expiry: null,
              protocol_version: protocol || null,
              score: 0,
            });
          }

          const validTo = new Date(cert.valid_to);
          const daysUntil = Math.max(0, Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const isExpired = Date.now() > validTo.getTime();

          let score = 30;
          if (!authorized || isExpired) score = 0;
          else if (daysUntil < 14) score = 15;

          const formatCertField = (field: string | string[] | undefined): string => {
            if (!field) return "Unknown";
            return Array.isArray(field) ? field.join(", ") : field;
          };

          socket.destroy();
          resolve({
            valid: authorized && !isExpired,
            issuer: formatCertField(cert.issuer?.O || cert.issuer?.CN),
            subject: formatCertField(cert.subject?.CN || domain),
            valid_from: cert.valid_from,
            valid_to: cert.valid_to,
            days_until_expiry: daysUntil,
            protocol_version: protocol || "TLSv1.3",
            score,
          });
        } catch {
          socket.destroy();
          resolve({
            valid: false,
            issuer: null,
            subject: null,
            valid_from: null,
            valid_to: null,
            days_until_expiry: null,
            protocol_version: null,
            score: 0,
          });
        }
      }
    );

    socket.on("error", () => {
      socket.destroy();
      resolve({
        valid: false,
        issuer: null,
        subject: null,
        valid_from: null,
        valid_to: null,
        days_until_expiry: null,
        protocol_version: null,
        score: 0,
      });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({
        valid: false,
        issuer: null,
        subject: null,
        valid_from: null,
        valid_to: null,
        days_until_expiry: null,
        protocol_version: null,
        score: 0,
      });
    });
  });
}

async function checkHeaders(url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "WebGuard-AI-MCP-Scanner/1.0" },
    });
    clearTimeout(timeout);

    let presentCount = 0;
    const findings: HeaderFinding[] = [];

    for (const item of CRITICAL_HEADERS) {
      const val = res.headers.get(item.name);
      const isPresent = !!val && val.trim().length > 0;
      if (isPresent) presentCount++;

      findings.push({
        header_name: item.name,
        present: isPresent,
        value: val || null,
        severity: item.severity,
        description: item.desc,
      });
    }

    const headerScore = Math.round((presentCount / CRITICAL_HEADERS.length) * 45);

    return {
      headers_checked: CRITICAL_HEADERS.length,
      headers_present: presentCount,
      score: headerScore,
      findings,
    };
  } catch {
    return {
      headers_checked: CRITICAL_HEADERS.length,
      headers_present: 0,
      score: 0,
      findings: CRITICAL_HEADERS.map((h) => ({
        header_name: h.name,
        present: false,
        value: null,
        severity: h.severity,
        description: h.desc,
      })),
    };
  }
}

async function checkSensitiveFiles(baseUrl: string) {
  const origin = new URL(baseUrl).origin;
  const findings: Array<{ path: string; exposed: boolean; status_code?: number }> = [];
  let exposedCount = 0;

  await Promise.allSettled(
    SENSITIVE_PROBES.map(async (p) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(origin + p, {
          method: "HEAD",
          signal: controller.signal,
          headers: { "User-Agent": "WebGuard-AI-MCP-Scanner/1.0" },
        });
        clearTimeout(timeout);

        const isExposed = res.status === 200;
        if (isExposed) exposedCount++;
        findings.push({ path: p, exposed: isExposed, status_code: res.status });
      } catch {
        findings.push({ path: p, exposed: false });
      }
    })
  );

  const fileScore = Math.max(0, 25 - exposedCount * 10);

  return {
    files_probed: SENSITIVE_PROBES.length,
    files_exposed: exposedCount,
    score: fileScore,
    findings,
  };
}

function getGrade(score: number): "A+" | "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}
