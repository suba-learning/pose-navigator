import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { isNative } from './config'

// Native-only chrome setup. Imported dynamically so the web build does not
// pull the Capacitor plugins into its bundle.
if (isNative) {
  document.documentElement.setAttribute('data-native', 'true')
  ;(async () => {
    try {
      const { StatusBar, Style } = await import('@capacitor/status-bar')
      const { SplashScreen } = await import('@capacitor/splash-screen')
      await StatusBar.setStyle({ style: Style.Light })   // dark text on our cream background
      await SplashScreen.hide()
    } catch (e) {
      console.warn('native chrome setup skipped:', e)
    }
  })()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
