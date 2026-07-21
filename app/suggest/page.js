"use client";

import { useState } from "react";

// TODO: set this to the address where you want suggestions to land.
const SUBMIT_EMAIL = "you@example.com";

export default function SuggestPage() {
  const [f, setF] = useState({ title: "", org: "", url: "", region: "", deadline: "", why: "" });
  const [copied, setCopied] = useState(false);

  const update = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));

  const body =
    `New opportunity suggestion for Launchpad:\n\n` +
    `Name: ${f.title}\nOrganizer: ${f.org}\nOfficial link: ${f.url}\n` +
    `Region: ${f.region}\nDeadline (approx): ${f.deadline}\n\nWhy it belongs: ${f.why}\n`;

  const mailto = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent("Launchpad opportunity suggestion: " + (f.title || "untitled"))}&body=${encodeURIComponent(body)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const inputStyle = { width: "100%", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius)", background: "var(--card)", fontFamily: "var(--body)", fontSize: 15, color: "var(--ink)", marginBottom: 12, boxShadow: "var(--shadow)" };
  const label = { display: "block", fontFamily: "var(--mono)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "6px 0 6px" };

  return (
    <main className="page">
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <p className="eyebrow">Help the map grow</p>
        <h1 className="hero-title small">Suggest an opportunity</h1>
        <p className="hero-sub" style={{ marginBottom: 26 }}>
          Know a competition, program, olympiad, or fellowship that belongs here - especially one from your part of the
          world? Add it. The product is only as good as its data, and the best entries come from students who chase them.
        </p>

        <label style={label}>Name</label>
        <input style={inputStyle} value={f.title} onChange={update("title")} placeholder="e.g. Indian Olympiad Qualifier in Mathematics" />
        <label style={label}>Organizer</label>
        <input style={inputStyle} value={f.org} onChange={update("org")} placeholder="Who runs it?" />
        <label style={label}>Official link</label>
        <input style={inputStyle} value={f.url} onChange={update("url")} placeholder="https://..." />
        <label style={label}>Region</label>
        <input style={inputStyle} value={f.region} onChange={update("region")} placeholder="India, US, Global (online)..." />
        <label style={label}>Approx. deadline</label>
        <input style={inputStyle} value={f.deadline} onChange={update("deadline")} placeholder="e.g. late July, or 2026-07-25" />
        <label style={label}>Why it belongs</label>
        <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={f.why} onChange={update("why")} placeholder="One or two lines on who it is for and why it is worth chasing." />

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
          <a className="empty-cta" style={{ marginTop: 0 }} href={mailto}>Send suggestion</a>
          <button className="track-btn" onClick={copy}>{copied ? "Copied" : "Copy details"}</button>
        </div>
      </div>
    </main>
  );
}
