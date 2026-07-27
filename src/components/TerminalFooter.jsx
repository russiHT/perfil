import React from 'react';
import { EyeOff } from 'lucide-react';

export default function TerminalFooter({ onToggleHideText }) {
  const agnesAsciiArt = `⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⢛⡛⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠉⠐⠀⠀⠈⠁⠀⠀⠈⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠻⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠔⠀⣠⣾⣿⣿⣿⣿⣶⣤⡀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠁⠀⠀⠀⢰⣿⣿
⣿⣿⣿⣇⠠⠀⠀⠉⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠐⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠹⣿⣿⣿⣿⡿⠋⢡⡄⠀⣤⡀⠀⠀⠀⣾⣿⣿
⣿⣿⣿⣿⡄⠀⠀⠀⡀⠀⢄⣉⠙⠿⣿⣿⣿⣿⣿⠿⠛⠋⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠀⠀⠈⠉⠀⠈⠻⠿⠉⢠⡶⠋⣰⣿⣿⣿⡦⢀⣾⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡄⠀⢾⣿⣦⡀⠙⢿⣆⠈⠻⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏⠀⢠⣿⣿⣿⡿⢁⣾⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡄⠘⣿⣿⣷⡄⠀⠙⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⠀⠀⠊⣿⣿⡟⢀⣾⣿⣿⣿⡿⠿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣦⠙⢿⢿⡛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣄⠀⠀⠀⠁⠉⠀⠛⠛⠛⠉⠀⢀⣼⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡿⠿⠿⠗⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣆⠀⠀⢤⣶⣦⠀⢤⣤⣶⣾⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠿⠇⠀⣶⠀⢰⡶⠠⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⡆⠀⡀⠹⣿⣷⡄⠻⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⢨⠩⠠⢀⣠⣿⠁⠁⠀⠀⠀⠀⠀⠀⠀⠰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣼⣿⣿⣿⣿⡄⢻⣄⠸⣿⣿⣄⠹⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣦⣤⣴⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⣀⣀⣀⡄⠠⣶⣾⣶⡄⢿⣿⣿⣿⣿⣿⡘⣿⣷⠈⣿⡀⠹⣿⣿⣆⠹⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⣾⣷⣄⠀⠀⠀⠀⠀⠀⠃⠀⠀⢠⣤⣶⣿⣿⣿⣿⡇⢁⢿⣿⣿⡇⡘⣿⣿⣿⣿⣿⣷⠘⣿⡆⢻⣧⠀⢹⣿⣿⡆⢻⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⢠⠼⣿⣿⡟⢸⢠⣄⣀⣤⠀⢰⣾⠀⢸⣿⣿⣿⣿⣿⣿⡇⣆⢸⣿⣿⡇⣷⡘⣿⣿⣿⣿⢻⣧⠸⡇⢸⣿⡆⠀⢿⣿⣿⡀⢻
⣿⣿⣿⣿⣿⣿⣿⠃⡏⠀⣿⣿⡇⠀⣿⣿⣿⡏⠀⣼⣿⡀⣿⣿⣿⣿⣿⣿⠹⡇⣿⣆⠿⡿⠇⠸⢷⡘⢿⣿⣿⢸⣿⡇⠇⢸⣿⣿⡀⠘⣿⣿⣧⠸
⣿⣿⣿⣿⣿⣿⠇⡼⠀⢳⣿⣿⣧⢠⣿⣿⣿⡇⣀⢈⣛⡁⠙⠻⣿⣿⣿⣿⠀⡇⣿⣡⣄⠲⣿⠸⣿⣿⣌⢻⣿⡎⣿⣿⠀⢸⣿⣿⣇⠀⢹⠉⣿⡆
⣿⣿⣿⣿⣿⠏⣼⠃⢠⣼⣿⣿⣿⡈⣿⣿⣿⡇⣿⡆⣿⣧⠸⣿⣿⣿⣿⣿⡇⠀⣿⣿⣿⣷⡘⠆⣿⣿⣿⣦⠙⠇⣿⣿⣦⣿⣿⣿⣿⠀⠈⠇⢹⡇
⣿⣿⣿⡿⢋⡼⠃⣀⢸⣿⣿⣿⣿⣧⠸⣿⣿⡇⣿⣿⡜⠿⢠⠹⣿⣿⣿⣿⣿⡀⣿⣿⣿⠿⠟⠂⠉⠉⠘⠛⠓⠚⢛⣿⣿⣿⣿⣿⣿⡆⠀⠀⢸⡇
⣿⣿⠟⠡⠞⣡⣾⣿⢸⠛⣿⣿⣿⣿⣧⡹⡛⠁⠛⠛⠋⠈⠐⠂⠹⣿⣿⣿⣿⣧⠹\\⢁⣀⠀⠀⠤⠤⠄⣤⡀⢠⣿⣿⣿⣿⣿⡏⢹⠇⠀⠀⢸⢁
⡿⠃⢀⣴⣾⣿⣿⣿⠸⡇⠹⣿⣿⣿⠟⠁⠀⠀⣠⡄⠤⠤⠄⠀⢠⣌⠻⣿⣿⣿⣆⠹⣿⣿⠐⠒⠂⠐⠒⣿⠀⣿⣿⣿⣿⣿⣿⡇⠘⠀⠀⠀⠈⣸
⣿⣿⣿⣿⣿⣿⣿⣿⡄⠇⢤⠈⢿⣿⣿⣷⡄⣸⣿⣇⠀⢀⢀⣁⢸⣿⣷⣬⡙⢿⣿⣧⠹⣿⣧⡸⠿⣟⡱⢣⣾⠟⣹⣿⣿⣿⡿⠁⠀⠀⠀⠀⣰⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠘⢠⠀⣙⠻⢿⣷⡜⢿⣻⣮⣛⣛⣣⣾⣿⣿⣿⣿⣷⣮⣭⣑⣈⣻⣿⡿⠋⣐⠉⡴⢸⣿⣿⣿⣿⠃⠀⠀⠀⠀⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⡄⠀⠈⠛⠂⢠⣭⣤⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣋⣨⡄⣼⣿⣿⠋⠁⠀⠀⢀⠀⠰⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⡇⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⠿⣿⡿⢿⣡⡿⠿⠿⠿⣿⣿⣿⠇⢻⡿⠃⠀⠀⠀⠀⢻⣶⣶⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠀⠀⠀⢈⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣫⣶⣿⣿⣿⣶⣍⠁⠀⠸⠁⠀⢠⣀⠀⠀⠸⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⢰⡀⠀⠀⠀⠸⠁⠀⠀⠉⠙⠛⠛⠛⠛⢛⠛⠛⠋⣼⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠻⣷⣶⣶⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⢀⡠⠀⠀⠀⠀⠀⣠⠏⠀⠀⣾⣿⣿⣿⣿⣿⡿⠛⢿⡏⣿⡆⢶⣤⣤⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣤⣼⣟⣁⣀⣠⠀⡀⣼⣿⡆⡾⣸⣿⣿⣿⣿⣿⣿⣧⣤⣼⡇⣿⣷⡈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢃⣾⠳⣈⣽⢰⢇⣿⣿⣿⣿⣿⣿⡿⠛⠻⣿⡇⢿⣿⣇⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠡⣿⡇⣾⣿⡿⣼⢸⣿⣿⣿⣿⣿⣿⣷⣤⣴⢹⡇⢸⣿⣿⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`;

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-amber)',
        paddingTop: '32px',
        fontSize: '0.85rem',
        color: 'var(--amber-dim)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
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
          title="Ocultar texto em tela"
        >
          <EyeOff size={16} />
          <span>Ocultar Textos</span>
        </button>
      </div>

      {/* Agnes Tachyon Braille ASCII Art Banner */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          overflowX: 'auto',
          maxWidth: '100%'
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '8px' }}>
          [ AGNES_TACHYON ]
        </div>
        <pre
          className="amber-glow-text"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.42rem',
            lineHeight: 1.05,
            letterSpacing: '0px',
            color: 'var(--amber-bright)',
            textAlign: 'center',
            margin: 0,
            userSelect: 'none'
          }}
        >
          {agnesAsciiArt}
        </pre>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--amber-dim)', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} russi // russiHT
      </div>
    </footer>
  );
}
