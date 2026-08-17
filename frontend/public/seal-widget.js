/**
 * WebGuard AI — Embeddable Trust Seal Widget
 *
 * Usage:
 *   <div id="webguard-seal" data-token="YOUR_SEAL_TOKEN" data-style="badge"></div>
 *   <script src="https://your-domain.com/seal-widget.js" async></script>
 *
 * The widget fetches the seal status from the WebGuard API
 * and renders a dynamic badge in the target div.
 */
(function () {
  "use strict";

  const API_BASE = "http://localhost:8000/api/v1";

  function init() {
    const container = document.getElementById("webguard-seal");
    if (!container) return;

    const token = container.getAttribute("data-token");
    const style = container.getAttribute("data-style") || "badge";

    if (!token) {
      console.error("[WebGuard] Missing data-token attribute");
      return;
    }

    fetchSealStatus(token)
      .then((data) => renderSeal(container, data, style))
      .catch((err) =>
        console.error("[WebGuard] Failed to load seal:", err)
      );
  }

  async function fetchSealStatus(token) {
    const res = await fetch(`${API_BASE}/seal/status/${token}`);
    if (!res.ok) throw new Error("Seal not found");
    return res.json();
  }

  function renderSeal(container, data, style) {
    const { domain, score, grade, label, color, verification_url } = data;

    // Clear container
    container.innerHTML = "";

    // Create link wrapper
    const link = document.createElement("a");
    link.href = verification_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = `${domain} — WebGuard AI Security Score: ${score}/100`;
    link.style.textDecoration = "none";
    link.style.display = "inline-block";

    if (style === "badge") {
      link.innerHTML = createBadge(score, grade, color);
    } else if (style === "banner") {
      link.innerHTML = createBanner(domain, score, grade, label, color);
    } else {
      link.innerHTML = createMinimal(score, grade, color);
    }

    container.appendChild(link);
  }

  function createBadge(score, grade, color) {
    return `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border: 1.5px solid ${color};
        border-radius: 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        cursor: pointer;
      " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.4)'"
         onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 12px rgba(0,0,0,0.3)'">
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: ${color}20;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 900;
          color: ${color};
          border: 1px solid ${color}40;
        ">${grade}</div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #f8fafc; letter-spacing: 0.02em;">
            WebGuard Verified
          </div>
          <div style="font-size: 10px; color: #94a3b8;">
            Score: ${score}/100 · Protected
          </div>
        </div>
      </div>
    `;
  }

  function createBanner(domain, score, grade, label, color) {
    return `
      <div style="
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border: 1px solid ${color}40;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        max-width: 380px;
      ">
        <div style="
          font-size: 28px;
          font-weight: 900;
          color: ${color};
          min-width: 48px;
          text-align: center;
        ">${score}</div>
        <div style="flex: 1;">
          <div style="font-size: 13px; font-weight: 700; color: #f8fafc;">
            🛡️ WebGuard AI Verified
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
            ${domain} · Grade ${grade} · ${label}
          </div>
        </div>
      </div>
    `;
  }

  function createMinimal(score, grade, color) {
    return `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        background: #0f172a;
        border: 1px solid ${color}40;
        border-radius: 100px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 11px;
        color: #94a3b8;
      ">
        <span style="color: ${color}; font-weight: 700;">${grade}</span>
        <span>WebGuard</span>
        <span style="color: ${color};">${score}/100</span>
      </div>
    `;
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
