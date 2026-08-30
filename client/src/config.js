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
