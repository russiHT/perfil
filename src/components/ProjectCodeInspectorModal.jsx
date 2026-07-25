import React, { useState } from 'react';
import { X, Code2, Cpu, CheckCircle2, Copy, ExternalLink } from 'lucide-react';

export default function ProjectCodeInspectorModal({ project, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const handleCopyCode = () => {
    if (!project.codeSnippet) return;
    navigator.clipboard.writeText(project.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(7, 5, 0, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        className="terminal-card"
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(14, 10, 2, 0.98)',
          border: '1px solid var(--border-amber)',
          boxShadow: '0 0 50px var(--amber-glow)',
          padding: '28px'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-amber)', pb: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 size={20} color="var(--amber-bright)" />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--amber-bright)' }}>
                {project.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)' }}>
                INSPETOR DE ARQUITETURA & CÓDIGO FONTE // SOURCE INSPECTOR
              </div>
            </div>
          </div>

          <button onClick={onClose} className="terminal-link" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
            <X size={15} />
            <span>FECHAR</span>
          </button>
        </div>

        {/* Tech Stack & Key Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ border: '1px solid var(--border-amber)', padding: '12px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '4px' }}>
              TECNOLOGIAS CHAVE
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--amber-bright)' }}>
              {project.techStack}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-amber)', padding: '12px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '4px' }}>
              PADRÃO DE ARQUITETURA
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--amber-primary)' }}>
              {project.architecturePattern}
            </div>
          </div>
        </div>

        {/* Engineering Highlights */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--amber-bright)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={15} /> DESTAQUES DE ENGENHARIA & DECISÕES TÉCNICAS:
          </h4>
          <ul style={{ paddingLeft: '20px', color: 'var(--amber-primary)', fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.9 }}>
            {project.highlights.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Code Snippet Box */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--amber-dim)', fontWeight: '700' }}>
              &gt; SNIPPET DE CÓDIGO FONTE ({project.snippetFile}):
            </span>
            <button
              onClick={handleCopyCode}
              className="terminal-link"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {copied ? <CheckCircle2 size={13} color="#00ff66" /> : <Copy size={13} />}
              <span>{copied ? 'COPIADO!' : 'COPIAR CÓDIGO'}</span>
            </button>
          </div>

          <pre
            style={{
              background: '#070500',
              border: '1px solid var(--border-amber)',
              borderRadius: '6px',
              padding: '16px',
              fontSize: '0.82rem',
              color: 'var(--amber-bright)',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
            }}
          >
            <code>{project.codeSnippet}</code>
          </pre>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="terminal-link"
              style={{ background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
            >
              <ExternalLink size={15} />
              <span>ABRIR REPOSITÓRIO COMPLETO NO GITHUB</span>
            </a>
          )}

          <div style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>
            STATUS: CÓDIGO FONTE VERIFICADO // russiHT
          </div>
        </div>
      </div>
    </div>
  );
}
