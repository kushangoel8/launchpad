"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useProfile } from "../lib/profile";
import OnboardingQuiz from "./OnboardingQuiz";

// The front door. Anyone arriving without a saved profile gets the quiz
// immediately, as a full-screen takeover - no button to press, no opt-in.
// Once answered, it never appears again on this device.

export default function OnboardingGate() {
  const profile = useProfile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Only decide on the client - localStorage does not exist during SSR, and
  // rendering the overlay on the server would cause a hydration mismatch.
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (profile) return null;
  if (pathname === "/start") return null; // that route renders the quiz itself

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Set up your launchpad"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--paper)",
        overflowY: "auto",
        animation: "lp-fade-in .28s ease",
      }}
    >
      <OnboardingQuiz embedded />
    </div>
  );
}
