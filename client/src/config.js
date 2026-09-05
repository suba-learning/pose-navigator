// Where the API lives.
//
// On the web the app is served from the same origin as /api, so a relative
// path works. Inside the iOS app the origin is capacitor://localhost, which
// has no /api on it — those fetches must go to the deployed backend.
// The API sets Access-Control-Allow-Origin: *, so this is allowed.

const PRODUCTION_API = 'https://posenavigator.com';

export const isNative =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'capacitor:' ||
   window.location.protocol === 'ionic:');

export const API_BASE = isNative ? PRODUCTION_API : '';

export const api = path => `${API_BASE}${path}`;

// Downloading all 61 pose detail records is right on a phone — the app promises
// to work with no signal. It is wasteful on the web, where it would fire ~61
// API requests at every first-time visitor for a feature the browser doesn't
// need. The flag is a test seam so the offline path stays verifiable.
export const shouldPrefetchAll = () =>
  isNative || (typeof window !== 'undefined' && window.__PN_FORCE_PREFETCH__ === true);
