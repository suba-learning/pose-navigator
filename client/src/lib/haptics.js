// A tap when you move between poses.
//
// Deliberately talks to Capacitor's global plugin registry rather than
// importing @capacitor/haptics, so this file builds and runs whether or not
// the native plugin is installed. When the plugin is added it starts working
// on its own; on the web it stays a no-op.

function plugin() {
  return typeof window !== 'undefined' ? window.Capacitor?.Plugins?.Haptics : undefined;
}

export function tap(style = 'Light') {
  try { plugin()?.impact({ style }); } catch { /* never break navigation over a buzz */ }
}

export function selection() {
  try { plugin()?.selectionChanged(); } catch { /* no-op */ }
}

export const hapticsAvailable = () => Boolean(plugin());
