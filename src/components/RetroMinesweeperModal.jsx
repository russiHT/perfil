import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, X, Play, Flag, ShieldAlert, CheckCircle2, Bot } from 'lucide-react';

const BOARD_SIZE = 9;
const MINES_COUNT = 10;

export default function RetroMinesweeperModal({ isOpen, onClose }) {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES_COUNT);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutopilot, setIsAutopilot] = useState(false);
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

  const revealCell = (r, c, currentBoard = board) => {
    if (isGameOver || isWon || currentBoard[r][c].isRevealed || currentBoard[r][c].isFlagged) return currentBoard;

    let newBoard = currentBoard.map(row => row.map(cell => ({ ...cell })));

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
      return newBoard;
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

    return newBoard;
  };

  const toggleFlag = (e, r, c, currentBoard = board) => {
    if (e) e.preventDefault();
    if (isGameOver || isWon || currentBoard[r][c].isRevealed) return currentBoard;

    let newBoard = currentBoard.map(row => row.map(cell => ({ ...cell })));
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
    return newBoard;
  };

  // Autopilot Solver Bot Logic Loop
  useEffect(() => {
    if (!isOpen || !isPlaying || isGameOver || isWon || !isAutopilot || board.length === 0) return;

    const botInterval = setInterval(() => {
      // 1. If board is completely unrevealed, reveal center cell
      const hasAnyRevealed = board.some(row => row.some(cell => cell.isRevealed));
      if (!hasAnyRevealed) {
        revealCell(4, 4);
        return;
      }

      let actionTaken = false;
      let newBoard = board.map(row => row.map(cell => ({ ...cell })));

      const getNeighbors = (r, c) => {
        const neighbors = [];
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
              neighbors.push(newBoard[nr][nc]);
            }
          }
        }
        return neighbors;
      };

      // 2. Guaranteed deductions
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const cell = newBoard[r][c];
          if (!cell.isRevealed || cell.neighborMines === 0) continue;

          const neighbors = getNeighbors(r, c);
          const hidden = neighbors.filter(n => !n.isRevealed && !n.isFlagged);
          const flagged = neighbors.filter(n => n.isFlagged);

          // All remaining hidden neighbors are mines
          if (hidden.length > 0 && hidden.length + flagged.length === cell.neighborMines) {
            hidden.forEach(n => {
              toggleFlag(null, n.r, n.c, newBoard);
            });
            actionTaken = true;
            break;
          }

          // All mines are flagged, remaining hidden neighbors are safe
          if (flagged.length === cell.neighborMines && hidden.length > 0) {
            hidden.forEach(n => {
              revealCell(n.r, n.c, newBoard);
            });
            actionTaken = true;
            break;
          }
        }
        if (actionTaken) break;
      }

      // 3. Fallback guess if no deterministic move found
      if (!actionTaken) {
        const candidates = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (!newBoard[r][c].isRevealed && !newBoard[r][c].isFlagged) {
              candidates.push(newBoard[r][c]);
            }
          }
        }

        if (candidates.length > 0) {
          const randomPick = candidates[Math.floor(Math.random() * candidates.length)];
          revealCell(randomPick.r, randomPick.c);
        }
      }
    }, 280);

    return () => clearInterval(botInterval);
  }, [isOpen, isPlaying, isGameOver, isWon, isAutopilot, board]);

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

        {/* Stats & Autopilot Toggle Bar */}
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
            onClick={() => setIsAutopilot(!isAutopilot)}
            className="terminal-link"
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              background: isAutopilot ? 'var(--amber-primary)' : 'var(--amber-soft-glow)',
              color: isAutopilot ? '#070500' : 'var(--amber-primary)',
              fontWeight: '800'
            }}
            title="Ativar/Desativar Bot Autopiloto para resolver o Campo Minado sozinho"
          >
            <Bot size={13} />
            <span>{isAutopilot ? 'AUTOPILOT: ON' : 'AUTOPILOT: OFF'}</span>
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
                  onClick={() => revealCell(r, c)}
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

        {/* Footer Status & Controls Notice */}
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
          ) : isAutopilot ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-bright)', fontWeight: '700' }} className="crt-flicker">
              <div>&gt; BOT AUTOPILOTO RESOLVENDO CAMPO MINADO...</div>
              <div style={{ color: 'var(--amber-dim)', fontSize: '0.74rem', marginTop: '2px' }}>
                o bot de campo minado tambem e meio burro :(
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.76rem', color: 'var(--amber-dim)' }}>
              &gt; Botão esquerdo para revelar // Botão direito para colocar bandeira [F]
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
