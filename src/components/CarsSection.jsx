import React, { useState } from 'react';
import { Gauge, Zap, Disc, Volume2, Cpu, Wrench, X, Award } from 'lucide-react';

const GARAGE_CARS = [
  {
    id: 'nissan-gtr',
    name: 'Nissan Skyline GT-R (R32 / R34)',
    era: '1989 - 2002',
    category: 'JDM Legend / AWD',
    engine: '2.6L Twin-Turbo (RB26DETT)',
    power: '280 HP @ 6800 RPM',
    torque: '392 Nm @ 4400 RPM',
    drivetrain: 'ATTESA E-TS AWD',
    desc: 'Lenda do automobilismo de alta tecnologia dos anos 90 com tração inteligente e sistema HICAS de esterçamento nas 4 rodas.',
    revFreq: [180, 450, 850, 320]
  },
  {
    id: 'opala-ss',
    name: 'Chevrolet Opala SS 4.1L',
    era: '1971 - 1980',
    category: 'Muscle Car / Clássico BR',
    engine: '4.1L 250-S 6-Cilindros em Linha',
    power: '171 HP @ 4800 RPM',
    torque: '320 Nm @ 2600 RPM',
    drivetrain: 'Traseira (RWD)',
    desc: 'Clássico nacional dos anos 70 com o icônico motor 250-S de 6 cilindros, tuchos mecânicos e ronco inconfundível.',
    revFreq: [120, 280, 550, 220]
  },
  {
    id: 'gol-gts',
    name: 'Volkswagen Gol Quadrado GTS / GTI',
    era: '1987 - 1994',
    category: 'Hot Hatch / Clássico BR',
    engine: '2.0L AP 2000 (Injeção Eletrônica LE-Jetronic)',
    power: '120 HP @ 5600 RPM',
    torque: '175 Nm @ 3200 RPM',
    drivetrain: 'Dianteira (FWD)',
    desc: 'O primeiro carro nacional com injeção eletrônica de combustível. Desempenho ágil, painel de instrumentos esportivo e volante de quatro bolas.',
    revFreq: [150, 380, 700, 260]
  },
  {
    id: 'rx7-fd',
    name: 'Mazda RX-7 (FD3S)',
    era: '1992 - 2002',
    category: 'Rotary Turbo / JDM',
    engine: '1.3L Twin-Rotary Wankel (13B-REW)',
    power: '255 HP @ 6500 RPM',
    torque: '294 Nm @ 5000 RPM',
    drivetrain: 'Traseira (RWD)',
    desc: 'Engenharia pura com motor rotativo Wankel bi-turbo sequencial e distribuição de peso perfeita 50:50.',
    revFreq: [220, 600, 1100, 400]
  }
];

export default function CarsSection() {
  const [selectedCar, setSelectedCar] = useState(null);

  // Web Audio engine sound synthesizer
  const playEngineRevSound = (revFreqs) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      let now = audioCtx.currentTime;

      osc.frequency.setValueAtTime(revFreqs[0], now);
      osc.frequency.exponentialRampToValueAtTime(revFreqs[1], now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(revFreqs[2], now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(revFreqs[3], now + 1.4);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {}
  };

  return (
    <section style={{ marginBottom: '80px' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: 'var(--amber-soft-glow)',
          border: '1px solid var(--border-amber)',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: 'var(--amber-bright)',
          fontWeight: '800',
          letterSpacing: '1px',
          marginBottom: '12px'
        }}
      >
        // GARAGEM RETRÔ & ENGENHARIA AUTOMOTIVA
      </div>

      <h2
        className="amber-glow-text"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: '700',
          marginBottom: '14px',
          lineHeight: 1.2
        }}
      >
        ## carros_ & motores
      </h2>

      <p style={{ color: 'var(--amber-dim)', fontSize: '0.98rem', marginBottom: '36px', maxWidth: '720px' }}>
        &gt; admiração por engenharia mecânica, roncos de motores clássicos e carros com personalidade.
      </p>

      {/* Cars Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {GARAGE_CARS.map((car) => (
          <div
            key={car.id}
            className="terminal-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '800', letterSpacing: '1px' }}>
                  {car.era}
                </span>
                <span style={{ fontSize: '0.72rem', background: 'var(--amber-soft-glow)', padding: '2px 8px', borderRadius: '4px', color: 'var(--amber-bright)', fontWeight: '800' }}>
                  {car.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--amber-bright)', marginBottom: '12px' }}>
                {car.name}
              </h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--amber-primary)', lineHeight: 1.6, marginBottom: '16px', opacity: 0.9 }}>
                {car.desc}
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', marginBottom: '20px', borderTop: '1px dashed var(--border-amber)', paddingTop: '12px' }}>
                <div>
                  <span style={{ color: 'var(--amber-dim)' }}>MOTOR:</span>
                  <div style={{ color: 'var(--amber-bright)', fontWeight: '700' }}>{car.engine}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--amber-dim)' }}>POTÊNCIA:</span>
                  <div style={{ color: 'var(--amber-bright)', fontWeight: '700' }}>{car.power}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--amber-dim)' }}>TORQUE:</span>
                  <div style={{ color: 'var(--amber-bright)', fontWeight: '700' }}>{car.torque}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--amber-dim)' }}>TRAÇÃO:</span>
                  <div style={{ color: 'var(--amber-bright)', fontWeight: '700' }}>{car.drivetrain}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => playEngineRevSound(car.revFreq)}
                className="terminal-link"
                style={{ padding: '6px 12px', fontSize: '0.76rem', flex: 1, justifyContent: 'center' }}
                title="Sintetizar Ronco do Motor via Web Audio API"
              >
                <Volume2 size={13} />
                <span>RONCO DO MOTOR</span>
              </button>

              <button
                onClick={() => setSelectedCar(car)}
                className="terminal-link"
                style={{ padding: '6px 12px', fontSize: '0.76rem', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
              >
                <Gauge size={13} />
                <span>TELEMETRIA</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Car Telemetry Detail Modal */}
      {selectedCar && (
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
              maxWidth: '560px',
              background: 'rgba(14, 10, 2, 0.98)',
              border: '1px solid var(--border-amber)',
              boxShadow: '0 0 50px var(--amber-glow)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-amber)', pb: '12px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--amber-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={18} />
                <span>TELEMETRIA & DADOS TÉCNICOS</span>
              </div>

              <button onClick={() => setSelectedCar(null)} className="terminal-link" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                <X size={14} />
                <span>FECHAR</span>
              </button>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--amber-bright)', marginBottom: '6px' }}>
              {selectedCar.name}
            </h3>

            <div style={{ fontSize: '0.8rem', color: 'var(--amber-dim)', marginBottom: '16px' }}>
              ERA: {selectedCar.era} // CATEGORIA: {selectedCar.category}
            </div>

            {/* Dyno Spec Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '20px', background: '#070500', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-amber)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>&gt; MOTOR & ASPIRAÇÃO:</span>
                <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.95rem' }}>{selectedCar.engine}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>&gt; POTÊNCIA MÁXIMA:</span>
                <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.95rem' }}>{selectedCar.power}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>&gt; TORQUE MÁXIMO:</span>
                <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.95rem' }}>{selectedCar.torque}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>&gt; SISTEMA DE TRAÇÃO:</span>
                <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.95rem' }}>{selectedCar.drivetrain}</div>
              </div>
            </div>

            {/* Sound Synthesizer Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => playEngineRevSound(selectedCar.revFreq)}
                className="terminal-link"
                style={{ padding: '8px 18px', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
              >
                <Volume2 size={15} />
                <span>TESTAR RONCO DO MOTOR</span>
              </button>

              <span style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>
                perfil v2.1 // russiHT
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
