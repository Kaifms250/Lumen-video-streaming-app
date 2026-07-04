import type { WatchProgress } from "./types";

const PROGRESS_KEY = "lumen.progress.v1";
const LIST_KEY = "lumen.mylist.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

// ---------- Continue watching ----------

export function readProgressMap(): Record<string, WatchProgress> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, WatchProgress>) : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: WatchProgress) {
  if (!isBrowser()) return;
  const map = readProgressMap();
  map[p.movieId] = p;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  } catch {
    /* quota */
  }
}

export function getProgress(movieId: string): WatchProgress | undefined {
  return readProgressMap()[movieId];
}

export function listInProgress(): WatchProgress[] {
  return Object.values(readProgressMap())
    .filter((p) => p.percent > 1 && p.percent < 95)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

// ---------- My List ----------

export function readMyList(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(LIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isInMyList(id: string): boolean {
  return readMyList().includes(id);
}

export function toggleMyList(id: string): boolean {
  if (!isBrowser()) return false;
  const list = readMyList();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift(id);
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
  return idx < 0;
}
