"use client";

import { useEffect, useState } from "react";

// The signature element: a lit fuse. As a deadline approaches the fuse burns
// down and its spark shifts from calm cobalt to warm amber to urgent coral.
//
// CRITICAL HONESTY RULE:
// A fuse burning down to "3d" is a promise that we know the date. We only make
// that promise for CONFIRMED deadlines (approx: false). For estimated dates we
// deliberately refuse the countdown and show a month instead - a student must
// never mistake our guess for a fact and miss a real deadline because of it.

const HORIZON = 120; // days; the full length of an "unlit" fuse
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function daysLeft(deadlineISO) {
  const now = new Date();
  const d = new Date(deadlineISO + "T23:59:59");
  return Math.ceil((d - now) / 86400000);
}

export function urgencyRank(deadlineISO) {
  const dl = daysLeft(deadlineISO);
  if (dl < 0) return 100000; // closed sorts last
  return dl; // fewer days = more urgent = sorts first
}

export default function DeadlineSignal({ deadline, approx, verifiedAt }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // stable placeholder to avoid hydration mismatch (time differs server/client)
    return <div className="fuse-wrap" aria-hidden="true" style={{ visibility: "hidden", height: 6 }} />;
  }

  // ---- ESTIMATED DATE: no countdown, no urgency colour, no pulse ----
  if (approx) {
    const d = new Date(deadline + "T00:00:00");
    const label = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    return (
      <div
        className="fuse-wrap tone-calm"
        title="Estimated from previous years - NOT a confirmed date. Check the official site for this year's deadline."
      >
        <div
          className="fuse-track"
          style={{
            opacity: 0.55,
            background:
              "repeating-linear-gradient(90deg, #dfe4ef 0 4px, transparent 4px 9px)",
          }}
        />
        <span className="fuse-label fuse-approx" style={{ minWidth: 86, fontWeight: 500 }}>
          est. {label}
        </span>
      </div>
    );
  }

  // ---- CONFIRMED DATE: the real fuse ----
  const dl = daysLeft(deadline);
  const closed = dl < 0;

  let tone = "calm";
  if (!closed) {
    if (dl <= 14) tone = "critical";
    else if (dl <= 45) tone = "warm";
  }

  const burned = closed ? 100 : Math.min(100, Math.max(0, (1 - dl / HORIZON) * 100));
  const label = closed ? "Closed" : dl === 0 ? "Today" : `${dl}d`;

  return (
    <div
      className={`fuse-wrap tone-${tone} ${closed ? "is-closed" : ""}`}
      title={verifiedAt ? `Confirmed deadline. Last verified ${verifiedAt}.` : "Confirmed deadline."}
    >
      <div className="fuse-track">
        <div className="fuse-burned" style={{ width: `${burned}%` }} />
        {!closed && <span className="fuse-spark" style={{ left: `${burned}%` }} />}
      </div>
      <span className="fuse-label">{label}</span>
    </div>
  );
}
