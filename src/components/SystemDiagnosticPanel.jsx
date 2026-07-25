import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Zap, X, Terminal, Flame } from 'lucide-react';

export default function SystemDiagnosticPanel({ isOpen, onClose }) {
  const [cpuUsage, setCpuUsage] = useState(42);
  const [ramUsage, setRamUsage] = useState(68);
  const [beamVoltage, setBeamVoltage] = useState(15.4);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 25 + 35));
      setRamUsage(Math.floor(Math.random() * 10 + 64));
      setBeamVoltage((15.2 + Math.random() * 0.4).toFixed(1));
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerGlitchEffect = () => {
    setIsGlitching(true);

    // Apply glitch effect class to body and main container
    document.body.classList.add('crt-glitch-active');

    setTimeout(() => {
      document.body.classList.remove('crt-glitch-active');
      setIsGlitching(false);
    }, 1200);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: isGlitching 
          ? 'rgba(255, 0, 0, 0.25)' 
          : 'rgba(7, 5, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'background 0.2s ease'
      }}
    >
      <div 
        className={`terminal-card ${isGlitching ? 'crt-glitch-active' : ''}`}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'rgba(18, 13, 2, 0.95)',
          border: '1px solid var(--border-amber)',
          boxShadow: isGlitching 
            ? '0 0 80px rgba(255, 0, 0, 0.8)' 
            : '0 0 50px var(--amber-glow)',
          padding: '28px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-amber)', pb: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber-bright)', fontWeight: '800', fontSize: '1rem' }}>
            <Cpu size={18} />
            <span>PAINEL DE DIAGNÓSTICO DO SISTEMA // SYSTEM HARDWARE MONITOR</span>
          </div>

          <button
            onClick={onClose}
            className="terminal-link"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >
            <X size={15} />
            <span>FECHAR</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* CPU Load */}
          <div style={{ border: '1px solid var(--border-amber)', padding: '16px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', fontWeight: '700' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={14} /> USO DE PROCESSADOR</span>
              <span style={{ color: 'var(--amber-bright)' }}>{cpuUsage}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${cpuUsage}%`, height: '100%', background: 'var(--amber-primary)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* RAM Stack */}
          <div style={{ border: '1px solid var(--border-amber)', padding: '16px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', fontWeight: '700' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><HardDrive size={14} /> ALOCAÇÃO DE MEMÓRIA</span>
              <span style={{ color: 'var(--amber-bright)' }}>{ramUsage}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${ramUsage}%`, height: '100%', background: 'var(--amber-primary)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* CRT Tube Voltage */}
          <div style={{ border: '1px solid var(--border-amber)', padding: '16px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', fontWeight: '700' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14} /> TENSÃO DO TUBO CRT</span>
              <span style={{ color: 'var(--amber-bright)' }}>{beamVoltage} kV</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)' }}>
              &gt; Calibração do Feixe de Elétrons: NOMINAL
            </div>
          </div>

          {/* Emotion Engine Audio Sync */}
          <div style={{ border: '1px solid var(--border-amber)', padding: '16px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', fontWeight: '700' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Flame size={14} /> EMOTION ENGINE FREQ</span>
              <span style={{ color: 'var(--amber-bright)' }}>128 BPM</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)' }}>
              &gt; Sincronização da Esfera 3D: 60 FPS OK
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={triggerGlitchEffect}
            className="terminal-link"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              background: isGlitching ? '#ff0055' : undefined,
              color: isGlitching ? '#ffffff' : undefined
            }}
          >
            <Terminal size={15} />
            <span>{isGlitching ? 'EXECUTANDO RUÍDO...' : 'Simular Ruído CRT (Glitch Test)'}</span>
          </button>

          <div style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>
            STATUS DO SISTEMA: OPERACIONAL (OS v2.6)
          </div>
        </div>
      </div>
    </div>
  );
}
