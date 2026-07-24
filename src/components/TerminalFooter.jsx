import React from 'react';
import { EyeOff } from 'lucide-react';

export default function TerminalFooter({ onToggleHideText }) {
  return (
    <footer 
      style={{
        borderTop: '1px solid var(--border-amber)',
        paddingTop: '32px',
        fontSize: '0.85rem',
        color: 'var(--amber-dim)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ color: 'var(--amber-primary)', fontWeight: '700' }}>
          &gt; end of transmission_
        </div>

        {/* Animated Terminal Link Button for Zen Mode */}
        <button
          onClick={onToggleHideText}
          className="terminal-link"
          style={{
            padding: '10px 18px',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
          title="Modo Zen: Ocultar todas as escritas"
        >
          <EyeOff size={16} />
          <span>Ocultar Escritas (Modo Zen)</span>
        </button>
      </div>

      <div>
        © {new Date().getFullYear()} russi — transmitindo em âmbar
      </div>
    </footer>
  );
}
