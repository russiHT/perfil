import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Radio as RadioIcon, Minimize2, Maximize2, Move, Youtube } from 'lucide-react';

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

export default function CyberpunkRadio({ globalMute = false }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [localMute, setLocalMute] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const effectiveMute = globalMute || localMute;

  // Draggable State with Inertial Momentum Physics
  const [pos, setPos] = useState({ x: window.innerWidth - 320, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const velRef = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const posRef = useRef(pos);
  posRef.current = pos;

  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      initPlayer(TRACKS[0].youtubeId);
    };

    if (window.YT && window.YT.Player) {
      initPlayer(TRACKS[currentTrackIndex].youtubeId);
    }
  }, []);

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
                handleNext();
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
          const maxX = window.innerWidth - (isMinimized ? 220 : 300);
          const minY = 10;
          const maxY = window.innerHeight - 100;

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

      const radioWidth = isMinimized ? 210 : 290;
      const radioHeight = isMinimized ? 50 : 120;
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
  }, [isDragging, isMinimized]);

  const handleMouseDown = (e) => {
    if (e.target.closest('button, input, iframe, a')) return;
    setIsDragging(true);
    velRef.current = { x: 0, y: 0 };
    dragStart.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newVx = (e.clientX - prevMousePos.current.x) * 1.8;
      const newVy = (e.clientY - prevMousePos.current.y) * 1.8;
      velRef.current = { x: newVx, y: newVy };
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      const newX = Math.max(10, Math.min(window.innerWidth - 240, e.clientX - dragStart.current.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 90, e.clientY - dragStart.current.y));
      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

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

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 120,
        width: isMinimized ? '210px' : '290px',
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
                className="terminal-link"
                style={{ padding: '5px 8px' }}
                title="Anterior"
              >
                <SkipBack size={13} />
              </button>

              <button
                onClick={togglePlay}
                className="terminal-link"
                style={{ padding: '6px 12px', background: 'var(--amber-primary)', color: '#0d0a00' }}
                title={isPlaying ? "Pausar" : "Tocar"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={handleNext}
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
                style={{ background: 'none', border: 'none', color: 'var(--amber-primary)', cursor: 'pointer', padding: '2px' }}
              >
                {effectiveMute || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <input
                type="range"
                min="0"
                max="100"
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
