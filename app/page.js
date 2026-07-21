"use client";

import { useMemo, useState } from "react";
import { opportunities, FIELDS, TYPES } from "./lib/opportunities";
import { useTracked, toggleTracked } from "./lib/store";
import { urgencyRank } from "./components/DeadlineSignal";
import OpportunityCard from "./components/OpportunityCard";

export default function Discover() {
  const tracked = useTracked();
  const [q, setQ] = useState("");
  const [field, setField] = useState("All");
  const [type, setType] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState("deadline");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = opportunities.filter((op) => {
      if (field !== "All" && !op.fields.includes(field)) return false;
      if (type !== "All" && op.type !== type) return false;
      if (freeOnly && !/free|stipend/i.test(op.cost)) return false;
      if (needle) {
        const hay = `${op.title} ${op.org} ${op.blurb} ${op.fields.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "deadline"
        ? urgencyRank(a.deadline) - urgencyRank(b.deadline)
        : a.title.localeCompare(b.title)
    );
    return list;
  }, [q, field, type, freeOnly, sort]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">For students who build, compete, and apply</p>
        <h1 className="hero-title">
          Every competition, program, and fellowship worth your time
          <span className="hero-accent"> and never a missed deadline.</span>
        </h1>
        <p className="hero-sub">
          A living map of the opportunities ambitious STEM students actually chase. Filter to what fits you,
          track the ones you want, and let the fuse tell you what is closing soon.
        </p>
      </header>

      <section className="controls" aria-label="Search and filters">
        <input
          className="search"
          type="search"
          placeholder="Search opportunities, fields, organizers..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="filter-line">
          <div className="chip-group" role="group" aria-label="Field">
            <button className={`chip ${field === "All" ? "on" : ""}`} onClick={() => setField("All")}>All fields</button>
            {FIELDS.map((f) => (
              <button key={f} className={`chip ${field === f ? "on" : ""}`} onClick={() => setField(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="filter-line">
          <div className="chip-group" role="group" aria-label="Type">
            <button className={`chip ${type === "All" ? "on" : ""}`} onClick={() => setType("All")}>All types</button>
            {TYPES.map((t) => (
              <button key={t} className={`chip ${type === t ? "on" : ""}`} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>

          <div className="right-controls">
            <label className="toggle">
              <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} />
              Free / funded only
            </label>
            <div className="sort">
              <button className={`sort-btn ${sort === "deadline" ? "on" : ""}`} onClick={() => setSort("deadline")}>
                Closing soon
              </button>
              <button className={`sort-btn ${sort === "name" ? "on" : ""}`} onClick={() => setSort("name")}>
                A-Z
              </button>
            </div>
          </div>
        </div>

        <p className="result-count">{results.length} {results.length === 1 ? "opportunity" : "opportunities"}</p>
      </section>

      {results.length === 0 ? (
        <div className="empty">
          <p>Nothing matches those filters yet.</p>
          <button className="empty-reset" onClick={() => { setQ(""); setField("All"); setType("All"); setFreeOnly(false); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <section className="grid">
          {results.map((op) => (
            <OpportunityCard
              key={op.id}
              op={op}
              tracked={!!tracked[op.id]}
              trackedInfo={tracked[op.id]}
              onToggle={toggleTracked}
            />
          ))}
        </section>
      )}
    </main>
  );
}
