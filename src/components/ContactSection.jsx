import React from 'react';
import { Instagram, Github, Mail, ArrowUpRight } from 'lucide-react';

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
      handle: 'otariolho@gmail.com',
      url: 'mailto:otariolho@gmail.com',
      icon: Mail
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
        // canal aberto
      </div>

      <h2 
        className="amber-glow-text"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: '700',
          marginBottom: '12px'
        }}
      >
        ## mandar mensagem
      </h2>

      <p style={{ color: 'var(--amber-dim)', fontSize: '0.95rem', marginBottom: '32px' }}>
        &gt; conecte-se via um dos canais abaixo. resposta em ondas curtas.
      </p>

      {/* Social Links Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
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
                fontSize: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <IconComponent size={22} />
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {lnk.label}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                    {lnk.handle}
                  </div>
                </div>
              </div>

              <ArrowUpRight size={20} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
