import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, X, Play, Flag, ShieldAlert, CheckCircle2 } from 'lucide-react';

const BOARD_SIZE = 9;
const MINES_COUNT = 10;

export default function RetroMinesweeperModal({ isOpen, onClose }) {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES_COUNT);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    return parseInt(localStorage.getItem('crt_mines_best_time') || '0', 10);
  });

  const playSound = (freq = 500, type = 'square', duration = 0.08) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const initializeBoard = () => {
    let newBoard = Array.from({ length: BOARD_SIZE }, (_, r) =>
      Array.from({ length: BOARD_SIZE }, (_, c) => ({
        r,
        c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines randomly
    let placed = 0;
    while (placed < MINES_COUNT) {
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                if (newBoard[nr][nc].isMine) count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setIsGameOver(false);
    setIsWon(false);
    setFlagsLeft(MINES_COUNT);
    setTimer(0);
    setIsPlaying(true);
    playSound(750, 'sine', 0.1);
  };

  useEffect(() => {
    if (isOpen) {
      initializeBoard();
    }
  }, [isOpen]);

  // Timer loop
  useEffect(() => {
    if (!isOpen || !isPlaying || isGameOver || isWon) return;
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, isGameOver, isWon]);

  const revealCell = (r, c) => {
    if (isGameOver || isWon || board[r][c].isRevealed || board[r][c].isFlagged) return;

    let newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[r][c].isMine) {
      // Game Over - reveal all mines
      newBoard.forEach(row =>
        row.forEach(cell => {
          if (cell.isMine) cell.isRevealed = true;
        })
      );
      setBoard(newBoard);
      setIsGameOver(true);
      setIsPlaying(false);
      playSound(150, 'sawtooth', 0.4);
      return;
    }

    // Flood fill reveal
    const floodFill = (row, col) => {
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
      if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return;

      newBoard[row][col].isRevealed = true;

      if (newBoard[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) floodFill(row + dr, col + dc);
          }
        }
      }
    };

    floodFill(r, c);
    playSound(600, 'square', 0.05);

    // Check Victory condition
    let unrevealedNonMines = 0;
    newBoard.forEach(row =>
      row.forEach(cell => {
        if (!cell.isMine && !cell.isRevealed) unrevealedNonMines++;
      })
    );

    setBoard(newBoard);

    if (unrevealedNonMines === 0) {
      setIsWon(true);
      setIsPlaying(false);
      playSound(950, 'sine', 0.2);
      if (bestTime === 0 || timer < bestTime) {
        setBestTime(timer);
        localStorage.setItem('crt_mines_best_time', timer.toString());
      }
    }
  };

  const toggleFlag = (e, r, c) => {
    if (e) e.preventDefault();
    if (isGameOver || isWon || board[r][c].isRevealed) return;

    let newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[r][c];

    if (!cell.isFlagged && flagsLeft > 0) {
      cell.isFlagged = true;
      setFlagsLeft(f => f - 1);
      playSound(800, 'triangle', 0.06);
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsLeft(f => f + 1);
      playSound(400, 'triangle', 0.06);
    }

    setBoard(newBoard);
  };

  const handleCellClick = (r, c) => {
    if (flagMode) {
      toggleFlag(null, r, c);
    } else {
      revealCell(r, c);
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
          maxWidth: '480px',
          background: 'rgba(14, 10, 2, 0.98)',
          border: '1px solid var(--border-amber)',
          boxShadow: '0 0 50px var(--amber-glow)',
          padding: '24px'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-amber)', pb: '12px' }}>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--amber-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} />
            <span>[GAME] CAMPO MINADO CRT v2.1</span>
          </div>

          <button onClick={onClose} className="terminal-link" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <X size={14} />
            <span>FECHAR</span>
          </button>
        </div>

        {/* Stats & Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.85rem', fontWeight: '700', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ color: 'var(--amber-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flag size={14} />
            <span>MINAS:</span>
            <span style={{ color: 'var(--amber-bright)', fontSize: '1.1rem' }}>{flagsLeft}</span>
          </div>

          <div style={{ color: 'var(--amber-dim)' }}>
            TEMPO: <span style={{ color: 'var(--amber-bright)', fontSize: '1.1rem' }}>{timer}s</span>
          </div>

          <button
            onClick={() => setFlagMode(!flagMode)}
            className="terminal-link"
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              background: flagMode ? 'var(--amber-primary)' : 'var(--amber-soft-glow)',
              color: flagMode ? '#070500' : 'var(--amber-primary)',
              fontWeight: '800'
            }}
          >
            <Flag size={13} />
            <span>{flagMode ? 'MODO BANDEIRA: ON' : 'MODO BANDEIRA: OFF'}</span>
          </button>
        </div>

        {/* Game Grid Board */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            gap: '3px',
            background: '#070500',
            border: '2px solid var(--border-amber)',
            padding: '6px',
            borderRadius: '6px',
            marginBottom: '16px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9)'
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              let content = '';
              let bg = 'rgba(255, 176, 0, 0.08)';
              let color = 'var(--amber-primary)';

              if (cell.isRevealed) {
                bg = 'rgba(18, 13, 2, 0.9)';
                if (cell.isMine) {
                  content = '*';
                  bg = 'rgba(255, 0, 85, 0.3)';
                  color = 'var(--amber-bright)';
                } else if (cell.neighborMines > 0) {
                  content = cell.neighborMines;
                  color = 'var(--amber-bright)';
                }
              } else if (cell.isFlagged) {
                content = 'F';
                color = 'var(--amber-bright)';
                bg = 'rgba(255, 176, 0, 0.25)';
              }

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  style={{
                    aspectRatio: '1/1',
                    background: bg,
                    border: cell.isRevealed ? '1px solid rgba(255, 176, 0, 0.15)' : '1px solid var(--border-amber)',
                    borderRadius: '3px',
                    color,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    outline: 'none'
                  }}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>

        {/* Footer Status & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {isWon ? (
            <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>VOCÊ VENCEU EM {timer}s!</span>
            </div>
          ) : isGameOver ? (
            <div style={{ color: 'var(--amber-bright)', fontWeight: '800', fontSize: '0.9rem' }}>
              BOOM! GAME OVER
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)' }}>
              &gt; Clique para revelar ou use o modo bandeira [F].
            </div>
          )}

          <button
            onClick={initializeBoard}
            className="terminal-link"
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
          >
            <RotateCcw size={14} />
            <span>NOVO JOGO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
