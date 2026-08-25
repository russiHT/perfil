import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { useLatest } from '../hooks/useLatest';

const PARTICLE_COUNT = 220;
const FOV = 650;
const MAX_LINK_DISTANCE = 75;
const MAX_DISPLACEMENT = 130;

/** Lê a cor ativa do tema. Chamada apenas quando o tema muda. */
function readThemeColor() {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--amber-primary').trim() ||
    '#ffb000'
  );
}

export default function ParticleSphereBg({ isZenMode = false }) {
  const canvasRef = useRef(null);

  // O modo zen vive num ref: antes ele era dependência do useEffect, então
  // cada toggle destruía e reconstruía o sistema inteiro de partículas,
  // zerando a posição da esfera.
  const zenRef = useLatest(isZenMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------------
       Dimensionamento sensível ao devicePixelRatio.
       Antes `canvas.width = window.innerWidth` ignorava a densidade da tela
       e as partículas saíam borradas em telas retina / 4K.
       ------------------------------------------------------------------ */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const applyCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // A partir daqui todo o desenho usa coordenadas em pixels CSS.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    applyCanvasSize();

    /* ------------------------------------------------------------------
       Distribuição de Fibonacci sobre a esfera
       ------------------------------------------------------------------ */
    const sphereRadius = Math.min(width, height) * 0.54;
    const particles = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY * sphereRadius;
      const z = Math.sin(theta) * radiusAtY * sphereRadius;
      const py = y * sphereRadius;
      const baseRadius = Math.random() * 1.8 + 1.2;

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
        radius: baseRadius,
        baseRadius,
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

    // Cor do tema em cache. Antes era lida com getComputedStyle A CADA FRAME,
    // o que forçava um recálculo de estilo do documento inteiro 60x por segundo.
    let themePrimary = readThemeColor();
    const handleThemeChange = () => {
      themePrimary = readThemeColor();
    };

    /* ------------------------------------------------------------------
       Buffer de projeção reutilizado entre frames.
       `applyPushForce` lê daqui em vez de refazer toda a projeção 3D a cada
       evento de mousemove (que podia disparar 100+ vezes por segundo).
       ------------------------------------------------------------------ */
    const projected = particles.map(() => ({
      projX: 0,
      projY: 0,
      scale: 1,
      z: 0,
      radius: 1,
      highlighted: false,
      index: 0
    }));

    const projectAll = () => {
      const centerX = width / 2;
      const centerY = height / 2;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const zen = zenRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;
        const x3 = x1 * cosZ - y2 * sinZ;
        const y3 = y2 * cosZ + x1 * sinZ;

        const scale = FOV / (FOV + z2 + 100);
        const projX = centerX + x3 * scale;
        const projY = centerY + y3 * scale;

        const dxMouse = projX - mouseX;
        const dyMouse = projY - mouseY;
        const dxRadio = projX - radioX;
        const dyRadio = projY - radioY;

        const highlighted =
          dxMouse * dxMouse + dyMouse * dyMouse < 8100 || // 90px
          dxRadio * dxRadio + dyRadio * dyRadio < 14400; // 120px

        const target = projected[i];
        target.index = i;
        target.projX = projX;
        target.projY = projY;
        target.scale = scale;
        target.z = z2;
        target.highlighted = highlighted;
        target.radius =
          p.radius * scale * (highlighted ? (zen ? 2.2 : 1.6) : zen ? 1.25 : 1);
      }
    };

    /* ------------------------------------------------------------------
       Empurrão do ponteiro / do rádio sobre as partículas
       ------------------------------------------------------------------ */
    const applyPushForce = (px, py, pvx, pvy, pushRadius, forceMultiplier) => {
      const pushRadiusSq = pushRadius * pushRadius;

      for (let i = 0; i < particles.length; i++) {
        const proj = projected[i];
        const dx = proj.projX - px;
        const dy = proj.projY - py;
        const distSq = dx * dx + dy * dy;

        if (distSq >= pushRadiusSq) continue;

        const dist = Math.sqrt(distSq) || 0.0001;
        const force = (1 - dist / pushRadius) * forceMultiplier;
        const p = particles[i];

        p.isDispersed = true;
        p.vx += (dx / dist) * force + pvx * 0.08;
        p.vy += (dy / dist) * force + pvy * 0.08;
      }
    };

    /* ------------------------------------------------------------------
       Listeners
       ------------------------------------------------------------------ */
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

      if (!prefersReducedMotion) {
        targetRotY = (mouseX / width - 0.5) * 2 * 0.5;
        targetRotX = -(mouseY / height - 0.5) * 2 * 0.5;
      }

      applyPushForce(mouseX, mouseY, mouseVx, mouseVy, 110, 3.5);
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
      applyCanvasSize();
    };

    const handleResetSphere = () => {
      particles.forEach((p) => {
        p.vx = 0;
        p.vy = 0;
        p.isDispersed = false;
      });

      if (prefersReducedMotion) {
        particles.forEach((p) => {
          p.x = p.origX;
          p.y = p.origY;
          p.z = p.origZ;
        });
        return;
      }

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
    window.addEventListener('theme-change', handleThemeChange);

    // Pulsação do raio das partículas — puro enfeite, desligada quando o
    // usuário pede movimento reduzido.
    const spherePulse = prefersReducedMotion
      ? null
      : animate(particles, {
          radius: (p) => [p.baseRadius, p.baseRadius * 1.5, p.baseRadius],
          delay: (p, i) => i * 14,
          duration: 3400,
          ease: 'inOutSine',
          loop: true
        });

    /* ------------------------------------------------------------------
       Grade espacial para as linhas de constelação.
       A busca de vizinhos era O(n²): 220 partículas = ~24 mil comparações
       de distância por frame. Com células do tamanho do alcance máximo,
       cada partícula só compara com as 9 células ao redor.
       ------------------------------------------------------------------ */
    const grid = new Map();

    const drawLinks = (order) => {
      grid.clear();

      for (let i = 0; i < order.length; i++) {
        const p = order[i];
        const cx = Math.floor(p.projX / MAX_LINK_DISTANCE);
        const cy = Math.floor(p.projY / MAX_LINK_DISTANCE);
        const key = cx * 100000 + cy;
        const bucket = grid.get(key);
        if (bucket) bucket.push(i);
        else grid.set(key, [i]);
      }

      const zen = zenRef.current;
      const baseAlphaMultiplier = zen ? 0.75 : 0.38;

      for (let i = 0; i < order.length; i++) {
        const p1 = order[i];
        const cx = Math.floor(p1.projX / MAX_LINK_DISTANCE);
        const cy = Math.floor(p1.projY / MAX_LINK_DISTANCE);

        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const bucket = grid.get((cx + ox) * 100000 + (cy + oy));
            if (!bucket) continue;

            for (let b = 0; b < bucket.length; b++) {
              const j = bucket[b];
              if (j <= i) continue; // cada par é desenhado uma única vez

              const p2 = order[j];
              const dx = p1.projX - p2.projX;
              const dy = p1.projY - p2.projY;
              const distSq = dx * dx + dy * dy;
              if (distSq >= MAX_LINK_DISTANCE * MAX_LINK_DISTANCE) continue;

              const dist = Math.sqrt(distSq);
              const isHighlighted = p1.highlighted || p2.highlighted;

              ctx.strokeStyle = isHighlighted ? '#ffffff' : themePrimary;
              ctx.globalAlpha =
                (1 - dist / MAX_LINK_DISTANCE) *
                (isHighlighted ? 0.95 : baseAlphaMultiplier) *
                Math.min(p1.scale, p2.scale);
              ctx.lineWidth = isHighlighted ? 2 : zen ? 1.25 : 1;

              ctx.beginPath();
              ctx.moveTo(p1.projX, p1.projY);
              ctx.lineTo(p2.projX, p2.projY);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    /* ------------------------------------------------------------------
       Loop de render
       ------------------------------------------------------------------ */
    const render = () => {
      scrollPos += (targetScrollPos - scrollPos) * 0.05;

      if (prefersReducedMotion) {
        // Sem deriva automática nem rotação por scroll: a esfera só reage
        // a interação direta do usuário.
        rotX += (targetRotX - rotX) * 0.03;
        rotY += (targetRotY - rotY) * 0.03;
      } else {
        rotX += (targetRotX - rotX) * 0.03 + 0.0012;
        rotY += (targetRotY - rotY) * 0.03 + 0.0025;
        rotZ = scrollPos * 0.0015;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.isDispersed) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.86;
        p.vy *= 0.86;

        const distFromOrig = Math.sqrt(
          (p.x - p.origX) ** 2 + (p.y - p.origY) ** 2 + (p.z - p.origZ) ** 2
        );

        if (distFromOrig > MAX_DISPLACEMENT) {
          const pullForce = (distFromOrig - MAX_DISPLACEMENT) * 0.04;
          p.vx += ((p.origX - p.x) / distFromOrig) * pullForce;
          p.vy += ((p.origY - p.y) / distFromOrig) * pullForce;
        }
      }

      projectAll();

      ctx.fillStyle = '#0a0800';
      ctx.fillRect(0, 0, width, height);

      // Ordena por profundidade (mais distante primeiro) sem perder o
      // vínculo com o buffer reutilizado.
      const order = projected.slice().sort((a, b) => b.z - a.z);

      drawLinks(order);

      const zen = zenRef.current;
      for (let i = 0; i < order.length; i++) {
        const p = order[i];

        ctx.fillStyle = p.highlighted ? '#ffffff' : themePrimary;
        ctx.shadowColor = themePrimary;
        ctx.shadowBlur = p.highlighted
          ? zen
            ? 28
            : 16
          : (zen ? 22 : 8) * p.scale;
        ctx.globalAlpha = Math.max(0.2, (p.z + sphereRadius) / (sphereRadius * 2));

        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(0.8, p.radius), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

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
      window.removeEventListener('theme-change', handleThemeChange);
      cancelAnimationFrame(animId);
      spherePulse?.pause?.();
    };
    // Sem dependências: o sistema de partículas é criado uma única vez e lê
    // o modo zen através de zenRef.
  }, [zenRef]);

  return (
    <div
      aria-hidden="true"
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
