"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { opportunities } from "../../lib/opportunities";
import { indiaAll } from "../../lib/india";
import { getRequirements } from "../../lib/requirements";
import { useProfile } from "../../lib/profile";
import { useTracked, toggleTracked } from "../../lib/store";
import DeadlineSignal, { daysLeft } from "../../components/DeadlineSignal";

const ALL = [...opportunities, ...indiaAll];

function analyseFit(op, profile) {
  if (!profile) return null;
  const fields = profile.fields || [];
  const regions = profile.region || [];
  const chasing = profile.chasing || [];

  const strengths = [];
  const gaps = [];

  const sharedFields = fields.filter((f) => op.fields.includes(f));
  if (sharedFields.length) {
    strengths.push(`Matches your interest in ${sharedFields.join(" and ")}.`);
  } else {
    gaps.push(`Outside the fields you picked - it sits in ${op.fields.join(", ")}.`);
  }

  const regionOk =
    regions.includes("Anywhere") ||
    regions.some((r) => op.region.includes(r)) ||
    /global|online|anywhere/i.test(op.region);
  if (regionOk) {
    strengths.push(`Open to you where you are (${op.region}).`);
  } else {
    gaps.push(`Runs in ${op.region}, which is outside the regions you chose - check eligibility carefully.`);
  }

  if (chasing.includes(op.type)) {
    strengths.push(`It is a ${op.type.toLowerCase()}, which is what you said you are chasing.`);
  }

  const level = profile.level;
  if (level && /middle/i.test(level) && /senior|undergrad/i.test(op.level)) {
    gaps.push(`Aimed at ${op.level} - worth bookmarking for later rather than applying now.`);
  }

  return { strengths, gaps };
}

export default function OpportunityDetail() {
  const params = useParams();
  const tracked = useTracked();
  const profile = useProfile();
  const [done, setDone] = useState({});

  const op = ALL.find((o) => o.id === params.id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`launchpad.checklist.${params.id}`);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, [params.id]);

  function toggleStep(key) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`launchpad.checklist.${params.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  if (!op) {
    return (
      <main className="page">
        <div className="empty tall">
          <h1 className="empty-title">Not found</h1>
          <p>That opportunity is not in the list.</p>
          <Link href="/" className="empty-cta">Back to Discover</Link>
        </div>
      </main>
    );
  }

  const req = getRequirements(op.id);
  const fit = analyseFit(op, profile);
  const isTracked = !!tracked[op.id];
  const dl = daysLeft(op.deadline);

  const sectionTitle = { fontFamily: "var(--display)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", margin: "0 0 12px" };
  const panel = { background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: 20, boxShadow: "var(--shadow)", marginBottom: 16 };

  return (
    <main className="page">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          back to discover
        </Link>

        <header style={{ margin: "18px 0 24px" }}>
          <span className={`type-badge type-${op.type.replace(/\s+/g, "-").toLowerCase()}`}>{op.type}</span>
          <h1 className="hero-title small" style={{ margin: "12px 0 6px" }}>{op.title}</h1>
          <p className="card-org" style={{ marginBottom: 14 }}>{op.org}</p>
          <p className="hero-sub">{op.blurb}</p>

          <div className="meta-row" style={{ marginTop: 16 }}>
            <span className="meta">{op.region}</span>
            <span className="dot">|</span>
            <span className="meta">{op.cost}</span>
            <span className="dot">|</span>
            <span className="meta">{op.level}</span>
          </div>

          <div style={{ marginTop: 14, marginBottom: 12 }}>
            <DeadlineSignal deadline={op.deadline} approx={op.approx} verifiedAt={op.verifiedAt} />
            <p className="result-count" style={{ marginTop: 8 }}>{op.window}</p>
          </div>

          {op.approx ? (
            <p style={{ fontSize: 12.5, color: "var(--amber)", background: "#fff8ec", border: "1px solid #f6e2c0", borderRadius: "var(--radius-sm)", padding: "10px 12px", margin: "0 0 16px" }}>
              This date is our estimate from previous years, not a confirmed deadline. Check the official site before you plan around it.
            </p>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 16px" }}>
              Confirmed deadline{op.verifiedAt ? ` - last verified ${op.verifiedAt}` : ""}.
            </p>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className={`track-btn ${isTracked ? "is-on" : ""}`} onClick={() => toggleTracked(op.id)}>
              {isTracked ? "Tracking" : "Track this"}
            </button>
            <a className="official-link" href={op.url} target="_blank" rel="noopener noreferrer" style={{ alignSelf: "center" }}>
              Official site
            </a>
          </div>
        </header>

        {fit && (fit.strengths.length > 0 || fit.gaps.length > 0) && (
          <section style={{ ...panel, borderColor: "var(--cobalt)" }}>
            <h2 style={sectionTitle}>Your fit</h2>
            {fit.strengths.map((s, i) => (
              <p key={`s${i}`} style={{ margin: "0 0 8px", fontSize: 14, color: "var(--ink-soft)" }}>
                <span style={{ color: "var(--mint)", fontWeight: 700 }}>+ </span>{s}
              </p>
            ))}
            {fit.gaps.map((g, i) => (
              <p key={`g${i}`} style={{ margin: "0 0 8px", fontSize: 14, color: "var(--ink-soft)" }}>
                <span style={{ color: "var(--amber)", fontWeight: 700 }}>! </span>{g}
              </p>
            ))}
          </section>
        )}

        <section style={panel}>
          <h2 style={sectionTitle}>What it asks of you</h2>
          <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", margin: "0 0 4px" }}>ELIGIBILITY</p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 14px" }}>{req.eligibility}</p>
          <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", margin: "0 0 4px" }}>REALISTIC LEAD TIME</p>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "0 0 14px" }}>{req.lead}</p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "var(--ink-soft)" }}>
            {req.needs.map((n, i) => <li key={i} style={{ marginBottom: 6 }}>{n}</li>)}
          </ul>
          {op.components && op.components.length > 0 && (
            <>
              <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", margin: "16px 0 4px" }}>APPLICATION COMPONENTS</p>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "var(--ink-soft)" }}>
                {op.components.map((c, i) => <li key={i} style={{ marginBottom: 6 }}>{c}</li>)}
              </ul>
            </>
          )}
        </section>

        <section style={panel}>
          <h2 style={sectionTitle}>Your prep plan</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 14px" }}>
            {op.approx
              ? "Timing is estimated, so work backwards from the official date once it is announced. Tick these off as you go - saved on this device."
              : dl >= 0
                ? `${dl} days until the deadline. Tick these off as you go - saved on this device.`
                : "This deadline has passed - use this as prep for the next cycle."}
          </p>
          {req.prep.map((step, i) => {
            const key = `p${i}`;
            const isDone = !!done[key];
            return (
              <label key={key} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid var(--line)", cursor: "pointer" }}>
                <input type="checkbox" checked={isDone} onChange={() => toggleStep(key)} style={{ accentColor: "var(--cobalt)", width: 16, height: 16, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: isDone ? "var(--muted)" : "var(--ink-soft)", textDecoration: isDone ? "line-through" : "none" }}>{step}</span>
              </label>
            );
          })}
        </section>

        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginBottom: 40 }}>
          {req.note} Always confirm details on the official site.
          {op.sourceUrl && (
            <>
              {" "}
              <a href={op.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Source</a>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
