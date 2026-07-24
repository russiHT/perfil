import React, { useState } from 'react';
import GlassCubeCanvas from './GlassCubeCanvas';
import { ArrowLeft, ArrowRight, Github, ExternalLink, ChevronRight } from 'lucide-react';

export default function HeroGlassSection({ onExploreClick, onOpenPortfolioModal }) {
  const slides = [
    { title: "Explore Code", subtitle: "Let's Build the Future of Code.", index: "01" },
    { title: "GitHub Pins", subtitle: "Open Source Masterpieces.", index: "02" },
    { title: "Design World", subtitle: "Avant-Garde Web Architecture.", index: "03" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        height: '94vh',
        minHeight: '700px',
        background: '#050505',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 48px'
      }}
    >
      {/* 1. Header Navigation Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          position: 'relative'
        }}
      >
        {/* Brand Logo Top-Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050505',
              fontWeight: '900',
              fontSize: '1.2rem'
            }}
          >
            D
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.5px' }}>
            Design World
          </span>
        </div>

        {/* Top-Right Navigation Menu & Arrow Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <nav style={{ display: 'flex', gap: '28px', fontSize: '0.9rem', fontWeight: '600' }}>
            <a href="#home" style={{ color: '#fff', textDecoration: 'none' }}>Home</a>
            <button 
              onClick={onOpenPortfolioModal}
              style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Portfolio
            </button>
            <a 
              href="https://github.com/octocat" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Github size={15} /> GitHub
            </a>
          </nav>

          {/* Arrow Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={prevSlide}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Previous Slide"
            >
              <ArrowLeft size={18} />
            </button>

            <button 
              onClick={nextSlide}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Next Slide"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Three.js Refractive Glass Cube Canvas (No HTML Text Overlay!) */}
      <GlassCubeCanvas currentHeadline={slides[currentSlide].title} />

      {/* 3. Bottom Row Layout (Matches Reference Image Bottom Left & Counter) */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          zIndex: 20,
          position: 'relative'
        }}
      >
        {/* Bottom Left Headline Statement */}
        <div style={{ maxWidth: '340px' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ffffff', lineHeight: 1.25, marginBottom: '6px' }}>
            {slides[currentSlide].subtitle}
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: '600' }}>
            Interactive 3D Glass Refraction Engine
          </span>
        </div>

        {/* Bottom Center "Explore Now" Button with Vector Line & Number Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={onOpenPortfolioModal}
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Explore Now</span>
            <ChevronRight size={16} />
          </button>

          {/* Vector Line */}
          <div style={{ width: '80px', height: '1px', background: 'rgba(255, 255, 255, 0.3)' }} />

          {/* Outline Counter ("01", "02", "03") */}
          <span 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '4.8rem',
              fontWeight: '900',
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.4)',
              userSelect: 'none'
            }}
          >
            {slides[currentSlide].index}
          </span>
        </div>

        {/* Right Side Vertical Dots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {slides.map((_, idx) => (
            <span 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentSlide === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: currentSlide === idx ? 'scale(1.4)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
