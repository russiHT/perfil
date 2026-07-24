import React from 'react';
import VideoPinCard from './VideoPinCard';
import { SearchX } from 'lucide-react';

export default function MasonryGrid({ projects, onSelectProject, loading }) {
  if (loading) {
    return (
      <div className="pinterest-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            style={{ 
              height: `${240 + (i % 3) * 50}px`, 
              breakInside: 'avoid', 
              marginBottom: '20px', 
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              opacity: 0.6
            }} 
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div 
        style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--card-border)',
          margin: '40px 0'
        }}
      >
        <SearchX size={48} color="var(--accent-pink)" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
          No Video Pins Found
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
          Try clearing your search query or choosing another language filter pill.
        </p>
      </div>
    );
  }

  return (
    <div className="pinterest-grid">
      {projects.map((project, index) => (
        <VideoPinCard 
          key={project.id || project.name} 
          project={project} 
          onClick={onSelectProject}
          index={index}
        />
      ))}
    </div>
  );
}
