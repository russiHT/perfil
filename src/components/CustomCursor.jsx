import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Em telas de toque não existe ponteiro para desenhar, e esconder o cursor
  // do sistema só atrapalha. `(pointer: fine)` isola mouse/trackpad/caneta.
  const [hasFinePointer, setHasFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    const onChange = (e) => setHasFinePointer(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // A regra `cursor: none` vive no index.css, dentro de @media (pointer: fine)
  // e sem atingir inputs/textarea — antes era um <style> global com !important
  // que apagava também o cursor de edição de texto.
  useEffect(() => {
    if (!hasFinePointer) return undefined;
    document.body.classList.add('has-custom-cursor');
    return () => document.body.classList.remove('has-custom-cursor');
  }, [hasFinePointer]);

  useEffect(() => {
    if (!hasFinePointer) return undefined;
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, input, [role="button"], .terminal-card, .terminal-link');
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <>
      {/* Outer Glowing Phosphor Amber Ring */}
      <div
        aria-hidden="true" 
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: isHovered ? '42px' : '26px',
          height: isHovered ? '42px' : '26px',
          border: '1px solid var(--amber-primary)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 999999,
          boxShadow: isHovered ? '0 0 20px var(--amber-glow)' : '0 0 10px var(--amber-soft-glow)',
          transition: 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease, background 0.1s ease',
          background: isMouseDown ? 'var(--amber-soft-glow)' : 'transparent'
        }}
      />

      {/* Inner Precision Crosshair Dot */}
      <div
        aria-hidden="true" 
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: isMouseDown ? '8px' : '4px',
          height: isMouseDown ? '8px' : '4px',
          backgroundColor: 'var(--amber-bright)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 1000000,
          boxShadow: '0 0 8px var(--amber-primary)'
        }}
      />
    </>
  );
}
