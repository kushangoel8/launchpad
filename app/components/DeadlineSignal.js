"use client";

import { useEffect, useState } from "react";

// The signature element: a lit fuse. As a deadline approaches, the fuse burns
// down and its spark shifts from calm cobalt to warm amber to urgent coral (and
// pulses when it's close). It encodes the one thing that matters most here:
// don't miss the deadline.

const HORIZON = 120; // days; the full length of an "unlit" fuse

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

export default function DeadlineSignal({ deadline, approx }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // stable placeholder to avoid hydration mismatch (time differs server/client)
    return <div className="fuse-wrap" aria-hidden="true" style={{ visibility: "hidden", height: 6 }} />;
  }

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
    <div className={`fuse-wrap tone-${tone} ${closed ? "is-closed" : ""}`}>
      <div className="fuse-track">
        <div className="fuse-burned" style={{ width: `${burned}%` }} />
        {!closed && <span className="fuse-spark" style={{ left: `${burned}%` }} />}
      </div>
      <span className="fuse-label">
        {label}
        {approx && !closed ? <span className="fuse-approx" title="Approximate. Confirm on the official site."> ~</span> : null}
      </span>
    </div>
  );
}
