import React, { useState } from 'react';
import { Gauge, Volume2, Cpu, Zap, Activity, Flame, ShieldAlert } from 'lucide-react';

const CARS = [
  {
    id: 'r34',
    name: 'Nissan Skyline GT-R (R34 V-Spec II)',
    category: 'JDM Legend // AWD Twin-Turbo',
    image: './images/r34.png',
    engine: '2.6L Twin-Turbo (RB26DETT)',
    power: '650+ HP (Tuned)',
    torque: '680 Nm @ 4,800 RPM',
    drivetrain: 'ATTESA E-TS Pro AWD',
    accel: '3.4s (0-100 km/h)',
    redline: '8,000 RPM',
    soundPitch: 220,
    turbo: true,
    desc: 'O ápice da tecnologia JDM dos anos 90. Tração integral com distribuição ativa de torque e o lendário motor RB26 de bloco de ferro inoxidável.'
  },
  {
    id: 'porsche',
    name: 'Porsche 911 GT3 RS (992)',
    category: 'German Track Weapon // Flat-6 NA',
    image: './images/porsche.png',
    engine: '4.0L Atmosférico (Flat-6 Box-6)',
    power: '525 HP @ 8,500 RPM',
    torque: '465 Nm @ 6,300 RPM',
    drivetrain: 'RWD (Traseira)',
    accel: '3.2s (0-100 km/h)',
    redline: '9,000 RPM',
    soundPitch: 310,
    turbo: false,
    desc: 'Engenharia de pista pura. Motor traseiro aspirado de alta rotação a 9.000 RPM com aerodinâmica ativa DRS e suspensão ajustável no volante.'
  },
  {
    id: 'rx7',
    name: 'Mazda RX-7 FD3S (Spirit R Type-A)',
    category: 'Rotary Icon // Twin-Sequential Turbo',
    image: './images/rx7.png',
    engine: '1.3L Bi-Rotativo (13B-REW)',
    power: '280 HP @ 6,500 RPM',
    torque: '314 Nm @ 5,000 RPM',
    drivetrain: 'RWD (Traseira)',
    accel: '5.1s (0-100 km/h)',
    redline: '8,200 RPM',
    soundPitch: 260,
    turbo: true,
    desc: 'Design atemporal e distribuição de peso perfeita 50:50. O motor Wankel rotativo entrega resposta instantânea com turbos sequenciais.'
  }
];

export default function GarageSection() {
  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [isRevving, setIsRevving] = useState(false);

  const activeCar = CARS[activeCarIndex];

  // Synthesize realistic engine revving sound using Web Audio API
  const playEngineRevSound = (baseFreq = 220, hasTurbo = true) => {
    if (isRevving) return;
    setIsRevving(true);

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      const now = ctx.currentTime;

      // Engine idle -> rev up -> redline -> rev down
      osc1.frequency.setValueAtTime(baseFreq * 0.5, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, now + 0.6);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 1.4);

      osc2.frequency.setValueAtTime(baseFreq * 0.25, now);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.6);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, now + 1.4);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.5);
      osc2.stop(now + 1.5);

      // Turbo blow-off valve whistle pop effect
      if (hasTurbo) {
        setTimeout(() => {
          try {
            const blowOffOsc = ctx.createOscillator();
            const blowOffGain = ctx.createGain();
            blowOffOsc.type = 'sine';
            blowOffOsc.frequency.setValueAtTime(1800, ctx.currentTime);
            blowOffOsc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.18);
            blowOffGain.gain.setValueAtTime(0.08, ctx.currentTime);
            blowOffGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
            blowOffOsc.connect(blowOffGain);
            blowOffGain.connect(ctx.destination);
            blowOffOsc.start();
            blowOffOsc.stop(ctx.currentTime + 0.18);
          } catch (e) {}
        }, 620);
      }

      setTimeout(() => {
        setIsRevving(false);
      }, 1500);
    } catch (e) {
      setIsRevving(false);
    }
  };

  return (
    <section style={{ marginBottom: '80px' }}>
      {/* Section Title */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          className="amber-glow-text"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Gauge size={26} color="var(--amber-bright)" />
          <span>## /usr/garage // TELEMETRIA AUTOMOTIVA OBD-II</span>
        </h2>

        <p style={{ color: 'var(--amber-primary)', fontSize: '1rem', opacity: '0.88', maxWidth: '720px' }}>
          Projetos e ícones automotivos que inspiram a engenharia: alta rotação, roncos marcantes e mecânica bruta.
        </p>
      </div>

      {/* Main Garage Card */}
      <div className="terminal-card" style={{ padding: '24px', position: 'relative' }}>
        {/* Car Selection Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {CARS.map((car, idx) => {
            const isActive = activeCarIndex === idx;
            return (
              <button
                key={car.id}
                onClick={() => setActiveCarIndex(idx)}
                className="terminal-link"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  background: isActive ? 'var(--amber-primary)' : 'var(--amber-soft-glow)',
                  color: isActive ? '#070500' : 'var(--amber-primary)',
                  fontWeight: '800'
                }}
              >
                <span>[{idx + 1}] {car.name.split(' ')[0]} {car.name.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Content Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {/* Car Image Container with CRT Glow */}
          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--border-amber)',
              background: '#070500',
              boxShadow: '0 0 30px var(--amber-soft-glow)',
              aspectRatio: '16/10'
            }}
          >
            <img
              src={activeCar.image}
              alt={activeCar.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.1) brightness(0.95)'
              }}
            />
            {/* Scanlines overlay effect */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                backgroundSize: '100% 4px',
                pointerEvents: 'none',
                opacity: 0.6
              }}
            />
          </div>

          {/* Telemetry Specs Details */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>
              &gt; {activeCar.category}
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-bright)', marginBottom: '12px' }}>
              {activeCar.name}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--amber-primary)', opacity: 0.9, lineHeight: 1.6, marginBottom: '20px' }}>
              {activeCar.desc}
            </p>

            {/* Telemetry Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div style={{ background: 'var(--amber-soft-glow)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-amber)' }}>
                <span style={{ color: 'var(--amber-dim)', display: 'block', fontSize: '0.7rem' }}>MOTOR</span>
                <strong style={{ color: 'var(--amber-bright)' }}>{activeCar.engine}</strong>
              </div>

              <div style={{ background: 'var(--amber-soft-glow)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-amber)' }}>
                <span style={{ color: 'var(--amber-dim)', display: 'block', fontSize: '0.7rem' }}>POTÊNCIA</span>
                <strong style={{ color: 'var(--amber-bright)' }}>{activeCar.power}</strong>
              </div>

              <div style={{ background: 'var(--amber-soft-glow)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-amber)' }}>
                <span style={{ color: 'var(--amber-dim)', display: 'block', fontSize: '0.7rem' }}>TORQUE</span>
                <strong style={{ color: 'var(--amber-bright)' }}>{activeCar.torque}</strong>
              </div>

              <div style={{ background: 'var(--amber-soft-glow)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-amber)' }}>
                <span style={{ color: 'var(--amber-dim)', display: 'block', fontSize: '0.7rem' }}>TRAÇÃO / 0-100</span>
                <strong style={{ color: 'var(--amber-bright)' }}>{activeCar.drivetrain} // {activeCar.accel}</strong>
              </div>
            </div>

            {/* Audio Engine Sound Synthesizer Trigger Button */}
            <button
              onClick={() => playEngineRevSound(activeCar.soundPitch, activeCar.turbo)}
              disabled={isRevving}
              className="terminal-link"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px 18px',
                fontSize: '0.85rem',
                background: isRevving ? 'var(--amber-bright)' : 'var(--amber-primary)',
                color: '#0d0a00',
                fontWeight: '900'
              }}
            >
              <Volume2 size={16} />
              <span>{isRevving ? 'CORTE DE GIRO @ REDLINE...' : 'SINTETIZAR RONCO DO MOTOR'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
