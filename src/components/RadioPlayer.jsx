import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Minimize2, Maximize2, Move, Youtube } from 'lucide-react';
import { useLatest } from '../hooks/useLatest';

const TRACKS = [
  {
    title: "dazegxd — emotion engine",
    artist: "dazegxd",
    youtubeId: "oIYlSJPMQ38"
  },
  {
    title: "dazegxd — idk what love is",
    artist: "dazegxd",
    youtubeId: "X0ArmTeJN84"
  },
  {
    title: "rusino — looping the rooms",
    artist: "rusino",
    youtubeId: "icBDYkfxpMs"
  }
];

export default function RadioPlayer({ globalMute = false }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [localMute, setLocalMute] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const effectiveMute = globalMute || localMute;

  // Dimensões do card, usadas para manter o player dentro da tela.
  const radioWidth = isMinimized ? 210 : 290;
  const radioHeight = isMinimized ? 50 : 120;

  // Draggable State with Inertial Momentum Physics
  // Em telas estreitas `innerWidth - 320` daria um valor negativo e o player
  // nasceria fora da viewport — por isso o clamp já na posição inicial.
  const [pos, setPos] = useState(() => ({
    x: Math.max(10, window.innerWidth - 320),
    y: Math.max(10, window.innerHeight - 200)
  }));
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const velRef = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const posRef = useLatest(pos);

  const playerRef = useRef(null);

  // O callback `onStateChange` do YouTube é registrado UMA vez e congela o
  // escopo daquele render. Sem estes refs, `handleNext` enxergaria para sempre
  // currentTrackIndex === 0 e o avanço automático nunca passaria da faixa 2.
  const currentTrackIndexRef = useLatest(currentTrackIndex);
  const handleNextRef = useRef(null);


  const initPlayer = (videoId) => {
    if (playerRef.current) return;
    try {
      playerRef.current = new window.YT.Player('yt-radio-player', {
        height: '1',
        width: '1',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(effectiveMute ? 0 : volume);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              if (event.data === window.YT.PlayerState.ENDED) {
                handleNextRef.current?.();
              }
            }
          }
        }
      });
    } catch (e) {
      // YT API fallback
    }
  };

  useEffect(() => {
    let cancelled = false;

    const setup = () => {
      if (!cancelled) initPlayer(TRACKS[currentTrackIndexRef.current].youtubeId);
    };

    if (window.YT && window.YT.Player) {
      setup();
      return () => { cancelled = true; };
    }

    // Encadeia o callback global em vez de sobrescrevê-lo: outro script na
    // página (ou um segundo mount em StrictMode) não é mais atropelado.
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') previousCallback();
      setup();
    };

    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    return () => { cancelled = true; };
  }, [currentTrackIndexRef]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(effectiveMute ? 0 : volume);
    }
  }, [volume, effectiveMute]);

  // Inertia Glide Loop & Dispatch Radio Coordinates to 3D Sphere
  useEffect(() => {
    let animId;

    const updatePhysics = () => {
      if (!isDragging) {
        let { x, y } = posRef.current;
        let { x: vx, y: vy } = velRef.current;

        if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
          x += vx;
          y += vy;

          velRef.current.x *= 0.965;
          velRef.current.y *= 0.965;

          const minX = 10;
          const maxX = Math.max(minX, window.innerWidth - radioWidth - 10);
          const minY = 10;
          const maxY = Math.max(minY, window.innerHeight - radioHeight - 10);

          if (x < minX || x > maxX) {
            velRef.current.x *= -0.75;
            x = Math.max(minX, Math.min(maxX, x));
          }
          if (y < minY || y > maxY) {
            velRef.current.y *= -0.75;
            y = Math.max(minY, Math.min(maxY, y));
          }

          setPos({ x, y });
        }
      }

      const centerX = posRef.current.x + radioWidth / 2;
      const centerY = posRef.current.y + radioHeight / 2;

      window.dispatchEvent(new CustomEvent('radio-move', {
        detail: {
          x: centerX,
          y: centerY,
          vx: velRef.current.x,
          vy: velRef.current.y
        }
      }));

      animId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();
    return () => cancelAnimationFrame(animId);
  }, [isDragging, isMinimized, radioWidth, radioHeight, posRef]);

  // Pointer Events cobrem mouse, toque e caneta com um único caminho de
  // código — antes o arrasto era só de mouse e o player era inarrastável
  // em celular e tablet.
  const handlePointerDown = (e) => {
    if (e.target.closest('button, input, iframe, a')) return;
    setIsDragging(true);
    velRef.current = { x: 0, y: 0 };
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const handlePointerMove = (e) => {
      velRef.current = {
        x: (e.clientX - prevMousePos.current.x) * 1.8,
        y: (e.clientY - prevMousePos.current.y) * 1.8
      };
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      const maxX = Math.max(10, window.innerWidth - radioWidth - 10);
      const maxY = Math.max(10, window.innerHeight - radioHeight - 10);
      setPos({
        x: Math.max(10, Math.min(maxX, e.clientX - dragStart.current.x)),
        y: Math.max(10, Math.min(maxY, e.clientY - dragStart.current.y))
      });
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [isDragging, radioWidth, radioHeight]);

  // Ao redimensionar a janela o player podia ficar preso fora da viewport.
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => ({
        x: Math.max(10, Math.min(prev.x, window.innerWidth - radioWidth - 10)),
        y: Math.max(10, Math.min(prev.y, window.innerHeight - radioHeight - 10))
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radioWidth, radioHeight]);

  const togglePlay = () => {
    if (!playerRef.current || !playerRef.current.playVideo) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const changeTrack = (newIndex) => {
    setCurrentTrackIndex(newIndex);
    const track = TRACKS[newIndex];

    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(track.youtubeId);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    changeTrack(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    changeTrack(prevIdx);
  };

  // Mantém o ref apontando para a versão atual, lida pelo callback do YouTube.
  // A escrita fica num efeito: mexer em refs durante o render não é seguro.
  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 120,
        width: `${radioWidth}px`,
        maxWidth: 'calc(100vw - 20px)',
        touchAction: 'none',
        background: 'rgba(18, 13, 2, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-amber)',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: isDragging
          ? '0 15px 45px var(--amber-glow), 0 0 30px var(--amber-soft-glow)'
          : '0 10px 35px rgba(0, 0, 0, 0.85), 0 0 25px var(--amber-soft-glow)',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease'
      }}
    >
      {/* Hidden YouTube IFrame Container */}
      <div style={{ position: 'absolute', opacity: 0.01, pointerEvents: 'none', width: '1px', height: '1px', overflow: 'hidden' }}>
        <div id="yt-radio-player" />
      </div>

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isMinimized ? '0' : '10px',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--amber-bright)', fontSize: '0.8rem', fontWeight: '800' }}>
          <Move size={13} style={{ opacity: 0.6 }} />
          <Youtube size={15} color="#ff0000" />
          <span>RADIO [{currentTrackIndex + 1}/{TRACKS.length}]</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Animated Equalizer Wave Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '12px' }}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={isPlaying && !effectiveMute ? 'eq-bar-playing' : ''}
                style={{
                  width: '3px',
                  height: isPlaying && !effectiveMute ? '12px' : '3px',
                  backgroundColor: 'var(--amber-primary)',
                  animationDelay: `${idx * 0.12}s`,
                  transition: 'height 0.2s ease'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expandir rádio' : 'Minimizar rádio'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--amber-primary)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isMinimized ? "Expandir Rádio" : "Minimizar"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Track Controls */}
      {!isMinimized && (
        <>
          {/* Track Info */}
          <div style={{ marginBottom: '12px', borderLeft: '2px solid var(--amber-primary)', paddingLeft: '8px' }}>
            <div style={{ color: 'var(--amber-bright)', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.title}
            </div>
            <div style={{ color: 'var(--amber-dim)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{currentTrack.artist}</span>
              <a
                href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--amber-primary)', textDecoration: 'underline', opacity: 0.8 }}
              >
                (Abrir no YouTube)
              </a>
            </div>
          </div>

          {/* Control Buttons & Volume */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handlePrev}
                aria-label="Faixa anterior"
                className="terminal-link"
                style={{ padding: '5px 8px' }}
                title="Anterior"
              >
                <SkipBack size={13} />
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar' : 'Tocar'}
                className="terminal-link"
                style={{ padding: '6px 12px', background: 'var(--amber-primary)', color: '#0d0a00' }}
                title={isPlaying ? "Pausar" : "Tocar"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={handleNext}
                aria-label="Próxima faixa"
                className="terminal-link"
                style={{ padding: '5px 8px' }}
                title="Próxima"
              >
                <SkipForward size={13} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setLocalMute(!localMute)}
                aria-label={effectiveMute ? 'Ativar som do rádio' : 'Silenciar rádio'}
                style={{ background: 'none', border: 'none', color: 'var(--amber-primary)', cursor: 'pointer', padding: '2px' }}
              >
                {effectiveMute || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                aria-label="Volume do rádio"
                step="5"
                value={effectiveMute ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value, 10));
                  if (localMute) setLocalMute(false);
                }}
                style={{
                  accentColor: 'var(--amber-primary)',
                  width: '55px',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
