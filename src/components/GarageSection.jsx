import React, { useState } from 'react';
import { Gauge, Cpu, Flame, Moon, Sparkles, Sliders, ChevronRight, Zap } from 'lucide-react';

const GARAGE_CARS = [
  {
    id: 'gol-gti',
    name: 'Volkswagen Gol GTI 2.0',
    category: 'Nacional / Ícone dos Anos 90',
    engine: '2.0 AP 8000 (Injeção EEC-IV)',
    power: '120 CV @ 5600 RPM',
    torque: '17.5 Kgfm @ 3200 RPM',
    trans: 'Manual 5 Marchas',
    drive: 'FWD (Tração Dianteira)',
    topSpeed: '185 km/h',
    desc: 'O primeiro carro brasileiro com injeção eletrônica de fábrica e painel satélite clássico.',
    specs: [
      { label: 'Cilindrada', val: '1.984 cc AP' },
      { label: 'Redline', val: '6.500 RPM' },
      { label: 'Peso', val: '1.020 kg' },
      { label: '0-100 km/h', val: '8.8s' }
    ]
  },
  {
    id: 'opala',
    name: 'Chevrolet Opala Comodoro 4.1',
    category: 'Nacional / 6 Cilindros Clássico',
    engine: '4.1L 250-S 6 Cilindros em Linha',
    power: '171 CV @ 4800 RPM',
    torque: '32.5 Kgfm @ 2600 RPM',
    trans: 'Manual 5 Marchas',
    drive: 'RWD (Tração Traseira)',
    topSpeed: '190 km/h',
    desc: 'O lendário 6 cilindros em linha brasileiro com ronco inconfundível e tração traseira raiz.',
    specs: [
      { label: 'Cilindrada', val: '4.093 cc L6' },
      { label: 'Redline', val: '5.500 RPM' },
      { label: 'Peso', val: '1.380 kg' },
      { label: '0-100 km/h', val: '9.5s' }
    ]
  },
  {
    id: 'uno-turbo',
    name: 'Fiat Uno Turbo i.e. 1.4',
    category: 'Nacional / Pocket Rocket',
    engine: '1.4L Turbo i.e. Garrett T2',
    power: '118 CV @ 5750 RPM',
    torque: '17.3 Kgfm @ 3500 RPM',
    trans: 'Manual 5 Marchas',
    drive: 'FWD (Tração Dianteira)',
    topSpeed: '195 km/h',
    desc: 'O lendário esportivo compacto turbinado de fábrica no Brasil nos anos 90.',
    specs: [
      { label: 'Cilindrada', val: '1.372 cc Turbo' },
      { label: 'Redline', val: '6.800 RPM' },
      { label: 'Peso', val: '975 kg' },
      { label: '0-100 km/h', val: '7.9s' }
    ]
  },
  {
    id: 'astra',
    name: 'Chevrolet Astra 2.0 16V (Stage 2)',
    category: 'Nacional / Street Project',
    engine: '2.0 16V Família II',
    power: '165 CV @ 6000 RPM',
    torque: '21.0 Kgfm @ 4000 RPM',
    trans: 'Manual 5 Marchas F23',
    drive: 'FWD (Tração Dianteira)',
    topSpeed: '215 km/h',
    desc: 'Projeto nacional com coletor 4x1 em inox, escapamento esportivo e acerto na injeção.',
    specs: [
      { label: 'Cilindrada', val: '1.998 cc 16V' },
      { label: 'Redline', val: '7.200 RPM' },
      { label: 'Modificações', val: 'Coletor 4x1 + Remap' },
      { label: '0-100 km/h', val: '8.2s' }
    ]
  }
];

export default function GarageSection({ isNightDrive, onToggleNightDrive }) {
  const [selectedCar, setSelectedCar] = useState(GARAGE_CARS[0]);

  const garageMetrics = [
    { label: 'MOTORIZADORAS', val: 'TURBO & AP 2.0 / 6 CIL', icon: Cpu },
    { label: 'CÂMBIO', val: 'MANUAL PREFERIDO', icon: Sliders },
    { label: 'REDLINE MAX', val: '7.200 RPM', icon: Flame },
    { label: 'ESTILO', val: 'NACIONAIS & BRASILEIROS', icon: Gauge }
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
    } catch (e) { }
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
            ## garage_specs
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
            fontWeight: '800',
            minWidth: '240px',
            justifyContent: 'center'
          }}
          title="Alternar Modo Piloto Noturno (Highway Night Cruise Background)"
        >
          <Moon size={15} />
          <span>{isNightDrive ? 'NIGHT DRIVE: ATIVO' : 'NIGHT DRIVE: DESATIVADO'}</span>
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
