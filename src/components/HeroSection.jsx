import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section style={{ marginBottom: '60px', position: 'relative' }}>
      {/* Title */}
      <h1
        className="amber-glow-text"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4.5rem, 12vw, 9rem)',
          lineHeight: 0.9,
          letterSpacing: '-2px',
          marginBottom: '20px',
          userSelect: 'none'
        }}
      >
        # russi<span className="terminal-caret" />
      </h1>

      {/* Transmission subtitle */}
      <div
        style={{
          color: 'var(--amber-dim)',
          fontSize: '1rem',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px'
        }}
      >
        <span>// continue scrolling to decode the transmission</span>
        <ChevronDown size={16} className="crt-flicker" />
      </div>

      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          border: '1px solid var(--border-amber)',
          background: 'var(--amber-soft-glow)',
          fontSize: '0.8rem',
          color: 'var(--amber-primary)',
          fontWeight: '700',
          letterSpacing: '1px'
        }}
      >
        // about
      </div>
    </section>
  );
}
