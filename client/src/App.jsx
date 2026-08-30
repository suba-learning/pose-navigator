import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import PoseNavigator from './pages/PoseNavigator';
import { isNative } from './config';

// On the web we keep clean URLs (posenavigator.com/poses/abc).
// Inside the iOS app there is no server to fall back to index.html on a deep
// path, so we use hash routing — reloads and restores can't 404.
const Router = isNative ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router>
      <Routes>
        {/* The landing page is marketing copy for the website. Someone who
            opened the app already downloaded it — send them to the poses. */}
        <Route path="/" element={isNative ? <Navigate to="/explore" replace /> : <Landing />} />
        <Route path="/explore" element={<Home />} />
        <Route path="/poses/:id" element={<PoseNavigator />} />
        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Routes>
    </Router>
  );
}
