// import { Link } from "react-router-dom";

// function Home() {
//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">

//       <h1 className="text-5xl font-bold mb-4">SymmetriCare</h1>

//       <p className="text-xl text-gray-400 mb-6 text-center max-w-xl">
//         Detect posture imbalance early and prevent long-term health issues using AI-powered real-time analysis.
//       </p>

//       <Link to="/analyze">
//         <button className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600">
//           Start Analysis
//         </button>
//       </Link>

//     </div>
//   );
// }

// export default Home;
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Floating particle
function Particle({ style }) {
  return <div className="particle" style={style} />;
}

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const accuracy = useCounter(97, 1800, statsVisible);
  const users = useCounter(12400, 2000, statsVisible);
  const issues = useCounter(4, 1200, statsVisible);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxX = (mousePos.x - 0.5) * 30;
  const parallaxY = (mousePos.y - 0.5) * 30;

  const features = [
    {
      icon: "⚡",
      title: "Real-Time Analysis",
      desc: "60fps skeleton tracking with sub-100ms latency. See posture deviations as they happen.",
      tag: "LIVE",
    },
    {
      icon: "🧠",
      title: "AI-Powered Scoring",
      desc: "MediaPipe-based landmark detection scores 8 biomechanical markers simultaneously.",
      tag: "ML",
    },
    {
      icon: "⚖️",
      title: "Symmetry Mapping",
      desc: "Left-right body balance comparison with precise deviation measurement in degrees.",
      tag: "PRECISE",
    },
    {
      icon: "📋",
      title: "PDF Health Report",
      desc: "Download a detailed clinical-style report with exercises, scores, and trend data.",
      tag: "EXPORT",
    },
    {
      icon: "🏋️",
      title: "Exercise Prescriptions",
      desc: "Personalized corrective exercises auto-generated based on detected imbalances.",
      tag: "CUSTOM",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      desc: "Session history with trend analysis to monitor your posture improvement over time.",
      tag: "HISTORY",
    },
  ];

  const metrics = [
    { label: "Shoulder Alignment", value: 92, color: "#3b82f6" },
    { label: "Spine Curvature", value: 78, color: "#3b82f6" },
    { label: "Hip Balance", value: 85, color: "#8471bd" },
    { label: "Neck Tilt", value: 88, color: "#f59e0b" },
  ];

  const particles = Array.from({ length: 18 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
    animationDelay: `${Math.random() * 6}s`,
    animationDuration: `${4 + Math.random() * 6}s`,
    opacity: 0.15 + Math.random() * 0.35,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #111827;
          --surface: #1f2937;
          --surface2: #111827;
          --border:#374151
          --accent: #ffffff;
          --accent2:#60a5fa;
          --accent3: #93c5fd;

          --text: #a49ae7;
          --muted:  #9ca3af;
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font-display); }

       

        /* ── HERO ── */
        .sc-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 120px 48px 80px;
          text-align: center;
        }
        .sc-hero-bg {
          position: absolute; inset: 0; pointer-events: none;z-index:0;
        }
        .sc-grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,196,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .sc-radial-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 800px; height: 800px;
          // background: radial-gradient(circle, rgba(0,245,196,0.06) 0%, transparent 70%);
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .sc-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .sc-orb-1 { width: 400px; height: 400px; top: -100px; right: -100px; background: rgba(59,130,246,0.12); }
        .sc-orb-2 { width: 300px; height: 300px; bottom: 0; left: -80px; background: rgba(147,197,253,0.12);; }

        .particle {
          position: absolute; border-radius: 50%; background: var(--accent);
          animation: float linear infinite;
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
          animation: float 6s linear infinite;
          pointer-events: none;
        }
        .sc-badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--accent);
          border: 1px solid rgba(59,130,246,0.3); border-radius: 100px;
          padding: 6px 16px; margin-bottom: 28px;
          background: rgba(59,130,246,0.05);
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s, transform 0.6s;
        }
        .sc-badge.visible { opacity: 1; transform: translateY(0); }
        .sc-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        .sc-hero-title {
          font-size: clamp(52px, 8vw, 96px); font-weight: 800; line-height: 0.95;
          letter-spacing: -3px; margin-bottom: 24px;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s 0.15s, transform 0.7s 0.15s;
        }
        .sc-hero-title.visible { opacity: 1; transform: translateY(0); }
        // .sc-hero-title .line-accent { color: var(--accent); }
        // .sc-hero-title .line-dim { color: var(--muted); }
        .sc-hero-title .line-detect {
          color: #7c2cb5   /* green */
        }

        .sc-hero-title .line-correct {
          color:  #ffffff;  /* blue */
        }

        .sc-hero-title .line-dim {
        color: var(--muted);   /* gray */
        }
        .sc-hero-sub {
          font-family: var(--font-mono); font-size: 15px; color: var(--muted);
          max-width: 520px; line-height: 1.7; margin: 0 auto 40px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s 0.3s, transform 0.6s 0.3s;
        }
        .sc-hero-sub.visible { opacity: 1; transform: translateY(0); }

        .sc-hero-actions {
          display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s 0.45s, transform 0.6s 0.45s;
        }
        .sc-hero-actions.visible { opacity: 1; transform: translateY(0); }

        .sc-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--accent); color: var(--bg);
          font-family: var(--font-mono); font-size: 13px; font-weight: 500;
          letter-spacing: 1px; text-transform: uppercase; text-decoration: none;
          padding: 16px 32px; border-radius: 8px; border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 40px rgba(59,130,246,0.25);
        }
        .sc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(59,130,246,0.4); }

        .sc-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          background: transparent; color: var(--text);
          font-family: var(--font-mono); font-size: 13px; font-weight: 500;
          letter-spacing: 1px; text-transform: uppercase; text-decoration: none;
          padding: 16px 32px; border-radius: 8px; border: 1px solid var(--border);
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .sc-btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

        /* ── LIVE CARD ── */
        .sc-live-card {
          position: relative; margin-top: 64px; width: 100%; max-width: 700px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s 0.6s, transform 0.7s 0.6s;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }
        .sc-live-card.visible { opacity: 1; transform: translateY(0); }
        .sc-live-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-bottom: 1px solid var(--border);
          background: rgba(59,130,246,0.03);
        }
        .sc-live-tag {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--accent);
          display: flex; align-items: center; gap: 6px;
        }
        .sc-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; animation: pulse 1.2s ease-in-out infinite; }
        .sc-live-card-body {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0;
        }
        .sc-skeleton-panel {
          padding: 32px; display: flex; align-items: center; justify-content: center;
          border-right: 1px solid var(--border);
          background: rgba(0,0,0,0.2);
        }
        .sc-metrics-panel { padding: 28px 24px; display: flex; flex-direction: column; gap: 18px; }
        .sc-metric-row { display: flex; flex-direction: column; gap: 6px; }
        .sc-metric-label {
          font-family: var(--font-mono); font-size: 11px; color: var(--muted);
          letter-spacing: 0.5px; display: flex; justify-content: space-between;
        }
        .sc-metric-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .sc-metric-fill { height: 100%; border-radius: 2px; transition: width 1.5s cubic-bezier(0.16,1,0.3,1); }

        /* ── STATS ── */
        .sc-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1px; background: var(--border); margin: 0 48px;
          border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
        }
        .sc-stat {
          background: var(--surface); padding: 40px 32px; text-align: center;
        }
        .sc-stat-num {
          font-size: 52px; font-weight: 800; letter-spacing: -2px;
          color: var(--accent); line-height: 1;
        }
        .sc-stat-suffix { font-size: 28px; color: var(--muted); }
        .sc-stat-label {
          font-family: var(--font-mono); font-size: 12px; color: var(--muted);
          letter-spacing: 1px; text-transform: uppercase; margin-top: 8px;
        }

        /* ── FEATURES ── */
        .sc-features { padding: 100px 48px; }
        .sc-section-label {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase; color: var(--accent); margin-bottom: 12px;
        }
        .sc-section-title {
          font-size: clamp(32px, 4vw, 52px); font-weight: 800; letter-spacing: -1.5px;
          margin-bottom: 56px; line-height: 1.05;
        }
        .sc-features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: var(--border); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
        }
        .sc-feature-card {
          background: var(--surface); padding: 36px 28px;
          transition: background 0.3s;
          position: relative; overflow: hidden;
        }
        .sc-feature-card:hover { background: var(--surface2); }
        .sc-feature-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .sc-feature-card:hover::before { opacity: 1; }
        .sc-feature-icon { font-size: 28px; margin-bottom: 16px; }
        .sc-feature-tag {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--accent); background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.2); border-radius: 4px; padding: 3px 8px;
          float: right; margin-top: 2px;
        }
        .sc-feature-title { font-size: 17px; font-weight: 700; margin-bottom: 10px; }
        .sc-feature-desc { font-family: var(--font-mono); font-size: 12px; color: var(--muted); line-height: 1.7; }

        /* ── HOW IT WORKS ── */
        .sc-how { padding: 80px 48px 100px; }
        .sc-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; margin-top: 56px; }
        .sc-step {
          position: relative; padding: 28px 24px;
          border: 1px solid var(--border); border-radius: 16px;
          background: var(--surface); overflow: hidden;
        }
        .sc-step-num {
          font-size: 64px; font-weight: 800; color: rgba(59,130,246,0.06);
          position: absolute; top: 8px; right: 16px; line-height: 1;
          font-family: var(--font-mono);
        }
        .sc-step-icon { font-size: 28px; margin-bottom: 16px; }
        .sc-step-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .sc-step-desc { font-family: var(--font-mono); font-size: 12px; color: var(--muted); line-height: 1.6; }
        .sc-step-connector {
          position: absolute; top: 50%; right: -13px;
          width: 26px; height: 1px; background: var(--border); z-index: 1;
        }

        /* ── CTA ── */
        .sc-cta {
          margin: 0 48px 80px; padding: 72px 64px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 24px; text-align: center;
          position: relative; overflow: hidden;
        }
        .sc-cta::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, rgba(59,130,246,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .sc-cta-title {
          font-size: clamp(28px, 4vw, 52px); font-weight: 800; letter-spacing: -1.5px;
          margin-bottom: 16px; line-height: 1.05;
        }
        .sc-cta-sub {
          font-family: var(--font-mono); font-size: 14px; color: var(--muted);
          margin-bottom: 36px; max-width: 440px; margin-left: auto; margin-right: auto;
        }

        /* ── FOOTER ── */
        .sc-footer {
          border-top: 1px solid var(--border); padding: 32px 48px;
          display: flex; align-items: center; justify-content: space-between;
          font-family: var(--font-mono); font-size: 12px; color: var(--muted);
        }

        /* ── SKELETON SVG ── */
        // .sc-skeleton-svg line { stroke: var(--accent); stroke-width: 2; stroke-linecap: round; opacity: 0.7; }
        // .sc-skeleton-svg circle { fill: var(--accent); opacity: 0.9; }
        .sc-skeleton-svg line {
          stroke: #60a5fa;
          stroke-width: 2.2;
          stroke-linecap: round;
          opacity: 0.95;
        }

        .sc-skeleton-svg circle {
          fill: #93c5fd;
          opacity: 1;
        }

        .sc-skeleton-svg {
          filter: drop-shadow(0 0 6px rgba(59,130,246,0.6));
        }
        .sc-skeleton-pulse { animation: skeletonPulse 2s ease-in-out infinite; }
        @keyframes skeletonPulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        } }

        @media (max-width: 900px) {
          .sc-nav { padding: 16px 24px; }
          .sc-nav-links { display: none; }
          .sc-hero { padding: 100px 24px 60px; }
          .sc-stats { grid-template-columns: 1fr; margin: 0 24px; }
          .sc-features { padding: 60px 24px; }
          .sc-features-grid { grid-template-columns: 1fr; }
          .sc-steps { grid-template-columns: 1fr 1fr; }
          .sc-cta { margin: 0 24px 60px; padding: 48px 32px; }
          .sc-footer { flex-direction: column; gap: 12px; padding: 24px; }
          .sc-live-card-body { grid-template-columns: 1fr; }
          .sc-skeleton-panel {
            padding: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid var(--border);
            background: radial-gradient(
              circle at center,
              rgba(59,130,246,0.15),
              rgba(0,0,0,0.2)
            );
          }
          .sc-how { padding: 60px 24px; }
        }
      `}</style>

      {/* NAV */}
      {/* <nav className="sc-nav">
        <div className="sc-nav-logo">Symmetri<span>Care</span></div>
        <div className="sc-nav-links">
          <Link to="/">Home</Link>
          <Link to="/analyze">Analyze</Link>
          <Link to="/resources">Resources</Link>
        </div>
        <Link to="/analyze" className="sc-nav-cta">Start Scan →</Link>
      </nav> */}

      {/* HERO */}
      <section className="sc-hero">
        <div className="sc-hero-bg">
          <div className="sc-grid-lines" />
          <div className="sc-radial-glow" style={{ transform: `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px))` }} />
          <div className="sc-orb sc-orb-1" />
          <div className="sc-orb sc-orb-2" />
          {particles.map((p, i) => <Particle key={i} style={p} />)}
        </div>

        <div className={`sc-badge ${heroVisible ? "visible" : ""}`}>
          <span className="sc-badge-dot" /> AI-Powered Posture Intelligence
        </div>

        {/* <h1 className={`sc-hero-title ${heroVisible ? "visible" : ""}`}>
          <span className="line-accent">Detect.</span><br />
          <span>Correct.</span><br />
          <span className="line-dim">Balance.</span>
        </h1> */}
      <h1 className={`sc-hero-title ${heroVisible ? "visible" : ""}`}>
        <span className="line-detect">Detect.</span><br />
        <span className="line-correct">Correct.</span><br />
        <span className="line-dim">Balance.</span>
      </h1>
        <p className={`sc-hero-sub ${heroVisible ? "visible" : ""}`}>
          Real-time biomechanical analysis using computer vision. Identify posture
          imbalances before they become chronic conditions.
        </p>

        <div className={`sc-hero-actions ${heroVisible ? "visible" : ""}`}>
          <Link to="/analyze" className="sc-btn-primary" style={{ color: "white" }}>
            <span>⚡</span> Start Free Scan
          </Link>
          <Link to="/resources" className="sc-btn-ghost">
            Learn More →
          </Link>
        </div>

        {/* Live demo card */}
        <div className={`sc-live-card ${heroVisible ? "visible" : ""}`}>
          <div className="sc-live-card-header">
            <span className="sc-live-tag"><span className="sc-live-dot" /> Live Posture Feed</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>
              OVERALL SCORE: <span style={{ color: "#3b82f6" }}>88</span>
            </span>
          </div>
          <div className="sc-live-card-body">
            <div className="sc-skeleton-panel">
              <svg
                className="sc-skeleton-svg sc-skeleton-pulse"
                viewBox="0 0 140 260"
                width="150"
                height="260"
              > 

                {/* Head */}
                <circle cx="70" cy="25" r="10" />

                {/* Neck */}
                <line x1="70" y1="35" x2="70" y2="50" />

                {/* Shoulders */}
                <line x1="40" y1="55" x2="100" y2="55" />

                {/* Spine */}
                <line x1="70" y1="50" x2="70" y2="140" />

                {/* Left arm */}
                <line x1="40" y1="55" x2="25" y2="95" />
                <line x1="25" y1="95" x2="35" y2="135" />

                {/* Right arm */}
                <line x1="100" y1="55" x2="115" y2="95" />
                <line x1="115" y1="95" x2="105" y2="135" />

                {/* Hips */}
                <line x1="50" y1="140" x2="90" y2="140" />

                {/* Left leg */}
                <line x1="50" y1="140" x2="45" y2="190" />
                <line x1="45" y1="190" x2="42" y2="235" />

                {/* Right leg */}
                <line x1="90" y1="140" x2="95" y2="190" />
                <line x1="95" y1="190" x2="98" y2="235" />

                {/* joints */}
                {[
                  [70,50],
                  [40,55],
                  [100,55],
                  [50,140],
                  [90,140],
                  [25,95],
                  [115,95],
                  [45,190],
                  [95,190],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3.5" />
                )              )}

              </svg>
            </div>
            <div className="sc-metrics-panel">
              {metrics.map((m, i) => (
                <div className="sc-metric-row" key={i}>
                  <div className="sc-metric-label">
                    <span>{m.label}</span>
                    <span style={{ color: m.color }}>{m.value}%</span>
                  </div>
                  <div className="sc-metric-bar">
                    <div
                      className="sc-metric-fill"
                      style={{ width: `${heroVisible ? m.value : 0}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>DETECTED ISSUES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Spine Slight Left", "Good Shoulders", "Good Hips"].map((tag, i) => (
                    <span key={i} style={{
                      fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5px",
                      padding: "3px 8px", borderRadius: 4,
                      background: i === 0 ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.08)",
                      border: `1px solid ${i === 0 ? "rgba(245,158,11,0.3)" : "rgba(59,130,246,0.2)"}`,
                      color: i === 0 ? "#f59e0b" : "var(--accent)"
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={statsRef} className="sc-stats" style={{ margin: "0 48px 100px" }}>
        {[
          { num: accuracy, suffix: "%", label: "Detection Accuracy" },
          { num: users.toLocaleString(), suffix: "+", label: "Scans Completed" },
          { num: issues, suffix: "", label: "Posture Markers Tracked" },
        ].map((s, i) => (
          <div className="sc-stat" key={i}>
            <div className="sc-stat-num">{s.num}<span className="sc-stat-suffix">{s.suffix}</span></div>
            <div className="sc-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="sc-features">
        <div className="sc-section-label">// capabilities</div>
        <div className="sc-section-title">Everything you need<br />to fix your posture.</div>
        <div className="sc-features-grid">
          {features.map((f, i) => (
            <div className="sc-feature-card" key={i}>
              <span className="sc-feature-tag">{f.tag}</span>
              <div className="sc-feature-icon">{f.icon}</div>
              <div className="sc-feature-title">{f.title}</div>
              <div className="sc-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sc-how">
        <div className="sc-section-label">// workflow</div>
        <div className="sc-section-title">How it works.</div>
        <div className="sc-steps">
          {[
            { icon: "📸", title: "Open Camera", desc: "Allow webcam access. SymmetriCare activates your camera feed instantly.", num: "01" },
            { icon: "🔍", title: "AI Detects Pose", desc: "MediaPipe identifies 33 body landmarks at 60fps in real-time.", num: "02" },
            { icon: "📊", title: "Score & Analyze", desc: "8 biomechanical metrics are scored. Deviations are flagged instantly.", num: "03" },
            { icon: "💊", title: "Get Prescriptions", desc: "Receive targeted exercises and a downloadable PDF health report.", num: "04" },
          ].map((s, i) => (
            <div className="sc-step" key={i}>
              {i < 3 && <div className="sc-step-connector" />}
              <div className="sc-step-num">{s.num}</div>
              <div className="sc-step-icon">{s.icon}</div>
              <div className="sc-step-title">{s.title}</div>
              <div className="sc-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="sc-cta">
        <div className="sc-cta-title">Your spine will<br /><span style={{ color: "var(--accent)" }}>thank you.</span></div>
        <p className="sc-cta-sub">View your posture history, track improvements, and monitor your alignment using the dashboard.</p>
        <Link to="/Dashboard" className="sc-btn-primary" style={{ display: "inline-flex", color: "white" }} >
          <span>🔬</span> View My Dashboard
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="sc-footer">
        <span>© 2026 SymmetriCare — Detect · Correct · Balance</span>
        <span style={{ color: "var(--accent)" }}>Built with MediaPipe + FastAPI + React</span>
      </footer>
    </>
  );
}
