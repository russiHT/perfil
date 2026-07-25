import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CrtOverlay from './components/CrtOverlay';
import CustomCursor from './components/CustomCursor';
import ParticleSphereBg from './components/ParticleSphereBg';
import TerminalHeader from './components/TerminalHeader';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CyberpunkRadio from './components/CyberpunkRadio';
import ProjectsSection from './components/ProjectsSection';
import GithubStatsCard from './components/GithubStatsCard';
import InteractiveCli from './components/InteractiveCli';
import ContactSection from './components/ContactSection';
import TerminalFooter from './components/TerminalFooter';
import SystemDiagnosticPanel from './components/SystemDiagnosticPanel';
import { RotateCcw, Eye } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isDiagOpen, setIsDiagOpen] = useState(false);

  const playClickSound = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // AudioContext fallback
    }
  };

  useEffect(() => {
    const handleClick = () => playClickSound();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isMuted]);

  const triggerResetSphere = () => {
    window.dispatchEvent(new CustomEvent('reset-sphere'));
  };

  return (
    <div className="crt-flicker" style={{ minHeight: '100vh', position: 'relative', background: '#0a0800' }}>
      {/* 5-second Profile Boot Loader Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Custom CRT Phosphor Amber Cursor */}
      <CustomCursor />

      {/* CRT Scanlines & Screen Vignette */}
      <CrtOverlay />

      {/* Interactive System Hardware Diagnostic Panel */}
      <SystemDiagnosticPanel isOpen={isDiagOpen} onClose={() => setIsDiagOpen(false)} />

      {/* Interactive 3D Connected Particle Sphere Background */}
      <ParticleSphereBg isZenMode={isZenMode} />

      {/* Draggable Corner Cyberpunk Radio Player (Global Mute Sync) */}
      {!isLoading && <CyberpunkRadio globalMute={isMuted} />}

      {/* Floating Zen Controls Bar (When text is hidden) */}
      {!isLoading && isZenMode && (
        <div 
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            gap: '14px',
            background: 'var(--bg-crt-box)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-amber)',
            borderRadius: '8px',
            padding: '12px 20px',
            boxShadow: '0 10px 35px var(--amber-soft-glow)'
          }}
        >
          <button
            onClick={triggerResetSphere}
            className="terminal-link"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem'
            }}
          >
            <RotateCcw size={16} />
            <span>Restaurar Esfera Inicial</span>
          </button>

          <button
            onClick={() => setIsZenMode(false)}
            className="terminal-link"
            style={{
              background: 'var(--amber-primary)',
              color: '#0d0a00',
              padding: '10px 18px',
              fontSize: '0.85rem'
            }}
          >
            <Eye size={16} />
            <span>Mostrar Escritas</span>
          </button>
        </div>
      )}

      {/* Main Terminal Content Layer */}
      {!isLoading && !isZenMode && (
        <main style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px 80px 24px', position: 'relative', zIndex: 10 }}>
          {/* Boot Logs & Header with Diag Trigger */}
          <TerminalHeader isMuted={isMuted} setIsMuted={setIsMuted} onOpenDiag={() => setIsDiagOpen(true)} />

          {/* Hero Section (# russi_) */}
          <HeroSection />

          {/* About Section (olá, aqui é o russi.) */}
          <AboutSection />

          {/* Projects / Registros Section */}
          <ProjectsSection />

          {/* GitHub Live API Stats Card */}
          <GithubStatsCard />

          {/* Interactive CLI Prompt */}
          <InteractiveCli onOpenDiag={() => setIsDiagOpen(true)} />

          {/* Contact / Canal Aberto Section */}
          <ContactSection />

          {/* Terminal Footer with Hide Text Toggle */}
          <TerminalFooter onToggleHideText={() => setIsZenMode(true)} />
        </main>
      )}
    </div>
  );
}
