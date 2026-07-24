import React from 'react';
import { Terminal, Code, Eye } from 'lucide-react';

export default function ProjectsSection() {
  const records = [
    {
      tag: "REG_01",
      title: "experimentos web",
      desc: "interfaces com estética retrô e interações estranhas.",
      icon: Terminal
    },
    {
      tag: "REG_02",
      title: "código aberto",
      desc: "pequenas ferramentas no github, mantidas por curiosidade.",
      icon: Code
    },
    {
      tag: "REG_03",
      title: "estudos visuais",
      desc: "tipografia mono, CRT, ruído e tudo que parece antigo.",
      icon: Eye
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
        // registros
      </div>

      <h2 
        className="amber-glow-text"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: '700',
          marginBottom: '32px'
        }}
      >
        ## o que ando fazendo
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {records.map((rec) => {
          const IconComp = rec.icon;
          return (
            <div key={rec.tag} className="terminal-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--amber-dim)', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconComp size={15} color="var(--amber-primary)" /> {rec.tag}
                </span>
                <span style={{ color: 'var(--amber-primary)', fontWeight: '700' }}>[ACTIVE]</span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '10px', color: 'var(--amber-bright)' }}>
                {rec.title}
              </h3>

              <p style={{ color: 'var(--amber-primary)', opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6 }}>
                {rec.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
