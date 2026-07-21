"use client";

import DeadlineSignal from "./DeadlineSignal";
import { STATUSES, setStatus } from "../lib/store";

export default function OpportunityCard({ op, tracked, trackedInfo, onToggle }) {
  const typeClass = op.type.replace(/\s+/g, "-").toLowerCase();
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
        <a className="official-link" href={op.url} target="_blank" rel="noopener noreferrer">
          Official site
        </a>
        <span className="confirm-note">confirm deadline on official site</span>
      </footer>
    </article>
  );
}
