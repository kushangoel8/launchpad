"use client";

// Profile store - the onboarding quiz answers. Mirrors lib/store.js: saved in
// the browser, and exposed through a subscribable hook so that when the quiz
// saves, every page re-renders immediately (no reload, no refresh).

import { useSyncExternalStore } from "react";

const KEY = "launchpad.profile.v1";
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

export function getProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {}
  emit();
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

// Cache the parsed value so useSyncExternalStore gets a stable reference.
let cache = null;
let cacheRaw;
function getSnapshot() {
  const raw = typeof window === "undefined" ? null : window.localStorage.getItem(KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? JSON.parse(raw) : null;
    } catch {
      cache = null;
    }
  }
  return cache;
}

function getServerSnapshot() {
  return null;
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
