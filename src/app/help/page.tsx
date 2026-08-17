"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield, ArrowLeft, HelpCircle, Search, ChevronDown, ChevronUp,
  BookOpen, Cpu, Wrench, CreditCard, Scan, MessageSquare, Sparkles,
} from "lucide-react";
import Footer from "@/components/Footer";

interface FAQItem { question: string; answer: string; }
interface FAQCategory { id: string; title: string; icon: React.ReactNode; description: string; items: FAQItem[]; }

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true, "1-0": true });

  const toggleAccordion = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categories: FAQCategory[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen size={20} color="var(--brand-primary)" />,
      description: "Account creation, initial domain setup, and dashboard orientation.",
      items: [
        { question: "How do I add my first domain to WebGuard AI?", answer: "Log in to your WebGuard AI Dashboard, click the '+ Add Website' button in the top right, enter your domain URL (e.g., example.com), and click 'Save & Verify'. The automated engine will immediately perform a baseline audit." },
        { question: "What is the difference between a quick scan and a full audit?", answer: "Quick scans run instant unauthenticated HTTP security header and TLS certificate checks in 2-3 seconds. Full audits perform deep path probing for exposed .env files, git directories, CMS vulnerabilities, and generate framework-specific AI fix patches." },
        { question: "Can I use WebGuard AI for localhost or internal staging domains?", answer: "Yes! By connecting the WebGuard AI Model Context Protocol (MCP) server directly into your IDE (Cursor, Windsurf, or Claude), you can scan and patch local codebases before deploying to production." },
      ],
    },
    {
      id: "security-scanning",
      title: "Security Scanning",
      icon: <Scan size={20} color="var(--success)" />,
      description: "Scanner capabilities, scoring methodology, and detection algorithms.",
      items: [
        { question: "Will scanning my website cause downtime or heavy traffic?", answer: "No. WebGuard AI utilizes lightweight, non-destructive HTTP HEAD/GET probes designed to consume less than 0.1% of server resources with zero payload injection or invasive exploits." },
        { question: "How is the overall security score and letter grade calculated?", answer: "Scores range from 0 to 100 based on weighted metrics: 30% for TLS/SSL certificate health, 40% for essential security headers (CSP, HSTS, X-Frame-Options), and 30% for exposed sensitive assets (.env, .git, admin endpoints). Scores of 90+ earn an 'A' grade." },
        { question: "How often are automated scans executed on monitored domains?", answer: "Free accounts execute manual scans on demand. Pro and Agency plans automatically trigger automated scans every 24 hours with continuous uptime verification and instant regression alerts." },
      ],
    },
    {
      id: "one-click-fixes",
      title: "One-Click Fixes & Guides",
      icon: <Wrench size={20} color="var(--warning)" />,
      description: "Applying AI-generated remediation patches to Next.js, WordPress, and VPS servers.",
      items: [
        { question: "How do I apply fix guides to Next.js or Vercel deployments?", answer: "Click 'Apply Fix Guide' next to any vulnerability on your dashboard. Select the 'AI Builder / Next.js' tab, copy the custom header config snippet, and paste it into your next.config.ts or vercel.json file." },
        { question: "What should I do if a recommended Content-Security-Policy (CSP) breaks my site fonts or analytics?", answer: "Our generated CSP patches include safe defaults with placeholders for common services (Google Fonts, Stripe, Google Analytics). You can whitelist specific third-party CDN hostnames directly in the generated prompt before copying." },
        { question: "Does WebGuard AI modify my code automatically in production?", answer: "No. WebGuard AI generates copy-paste ready code patches and AI prompt templates that you or your IDE assistant review and apply safely inside your version control system." },
      ],
    },
    {
      id: "mcp-integration",
      title: "MCP Server & IDE Integration",
      icon: <Cpu size={20} color="var(--brand-primary)" />,
      description: "Connecting WebGuard AI to Cursor, Windsurf, and Claude Desktop.",
      items: [
        { question: "What is the Model Context Protocol (MCP) server?", answer: "The WebGuard AI MCP server is a standard protocol bridge allowing AI coding assistants to invoke scan_target_url and get_remediation_patch tools directly from your editor terminal." },
        { question: "How do I install and start the MCP server?", answer: "Navigate to the mcp-server directory, run 'npm install && npm run build', and register 'node ./dist/index.js' in your cursor_settings.json or claude_desktop_config.json file under mcpServers." },
      ],
    },
    {
      id: "billing",
      title: "Billing & Subscription Plans",
      icon: <CreditCard size={20} color="var(--brand-primary)" />,
      description: "Invoicing, upgrades, payment options, and agency licenses.",
      items: [
        { question: "What payment methods are supported?", answer: "We support all major international credit/debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and SEPA/Stripe invoice billing for annual enterprise plans." },
        { question: "Can I upgrade or cancel my subscription anytime?", answer: "Yes. You can manage, upgrade, or cancel your subscription anytime with 1-click from the Dashboard Settings. When cancelled, your plan remains active until the end of the billing cycle." },
        { question: "Do you offer discounts for educational institutions or open source projects?", answer: "Yes! Open-source maintainers and non-profit educational institutions can contact support@webguard.ai to receive a 50% discount on Pro plans." },
      ],
    },
  ];

  const filteredCategories = categories.map((cat) => {
    if (activeCategory !== "all" && cat.id !== activeCategory) return null;
    const matchingItems = cat.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchingItems.length === 0 && searchQuery.trim() !== "") return null;
    return { ...cat, items: searchQuery.trim() !== "" ? matchingItems : cat.items };
  }).filter(Boolean) as FAQCategory[];

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

      {/* ─── Hero Search Section ─────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--canvas-border)", background: "var(--canvas-raised)", padding: "52px 24px 44px", textAlign: "center" }}>
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
            <HelpCircle size={14} /> Help Center &amp; Knowledge Base
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 900, color: "var(--brand-deep)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 14 }}>
            How can we help you today?
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Explore guides, setup instructions, and quick solutions for WebGuard AI security automation.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 540, margin: "0 auto" }}>
            <div style={{ position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)", pointerEvents: "none" }}>
              <Search size={18} color="var(--text-muted)" />
            </div>
            <input
              type="text"
              placeholder="Search for questions, headers, CSP, MCP setup, or billing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: 48,
                paddingRight: 60,
                paddingTop: 14,
                paddingBottom: 14,
                background: "var(--canvas)",
                border: "1.5px solid var(--canvas-border)",
                borderRadius: "var(--radius-xl)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                boxShadow: "var(--shadow-sm)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main FAQ List ────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: 960, width: "100%", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Category Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, overflowX: "auto", paddingBottom: 16, marginBottom: 32 }}>
          <button
            onClick={() => setActiveCategory("all")}
            style={{
              padding: "9px 18px",
              borderRadius: "var(--radius-lg)",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              cursor: "pointer",
              border: activeCategory === "all" ? "none" : "1px solid var(--canvas-border)",
              background: activeCategory === "all" ? "var(--brand-primary)" : "var(--canvas-raised)",
              color: activeCategory === "all" ? "#FFFFFF" : "var(--text-secondary)",
              boxShadow: activeCategory === "all" ? "var(--shadow-sm)" : "none",
            }}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "9px 18px",
                borderRadius: "var(--radius-lg)",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                cursor: "pointer",
                border: activeCategory === cat.id ? "none" : "1px solid var(--canvas-border)",
                background: activeCategory === cat.id ? "var(--brand-primary)" : "var(--canvas-raised)",
                color: activeCategory === cat.id ? "#FFFFFF" : "var(--text-secondary)",
                boxShadow: activeCategory === cat.id ? "var(--shadow-sm)" : "none",
              }}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat, catIdx) => (
              <div
                key={cat.id}
                style={{
                  background: "var(--canvas-raised)",
                  border: "1px solid var(--canvas-border)",
                  borderRadius: "var(--radius-2xl)",
                  padding: "28px 28px 24px",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--canvas-border)" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: "var(--canvas-inset)",
                      border: "1px solid var(--canvas-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--brand-deep)", marginBottom: 2 }}>{cat.title}</h2>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{cat.description}</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cat.items.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = !!openItems[key];
                    return (
                      <div
                        key={itemIdx}
                        style={{
                          borderRadius: "var(--radius-lg)",
                          border: "1px solid var(--canvas-border)",
                          background: "var(--canvas)",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() => toggleAccordion(key)}
                          style={{
                            width: "100%",
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-deep)" }}>{item.question}</span>
                          <span style={{ flexShrink: 0 }}>
                            {isOpen ? <ChevronUp size={16} color="var(--brand-primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                          </span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: "0 20px 16px", borderTop: "1px solid var(--canvas-border)", paddingTop: 12 }}>
                            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--canvas-raised)", border: "1px solid var(--canvas-border)", borderRadius: "var(--radius-2xl)" }}>
              <HelpCircle size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-deep)", marginBottom: 6 }}>No matching questions found</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>Try searching with different keywords or contact our support engineers.</p>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 20px",
                  background: "var(--brand-primary)",
                  color: "#FFFFFF",
                  fontSize: 13.5,
                  fontWeight: 600,
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <MessageSquare size={14} /> Contact Support
              </Link>
            </div>
          )}
        </div>

        {/* Enterprise Callout */}
        <div
          style={{
            marginTop: 48,
            padding: "28px 32px",
            borderRadius: "var(--radius-2xl)",
            background: "var(--canvas-raised)",
            border: "1px solid var(--canvas-border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--brand-deep)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="var(--brand-primary)" /> Need custom enterprise guidance?
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", maxWidth: 500, margin: 0, lineHeight: 1.6 }}>
              Our security specialists can review your architecture, configure custom CSP headers, and assist with SOC2 compliance.
            </p>
          </div>
          <Link
            href="/contact"
            style={{
              padding: "12px 22px",
              background: "var(--brand-primary)",
              color: "#FFFFFF",
              fontSize: 13.5,
              fontWeight: 600,
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              flexShrink: 0,
            }}
          >
            Get in Touch →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
