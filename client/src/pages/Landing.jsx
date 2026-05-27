import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="badge">For the curious practitioner</div>
        <h1>The pose is the beginning, <em>not the point.</em></h1>
        <p>The sequence, the connections, the why — that's where practice actually lives.</p>
        <button className="cta" onClick={() => navigate('/explore')}>
          Try it <span>→</span>
        </button>
        <div className="scroll-hint">Scroll to explore</div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="problem">
        <div className="section-label">The gap</div>
        <h2>Good information exists. Coherence doesn't.</h2>
        <p>When you encounter a pose and need to go deeper, the options aren't great.</p>
        <div className="quotes">
          <div className="quote-chip">Pose databases give you a bullet list and a stock photo.</div>
          <div className="quote-chip">Streaming apps give you a video to follow — not a concept to understand.</div>
          <div className="quote-chip">Nothing answers: <em>why does this come before that? Is this safe for me right now? What do I do instead?</em></div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how">
        <div className="section-label">How it works</div>
        <h2>A terrain you navigate, not a library you search.</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-body">
              <h3>Land on a pose</h3>
              <p>Something you just tried, something that felt off, something you're working toward.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-body">
              <h3>Understand its shape</h3>
              <p>What it loads, what it demands, whether it's right for your body right now.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-body">
              <h3>Navigate outward</h3>
              <p>Preparation poses, what it unlocks, complementary shapes — with a short written reason for every connection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="story">
        <div className="section-label">Why this exists</div>
        <p className="story-text">
          She and her husband started yoga at the same time. He chased the destination —
          the full pose, the next challenge. She was drawn to the <strong>journey.</strong>
          <br /><br />
          Years later, four different teachers noticed something unprompted.
          Not that she was advanced. That her practice <strong>looked right.</strong>
          <br /><br />
          She didn't set out to build an app. She set out to practice well.
          Then she looked around and realized what had guided her didn't exist anywhere in a form others could use.
        </p>
        <div className="founder-note">
          <div className="founder-avatar">🧘</div>
          <div className="founder-info">
            <div className="name">The Founder</div>
            <div className="role">Yoga practitioner, teacher in training</div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="closing">
        <h2>Mastery before progression. Understanding before performing.</h2>
        <p>Start with one pose. See where it leads.</p>
        <button className="cta-light" onClick={() => navigate('/explore')}>
          Try it →
        </button>
      </section>

      <footer>
        Pose Navigator &nbsp;·&nbsp; Built with care for the curious practitioner
      </footer>

    </div>
  );
}
