import React from 'react';
import { Star, GitFork, BookOpen, Users, MapPin, ExternalLink, Code2 } from 'lucide-react';

export default function StatsHeader({ user, projectsCount, totalStars, languageStats }) {
  return (
    <div 
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      {/* Decorative gradient top accent line */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-pink), var(--accent-cyan))'
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '28px', alignItems: 'center' }}>
        {/* Avatar with Glow Ring */}
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-pink))',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
            }}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div 
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              border: '3px solid var(--bg-secondary)',
              boxShadow: '0 0 10px var(--accent-emerald)'
            }}
            title="Active Open Source Contributor"
          />
        </div>

        {/* Developer Bio & Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              {user.name || user.username}
            </h2>
            <span 
              style={{
                fontSize: '0.8rem',
                color: 'var(--accent-indigo)',
                background: 'rgba(99, 102, 241, 0.15)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              @{user.username}
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '650px', marginBottom: '14px', lineHeight: 1.5 }}>
            {user.bio}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            {user.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--accent-pink)" />
                {user.location}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="var(--accent-cyan)" />
              {user.followers?.toLocaleString() || 0} Followers
            </span>
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-indigo)', textDecoration: 'none' }}
              >
                <ExternalLink size={15} />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Key Metrics Stats Counter */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div 
            style={{
              background: 'var(--bg-tertiary)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              textAlign: 'center',
              minWidth: '100px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-amber)', marginBottom: '4px' }}>
              <Star size={18} fill="var(--accent-amber)" />
              <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                {totalStars.toLocaleString()}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Stars
            </span>
          </div>

          <div 
            style={{
              background: 'var(--bg-tertiary)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              textAlign: 'center',
              minWidth: '100px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-indigo)', marginBottom: '4px' }}>
              <BookOpen size={18} />
              <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                {projectsCount}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Projects
            </span>
          </div>
        </div>
      </div>

      {/* Language Breakdown Distribution Bar */}
      {languageStats && languageStats.length > 0 && (
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={14} color="var(--accent-indigo)" />
              Top Stack Distribution
            </span>
          </div>
          
          <div style={{ display: 'flex', height: '8px', borderRadius: 'var(--radius-full)', overflow: 'hidden', gap: '2px', background: 'var(--bg-tertiary)' }}>
            {languageStats.map((item) => (
              <div 
                key={item.name}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  transition: 'width 0.6s ease'
                }}
                title={`${item.name}: ${item.percentage}%`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '10px', fontSize: '0.75rem' }}>
            {languageStats.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{item.name}</span>
                <span style={{ color: 'var(--text-dim)' }}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
