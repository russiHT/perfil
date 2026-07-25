import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, X, Play, Keyboard, CheckCircle2 } from 'lucide-react';

const TYPING_CODE_SNIPPETS = [
  {
    lang: 'JavaScript',
    code: 'const playMorseBeeps = (str) => { const ctx = new AudioContext(); };'
  },
  {
    lang: 'Java Spring',
    code: '@RestController public class UsuarioController { @GetMapping }'
  },
  {
    lang: 'Python ETL',
    code: 'import pandas as pd\ndf = pd.read_csv("dataset.csv")'
  },
  {
    lang: 'React Hook',
    code: 'const [score, setScore] = useState(0);\nuseEffect(() => {}, []);'
  }
];

export default function DevTypingSpeedModal({ isOpen, onClose }) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [highScoreWpm, setHighScoreWpm] = useState(() => {
    return parseInt(localStorage.getItem('crt_typing_wpm_highscore') || '0', 10);
  });

  const inputRef = useRef(null);
  const targetCode = TYPING_CODE_SNIPPETS[snippetIndex].code;

  useEffect(() => {
    if (isOpen) {
      resetTest();
    }
  }, [isOpen]);

  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    const nextIdx = Math.floor(Math.random() * TYPING_CODE_SNIPPETS.length);
    setSnippetIndex(nextIdx);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleInputChange = (e) => {
    if (isFinished) return;
    const val = e.target.value;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetCode[i]) correctChars++;
    }
    const currentAcc = val.length > 0 ? Math.floor((correctChars / val.length) * 100) : 100;
    setAccuracy(currentAcc);

    // Calculate real-time WPM
    if (startTime && val.length > 0) {
      const timeInMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = val.length / 5;
      const currentWpm = Math.floor(wordsTyped / (timeInMinutes || 0.001));
      setWpm(currentWpm);
    }

    // Check completion
    if (val === targetCode) {
      const totalTimeMin = (Date.now() - startTime) / 60000;
      const finalWpm = Math.floor((targetCode.length / 5) / (totalTimeMin || 0.001));
      setWpm(finalWpm);
      setIsFinished(true);

      if (finalWpm > highScoreWpm) {
        setHighScoreWpm(finalWpm);
        localStorage.setItem('crt_typing_wpm_highscore', finalWpm.toString());
      }
    }
  };

  if (!isOpen) return null;

  return (
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
        padding: '20px'
      }}
    >
      <div
        className="terminal-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'rgba(14, 10, 2, 0.98)',
          border: '1px solid var(--border-amber)',
          boxShadow: '0 0 50px var(--amber-glow)',
          padding: '24px'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-amber)', pb: '12px' }}>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--amber-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={18} />
            <span>TESTE DE VELOCIDADE DE DIGITAÇÃO DEV (WPM)</span>
          </div>

          <button onClick={onClose} className="terminal-link" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <X size={14} />
            <span>FECHAR</span>
          </button>
        </div>

        {/* Score Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          <div style={{ border: '1px solid var(--border-amber)', padding: '10px', borderRadius: '6px', background: 'var(--amber-soft-glow)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700' }}>WPM (VELOCIDADE)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-bright)' }}>{wpm}</div>
          </div>

          <div style={{ border: '1px solid var(--border-amber)', padding: '10px', borderRadius: '6px', background: 'var(--amber-soft-glow)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700' }}>PRECISÃO</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-primary)' }}>{accuracy}%</div>
          </div>

          <div style={{ border: '1px solid var(--border-amber)', padding: '10px', borderRadius: '6px', background: 'var(--amber-soft-glow)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--amber-dim)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Trophy size={12} color="var(--amber-bright)" /> RECORD
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-bright)' }}>{highScoreWpm} WPM</div>
          </div>
        </div>

        {/* Target Code Snippet Display Box */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '6px' }}>
            &gt; DIGITE O CÓDIGO ABAIXO ({TYPING_CODE_SNIPPETS[snippetIndex].lang}):
          </div>

          <div
            style={{
              background: '#070500',
              border: '1px solid var(--border-amber)',
              borderRadius: '6px',
              padding: '16px',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              letterSpacing: '0.5px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              userSelect: 'none'
            }}
          >
            {targetCode.split('').map((char, i) => {
              let charColor = 'var(--amber-dim)';
              let bg = 'transparent';

              if (i < userInput.length) {
                if (userInput[i] === char) {
                  charColor = 'var(--amber-bright)';
                  bg = 'rgba(255, 176, 0, 0.2)';
                } else {
                  charColor = '#ff0055';
                  bg = 'rgba(255, 0, 85, 0.25)';
                }
              }

              return (
                <span key={i} style={{ color: charColor, background: bg, borderRadius: '2px' }}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Input Textarea */}
        <div style={{ marginBottom: '20px' }}>
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            placeholder="Comece a digitar aqui..."
            rows={3}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid var(--border-amber)',
              borderRadius: '6px',
              padding: '12px',
              color: 'var(--amber-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.95rem',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        {/* Completion Message & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {isFinished ? (
            <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>TESTE CONCLUÍDO! VELOCIDADE: {wpm} WPM</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)' }}>
              &gt; Digite sem parar para medir sua velocidade em WPM.
            </div>
          )}

          <button
            onClick={resetTest}
            className="terminal-link"
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
          >
            <RotateCcw size={14} />
            <span>{isFinished ? 'NOVO TESTE' : 'REINICIAR'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
