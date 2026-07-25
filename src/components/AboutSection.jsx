import React, { useState } from 'react';
import { Activity, MapPin, Cpu, Clock, Code2 } from 'lucide-react';
import SiteCodeSnippetsModal from './SiteCodeSnippetsModal';

export default function AboutSection() {
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);

  const metrics = [
    { label: 'STATUS', value: 'online', icon: Activity, pulse: true },
    { label: 'LOCAL', value: 'brasil', icon: MapPin },
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
        direto da linha de comando. gosto de terminais antigos, carros antigos e de coisas que fazem barulho quando carregam. explore todas as partes, talvez encontre coisas novas.
      </p>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
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

      {/* Short Tech Specs about THIS site */}
      <div className="terminal-card" style={{ padding: '20px', background: 'rgba(18, 13, 2, 0.75)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--amber-dim)', fontWeight: '700' }}>
            // SOBRE A ARQUITETURA DESTE SITE (perfil v2.1)
          </div>

          <button
            onClick={() => setIsSnippetsOpen(true)}
            className="terminal-link"
            style={{ padding: '6px 12px', fontSize: '0.78rem', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
          >
            <Code2 size={14} />
            <span>EXPLORAR CODE SNIPPETS DO SITE</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '0.88rem' }}>
          <div>
            <strong style={{ color: 'var(--amber-bright)' }}>• Web Audio Synthesizer:</strong>
            <p style={{ opacity: 0.85, marginTop: '2px' }}>Osciladores em tempo real para bipes de Código Morse e cliques de terminal.</p>
          </div>
          <div>
            <strong style={{ color: 'var(--amber-bright)' }}>• 3D WebGL Mesh Engine:</strong>
            <p style={{ opacity: 0.85, marginTop: '2px' }}>Esfera de partículas interativas com renderização fluida em 60 FPS.</p>
          </div>
          <div>
            <strong style={{ color: 'var(--amber-bright)' }}>• Dynamic CRT Design System:</strong>
            <p style={{ opacity: 0.85, marginTop: '2px' }}>Filtro de scanlines, cursor fosforescente e temas de cor alternáveis em tempo de execução.</p>
          </div>
        </div>
      </div>

      {/* Site Code Snippets Explorer Modal */}
      <SiteCodeSnippetsModal
        isOpen={isSnippetsOpen}
        onClose={() => setIsSnippetsOpen(false)}
      />
    </section>
  );
}
