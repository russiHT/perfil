import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldCheck, Radio, Cpu, Activity } from 'lucide-react';
import OscilloscopeHeader from './OscilloscopeHeader';

export default function TerminalHeader({ isMuted, setIsMuted, onOpenDiag }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-BR'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      style={{
        borderBottom: '1px solid var(--border-amber)',
        padding: '16px 0',
        marginBottom: '40px',
        fontSize: '0.85rem',
        color: 'var(--amber-dim)'
      }}
    >
      {/* Top Status Bar & Live Oscilloscope Monitor */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Prominent Interactive Status Bar Button */}
        <button 
          onClick={onOpenDiag}
          className="terminal-link"
          style={{ 
            padding: '6px 14px', 
            fontSize: '0.8rem',
            letterSpacing: '0.5px'
          }}
          title="Clique para abrir o Painel de Diagnóstico do Sistema"
        >
          <Radio size={15} className="crt-flicker" />
          <span>SYS_LOG // AMBER_OS_v2.6</span>
          <span 
            style={{ 
              fontSize: '0.7rem', 
              background: 'var(--amber-primary)', 
              color: '#0a0800', 
              padding: '1px 6px', 
              borderRadius: '3px',
              fontWeight: '800'
            }}
          >
            DIAG
          </span>
        </button>

        {/* Oscilloscope Frequency Waveform Monitor */}
        <OscilloscopeHeader />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'monospace' }}>[{time || '15:33:00'}]</span>
          
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="terminal-link"
            style={{
              padding: '5px 12px',
              fontSize: '0.75rem'
            }}
            title="CRT Audio Feedback"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}</span>
          </button>
        </div>
      </div>

      {/* Boot Logs */}
      <div style={{ lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
        <div>&gt; loading /usr/russi/profile...</div>
        <div>&gt; mounting memory banks...</div>
        <div style={{ color: 'var(--amber-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          &gt; scanline calibration: OK <ShieldCheck size={14} />
        </div>
      </div>
    </header>
  );
}
