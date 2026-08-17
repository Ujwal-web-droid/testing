#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { scanTargetUrl } from "./tools/scan.js";
import { getRemediationPatch } from "./tools/remediation.js";

// Initialize the WebGuard AI MCP Server
const server = new McpServer({
  name: "webguard-ai-mcp-server",
  version: "1.0.0",
});

// ═══════════════════════════════════════════════════════════════
// Tool 1: scan_target_url
// ═══════════════════════════════════════════════════════════════
server.tool(
  "scan_target_url",
  "Runs a live security audit on a target website URL (SSL/TLS validation, HTTP security headers check, sensitive file probe, and overall compliance score).",
  {
    url: z.string().describe("The website URL or domain to audit (e.g. 'https://evostackr.in' or 'example.com')"),
  },
  async ({ url }) => {
    try {
      const report = await scanTargetUrl(url);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `WebGuard scan failed: ${error.message || String(error)}`,
          },
        ],
      };
    }
  }
);

// ═══════════════════════════════════════════════════════════════
// Tool 2: get_remediation_patch
// ═══════════════════════════════════════════════════════════════
server.tool(
  "get_remediation_patch",
  "Generates an actionable code fix, config patch, or AI prompt to resolve specific website security vulnerabilities based on the user's tech stack.",
  {
    vulnerability_type: z
      .string()
      .describe(
        "Vulnerability type to resolve (e.g. 'missing-csp', 'missing-hsts', 'missing-x-frame-options', 'missing-nosniff', 'exposed-env', 'all-headers')"
      ),
    tech_stack: z
      .enum(["nextjs", "vercel", "nginx", "apache", "wordpress", "express"])
      .describe("The target platform or framework used by the website"),
    domain: z
      .string()
      .optional()
      .describe("Optional website domain name for personalized configurations"),
  },
  async ({ vulnerability_type, tech_stack, domain }) => {
    try {
      const patch = getRemediationPatch(vulnerability_type, tech_stack, domain);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(patch, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Failed to generate remediation patch: ${error.message || String(error)}`,
          },
        ],
      };
    }
  }
);

// Start the server over Standard I/O Transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting WebGuard MCP server:", error);
  process.exit(1);
});
