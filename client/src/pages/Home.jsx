import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import {
  cachedPoses, cacheInfo, fetchPoses, syncAll, cacheImages,
} from '../lib/graphCache';
import { getSaved, toggleSaved } from '../lib/saved';
import { tap } from '../lib/haptics';

export default function Home() {
  // Start from the cache so the grid is on screen before any network call.
  const [poses, setPoses]     = useState(() => cachedPoses() ?? []);
  const [loading, setLoading] = useState(() => !cachedPoses());
  const [offline, setOffline] = useState(false);
  const [sync, setSync]       = useState(null);        // {done,total} while warming
  const [query, setQuery]     = useState('');
  const [area, setArea]       = useState(null);        // body-area filter
  const [onlySaved, setOnlySaved] = useState(false);
  const [saved, setSaved]     = useState(() => getSaved());
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      // 1. Refresh the list itself.
      try {
        const list = await fetchPoses();
        if (!alive) return;
        setPoses(list);
        setOffline(false);
      } catch {
        // No network. If we have a cache we're fine; otherwise say so.
        if (alive) setOffline(!cachedPoses());
      } finally {
        if (alive) setLoading(false);
      }

      // 2. Warm the full graph in the background, so every pose's
      //    relationships are readable with no signal later.
      const info = cacheInfo();
      if (!info.present || info.stale) {
        try {
          const { poses: all } = await syncAll({
            onProgress: (done, total) => alive && setSync({ done, total }),
          });
          if (alive) setSync(null);
          cacheImages(all);                 // best effort, unawaited
        } catch {
          if (alive) setSync(null);
        }
      }
    })();

    return () => { alive = false; };
  }, []);

  // Every body area present in the data, for the filter row.
  const areas = useMemo(() => {
    const set = new Set();
    poses.forEach(p => p.body_areas?.forEach(a => set.add(a)));
    return [...set].sort();
  }, [poses]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return poses.filter(p => {
      if (onlySaved && !saved.includes(p.id)) return false;
      if (area && !p.body_areas?.includes(area)) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.sanskrit?.toLowerCase().includes(q) ||
        p.body_areas?.some(a => a.toLowerCase().includes(q))
      );
    });
  }, [poses, query, area, onlySaved, saved]);

  function handleStar(e, id) {
    e.stopPropagation();
    tap('Light');
    toggleSaved(id);
    setSaved(getSaved());
  }

  function open(id) {
    tap('Light');
    navigate(`/poses/${id}`);
  }

  if (loading) return <div className="loading">Loading poses…</div>;

  if (offline && poses.length === 0) {
    return (
      <div className="loading">
        No connection, and nothing saved yet.<br />
        <span className="loading-sub">
          Open this once with a signal and the whole graph stays on your phone.
        </span>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-badge">For the curious practitioner</div>
        <h1>Pose Navigator</h1>
        <p>The pose is the beginning, <em>not the point.</em></p>
      </header>

      <main className="home-grid-section">
        {/* ── Search ── */}
        <div className="search-wrap">
          <input
            className="search-input"
            type="search"
            inputMode="search"
            placeholder="Search poses, Sanskrit, body area…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search poses"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">×</button>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="filter-row">
          <button
            className={`filter-chip ${onlySaved ? 'active' : ''}`}
            onClick={() => { tap(); setOnlySaved(v => !v); }}
          >
            ★ Saved{saved.length ? ` (${saved.length})` : ''}
          </button>
          {areas.map(a => (
            <button
              key={a}
              className={`filter-chip ${area === a ? 'active' : ''}`}
              onClick={() => { tap(); setArea(area === a ? null : a); }}
            >
              {a}
            </button>
          ))}
        </div>

        <p className="grid-hint">
          {visible.length === poses.length
            ? 'Tap any pose to explore its connections'
            : `${visible.length} of ${poses.length} poses`}
        </p>

        {visible.length === 0 ? (
          <div className="empty-state">
            {onlySaved && saved.length === 0
              ? 'Nothing saved yet — tap ★ on a pose to keep it here.'
              : 'No poses match that.'}
          </div>
        ) : (
          <div className="home-grid">
            {visible.map(pose => (
              <button
                key={pose.id}
                className="pose-tile"
                onClick={() => open(pose.id)}
              >
                <span
                  className={`star-btn ${saved.includes(pose.id) ? 'on' : ''}`}
                  onClick={e => handleStar(e, pose.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={saved.includes(pose.id) ? 'Remove from saved' : 'Save pose'}
                >
                  {saved.includes(pose.id) ? '★' : '☆'}
                </span>
                <div className="pose-tile-name">{pose.name}</div>
                <div className="pose-tile-sanskrit">{pose.sanskrit}</div>
                {pose.body_areas?.length > 0 && (
                  <div className="tags" style={{ marginTop: '.6rem' }}>
                    {pose.body_areas.slice(0, 2).map(a => (
                      <span key={a} className="tag">{a}</span>
                    ))}
                  </div>
                )}
                <div className="pose-tile-arrow">→</div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Quiet status line — only while first warming the offline copy */}
      {sync && (
        <div className="sync-bar">
          Saving for offline… {sync.done}/{sync.total}
        </div>
      )}
    </div>
  );
}
