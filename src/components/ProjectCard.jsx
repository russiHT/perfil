import React from 'react';
import { Star, GitFork, ExternalLink, Github, Pin } from 'lucide-react';

export default function ProjectCard({ project, onClick, index }) {
  // Staggered animation delay for Pinterest entrance keyframe
  const animationDelay = `${(index % 12) * 0.08}s`;

  return (
    <div 
      className="pin-card"
      onClick={() => onClick(project)}
      style={{ animationDelay }}
    >
      {/* Media Image Banner */}
      <div className="pin-card-media">
        <img 
          src={project.image} 
          alt={project.title} 
          loading="lazy"
          style={{
            minHeight: '160px',
            maxHeight: project.aspectRatio ? `${parseFloat(project.aspectRatio) * 220}px` : '260px'
          }}
        />

        {/* Pinterest Dark Hover Overlay */}
        <div className="pin-card-overlay">
          <div className="overlay-actions">
            <button 
              className="btn-icon-glass" 
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.html_url, '_blank');
              }}
              title="Open GitHub Repository"
            >
              <Github size={18} />
            </button>

            {project.homepage && (
              <button 
                className="btn-icon-glass" 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.homepage, '_blank');
                }}
                title="Live Demo Preview"
              >
                <ExternalLink size={18} />
              </button>
            )}

            <button 
              className="btn-icon-glass"
              onClick={(e) => {
                e.stopPropagation();
                // Visual pin bookmark effect
                e.currentTarget.style.transform = 'scale(1.3) rotate(15deg)';
                setTimeout(() => {
                  e.currentTarget.style.transform = 'scale(1)';
                }, 300);
              }}
              title="Pin this repo"
            >
              <Pin size={18} fill="currentColor" />
            </button>
          </div>

          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '600' }}>
            Click for full details & README →
          </div>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="pin-card-body">
        <div className="pin-card-header">
          <h3 className="pin-title">
            {project.title || project.name}
          </h3>
        </div>

        <p className="pin-desc">
          {project.description}
        </p>

        {/* Tags */}
        <div className="pin-tags">
          {project.topics && project.topics.slice(0, 3).map((topic, i) => (
            <span key={topic} className={`tag-badge ${i === 0 ? 'primary' : ''}`}>
              #{topic}
            </span>
          ))}
        </div>

        {/* Card Footer Meta */}
        <div className="pin-footer">
          <div className="pin-meta">
            <span className="meta-item" title="Language">
              <span 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: project.languageColor || '#6366f1' 
                }} 
              />
              <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{project.language}</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="meta-item" style={{ color: 'var(--accent-amber)' }}>
              <Star size={13} fill="var(--accent-amber)" />
              {project.stars?.toLocaleString()}
            </span>
            <span className="meta-item">
              <GitFork size={13} />
              {project.forks?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
