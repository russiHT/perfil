import React from 'react';
import { Play, Star, GitFork, Github, ExternalLink, Pin, Sparkles, Film } from 'lucide-react';

export default function VideoPinCard({ project, onClick, index }) {
  const animTypes = ['code', 'equalizer', 'cube', 'graph'];
  const animType = animTypes[index % animTypes.length];

  return (
    <div className="video-pin-card" onClick={() => onClick(project)}>
      {/* Animated CSS Stage */}
      <div className="pin-anim-stage" style={{ height: `${200 + (index % 3) * 40}px` }}>
        {/* Background Image with Overlay */}
        <img 
          src={project.image} 
          alt={project.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }}
        />

        {/* CSS Animated Elements Layer */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 40%, rgba(5,8,17,0.9) 100%)' }} />

        {/* Equalizer animation for audio/media projects */}
        {animType === 'equalizer' && (
          <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '4px', alignItems: 'flex-end', height: '40px' }}>
            {[40, 70, 30, 90, 50, 80, 60, 100, 45, 75].map((h, i) => (
              <div 
                key={i} 
                style={{ 
                  width: '4px', 
                  height: `${h}%`, 
                  background: 'var(--accent-pink)', 
                  borderRadius: '4px',
                  animation: `pulseDot ${0.6 + (i % 3) * 0.2}s infinite alternate` 
                }} 
              />
            ))}
          </div>
        )}

        {/* Code Lines for TypeScript / JavaScript */}
        {animType === 'code' && (
          <div 
            style={{ 
              position: 'absolute', 
              inset: '20px', 
              background: 'rgba(10, 14, 24, 0.8)', 
              borderRadius: '8px', 
              padding: '12px', 
              fontFamily: 'monospace', 
              fontSize: '0.7rem', 
              color: 'var(--accent-emerald)',
              overflow: 'hidden'
            }}
          >
            <div style={{ color: 'var(--accent-pink)' }}>{`// Live CSS Walkthrough`}</div>
            <div>{`function renderApp() {`}</div>
            <div style={{ paddingLeft: '10px', color: 'var(--text-main)' }}>{`return <PinVideo project="${project.name}" />`}</div>
            <div>{`}`}</div>
          </div>
        )}

        {/* Live Badges */}
        <div className="badge-live-video">
          <span className="live-dot" />
          <span>ANIMATED VIDEO PIN</span>
        </div>

        <span className="duration-tag">0:15</span>

        {/* Hover Play Button Circle */}
        <div className="pin-video-overlay">
          <div className="play-btn-circle">
            <Play size={24} style={{ marginLeft: '3px' }} fill="#fff" />
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
          {project.title || project.name}
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '12px' }}>
          {project.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {project.topics?.slice(0, 3).map(topic => (
            <span 
              key={topic} 
              style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                padding: '3px 9px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-muted)'
              }}
            >
              #{topic}
            </span>
          ))}
        </div>

        {/* Footer Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--card-border)', fontSize: '0.78rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: project.languageColor || '#6366f1' }} />
            <span style={{ fontWeight: '600' }}>{project.language}</span>
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={13} fill="var(--accent-amber)" /> {project.stars}
            </span>
            <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <GitFork size={13} /> {project.forks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
