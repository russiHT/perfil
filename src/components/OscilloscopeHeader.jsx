import React, { useEffect, useRef, useState } from 'react';
import { Activity, Sliders } from 'lucide-react';

export default function OscilloscopeHeader() {
  const canvasRef = useRef(null);
  const [waveType, setWaveType] = useState('sine'); // sine, square, sawtooth
  const freq = 2.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensionar o canvas APAGA e reinicia o contexto. Antes isso acontecia
    // dentro do laço de render, 60 vezes por segundo; agora é feito uma vez.
    const width = 240;
    const height = 42;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Cor do tema lida uma vez e reavaliada só quando o tema muda, em vez de
    // um getComputedStyle por frame (que força recálculo de estilo).
    let themePrimary =
      getComputedStyle(document.documentElement).getPropertyValue('--amber-primary').trim() || '#ffb000';
    const handleThemeChange = () => {
      themePrimary =
        getComputedStyle(document.documentElement).getPropertyValue('--amber-primary').trim() || '#ffb000';
    };
    window.addEventListener('theme-change', handleThemeChange);

    let phase = 0;
    let animId;

    const render = () => {
      if (!prefersReducedMotion) phase += 0.05;

      ctx.clearRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Waveform Path
      ctx.strokeStyle = themePrimary;
      ctx.shadowColor = themePrimary;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        let y = height / 2;
        const normX = (x / width) * Math.PI * 2 * freq + phase;

        if (waveType === 'sine') {
          y += Math.sin(normX) * 14;
        } else if (waveType === 'square') {
          y += (Math.sin(normX) > 0 ? 1 : -1) * 14;
        } else if (waveType === 'sawtooth') {
          y += ((normX % Math.PI) / Math.PI - 0.5) * 28;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Com movimento reduzido desenhamos um único quadro estático.
      if (!prefersReducedMotion) animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
      cancelAnimationFrame(animId);
    };
  }, [waveType]);

  const cycleWave = () => {
    if (waveType === 'sine') setWaveType('square');
    else if (waveType === 'square') setWaveType('sawtooth');
    else setWaveType('sine');
  };

  return (
    <div
      className="oscilloscope-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(18, 13, 2, 0.8)',
        border: '1px solid var(--border-amber)',
        borderRadius: '6px',
        padding: '6px 12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--amber-dim)', fontSize: '0.72rem', fontWeight: '700' }}>
        <Activity size={13} color="var(--amber-primary)" className="crt-flicker" />
        <span>OSCILLOSCOPE [{waveType.toUpperCase()}]</span>
      </div>

      {/* Waveform Canvas */}
      <canvas
        ref={canvasRef}
        onClick={cycleWave}
        role="img"
        aria-label={`Osciloscópio decorativo exibindo uma onda ${waveType}`}
        style={{ 
          cursor: 'pointer',
          borderRadius: '3px',
          background: 'rgba(5, 4, 0, 0.6)',
          border: '1px solid var(--border-amber)'
        }}
        title="Clique para alternar o tipo de onda (Sine / Square / Sawtooth)"
      />

      <button
        onClick={cycleWave}
        aria-label="Alternar forma de onda do osciloscópio"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--amber-primary)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Alternar Forma de Onda"
      >
        <Sliders size={13} />
      </button>
    </div>
  );
}
