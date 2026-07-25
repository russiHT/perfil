import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export default function ParticleSphereBg({ isZenMode = false, isNightDrive = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let roadSpeed = 0;

    // 1. Larger Single Main 3D Sphere (220 particles, 0.54 radius)
    const particleCount = 220;
    const sphereRadius = Math.min(width, height) * 0.54;
    const particles = [];

    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY * sphereRadius;
      const z = Math.sin(theta) * radiusAtY * sphereRadius;
      const py = y * sphereRadius;

      particles.push({
        id: i,
        x,
        y: py,
        z,
        origX: x,
        origY: py,
        origZ: z,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.8 + 1.2,
        baseRadius: Math.random() * 1.8 + 1.2,
        isDispersed: false
      });
    }

    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    let targetRotX = 0;
    let targetRotY = 0;

    let mouseX = -9999;
    let mouseY = -9999;
    let prevMouseX = -9999;
    let prevMouseY = -9999;

    let radioX = -9999;
    let radioY = -9999;

    let scrollPos = 0;
    let targetScrollPos = 0;

    let animId;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newMouseX = e.clientX - rect.left;
      const newMouseY = e.clientY - rect.top;

      const mouseVx = newMouseX - (prevMouseX === -9999 ? newMouseX : prevMouseX);
      const mouseVy = newMouseY - (prevMouseY === -9999 ? newMouseY : prevMouseY);

      mouseX = newMouseX;
      mouseY = newMouseY;
      prevMouseX = newMouseX;
      prevMouseY = newMouseY;

      const normX = (mouseX / width - 0.5) * 2;
      const normY = (mouseY / height - 0.5) * 2;
      targetRotY = normX * 0.5;
      targetRotX = -normY * 0.5;

      applyPushForce(mouseX, mouseY, mouseVx, mouseVy, 110, 3.5);
    };

    const applyPushForce = (px, py, pvx, pvy, pushRadius, forceMultiplier) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 650;

      particles.forEach((p) => {
        let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);
        let y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);
        let x3 = x1 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
        let y3 = y2 * Math.cos(rotZ) + x1 * Math.sin(rotZ);

        const scale = fov / (fov + z2 + 100);
        const projX = centerX + x3 * scale;
        const projY = centerY + y3 * scale;

        const dx = projX - px;
        const dy = projY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pushRadius) {
          p.isDispersed = true;
          const force = (1 - dist / pushRadius) * forceMultiplier;
          const angle = Math.atan2(dy, dx);
          
          p.vx += Math.cos(angle) * force + pvx * 0.08;
          p.vy += Math.sin(angle) * force + pvy * 0.08;
        }
      });
    };

    const handleRadioMove = (e) => {
      const { x, y, vx, vy } = e.detail;
      radioX = x;
      radioY = y;
      applyPushForce(x, y, vx || 0, vy || 0, 160, 5.0);
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      prevMouseX = -9999;
      prevMouseY = -9999;
    };

    const handleScroll = () => {
      targetScrollPos = window.scrollY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleResetSphere = () => {
      particles.forEach((p) => {
        p.vx = 0;
        p.vy = 0;
        p.isDispersed = false;
      });

      animate(particles, {
        x: (p) => p.origX,
        y: (p) => p.origY,
        z: (p) => p.origZ,
        duration: 1600,
        ease: 'outElastic(1, 0.5)'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('reset-sphere', handleResetSphere);
    window.addEventListener('radio-move', handleRadioMove);

    const spherePulse = animate(particles, {
      radius: (p) => [p.baseRadius, p.baseRadius * 1.5, p.baseRadius],
      delay: (p, i) => i * 14,
      duration: 3400,
      ease: 'inOutSine',
      loop: true
    });

    const render = () => {
      scrollPos += (targetScrollPos - scrollPos) * 0.05;

      rotX += (targetRotX - rotX) * 0.03 + 0.0012;
      rotY += (targetRotY - rotY) * 0.03 + 0.0025;
      rotZ = scrollPos * 0.0015;

      // Update Main Sphere Dispersed Particles
      particles.forEach((p) => {
        if (p.isDispersed) {
          p.x += p.vx;
          p.y += p.vy;

          p.vx *= 0.86;
          p.vy *= 0.86;

          const distFromOrig = Math.sqrt(
            (p.x - p.origX) ** 2 + (p.y - p.origY) ** 2 + (p.z - p.origZ) ** 2
          );
          const maxDisplacement = 130;

          if (distFromOrig > maxDisplacement) {
            const pullForce = (distFromOrig - maxDisplacement) * 0.04;
            const angleX = (p.origX - p.x) / distFromOrig;
            const angleY = (p.origY - p.y) / distFromOrig;

            p.vx += angleX * pullForce;
            p.vy += angleY * pullForce;
          }
        }
      });

      const themePrimary = getComputedStyle(document.documentElement).getPropertyValue('--amber-primary').trim() || '#ffb000';

      ctx.fillStyle = '#0a0800';
      ctx.fillRect(0, 0, width, height);

      // Render 3D Night Drive Highway Grid when active
      if (isNightDrive) {
        const roadY = height * 0.58;
        const horizonX = width / 2;

        ctx.strokeStyle = themePrimary;

        // Perspective Lane Lines
        const laneCount = 10;
        for (let i = -laneCount; i <= laneCount; i++) {
          const startX = horizonX + (i * width * 0.03);
          const endX = horizonX + (i * width * 0.45);
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(startX, roadY);
          ctx.lineTo(endX, height);
          ctx.stroke();
        }

        // Horizontal Road Grid Lines moving forward
        roadSpeed = (roadSpeed + 3) % 35;
        for (let z = 0; z < height - roadY; z += 35) {
          const y = roadY + ((z + roadSpeed) % (height - roadY));
          const alpha = ((y - roadY) / (height - roadY)) * 0.45;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 650;

      const projected = particles.map((p) => {
        let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);
        let y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);
        let x3 = x1 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
        let y3 = y2 * Math.cos(rotZ) + x1 * Math.sin(rotZ);

        const scale = fov / (fov + z2 + 100);
        const projX = centerX + x3 * scale;
        const projY = centerY + y3 * scale;

        const dx = projX - mouseX;
        const dy = projY - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        const dxRadio = projX - radioX;
        const dyRadio = projY - radioY;
        const distToRadio = Math.sqrt(dxRadio * dxRadio + dyRadio * dyRadio);

        const mouseHover = distToMouse < 90 || distToRadio < 120;

        return {
          projX,
          projY,
          scale,
          z: z2,
          radius: (p.radius || p.baseRadius) * scale * (mouseHover ? (isZenMode ? 2.2 : 1.6) : (isZenMode ? 1.25 : 1)),
          mouseHover
        };
      });

      projected.sort((a, b) => b.z - a.z);

      const maxDistance = 75;
      ctx.lineWidth = isZenMode ? 1.4 : 1;

      // Draw Constellation Lines between neighbor particles
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const isHovered = p1.mouseHover || p2.mouseHover;
            const baseAlphaMultiplier = isZenMode ? 0.75 : 0.38;
            const alpha = (1 - dist / maxDistance) * (isHovered ? 0.95 : baseAlphaMultiplier) * Math.min(p1.scale, p2.scale);
            
            ctx.strokeStyle = isHovered 
              ? '#ffffff' 
              : themePrimary;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = isHovered ? 2 : (isZenMode ? 1.25 : 1);

            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // Draw Glowing Particles
      projected.forEach((p) => {
        const alpha = Math.max(0.2, (p.z + sphereRadius) / (sphereRadius * 2));
        
        ctx.fillStyle = p.mouseHover ? '#ffffff' : themePrimary;
        ctx.shadowColor = themePrimary;
        ctx.shadowBlur = p.mouseHover 
          ? (isZenMode ? 28 : 16) 
          : (isZenMode ? 22 * p.scale : 8 * p.scale);
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(0.8, p.radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('reset-sphere', handleResetSphere);
      window.removeEventListener('radio-move', handleRadioMove);
      cancelAnimationFrame(animId);
      if (spherePulse && spherePulse.pause) spherePulse.pause();
    };
  }, [isZenMode]);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1,
          pointerEvents: 'auto'
        }} 
      />

      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: isZenMode 
            ? 'radial-gradient(circle at 50% 50%, var(--amber-soft-glow), transparent 75%), linear-gradient(180deg, rgba(10, 8, 0, 0.2) 0%, rgba(10, 8, 0, 0.75) 100%)' 
            : 'radial-gradient(circle at 50% 50%, var(--amber-soft-glow), transparent 70%), linear-gradient(180deg, rgba(10, 8, 0, 0.3) 0%, rgba(10, 8, 0, 0.85) 100%)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease'
        }}
      />
    </div>
  );
}
