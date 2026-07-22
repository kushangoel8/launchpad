"use client";

import Link from "next/link";
import DeadlineSignal from "./DeadlineSignal";
import { STATUSES, setStatus } from "../lib/store";

function matchesProfile(op, profile) {
  if (!profile) return false;
  const fields = profile.fields || [];
  const regions = profile.region || [];
  const fieldHit = fields.some((f) => op.fields.includes(f));
  const regionHit =
    regions.includes("Anywhere") ||
    regions.some((r) => op.region.includes(r)) ||
    /global|online|anywhere/i.test(op.region);
  const typeHit = (profile.chasing || []).includes(op.type);
  return fieldHit && (regionHit || typeHit);
}

export default function OpportunityCard({ op, tracked, trackedInfo, onToggle, profile }) {
  const typeClass = op.type.replace(/\s+/g, "-").toLowerCase();
  const matched = matchesProfile(op, profile);
  return (
    <article className={`card ${tracked ? "card-tracked" : ""}`}>
      <header className="card-top">
        <span className={`type-badge type-${typeClass}`}>{op.type}</span>
        <button
          className={`track-btn ${tracked ? "is-on" : ""}`}
          onClick={() => onToggle(op.id)}
          aria-pressed={tracked}
        >
          {tracked ? "Tracking" : "Track"}
        </button>
      </header>

      {matched && (
        <span style={{ alignSelf: "flex-start", fontFamily: "var(--mono)", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--mint)", background: "#e7f9f1", padding: "3px 9px", borderRadius: 6, marginBottom: 8 }}>
          Matches you
        </span>
      )}

      <h3 className="card-title">{op.title}</h3>
      <p className="card-org">{op.org}</p>
      <p className="card-blurb">{op.blurb}</p>

      <div className="tag-row">
        {op.fields.map((f) => (
          <span key={f} className="tag">{f}</span>
        ))}
      </div>

      <div className="meta-row">
        <span className="meta">{op.region}</span>
        <span className="dot">|</span>
        <span className="meta">{op.cost}</span>
        <span className="dot">|</span>
        <span className="meta">{op.level}</span>
      </div>

      <div className="window-row" title={op.window}>{op.window}</div>

      <DeadlineSignal deadline={op.deadline} approx={op.approx} />

      {tracked && (
        <div className="status-row">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`status-chip ${trackedInfo?.status === s ? "chip-active" : ""}`}
              onClick={() => setStatus(op.id, s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <footer className="card-foot">
        <Link className="official-link" href={`/opportunity/${op.id}`}>
          How to apply
        </Link>
        <a className="confirm-note" href={op.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          official site
        </a>
      </footer>
    </article>
  );
}
