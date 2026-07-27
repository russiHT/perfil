import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, X, Play, Bot } from 'lucide-react';

const GRID_SIZE = 18;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 }
];
const INITIAL_DIR = { x: 1, y: 0 };

// BFS Pathfinding AI Algorithm for Snake Autopilot Bot
const getNextAutopilotDirection = (snake, food, currentDir) => {
  const head = snake[0];
  const directions = [
    { x: 0, y: -1 }, // UP
    { x: 1, y: 0 },  // RIGHT
    { x: 0, y: 1 },  // DOWN
    { x: -1, y: 0 }  // LEFT
  ];

  const isValid = (pos) => {
    if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE) return false;
    return !snake.some((seg, idx) => idx !== snake.length - 1 && seg.x === pos.x && seg.y === pos.y);
  };

  // BFS search for shortest path to food
  const queue = [[head]];
  const visited = new Set();
  visited.add(`${head.x},${head.y}`);
  let pathToFood = null;

  while (queue.length > 0) {
    const path = queue.shift();
    const curr = path[path.length - 1];

    if (curr.x === food.x && curr.y === food.y) {
      pathToFood = path;
      break;
    }

    for (const dir of directions) {
      const nextPos = { x: curr.x + dir.x, y: curr.y + dir.y };
      const key = `${nextPos.x},${nextPos.y}`;

      if (isValid(nextPos) && !visited.has(key)) {
        visited.add(key);
        queue.push([...path, nextPos]);
      }
    }
  }

  if (pathToFood && pathToFood.length > 1) {
    const nextStep = pathToFood[1];
    return { x: nextStep.x - head.x, y: nextStep.y - head.y };
  }

  // Fallback: Pick safest move towards open space
  const safeMoves = directions.filter(dir => {
    if (dir.x === -currentDir.x && dir.y === -currentDir.y) return false;
    return isValid({ x: head.x + dir.x, y: head.y + dir.y });
  });

  if (safeMoves.length > 0) {
    safeMoves.sort((a, b) => {
      const distA = Math.abs((head.x + a.x) - food.x) + Math.abs((head.y + a.y) - food.y);
      const distB = Math.abs((head.x + b.x) - food.x) + Math.abs((head.y + b.y) - food.y);
      return distA - distB;
    });
    return safeMoves[0];
  }

  return currentDir;
};

export default function RetroSnakeGameModal({ isOpen, onClose }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIR);
  const [food, setFood] = useState({ x: 14, y: 8 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('crt_snake_highscore') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutopilot, setIsAutopilot] = useState(false);

  const dirRef = useRef(direction);
  dirRef.current = direction;

  const playBeep = (freq = 600, duration = 0.08) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  };

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
    playBeep(880, 0.1);
  };

  // Lock background page scroll when Snake game modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen || isAutopilot) return;

    const handleKeyDown = (e) => {
      const currentDir = dirRef.current;
      const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'];
      if (gameKeys.includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAutopilot]);

  // Game loop tick
  useEffect(() => {
    if (!isOpen || !isPlaying || isGameOver) return;

    const tickSpeed = isAutopilot ? 65 : 120;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        let currentNextDir = dirRef.current;

        if (isAutopilot) {
          currentNextDir = getNextAutopilotDirection(prevSnake, food, dirRef.current);
          setDirection(currentNextDir);
        }

        const head = { ...prevSnake[0] };
        head.x += currentNextDir.x;
        head.y += currentNextDir.y;

        // Collision check
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          playBeep(220, 0.3);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          playBeep(220, 0.3);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          playBeep(1200, 0.08);
          setScore(s => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('crt_snake_highscore', nextScore.toString());
            }
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, tickSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, isGameOver, food, highScore, isAutopilot]);

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
          maxWidth: '520px',
          background: 'rgba(14, 10, 2, 0.98)',
          border: '1px solid var(--border-amber)',
          boxShadow: '0 0 50px var(--amber-glow)',
          padding: '24px'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-amber)', pb: '12px' }}>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--amber-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>[GAME] CYBER-SNAKE CRT v2.1</span>
          </div>

          <button onClick={onClose} className="terminal-link" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <X size={14} />
            <span>FECHAR</span>
          </button>
        </div>

        {/* Scoreboard Bar & Autopilot Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.85rem', fontWeight: '700', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ color: 'var(--amber-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>PONTOS:</span>
            <span style={{ color: 'var(--amber-bright)', fontSize: '1.1rem' }}>{score}</span>
          </div>

          <div style={{ color: 'var(--amber-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={14} color="var(--amber-bright)" />
            <span>RECORD:</span>
            <span style={{ color: 'var(--amber-bright)', fontSize: '1.1rem' }}>{highScore}</span>
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
            title="Ativar/Desativar Autopiloto"
          >
            <Bot size={14} />
            <span>{isAutopilot ? 'AUTOPILOT: ON' : 'AUTOPILOT: OFF'}</span>
          </button>
        </div>

        {/* Game Canvas Area */}
        <div
          style={{
            width: '100%',
            aspectRatio: '1/1',
            background: '#070500',
            border: '2px solid var(--border-amber)',
            borderRadius: '6px',
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '1px',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.9)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
            const isFoodItem = food.x === x && food.y === y;

            let bg = 'rgba(255, 176, 0, 0.03)';
            if (isHead) bg = 'var(--amber-bright)';
            else if (isBody) bg = 'var(--amber-primary)';
            else if (isFoodItem) bg = 'var(--amber-bright)';

            return (
              <div
                key={index}
                style={{
                  background: bg,
                  borderRadius: isFoodItem ? '50%' : '1px',
                  boxShadow: isHead || isFoodItem ? '0 0 8px var(--amber-glow)' : 'none',
                  transition: 'background 0.05s ease'
                }}
              />
            );
          })}

          {/* Overlay when game not playing or game over */}
          {(!isPlaying || isGameOver) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(7, 5, 0, 0.88)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              {isGameOver ? (
                <>
                  <div style={{ color: 'var(--amber-bright)', fontSize: '1.4rem', fontWeight: '900', marginBottom: '8px' }}>
                    GAME OVER
                  </div>
                  <div style={{ color: 'var(--amber-primary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Pontuação final: <strong>{score}</strong>
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--amber-primary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                  Use as <strong>setas do teclado</strong> ou ative o <strong>AUTOPILOT</strong> para a IA jogar!
                </div>
              )}

              <button
                onClick={startGame}
                className="terminal-link"
                style={{
                  background: 'var(--amber-primary)',
                  color: '#0d0a00',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: '800'
                }}
              >
                {isGameOver ? <RotateCcw size={16} /> : <Play size={16} />}
                <span>{isGameOver ? 'JOGAR NOVAMENTE' : 'INICIAR JOGO'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Direction Controls / Autopilot Notice */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          {isAutopilot ? (
            <div style={{ color: 'var(--amber-bright)', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center' }} className="crt-flicker">
              <div>&gt; ALGORITMO AUTOPILOTO ATIVO</div>
              <div style={{ color: 'var(--amber-dim)', fontSize: '0.76rem', marginTop: '2px' }}>
                o autopilot e meio burro :(
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => dirRef.current.y !== 1 && setDirection({ x: 0, y: -1 })}
                className="terminal-link"
                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
              >
                ▲
              </button>
              <div style={{ display: 'flex', gap: '20px' }}>
                <button
                  onClick={() => dirRef.current.x !== 1 && setDirection({ x: -1, y: 0 })}
                  className="terminal-link"
                  style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                >
                  ◀
                </button>
                <button
                  onClick={() => dirRef.current.x !== -1 && setDirection({ x: 1, y: 0 })}
                  className="terminal-link"
                  style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                >
                  ▶
                </button>
              </div>
              <button
                onClick={() => dirRef.current.y !== -1 && setDirection({ x: 0, y: 1 })}
                className="terminal-link"
                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
              >
                ▼
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
