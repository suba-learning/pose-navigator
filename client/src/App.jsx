import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import PoseNavigator from './pages/PoseNavigator';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Home />} />
        <Route path="/poses/:id" element={<PoseNavigator />} />
      </Routes>
    </BrowserRouter>
  );
}
