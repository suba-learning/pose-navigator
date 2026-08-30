import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { isNative } from './config'

// Marks the document so index.css can apply the iOS-only adjustments
// (safe-area padding, no tap highlight, no long-press callout).
// Status bar style is set natively in Info.plist rather than via a plugin —
// the Capacitor status-bar plugin is not compatible with this core version.
if (isNative) {
  document.documentElement.setAttribute('data-native', 'true')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
