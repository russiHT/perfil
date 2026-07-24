import React, { useEffect, useRef } from 'react';
import { animate, set } from 'animejs';

export default function Anime3DGridBg() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const rows = 12;
  const cols = 20;
  const totalNodes = rows * cols;

  useEffect(() => {
    const gridEl = gridRef.current;
    const container = containerRef.current;
    if (!gridEl || !container) return;

    const nodes = Array.from(gridEl.children);

    // 1. Anime.js v4 Signature 3D Staggered Wave Animation (from animejs.com concept)
    const waveAnim = animate(nodes, {
      translateZ: [
        { value: -60, duration: 1400 },
        { value: 60, duration: 1400 }
      ],
      scale: [
        { value: 0.5, duration: 1400 },
        { value: 1.4, duration: 1400 }
      ],
      opacity: [
        { value: 0.2, duration: 1400 },
        { value: 0.95, duration: 1400 }
      ],
      rotateZ: [
        { value: '0.5turn', duration: 2800 }
      ],
      delay: (el, i) => {
        const x = i % cols;
        const y = Math.floor(i / cols);
        const centerX = cols / 2;
        const centerY = rows / 2;
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return dist * 180;
      },
      ease: 'inOutSine',
      loop: true,
      direction: 'alternate'
    });

    // 2. Scroll-Driven 3D Perspective Rotation
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollFraction = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);

      set(container, {
        rotateX: 55 + scrollFraction * 25, // 3D Tilt grid
        rotateZ: -20 + scrollFraction * 30,
        translateZ: scrollFraction * 120
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (waveAnim && waveAnim.pause) waveAnim.pause();
    };
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        perspective: '1000px',
        background: '#0a0800'
      }}
    >
      {/* Anime.js 3D Grid Stage Container */}
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '1400px',
          height: '900px',
          transform: 'translate(-50%, -50%) rotateX(60deg) rotateZ(-20deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s linear'
        }}
      >
        {/* 3D Matrix Nodes Grid */}
        <div 
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: '24px',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d'
          }}
        >
          {Array.from({ length: totalNodes }).map((_, i) => (
            <div 
              key={i}
              className="anime-3d-node"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '3px',
                background: 'var(--amber-primary)',
                boxShadow: '0 0 16px var(--amber-glow)',
                margin: 'auto',
                transformStyle: 'preserve-3d'
              }}
            />
          ))}
        </div>
      </div>

      {/* Cyberpunk Amber Fog Vignette Layer */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'radial-gradient(circle at 50% 40%, rgba(255, 176, 0, 0.12), transparent 70%), linear-gradient(180deg, rgba(10, 8, 0, 0.3) 0%, rgba(10, 8, 0, 0.8) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
