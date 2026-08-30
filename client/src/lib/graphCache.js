// Offline cache for the pose graph.
//
// The whole point of this app is that you can open it on a mat, in a studio,
// with no signal. So the graph — every pose, and every relationship with its
// written explanation — is pulled down once and kept on the device.
//
// Text lives in localStorage (small, synchronous, survives relaunches).
// Images are pushed into the Cache API separately, because they're big and
// their absence degrades gracefully.

import { api } from '../config';

const KEY = 'pn.graph.v1';
const IMG_CACHE = 'pn-images-v1';
const STALE_AFTER = 1000 * 60 * 60 * 24; // re-sync in the background after a day

let memo = null;          // in-memory mirror, so we parse the JSON once
let memoLoaded = false;

function load() {
  if (memoLoaded) return memo;
  memoLoaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    memo = raw ? JSON.parse(raw) : null;
  } catch {
    memo = null;          // corrupt or unavailable — treat as empty
  }
  return memo;
}

function persist(graph) {
  memo = graph;
  memoLoaded = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(graph));
    return true;
  } catch {
    return false;         // over quota; we still have it in memory this session
  }
}

/* ── Reads (synchronous, safe to call during render) ──────────────────── */

export function cachedPoses() {
  return load()?.poses ?? null;
}

export function cachedDetail(id) {
  return load()?.details?.[id] ?? null;
}

export function cacheInfo() {
  const g = load();
  if (!g) return { present: false, count: 0, savedAt: null, stale: true };
  return {
    present: true,
    count: g.poses?.length ?? 0,
    detailCount: Object.keys(g.details ?? {}).length,
    savedAt: g.savedAt,
    stale: Date.now() - (g.savedAt ?? 0) > STALE_AFTER,
  };
}

/* ── Network ──────────────────────────────────────────────────────────── */

async function getJSON(path) {
  const res = await fetch(api(path));
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

export const fetchPoses = () => getJSON('/api/poses');
export const fetchDetail = id => getJSON(`/api/poses/${id}`);

/* ── Full sync ────────────────────────────────────────────────────────── */

// Walk every pose and store its relationships. Runs a small pool rather than
// 61 parallel requests, which a phone on hotel wifi handles badly.
export async function syncAll({ onProgress, concurrency = 6 } = {}) {
  const poses = await fetchPoses();
  const details = { ...(load()?.details ?? {}) };

  let done = 0;
  const queue = [...poses];

  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      try {
        details[p.id] = await fetchDetail(p.id);
      } catch {
        /* leave whatever we already had for this pose */
      }
      done += 1;
      onProgress?.(done, poses.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, poses.length) }, worker)
  );

  persist({ poses, details, savedAt: Date.now() });
  return { poses, details };
}

/* ── Images ───────────────────────────────────────────────────────────── */

// Best-effort. Never throws, never blocks anything the user is waiting on.
export async function cacheImages(poses) {
  if (typeof caches === 'undefined') return 0;
  let stored = 0;
  try {
    const cache = await caches.open(IMG_CACHE);
    for (const p of poses) {
      if (!p.image_url) continue;
      try {
        if (await cache.match(p.image_url)) { stored += 1; continue; }
        await cache.add(p.image_url);
        stored += 1;
      } catch { /* one bad image shouldn't stop the rest */ }
    }
  } catch { /* Cache API unavailable */ }
  return stored;
}
