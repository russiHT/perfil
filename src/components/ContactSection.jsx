import React from 'react';
import { Instagram, Github, Mail, ArrowUpRight } from 'lucide-react';

function DiscordIcon({ size = 22, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function ContactSection() {
  const links = [
    {
      label: 'instagram',
      handle: '@grussi_',
      url: 'https://instagram.com/grussi_',
      icon: Instagram
    },
    {
      label: 'github',
      handle: 'russiHT',
      url: 'https://github.com/russiHT',
      icon: Github
    },
    {
      label: 'email',
      handle: 'gustavorussi07@gmail.com',
      url: 'mailto:gustavorussi07@gmail.com',
      icon: Mail
    },
    {
      label: 'discord',
      handle: 'russizin',
      url: 'https://discord.com/users/russizin',
      icon: DiscordIcon
    }
  ];

  return (
    <section style={{ marginBottom: '80px' }}>
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          border: '1px solid var(--border-amber)',
          background: 'var(--amber-soft-glow)',
          fontSize: '0.8rem',
          color: 'var(--amber-primary)',
          fontWeight: '700',
          letterSpacing: '1px',
          marginBottom: '16px'
        }}
      >
        {'// canal aberto'}
      </div>

      <h2
        className="amber-glow-text"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.2rem',
          fontWeight: '700',
          marginBottom: '12px'
        }}
      >
        ## mandar mensagem
      </h2>

      <p style={{ color: 'var(--amber-dim)', fontSize: '0.95rem', marginBottom: '32px' }}>
        &gt; conecte-se via um dos canais abaixo.
      </p>

      {/* Social Links Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {links.map((lnk) => {
          const IconComponent = lnk.icon;
          return (
            <a
              key={lnk.label}
              href={lnk.url}
              target="_blank"
              rel="noreferrer"
              className="terminal-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                fontSize: '1rem',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                <IconComponent size={22} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {lnk.label}
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    wordBreak: 'break-all',
                    lineHeight: 1.3
                  }}>
                    {lnk.handle}
                  </div>
                </div>
              </div>

              <ArrowUpRight size={20} style={{ flexShrink: 0, marginLeft: '8px' }} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
