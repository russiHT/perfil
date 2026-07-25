import React from 'react';
import { Activity, MapPin, Cpu, Clock } from 'lucide-react';

export default function AboutSection() {
  const metrics = [
    { label: 'STATUS', value: 'online', icon: Activity, pulse: true },
    { label: 'LOCAL', value: 'brasil 🇧🇷', icon: MapPin },
    { label: 'MODO', value: 'grind', icon: Cpu },
    { label: 'UPTIME', value: 'v2.1', icon: Clock }
  ];

  return (
    <section style={{ marginBottom: '80px' }}>
      {/* About Heading */}
      <h2
        className="amber-glow-text"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: '700',
          marginBottom: '20px',
          lineHeight: 1.2
        }}
      >
        ## eu sou russi.
      </h2>

      {/* Main Paragraph */}
      <p
        style={{
          color: 'var(--amber-primary)',
          fontSize: '1.15rem',
          lineHeight: 1.8,
          maxWidth: '780px',
          marginBottom: '36px',
          opacity: 0.9
        }}
      >
        direto da linha de comando. gosto de terminais antigos, carros, e de coisas que fazem barulho quando carregam. este é meu espaço — role para baixo pra puxar os próximos pacotes.
      </p>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px'
        }}
      >
        {metrics.map((m) => {
          const IconComponent = m.icon;
          return (
            <div key={m.label} className="terminal-card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconComponent size={13} />
                {m.label}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--amber-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {m.pulse && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--amber-primary)',
                      boxShadow: '0 0 10px var(--amber-primary)'
                    }}
                    className="crt-flicker"
                  />
                )}
                {m.value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
