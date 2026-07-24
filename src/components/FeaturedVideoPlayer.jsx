import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Monitor, Code2, Sparkles, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export default function FeaturedVideoPlayer({ activeProject }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const steps = [
    { title: '01. Code & Architecture', desc: 'Typing reactive components & WebGL layout' },
    { title: '02. User Interaction', desc: 'Simulated 3D cursor click & micro-animations' },
    { title: '03. Live Application', desc: 'Real-time responsive UI state transformation' }
  ];

  // Auto step cycle when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="hero-video-container">
      {/* Top Header Tag */}
      <div 
        style={{
          padding: '14px 24px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '600' }}>
            {activeProject?.name || 'github-animated-portfolio'}.showreel.mp4 — 60 FPS CSS ANIMATION
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(236, 72, 153, 0.15)',
              color: 'var(--accent-pink)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={13} /> HD 60FPS
          </span>
        </div>
      </div>

      {/* Main Animated Video Screen Stage */}
      <div className="hero-video-screen">
        {/* Simulated Cursor Path Animation */}
        {isPlaying && <div className="simulated-cursor" />}

        {/* Scene 0: Code Typing */}
        {activeStep === 0 && (
          <div className="code-terminal-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code2 size={15} color="var(--accent-pink)" /> AppFeature.jsx
              </span>
              <span>UTF-8 | JavaScript</span>
            </div>
            <div className="typing-line">
              {`const project = new PortfolioPin({ name: "${activeProject?.title || 'Cyberpunk Store'}", animate: true });`}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              <div>{`> Initializing Pinterest Masonry grid layout...`}</div>
              <div>{`> Applying CSS Animation Skill keyframes... [DONE 60fps]`}</div>
            </div>
          </div>
        )}

        {/* Scene 1: UI Interaction */}
        {activeStep === 1 && (
          <div 
            style={{
              width: '85%',
              maxWidth: '650px',
              padding: '24px',
              background: 'rgba(15, 21, 35, 0.9)',
              border: '1px solid var(--accent-pink)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 0 40px rgba(236, 72, 153, 0.3)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
              ⚡ Simulated Action Phase
            </div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '14px' }}>
              {activeProject?.title || 'Interactive Visual Showcase'}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn-pill btn-primary" style={{ pointerEvents: 'none' }}>
                Clicked Button (Action)
              </button>
              <button className="btn-pill btn-secondary" style={{ pointerEvents: 'none' }}>
                Card Transformed
              </button>
            </div>
          </div>
        )}

        {/* Scene 2: Live Result */}
        {activeStep === 2 && (
          <div style={{ position: 'relative', width: '90%', height: '80%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <img 
              src={activeProject?.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80"} 
              alt="Feature preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.85), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: '#fff' }}>
              <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'var(--accent-indigo)', fontSize: '0.75rem', fontWeight: '700' }}>
                RESULT STATE
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {activeProject?.title || 'Portfolio Pin Showreel'}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar & Timeline */}
      <div className="video-control-bar">
        {/* Play / Pause Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-pink), var(--accent-indigo))',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
          </button>

          <button 
            onClick={() => { setActiveStep(0); setIsPlaying(true); }}
            className="btn-icon-glass"
            title="Restart Animation"
            style={{ width: '36px', height: '36px' }}
          >
            <RotateCcw size={16} />
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700' }}>
            00:0{activeStep * 5 + 4} / 00:15
          </span>
        </div>

        {/* Scene Selector Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: activeStep === i ? 'var(--accent-pink)' : 'var(--card-border)',
                background: activeStep === i ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
                color: activeStep === i ? 'var(--accent-pink)' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              {st.title}
            </button>
          ))}
        </div>

        {/* Right Audio / Screen Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="btn-icon-glass"
            style={{ width: '36px', height: '36px' }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} color="var(--accent-pink)" />}
          </button>
        </div>
      </div>

      {/* Dynamic Animated Timeline Scrubber */}
      <div className="video-progress-track">
        <div className="video-progress-fill" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
      </div>
    </div>
  );
}
