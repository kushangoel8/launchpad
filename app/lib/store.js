"use client";

// ----------------------------------------------------------------------------
// v1 tracker store — saves to the browser (localStorage). Zero backend needed,
// so the app deploys with no database and no env vars. This is a DELIBERATE v1
// choice: ship first, add real accounts (login + database) in v1.1 once people
// are actually using it. Data lives only in the user's browser for now.
// ----------------------------------------------------------------------------

import { useSyncExternalStore } from "react";

const KEY = "launchpad.tracked.v1";
const listeners = new Set();

function read() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(next) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export const STATUSES = ["Interested", "Applying", "Submitted"];

export function toggleTracked(id) {
  const cur = read();
  if (cur[id]) {
    delete cur[id];
  } else {
    cur[id] = { status: "Interested", addedAt: Date.now() };
  }
  write(cur);
}

export function setStatus(id, status) {
  const cur = read();
  if (!cur[id]) cur[id] = { addedAt: Date.now() };
  cur[id].status = status;
  write(cur);
}

export function removeTracked(id) {
  const cur = read();
  delete cur[id];
  write(cur);
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

const EMPTY = {};
function getServerSnapshot() {
  return EMPTY;
}

// Cache the parsed snapshot so useSyncExternalStore gets a stable reference.
let cache = EMPTY;
let cacheRaw = null;
function getSnapshot() {
  const raw = typeof window === "undefined" ? "{}" : window.localStorage.getItem(KEY) || "{}";
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = JSON.parse(raw);
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

export function useTracked() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
