export interface RemediationPatchResult {
  vulnerability_type: string;
  tech_stack: string;
  target_file: string;
  code_patch: string;
  ai_prompt: string;
  verification_command: string;
  explanation: string;
}

export function getRemediationPatch(
  vulnerabilityType: string,
  techStack: string,
  domain = "example.com"
): RemediationPatchResult {
  const normVuln = vulnerabilityType.toLowerCase().trim();
  const normStack = techStack.toLowerCase().trim();

  // 1. Next.js / React Stack
  if (normStack === "nextjs" || normStack === "react" || normStack === "next") {
    return {
      vulnerability_type: normVuln,
      tech_stack: "Next.js",
      target_file: "next.config.mjs",
      code_patch: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
    ];
  },
};

export default nextConfig;`,
      ai_prompt: `Update my Next.js configuration in next.config.mjs to add the security headers (CSP, HSTS, X-Frame-Options, and X-Content-Type-Options) to resolve '${normVuln}'.`,
      verification_command: "npm run build && npm run start",
      explanation: "Next.js async headers() configures secure HTTP response headers at the framework level before responses are sent to clients.",
    };
  }

  // 2. Vercel Serverless Platform
  if (normStack === "vercel") {
    return {
      vulnerability_type: normVuln,
      tech_stack: "Vercel",
      target_file: "vercel.json",
      code_patch: `{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self' https: data: 'unsafe-inline';" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}`,
      ai_prompt: `Create or update vercel.json in my root directory to include production HTTP security response headers to fix '${normVuln}'.`,
      verification_command: "vercel deploy --prod",
      explanation: "Vercel edge network applies these headers automatically on all route responses.",
    };
  }

  // 3. WordPress / WooCommerce (.htaccess)
  if (normStack === "wordpress" || normStack === "woocommerce" || normStack === "apache") {
    return {
      vulnerability_type: normVuln,
      tech_stack: "WordPress / Apache",
      target_file: ".htaccess",
      code_patch: `# --- WebGuard AI Security Headers ---
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';"
  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Block access to sensitive files
<FilesMatch "(\\.env|\\.git|composer\\.json|wp-config\\.php)$">
  Order allow,deny
  Deny from all
</FilesMatch>`,
      ai_prompt: `Add Apache security headers and file protection directives to .htaccess for WordPress domain ${domain} to resolve '${normVuln}'.`,
      verification_command: "curl -I https://" + domain,
      explanation: "Apache mod_headers appends security headers to all outgoing responses and blocks direct access to sensitive config files.",
    };
  }

  // 4. Custom VPS / Nginx (Default)
  return {
    vulnerability_type: normVuln,
    tech_stack: "Nginx",
    target_file: "/etc/nginx/sites-available/default",
    code_patch: `# Nginx Server Block Configuration
server {
    listen 443 ssl http2;
    server_name ${domain};

    # WebGuard AI Security Headers
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline';" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Protect hidden files (.env, .git)
    location ~ /\\.(env|git|htaccess) {
        deny all;
        return 404;
    }
}`,
    ai_prompt: `Provide the Nginx server block configuration for ${domain} adding HTTP security headers (CSP, HSTS, X-Frame-Options, nosniff) to resolve '${normVuln}'.`,
    verification_command: "sudo nginx -t && sudo systemctl reload nginx",
    explanation: "Nginx add_header directives inject defensive security headers at the reverse proxy layer.",
  };
}
