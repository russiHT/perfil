import React, { useState } from 'react';
import { Gauge, Cpu, Flame, Moon, Sparkles, Sliders, ChevronRight, Zap } from 'lucide-react';

const GARAGE_CARS = [
  {
    id: 'r34',
    name: 'Nissan Skyline GT-R (BNR34)',
    category: 'JDM Legend',
    engine: 'RB26DETT Twin-Turbo',
    power: '320 CV @ 6800 RPM',
    torque: '40.0 Kgfm @ 4400 RPM',
    trans: '6-Speed Manual Getrag',
    drive: 'ATTESA E-TS Pro AWD',
    topSpeed: '250 km/h (Limitado)',
    desc: 'O ícone supremo do automobilismo japonês com tração integral inteligente e duplo turbo.',
    specs: [
      { label: 'Cilindrada', val: '2.568 cc L6' },
      { label: 'Redline', val: '8.000 RPM' },
      { label: 'Peso', val: '1.560 kg' },
      { label: '0-100 km/h', val: '4.8s' }
    ]
  },
  {
    id: 'rx7',
    name: 'Mazda RX-7 Spirit R (FD3S)',
    category: 'Rotary Legend',
    engine: '13B-REW Sequential Twin-Turbo Wankel',
    power: '280 CV @ 6500 RPM',
    torque: '32.0 Kgfm @ 5000 RPM',
    trans: '5-Speed Manual',
    drive: 'RWD com LSD Torsen',
    topSpeed: '255 km/h',
    desc: 'Motor rotativo Wankel bi-turbo sequencial com distribuição de peso perfeita 50:50.',
    specs: [
      { label: 'Cilindrada', val: '1.308 cc (Rotativo)' },
      { label: 'Redline', val: '8.200 RPM' },
      { label: 'Peso', val: '1.270 kg' },
      { label: '0-100 km/h', val: '5.1s' }
    ]
  },
  {
    id: 'porsche911',
    name: 'Porsche 911 Turbo (930)',
    category: 'Euro Classic',
    engine: '3.3L Flat-6 Air-Cooled Turbo',
    power: '300 CV @ 5500 RPM',
    torque: '41.2 Kgfm @ 4000 RPM',
    trans: '4-Speed Manual Heavy Duty',
    drive: 'RWD (Motor Traseiro)',
    topSpeed: '260 km/h',
    desc: 'A lendária "Widowmaker" alemã com turbocompressor de resposta brutal e tração traseira puro sangue.',
    specs: [
      { label: 'Cilindrada', val: '3.299 cc Flat-6' },
      { label: 'Redline', val: '6.700 RPM' },
      { label: 'Peso', val: '1.335 kg' },
      { label: '0-100 km/h', val: '5.0s' }
    ]
  },
  {
    id: 'hot-hatch',
    name: 'Volkswagen Golf GTI (Stage 2)',
    category: 'Hot Hatch / Daily Project',
    engine: '2.0 TSI EA888 Gen 3',
    power: '310 CV @ 5800 RPM',
    torque: '45.0 Kgfm @ 2500 RPM',
    trans: '6-Speed DSG / Manual',
    drive: 'FWD com Blocante VAQ',
    topSpeed: '270 km/h',
    desc: 'Projeto street com remap Stage 2, downpipe em inox, intake esportivo e pop & bangs no mapa.',
    specs: [
      { label: 'Cilindrada', val: '1.984 cc Turbo' },
      { label: 'Redline', val: '7.000 RPM' },
      { label: 'Modificações', val: 'Downpipe + Remap' },
      { label: '0-100 km/h', val: '5.2s' }
    ]
  }
];

export default function GarageSection({ isNightDrive, onToggleNightDrive }) {
  const [selectedCar, setSelectedCar] = useState(GARAGE_CARS[0]);

  const garageMetrics = [
    { label: 'MOTORIZADORAS', val: 'TURBO & ROTATIVO', icon: Cpu },
    { label: 'CÂMBIO', val: 'MANUAL PREFERIDO', icon: Sliders },
    { label: 'REDLINE MAX', val: '8.200 RPM', icon: Flame },
    { label: 'ESTILO', val: 'JDM & HOT HATCH', icon: Gauge }
  ];

  const playRevBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  return (
    <section style={{ marginBottom: '80px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2
            className="amber-glow-text"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '4px'
            }}
          >
            ## garage_specs // telemetria automotiva
          </h2>
          <p style={{ color: 'var(--amber-dim)', fontSize: '0.88rem' }}>
            coisas que fazem barulho quando carregam, motores, modificações e telemetria.
          </p>
        </div>

        {/* Night Drive Mode Toggle Button */}
        <button
          onClick={() => {
            onToggleNightDrive();
            playRevBeep();
          }}
          className="terminal-link"
          style={{
            padding: '8px 16px',
            fontSize: '0.82rem',
            background: isNightDrive ? 'var(--amber-primary)' : 'var(--amber-soft-glow)',
            color: isNightDrive ? '#070500' : 'var(--amber-primary)',
            fontWeight: '800'
          }}
          title="Alternar Modo Piloto Noturno (Highway Night Cruise Background)"
        >
          <Moon size={15} />
          <span>{isNightDrive ? 'MODO NIGHT DRIVE: ATIVO' : 'MODO NIGHT DRIVE: DESATIVADO'}</span>
        </button>
      </div>

      {/* Garage Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {garageMetrics.map((m) => {
          const IconComp = m.icon;
          return (
            <div key={m.label} className="terminal-card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconComp size={13} />
                {m.label}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--amber-bright)' }}>
                {m.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Car Selection & Telemetry Specs Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Car List Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '4px' }}>
            &gt; SELECIONE O VEÍCULO DA GARAGEM:
          </div>

          {GARAGE_CARS.map((car) => {
            const isSelected = selectedCar.id === car.id;
            return (
              <button
                key={car.id}
                onClick={() => {
                  setSelectedCar(car);
                  playRevBeep();
                }}
                className="terminal-card"
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  border: isSelected ? '1px solid var(--amber-bright)' : '1px solid var(--border-amber)',
                  background: isSelected ? 'var(--amber-soft-glow)' : 'rgba(14, 10, 2, 0.75)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700' }}>
                    {car.category}
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '800', color: isSelected ? 'var(--amber-bright)' : 'var(--amber-primary)', marginTop: '2px' }}>
                    {car.name}
                  </div>
                </div>
                <ChevronRight size={16} color={isSelected ? 'var(--amber-bright)' : 'var(--amber-dim)'} />
              </button>
            );
          })}
        </div>

        {/* Selected Car Telemetry Ficha Técnica */}
        <div
          className="terminal-card"
          style={{
            padding: '24px',
            background: 'rgba(14, 10, 2, 0.95)',
            border: '1px solid var(--border-amber)',
            boxShadow: '0 0 30px var(--amber-soft-glow)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-amber)', pb: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--amber-dim)', fontWeight: '700' }}>TELEMETRIA // </span>
                <span style={{ fontSize: '0.95rem', color: 'var(--amber-bright)', fontWeight: '900' }}>{selectedCar.name}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--amber-primary)', background: 'var(--amber-soft-glow)', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
                {selectedCar.category}
              </span>
            </div>

            <p style={{ color: 'var(--amber-primary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px', opacity: 0.9 }}>
              {selectedCar.desc}
            </p>

            {/* Car Specs Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ borderLeft: '2px solid var(--amber-primary)', paddingLeft: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700' }}>MOTORIZAÇÃO</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--amber-bright)' }}>{selectedCar.engine}</div>
              </div>

              <div style={{ borderLeft: '2px solid var(--amber-primary)', paddingLeft: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700' }}>POTÊNCIA</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--amber-bright)' }}>{selectedCar.power}</div>
              </div>

              <div style={{ borderLeft: '2px solid var(--amber-primary)', paddingLeft: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700' }}>TORQUE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--amber-bright)' }}>{selectedCar.torque}</div>
              </div>

              <div style={{ borderLeft: '2px solid var(--amber-primary)', paddingLeft: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700' }}>TRANSMISSÃO</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--amber-bright)' }}>{selectedCar.trans}</div>
              </div>
            </div>

            {/* Quick Specs Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              {selectedCar.specs.map(s => (
                <div key={s.label} style={{ background: '#070500', border: '1px solid var(--border-amber)', padding: '8px 4px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--amber-dim)', fontWeight: '700' }}>{s.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--amber-bright)', fontWeight: '800', marginTop: '2px' }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--amber-dim)' }}>
            <span>&gt; TRAÇÃO: {selectedCar.drive}</span>
            <span>VEL. MÁX: {selectedCar.topSpeed}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
