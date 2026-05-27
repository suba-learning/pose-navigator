import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PoseNavigator.css';

const COLUMN_CONFIG = [
  { key: 'prepares',    label: 'Prepares You',  arrow: '↑', color: 'sage' },
  { key: 'complements', label: 'Alongside It',  arrow: '↔', color: 'warm' },
  { key: 'unlocks',     label: 'What It Unlocks', arrow: '↓', color: 'ink'  },
];

function RelatedCard({ pose, onSelect, isSelected }) {
  const [showImg, setShowImg] = useState(false);

  return (
    <div
      className={`rel-card ${isSelected ? 'active' : ''}`}
      onClick={() => onSelect(pose)}
    >
      <div className="rel-card-content">
        <div className="rel-card-text">
          <div className="rel-card-name">{pose.name}</div>
          {pose.explanation && (
            <div className="rel-card-desc">{pose.explanation}</div>
          )}
        </div>

        {/* Eye icon — always visible, tapping it toggles image */}
        <button
          className="eye-btn"
          onClick={e => { e.stopPropagation(); setShowImg(v => !v); }}
          aria-label={showImg ? 'Hide image' : 'Show image'}
        >
          {showImg ? '🙈' : '👁'}
        </button>
      </div>

      {/* Image — revealed on eye tap */}
      {showImg && (
        <div className="rel-card-img-wrap">
          {pose.image_url ? (
            <img src={pose.image_url} alt={pose.name} />
          ) : (
            <div className="img-placeholder">No image yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PoseNavigator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pose, setPose] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [centerImgVisible, setCenterImgVisible] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    fetch(`/api/poses/${id}`)
      .then(r => r.json())
      .then(data => { setPose(data); setLoading(false); });
  }, [id]);

  function handleSelect(relPose) {
    if (selected?.pose.id === relPose.id) {
      setSelected(null);
    } else {
      const allRelated = [
        ...pose.related.prepares,
        ...pose.related.complements,
        ...pose.related.unlocks,
      ];
      const found = allRelated.find(p => p.id === relPose.id);
      setSelected({ pose: relPose, explanation: found?.explanation });
    }
  }

  if (loading) return <div className="loading">Finding connections…</div>;
  if (!pose)   return <div className="loading">Pose not found.</div>;

  return (
    <div className="navigator">

      {/* Back */}
      <button className="back-btn" onClick={() => navigate('/explore')}>
        ← All poses
      </button>

      {/* Center pose card */}
      <div className="center-card">
        <div className="center-card-label">YOU ARE HERE</div>
        <h1 className="center-card-name">{pose.name}</h1>
        <div className="center-card-sanskrit">{pose.sanskrit}</div>

        {/* Silhouette image */}
        {pose.image_url && (
          <div className={`center-img-wrap ${centerImgVisible ? 'visible' : ''}`}>
            <img src={pose.image_url} alt={pose.name} />
          </div>
        )}

        {/* Body areas */}
        {pose.body_areas?.length > 0 && (
          <div className="tags center-tags">
            {pose.body_areas.map(area => (
              <span key={area} className="tag">{area}</span>
            ))}
          </div>
        )}

        {/* Flags */}
        {pose.flags?.length > 0 && (
          <div className="center-flag">
            △ caution: {pose.flags.join(' & ')}
          </div>
        )}
      </div>

      {/* Divider with arrows */}
      <div className="nav-divider">↕</div>

      {/* Column headers */}
      <div className="nav-col-headers">
        {COLUMN_CONFIG.map(col => (
          <div key={col.key} className={`nav-col-header nav-col-header--${col.color}`}>
            <span className="nav-col-arrow">{col.arrow}</span> {col.label.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Three columns */}
      <div className="nav-columns">
        {COLUMN_CONFIG.map(col => (
          <div key={col.key} className="nav-col">
            {pose.related[col.key].length === 0 ? (
              <div className="nav-col-empty">None added yet</div>
            ) : (
              pose.related[col.key].map(p => (
                <RelatedCard
                  key={p.id}
                  pose={p}
                  onSelect={handleSelect}
                  isSelected={selected?.pose.id === p.id}
                />
              ))
            )}
          </div>
        ))}
      </div>

      {/* Detail panel — sticky at bottom on tap */}
      {selected && (
        <div className="detail-panel">
          <div className="detail-panel-inner">
            <div className="detail-header">
              <span className="detail-name">{selected.pose.name}</span>
              <button
                className="detail-navigate-btn"
                onClick={() => navigate(`/poses/${selected.pose.id}`)}
              >
                Navigate to this pose →
              </button>
            </div>
            {selected.explanation && (
              <p className="detail-explanation">{selected.explanation}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
