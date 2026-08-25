import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SkipForward } from 'lucide-react';
import { useLatest } from '../hooks/useLatest';

// Antes eram 5 segundos obrigatórios bloqueando todo o conteúdo. A animação
// continua existindo, mas em menos de 2 s e — principalmente — com saída.
const TOTAL_TIME = 1800;
const TICK = 40;

const BOOT_MESSAGES = [
  { time: '0.00s', text: 'INITIALIZING OS v2.1...' },
  { time: '0.28s', text: 'LOADING /usr/russi/profile...' },
  { time: '0.56s', text: 'MOUNTING MEMORY BANKS & CRT SCANLINES...' },
  { time: '0.84s', text: 'SYNCHRONIZING EMOTION ENGINE FREQUENCIES...' },
  { time: '1.20s', text: 'CALIBRATING PARTICLE MATRIX SPHERE...' },
  { time: '1.60s', text: 'SYSTEM READY. WELCOME TO RUSSI TERMINAL.' }
];

export default function LoadingScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const hasCompleted = useRef(false);
  const onCompleteRef = useLatest(onComplete);

  const finish = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    onCompleteRef.current?.();
  }, [onCompleteRef]);

  useEffect(() => {
    // Quem pede movimento reduzido não deveria enfrentar uma animação de boot.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return undefined;
    }

    let elapsed = 0;
    const progressInterval = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.min(100, Math.floor((elapsed / TOTAL_TIME) * 100)));
      if (elapsed >= TOTAL_TIME) {
        clearInterval(progressInterval);
        setTimeout(() => finish(), 180);
      }
    }, TICK);

    const messageStep = TOTAL_TIME / BOOT_MESSAGES.length;
    const timerIds = BOOT_MESSAGES.map((msg, idx) =>
      setTimeout(() => {
        setLogs((prev) => (prev.some((l) => l.text === msg.text) ? prev : [...prev, msg]));
      }, idx * messageStep)
    );

    // Saída por teclado: Escape, Enter ou espaço.
    const handleKeyDown = (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(progressInterval);
      timerIds.forEach(clearTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finish]);

  const filledBlocks = Math.floor(progress / 5);
  const progressBarStr = `[${'█'.repeat(filledBlocks)}${'-'.repeat(20 - filledBlocks)}] ${progress}%`;

  return (
    <div
      onClick={() => finish()}
      role="status"
      aria-live="polite"
      aria-label="Carregando o terminal. Pressione Escape para pular."
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#070500',
        color: 'var(--amber-primary)',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          border: '1px solid var(--border-amber)',
          borderRadius: '8px',
          background: 'rgba(18, 13, 2, 0.95)',
          padding: '24px',
          boxShadow: '0 0 50px rgba(255, 176, 0, 0.25)'
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--amber-dim)', marginBottom: '16px', fontWeight: '700' }}>
          ((o)) OS BOOT LOADER v2.1 // PROFILE TRANSMISSION
        </div>

        {/* Boot Logs Output */}
        <div style={{ height: '150px', overflowY: 'auto', marginBottom: '20px', fontSize: '0.88rem', lineHeight: 1.7 }}>
          {logs.map((log, index) => (
            <div
              key={log.text}
              style={{ color: index === logs.length - 1 ? 'var(--amber-bright)' : 'var(--amber-primary)' }}
            >
              <span style={{ opacity: 0.7, marginRight: '10px' }}>[{log.time}]</span>
              <span>{log.text}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={{ color: 'var(--amber-bright)', fontWeight: '700', fontSize: '0.95rem', marginBottom: '18px' }}>
          {progressBarStr}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className="terminal-link"
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          <SkipForward size={14} />
          <span>PULAR INTRO [ESC]</span>
        </button>
      </div>
    </div>
  );
}
