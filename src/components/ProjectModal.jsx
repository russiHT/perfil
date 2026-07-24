import React, { useEffect } from 'react';
import { X, Star, GitFork, ExternalLink, Github, Calendar, Code2, Tag, BookOpen } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Hero Image Banner */}
        <div style={{ position: 'relative', height: '320px', width: '100%', overflow: 'hidden', background: '#000' }}>
          <img 
            src={project.image} 
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, var(--bg-secondary) 100%)'
            }}
          />

          <div 
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '28px',
              right: '28px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: project.languageColor || '#6366f1' }} />
                  {project.language}
                </span>
                
                {project.updatedAt && (
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {project.updatedAt}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                {project.title || project.name}
              </h2>
            </div>

            {/* Quick Link Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {project.homepage && (
                <a 
                  href={project.homepage} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-pill btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={16} />
                  <span>Live Preview</span>
                </a>
              )}
              <a 
                href={project.html_url} 
                target="_blank" 
                rel="noreferrer"
                className="btn-pill btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <Github size={16} />
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '32px' }}>
          {/* Stats Bar */}
          <div 
            style={{
              display: 'flex',
              gap: '24px',
              padding: '16px 20px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} fill="var(--accent-amber)" color="var(--accent-amber)" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{project.stars?.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Stars</div>
              </div>
            </div>

            <div style={{ height: '30px', width: '1px', background: 'var(--card-border)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitFork size={18} color="var(--accent-indigo)" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{project.forks?.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Forks</div>
              </div>
            </div>

            <div style={{ height: '30px', width: '1px', background: 'var(--card-border)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={18} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{project.language}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Primary Stack</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
              About Project
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.98rem' }}>
              {project.description}
            </p>
          </div>

          {/* Topics Tag Cloud */}
          {project.topics && project.topics.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dim)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} /> Repository Topics
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.topics.map(t => (
                  <span 
                    key={t} 
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--accent-indigo)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* README Code Preview */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dim)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} /> README.md Preview
            </h4>
            <div 
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                maxHeight: '220px',
                overflowY: 'auto'
              }}
            >
              {project.readme || 'No README details available.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
