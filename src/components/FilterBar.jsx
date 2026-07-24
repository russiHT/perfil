import React from 'react';
import { Filter, ArrowUpDown, Sparkles } from 'lucide-react';

export default function FilterBar({ 
  languages, 
  selectedLanguage, 
  onSelectLanguage, 
  sortBy, 
  onSortChange,
  totalCount 
}) {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        padding: '12px 18px',
        background: 'var(--card-bg)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--card-border)'
      }}
    >
      {/* Category Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
          <Filter size={14} /> Filter:
        </span>

        {languages.map((lang) => {
          const isActive = selectedLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => onSelectLanguage(lang)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-indigo)' : 'var(--card-border)',
                background: isActive ? 'linear-gradient(135deg, var(--accent-indigo), #4f46e5)' : 'var(--bg-tertiary)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {lang}
            </button>
          );
        })}
      </div>

      {/* Right Controls (Sort & Total Counter) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="stars">Most Stars ⭐</option>
            <option value="forks">Most Forks 🍴</option>
            <option value="updated">Recently Updated 🕒</option>
            <option value="name">Repository Name 🔤</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} color="var(--accent-pink)" />
          <span>{totalCount} Pins</span>
        </div>
      </div>
    </div>
  );
}
