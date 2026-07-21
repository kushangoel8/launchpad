"use client";

import Link from "next/link";
import { useMemo } from "react";
import { opportunities } from "../lib/opportunities";
import { useTracked, toggleTracked } from "../lib/store";
import { urgencyRank, daysLeft } from "../components/DeadlineSignal";
import OpportunityCard from "../components/OpportunityCard";

export default function Tracked() {
  const tracked = useTracked();

  const items = useMemo(() => {
    return opportunities
      .filter((op) => tracked[op.id])
      .sort((a, b) => urgencyRank(a.deadline) - urgencyRank(b.deadline));
  }, [tracked]);

  const closingSoon = items.filter((op) => {
    const d = daysLeft(op.deadline);
    return d >= 0 && d <= 21;
  }).length;

  if (items.length === 0) {
    return (
      <main className="page">
        <div className="empty tall">
          <h1 className="empty-title">Your launchpad is empty</h1>
          <p>Track opportunities and they&apos;ll line up here — the closest deadline always on top.</p>
          <Link href="/" className="empty-cta">Find opportunities →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="hero compact">
        <p className="eyebrow">Your tracking board</p>
        <h1 className="hero-title small">
          {items.length} tracked
          {closingSoon > 0 ? <span className="hero-accent"> · {closingSoon} closing within 3 weeks</span> : null}
        </h1>
        <p className="hero-sub">Sorted by what closes first. Move each one from Interested → Applying → Submitted as you go.</p>
      </header>

      <section className="grid">
        {items.map((op) => (
          <OpportunityCard
            key={op.id}
            op={op}
            tracked={true}
            trackedInfo={tracked[op.id]}
            onToggle={toggleTracked}
          />
        ))}
      </section>
    </main>
  );
}
