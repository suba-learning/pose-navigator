import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/poses')
      .then(r => r.json())
      .then(data => { setPoses(data); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Loading poses…</div>;

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-badge">For the curious practitioner</div>
        <h1>Pose Navigator</h1>
        <p>The pose is the beginning, <em>not the point.</em></p>
      </header>

      <main className="home-grid-section">
        <div className="section-label">All poses</div>
        <div className="home-grid">
          {poses.map(pose => (
            <button
              key={pose.id}
              className="pose-tile"
              onClick={() => navigate(`/poses/${pose.id}`)}
            >
              <div className="pose-tile-name">{pose.name}</div>
              <div className="pose-tile-sanskrit">{pose.sanskrit}</div>
              {pose.body_areas?.length > 0 && (
                <div className="tags" style={{ marginTop: '.6rem' }}>
                  {pose.body_areas.slice(0, 2).map(area => (
                    <span key={area} className="tag">{area}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
