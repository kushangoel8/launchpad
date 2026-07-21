"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "../lib/profile";

const STEPS = [
  {
    key: "fields",
    q: "What are you into?",
    hint: "Pick all that spark something. You can change these later.",
    multi: true,
    options: ["Math", "CS", "Physics", "Chemistry", "Biology", "Engineering", "Research", "Entrepreneurship"],
  },
  {
    key: "level",
    q: "Where are you right now?",
    hint: "So we show things you can actually enter.",
    multi: false,
    options: ["Middle School", "High School", "Undergrad", "Just exploring"],
  },
  {
    key: "region",
    q: "Where do you want opportunities?",
    hint: "Pick any that fit.",
    multi: true,
    options: ["India", "Global (online)", "US", "Anywhere"],
  },
  {
    key: "chasing",
    q: "What are you chasing?",
    hint: "This shapes what we surface first.",
    multi: true,
    options: ["Competition", "Olympiad", "Summer Program", "Research", "Fellowship"],
  },
];

export default function OnboardingQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [leaving, setLeaving] = useState(false);

  const current = STEPS[step];
  const selected = answers[current.key] || (current.multi ? [] : "");
  const canAdvance = current.multi ? selected.length > 0 : !!selected;
  const isLast = step === STEPS.length - 1;

  function choose(option) {
    setAnswers((prev) => {
      if (current.multi) {
        const existing = prev[current.key] || [];
        return {
          ...prev,
          [current.key]: existing.includes(option)
            ? existing.filter((o) => o !== option)
            : [...existing, option],
        };
      }
      return { ...prev, [current.key]: option };
    });
  }

  function go(dir) {
    setLeaving(true);
    setTimeout(() => {
      setStep((s) => Math.min(STEPS.length - 1, Math.max(0, s + dir)));
      setLeaving(false);
    }, 200);
  }

  function finish() {
    saveProfile({ ...answers, completedAt: Date.now() });
    router.push("/");
  }

  return (
    <main className="page">
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p className="eyebrow">Let us tune this to you - 30 seconds</p>

        <div style={{ height: 6, background: "var(--line)", borderRadius: 999, overflow: "hidden", margin: "0 0 28px" }}>
          <div style={{ height: "100%", width: `${((step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(90deg, var(--cobalt), #6a7bff)", borderRadius: 999, transition: "width .35s cubic-bezier(.4,0,.2,1)" }} />
        </div>

        <div style={{ opacity: leaving ? 0 : 1, transform: leaving ? "translateY(8px)" : "translateY(0)", transition: "opacity .2s ease, transform .2s ease" }}>
          <p className="eyebrow" style={{ color: "var(--muted)" }}>Step {step + 1} of {STEPS.length}</p>
          <h1 className="hero-title small" style={{ marginBottom: 6 }}>{current.q}</h1>
          {current.hint && <p className="hero-sub" style={{ marginBottom: 22 }}>{current.hint}</p>}

          <div style={{ display: "grid", gap: 10 }}>
            {current.options.map((opt) => {
              const active = current.multi ? selected.includes(opt) : selected === opt;
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    textAlign: "left", padding: "15px 18px", borderRadius: "var(--radius)",
                    border: `1px solid ${active ? "var(--cobalt)" : "var(--line)"}`,
                    background: active ? "var(--cobalt-soft)" : "var(--card)",
                    color: "var(--ink)", fontFamily: "var(--body)", fontSize: 15,
                    fontWeight: 500, cursor: "pointer", transition: "all .14s ease",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  {opt}
                  <span style={{ color: "var(--cobalt)", fontWeight: 700, opacity: active ? 1 : 0 }}>+</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
            {step > 0 ? (
              <button onClick={() => go(-1)} style={{ background: "none", border: "none", color: "var(--ink-soft)", cursor: "pointer", fontFamily: "var(--body)", fontSize: 14 }}>Back</button>
            ) : <span />}
            <button
              onClick={() => (isLast ? finish() : go(1))}
              disabled={!canAdvance}
              className="empty-cta"
              style={{ marginTop: 0, opacity: canAdvance ? 1 : 0.4, cursor: canAdvance ? "pointer" : "not-allowed" }}
            >
              {isLast ? "Show my launchpad" : "Next"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button onClick={finish} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, fontFamily: "var(--body)" }}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
