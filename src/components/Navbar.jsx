import React, { useState } from 'react';
import { Search, Github, Moon, Sun, Pin, RefreshCw, User } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  githubUser, 
  onFetchUser, 
  theme, 
  toggleTheme,
  loading 
}) {
  const [inputUsername, setInputUsername] = useState(githubUser);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      onFetchUser(inputUsername.trim());
    }
  };

  return (
    <header className="navbar-glass">
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e60023, #ff4757)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(230, 0, 35, 0.4)'
          }}
        >
          <Pin size={24} style={{ transform: 'rotate(-25deg)' }} />
        </div>
        <div>
          <h1 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '800', 
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
            background: 'linear-gradient(90deg, var(--text-main), var(--accent-indigo))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            PinFolio
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>
            GITHUB PINTEREST PORTFOLIO
          </span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-muted)' 
          }} 
        />
        <input
          type="text"
          placeholder="Search repositories, topics, languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 16px 10px 42px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        />
      </div>

      {/* GitHub Username Fetch Form */}
      <form onSubmit={handleUserSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative' }}>
          <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="GitHub Username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            style={{
              width: '150px',
              padding: '8px 12px 8px 34px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-pill btn-secondary" 
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          title="Fetch user repositories"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Load</span>
        </button>
      </form>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={toggleTheme}
          className="btn-icon-glass"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        <a 
          href={`https://github.com/${githubUser}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <Github size={16} />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
