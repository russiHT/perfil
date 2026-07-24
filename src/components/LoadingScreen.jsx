import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const bootMessages = [
    { time: '0.00s', text: 'INITIALIZING AMBER_OS v2.6...' },
    { time: '0.80s', text: 'LOADING /usr/russi/profile...' },
    { time: '1.60s', text: 'MOUNTING MEMORY BANKS & CRT SCANLINES...' },
    { time: '2.50s', text: 'SYNCHRONIZING EMOTION ENGINE FREQUENCIES...' },
    { time: '3.40s', text: 'CALIBRATING 3D PARTICLE MATRIX SPHERE...' },
    { time: '4.50s', text: 'SYSTEM READY. WELCOME TO RUSSI TERMINAL.' }
  ];

  useEffect(() => {
    const totalTime = 5000;
    const intervalTime = 50;
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(100, Math.floor((elapsed / totalTime) * 100));
      setProgress(pct);

      if (elapsed >= totalTime) {
        clearInterval(progressInterval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }
    }, intervalTime);

    const timerIds = [];
    bootMessages.forEach((msg, idx) => {
      const id = setTimeout(() => {
        setLogs((prev) => {
          if (prev.some((l) => l.text === msg.text)) return prev;
          return [...prev, msg];
        });
      }, idx * 800);
      timerIds.push(id);
    });

    return () => {
      clearInterval(progressInterval);
      timerIds.forEach((id) => clearTimeout(id));
    };
  }, []);

  const filledBlocks = Math.floor(progress / 5);
  const emptyBlocks = 20 - filledBlocks;
  const progressBarStr = `[${'█'.repeat(filledBlocks)}${'-'.repeat(emptyBlocks)}] ${progress}%`;

  return (
    <div 
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
        padding: '32px'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          border: '1px solid var(--border-amber)',
          borderRadius: '8px',
          background: 'rgba(18, 13, 2, 0.95)',
          padding: '28px',
          boxShadow: '0 0 50px rgba(255, 176, 0, 0.25)'
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--amber-dim)', marginBottom: '16px', fontWeight: '700' }}>
          ((o)) AMBER_OS BOOT LOADER v2.6 // PROFILE TRANSMISSION
        </div>

        {/* Boot Logs Output */}
        <div style={{ height: '180px', overflowY: 'auto', marginBottom: '24px', fontSize: '0.88rem', lineHeight: 1.7 }}>
          {logs.map((log, index) => (
            <div key={index} style={{ color: index === logs.length - 1 ? 'var(--amber-bright)' : 'var(--amber-primary)' }}>
              <span style={{ opacity: 0.6, marginRight: '10px' }}>[{log.time}]</span>
              <span>{log.text}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={{ color: 'var(--amber-bright)', fontWeight: '700', fontSize: '0.95rem' }}>
          {progressBarStr}
        </div>
      </div>
    </div>
  );
}
