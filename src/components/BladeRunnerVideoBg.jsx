import React, { useEffect, useRef } from 'react';
import { animate, set } from 'animejs';

export default function BladeRunnerVideoBg() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const gridRef = useRef(null);
  const ringsRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const grid = gridRef.current;
    const rings = ringsRef.current;
    if (!container || !video) return;

    // 1. Anime.js v4 Continuous 3D Floating Animation
    const floatAnim = animate(container, {
      rotateX: [0, 8, -4, 0],
      rotateY: [-5, 5, -5],
      scale: [1, 1.05, 1],
      duration: 12000,
      ease: 'inOutSine',
      loop: true
    });

    // 2. Anime.js v4 Holographic Ring Pulsing
    if (rings && rings.children.length) {
      animate(Array.from(rings.children), {
        scale: [0.8, 1.5],
        opacity: [0.8, 0],
        duration: 4000,
        delay: (el, i) => i * 1200,
        ease: 'outExpo',
        loop: true
      });
    }

    // 3. Anime.js v4 Scroll-Driven 3D Transform & Video Playback Scrubbing
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollFraction = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);

      // Scrub video current time
      if (video.duration) {
        video.currentTime = scrollFraction * video.duration;
      }

      // Anime.js v4 set 3D Perspective Rotation driven by scroll fraction
      set(container, {
        rotateX: 10 + scrollFraction * 20,
        rotateY: Math.sin(scrollFraction * Math.PI) * 12,
        scale: 1 + scrollFraction * 0.15,
        translateZ: scrollFraction * 100
      });

      if (grid) {
        set(grid, {
          translateY: scrollFraction * -150,
          opacity: 0.2 + scrollFraction * 0.4
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (floatAnim && floatAnim.pause) floatAnim.pause();
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
        perspective: '1200px',
        background: '#070500'
      }}
    >
      {/* Anime.js v4 3D Perspective Container */}
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: '-5%',
          width: '110%',
          height: '110%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.05s linear'
        }}
      >
        {/* Blade Runner 2049 Video Layer */}
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          loop
          src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-traffic-at-night-42862-large.mp4"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.65,
            filter: 'sepia(1) hue-rotate(-25deg) saturate(3) contrast(1.4) brightness(0.95)',
            mixBlendMode: 'screen',
            transform: 'translateZ(0px)'
          }}
        />

        {/* Anime.js v4 Cyberpunk 3D Perspective Grid */}
        <div 
          ref={gridRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255, 176, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 176, 0, 0.15) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            transform: 'rotateX(75deg) translateY(200px) translateZ(-100px)',
            transformOrigin: 'bottom center',
            opacity: 0.35,
            pointerEvents: 'none'
          }}
        />

        {/* Anime.js v4 Holographic 3D Rings */}
        <div 
          ref={ringsRef}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%) translateZ(50px)',
            width: '400px',
            height: '400px',
            pointerEvents: 'none'
          }}
        >
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(255, 176, 0, 0.6)',
                boxShadow: '0 0 30px rgba(255, 176, 0, 0.4)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Cyberpunk Dark Amber Ambient Fog Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'radial-gradient(circle at 50% 30%, rgba(255, 140, 0, 0.18), transparent 70%), linear-gradient(180deg, rgba(10, 8, 0, 0.2) 0%, rgba(10, 8, 0, 0.75) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
