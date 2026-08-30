// Poses the practitioner has starred. Plain localStorage — this is the user's
// own list, it never leaves the device.

const KEY = 'pn.saved.v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function write(ids) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* quota */ }
}

export function getSaved()        { return read(); }
export function isSaved(id)       { return read().includes(id); }

export function toggleSaved(id) {
  const ids = read();
  const i = ids.indexOf(id);
  if (i === -1) ids.push(id); else ids.splice(i, 1);
  write(ids);
  return ids.includes(id);
}
