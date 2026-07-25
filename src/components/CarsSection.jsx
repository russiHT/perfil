import React, { useState, useRef } from 'react';
import { Gauge, Volume2, X, Play, Pause, Disc, Award } from 'lucide-react';

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
    youtubeAudioId: 'Z-dG7P2vS_A',
    audioTitle: 'Nissan Skyline GT-R RB26DETT Twin-Turbo Engine Sound'
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
    youtubeAudioId: '1t4K44g4K-w',
    audioTitle: 'Chevrolet Opala 4.1L 250-S 6-Cilindros Ronco Real'
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
    youtubeAudioId: '6rY6_6k90kw',
    audioTitle: 'VW Gol GTS AP 2.0 Ronco do Motor & Aceleração'
  },
  {
    id: 'lexus-lfa',
    name: 'Lexus LFA (LFA10)',
    era: '2010 - 2012',
    category: 'V10 Supercar / JDM',
    engine: '4.8L V10 N/A (1LR-GUE com acústica Yamaha)',
    power: '560 HP @ 8700 RPM',
    torque: '480 Nm @ 6800 RPM',
    drivetrain: 'Traseira (RWD) com Transaxle',
    desc: 'Superesportivo com o motor V10 de aspiração natural mais sinfônico do mundo projetado em parceria com a divisão musical da Yamaha. Sobe de 0 a 9000 RPM em incríveis 0.6s.',
    youtubeAudioId: 'p6ZD1M32_8w',
    audioTitle: 'Lexus LFA 4.8L V10 9000 RPM Yamaha Scream Sound'
  },
  {
    id: 'rx7-fc',
    name: 'Mazda RX-7 Savanna (FC3S)',
    era: '1985 - 1992',
    category: 'Rotary Turbo / Pop-Up Headlights',
    engine: '1.3L Turbo Rotary Wankel (13B-DEI)',
    power: '205 HP @ 6500 RPM',
    torque: '270 Nm @ 3500 RPM',
    drivetrain: 'Traseira (RWD)',
    desc: 'Ícone dos anos 80 com faróis escamoteáveis pop-up, chassi equilibrado e o icônico motor rotativo Wankel turbo de alta aceleração.',
    youtubeAudioId: 'm0Y_J4pX-94',
    audioTitle: 'Mazda RX-7 FC3S 13B Turbo Wankel Rotary Sound'
  },
  {
    id: 'rx7-fd',
    name: 'Mazda RX-7 Spirit R (FD3S)',
    era: '1992 - 2002',
    category: 'Rotary Turbo / JDM',
    engine: '1.3L Twin-Rotary Wankel (13B-REW)',
    power: '280 HP @ 6500 RPM',
    torque: '314 Nm @ 5000 RPM',
    drivetrain: 'Traseira (RWD)',
    desc: 'Engenharia pura com motor rotativo Wankel bi-turbo sequencial, bancos Recaro em carbono e distribuição de peso perfeita 50:50.',
    youtubeAudioId: 'm0Y_J4pX-94',
    audioTitle: 'Mazda RX-7 FD3S Twin-Rotary Wankel Sound'
  }
];

export default function CarsSection() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [playingAudioCar, setPlayingAudioCar] = useState(null);

  const handlePlayRealAudio = (car) => {
    if (playingAudioCar && playingAudioCar.id === car.id) {
      setPlayingAudioCar(null);
    } else {
      setPlayingAudioCar(car);
    }
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

      {/* Playing Audio Notification Banner */}
      {playingAudioCar && (
        <div
          className="terminal-card"
          style={{
            marginBottom: '24px',
            padding: '16px 20px',
            border: '1px solid var(--amber-primary)',
            boxShadow: '0 0 30px var(--amber-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Volume2 size={20} color="var(--amber-bright)" className="crt-flicker" />
            <div>
              <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.92rem' }}>
                &gt; TOCANDO RONCO REAL DO MOTOR: {playingAudioCar.name}
              </div>
              <div style={{ color: 'var(--amber-dim)', fontSize: '0.78rem', marginTop: '2px' }}>
                {playingAudioCar.engine} ({playingAudioCar.audioTitle})
              </div>
            </div>
          </div>

          <button
            onClick={() => setPlayingAudioCar(null)}
            className="terminal-link"
            style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
          >
            <X size={14} />
            <span>PAUSAR RONCO</span>
          </button>

          {/* Hidden YouTube Iframe Audio Player */}
          <div style={{ position: 'absolute', opacity: 0.01, pointerEvents: 'none', width: '1px', height: '1px', overflow: 'hidden' }}>
            <iframe
              width="1"
              height="1"
              src={`https://www.youtube.com/embed/${playingAudioCar.youtubeAudioId}?autoplay=1&controls=0`}
              title="Real Engine Sound Audio"
              allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* Cars Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {GARAGE_CARS.map((car) => {
          const isAudioPlaying = playingAudioCar && playingAudioCar.id === car.id;
          return (
            <div
              key={car.id}
              className="terminal-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isAudioPlaying ? '1px solid var(--amber-bright)' : '1px solid var(--border-amber)',
                boxShadow: isAudioPlaying ? '0 0 35px var(--amber-glow)' : 'none'
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
                  onClick={() => handlePlayRealAudio(car)}
                  className="terminal-link"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.76rem',
                    flex: 1,
                    justifyContent: 'center',
                    background: isAudioPlaying ? 'var(--amber-bright)' : 'var(--amber-soft-glow)',
                    color: isAudioPlaying ? '#070500' : 'var(--amber-primary)',
                    fontWeight: '800'
                  }}
                  title="Ouvir Ronco Real Autêntico do Motor"
                >
                  {isAudioPlaying ? <Pause size={13} /> : <Volume2 size={13} />}
                  <span>{isAudioPlaying ? 'PAUSAR RONCO' : 'RONCO REAL DO MOTOR'}</span>
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
          );
        })}
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

            {/* Real Audio Synthesizer Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={() => handlePlayRealAudio(selectedCar)}
                className="terminal-link"
                style={{ padding: '8px 18px', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
              >
                <Volume2 size={15} />
                <span>{playingAudioCar && playingAudioCar.id === selectedCar.id ? 'PAUSAR RONCO REAL' : 'OUVIR RONCO REAL DO MOTOR'}</span>
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
