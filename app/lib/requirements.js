// ---------------------------------------------------------------------------
// REQUIREMENTS - what each opportunity actually asks of a student.
//
// This is the layer that turns a directory into a coach. For each program we
// record what you must have ready, how long it realistically takes, and who it
// suits. Honesty rules, same as the dataset:
//   - Only fill this in where we actually know. A missing entry is fine; the UI
//     falls back to a generic checklist rather than inventing specifics.
//   - These are PREPARATION guides, not official rules. Always confirm on the
//     official site. Requirements change year to year.
// ---------------------------------------------------------------------------

export const requirements = {
  ioqm: {
    eligibility: "Classes 8-12 in a recognised Indian school, any board.",
    lead: "3-6 months of problem practice",
    needs: [
      "Enrolment through a registered centre or the online portal",
      "Registration fee (modest; concessions in some categories)",
      "Comfort with olympiad-style algebra, geometry, number theory, combinatorics",
    ],
    prep: [
      "Work past IOQM papers under a real 3-hour clock",
      "Build a mistake log - the same gaps repeat until you write them down",
      "Drill the four core topics rather than reading broadly",
    ],
    note: "This is the widest funnel in Indian math olympiads and the entry point to RMO, INMO, and eventually the IMO.",
  },
  "ioq-science": {
    eligibility: "School students up to class 12; enrol through your school where possible.",
    lead: "2-4 months",
    needs: [
      "Enrolment via your school or an approved centre",
      "Enrolment fee per subject",
      "Solid class 11-12 level command of your chosen subject",
    ],
    prep: [
      "Pick one or two subjects and go deep rather than entering everything",
      "Practise the objective and subjective halves separately - they reward different skills",
      "Ask your school early; many schools miss the enrolment window entirely",
    ],
    note: "Leads through the national olympiad stages toward India's international teams.",
  },
  "ico-india": {
    eligibility: "Any school student up to class 12, any board. No lower age limit.",
    lead: "2-4 months of programming practice",
    needs: [
      "Online registration on the IARCS site plus fee",
      "ZIO needs pen-and-paper algorithmic reasoning; ZCO needs actual coding",
      "For INOI and beyond, working C++ is effectively required",
    ],
    prep: [
      "Choose your route: ZIO rewards reasoning, ZCO rewards implementation speed",
      "Practise past problems on the IARCS archive",
      "Get fluent in one language first; breadth does not help here",
    ],
    note: "Clearing either zonal round puts you in INOI, the path to India's IOI team.",
  },
  usaco: {
    eligibility: "Open to anyone; no country restriction for practice and contests.",
    lead: "Ongoing - start any time",
    needs: [
      "A free USACO account",
      "One language you can write confidently under time pressure",
    ],
    prep: [
      "Start at Bronze and actually finish the division before moving up",
      "Use the USACO Guide for structured topic order",
      "Enter a contest early even if unprepared - the format is the real lesson",
    ],
    note: "Fully open. One of the few elite paths with no application at all - you just compete.",
  },
  "regeneron-sts": {
    eligibility: "US high school seniors.",
    lead: "12+ months - the research must already exist",
    needs: [
      "A completed original research project",
      "A written research report",
      "Essays, recommendations, and transcript",
    ],
    prep: [
      "The project is the whole application - start research a year or more ahead",
      "Find a mentor early; most competitive entries have lab or faculty support",
      "Write the report as you go, not in the final month",
    ],
    note: "You cannot start this one late. If the research does not exist yet, aim at next cycle.",
  },
  rsi: {
    eligibility: "Rising high school seniors; extremely selective.",
    lead: "6-12 months",
    needs: [
      "Very strong standardised scores and coursework",
      "Evidence of prior research or olympiad-level achievement",
      "Essays and recommendations",
    ],
    prep: [
      "Build a real record before applying - this rewards a track record, not potential alone",
      "Have a specific research interest you can articulate",
      "Apply to several summer programs; admission rates here are brutal for everyone",
    ],
    note: "Free, and among the most selective programs in the world. Apply, but never as your only plan.",
  },
  "mit-primes": {
    eligibility: "High school students; strong preference for the Boston area, with online tracks.",
    lead: "3-6 months",
    needs: [
      "A demanding problem set solved independently",
      "Strong math or CS background",
      "Time commitment across the academic year",
    ],
    prep: [
      "The entrance problem set is the filter - budget weeks for it",
      "Show full reasoning; partial rigorous work beats bare answers",
      "Confirm which track fits your location",
    ],
    note: "Free, year-long, and genuinely produces publishable work.",
  },
  "breakthrough-jr": {
    eligibility: "Ages 13-18 worldwide.",
    lead: "4-8 weeks",
    needs: [
      "A short original video explaining a concept in physics, math, or life sciences",
      "Registration before the submission deadline",
    ],
    prep: [
      "Pick one idea and explain it unusually clearly - production value matters less than clarity",
      "Watch past winners before scripting",
      "Leave a week for editing; nearly everyone underestimates this",
    ],
    note: "One of the most accessible global competitions with a serious prize. No institutional backing needed.",
  },
};

// Fallback when we have not researched a program yet - deliberately generic
// rather than invented specifics.
export const genericRequirements = {
  eligibility: "Check the official site - eligibility varies by year and region.",
  lead: "Varies",
  needs: [
    "Read the official eligibility rules before investing time",
    "Note whether you apply as an individual, a team, or through a school",
    "Confirm the current deadline on the official site",
  ],
  prep: [
    "Work backwards from the deadline and set your own earlier internal one",
    "Find last year's winners or participants to see the real standard",
    "Ask a teacher or mentor early if recommendations are needed",
  ],
  note: "We have not written a detailed guide for this one yet.",
};

export function getRequirements(id) {
  return requirements[id] || genericRequirements;
}

export function hasDetailedGuide(id) {
  return Boolean(requirements[id]);
}
