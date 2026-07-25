import React, { useState } from 'react';
import { X, Code, CheckCircle2, Copy, Cpu, Music, Shield, Terminal, Globe } from 'lucide-react';

const SITE_SNIPPETS = [
  {
    id: 'audio',
    title: '1. Sintetizador Web Audio API (Sons & Morse)',
    file: 'src/components/InteractiveCli.jsx',
    icon: Music,
    desc: 'Síntese de áudio feita em JS puro usando AudioContext e osciladores senoidais de 700Hz com controle de envelope exponencial de ganho.',
    code: `// Oscilador senoidal com envelope de ganho para bipes CRT
const playMorseBeeps = (morseString) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let startTime = audioCtx.currentTime + 0.05;
  const unit = 0.05; // 50ms unit per dot

  morseString.split('').forEach(char => {
    if (char === '.' || char === '-') {
      const duration = char === '.' ? unit : unit * 3;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, startTime);
      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
      startTime += duration + unit;
    }
  });
};`
  },
  {
    id: 'ai-snake',
    title: '2. IA Autopiloto com Busca em Largura (BFS)',
    file: 'src/components/RetroSnakeGameModal.jsx',
    icon: Cpu,
    desc: 'Algoritmo de IA no mini-game que mapeia os caminhos no mapa via fila BFS e guia a cobra automaticamente desviando de si mesma.',
    code: `// BFS Pathfinding para encontrar a rota mais curta até a comida
const getNextAutopilotDirection = (snake, food, currentDir) => {
  const head = snake[0];
  const queue = [[head]];
  const visited = new Set();
  visited.add(\`\${head.x},\${head.y}\`);

  while (queue.length > 0) {
    const path = queue.shift();
    const curr = path[path.length - 1];

    if (curr.x === food.x && curr.y === food.y) {
      const nextStep = path[1];
      return { x: nextStep.x - head.x, y: nextStep.y - head.y };
    }

    for (const dir of directions) {
      const nextPos = { x: curr.x + dir.x, y: curr.y + dir.y };
      const key = \`\${nextPos.x},\${nextPos.y}\`;
      if (isValid(nextPos) && !visited.has(key)) {
        visited.add(key);
        queue.push([...path, nextPos]);
      }
    }
  }
  return currentDir;
};`
  },
  {
    id: 'theme',
    title: '3. Engine de Temas Dinâmicos via CSS Variables',
    file: 'src/components/InteractiveCli.jsx',
    icon: Shield,
    desc: 'Sistema de temas CRT que injeta variáveis CSS nativas (--amber-primary, --amber-glow) em tempo de execução sem re-renderizar estilos.',
    code: `// Alterna paleta de cores globalmente alterando o root CSS
const toggleTheme = (themeName) => {
  const root = document.documentElement;

  if (themeName === 'emerald') {
    root.style.setProperty('--amber-primary', '#00ff66');
    root.style.setProperty('--amber-bright', '#55ff99');
    root.style.setProperty('--amber-glow', 'rgba(0, 255, 102, 0.6)');
    root.style.setProperty('--border-amber', 'rgba(0, 255, 102, 0.4)');
  } else if (themeName === 'cyan') {
    root.style.setProperty('--amber-primary', '#00f0ff');
    root.style.setProperty('--amber-bright', '#70f5ff');
    root.style.setProperty('--amber-glow', 'rgba(0, 240, 255, 0.6)');
    root.style.setProperty('--border-amber', 'rgba(0, 240, 255, 0.4)');
  }
};`
  },
  {
    id: 'github-api',
    title: '4. Conexão em Tempo Real com a API do GitHub',
    file: 'src/components/GithubStatsCard.jsx',
    icon: Globe,
    desc: 'Requisição assíncrona em paralelo via Promise.all buscando perfil e repositórios do GitHub com tratamento de cache offline.',
    code: `// Busca paralela de perfil e repositórios usando Promise.all
const fetchGithubStats = async () => {
  const [userRes, reposRes] = await Promise.all([
    fetch('https://api.github.com/users/russiHT'),
    fetch('https://api.github.com/users/russiHT/repos?per_page=100&sort=updated')
  ]);

  const userData = await userRes.json();
  const reposData = await reposRes.json();

  const totalStars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  return { publicRepos: userData.public_repos, totalStars };
};`
  },
  {
    id: 'sphere-3d',
    title: '5. Esfera 3D de Partículas (Mouse & Scroll)',
    file: 'src/components/ParticleSphereBg.jsx',
    icon: Terminal,
    desc: 'Projeção de perspectiva 3D (FOV) com campo de força repulsivo no movimento do mouse e rotação acelerada via evento de scroll.',
    code: `// Projeção 3D, força repulsiva do mouse e rotação pelo scroll
const handleMouseMove = (e) => {
  const normX = (e.clientX / width - 0.5) * 2;
  const normY = (e.clientY / height - 0.5) * 2;
  targetRotY = normX * 0.5;
  targetRotX = -normY * 0.5;

  applyPushForce(e.clientX, e.clientY, 110, 3.5);
};

const handleScroll = () => {
  targetScrollPos = window.scrollY;
};

// Aplica campo de força repulsiva no plano projetado 3D
const applyPushForce = (px, py, pushRadius, forceMultiplier) => {
  particles.forEach((p) => {
    const scale = fov / (fov + p.z + 100);
    const projX = centerX + p.x * scale;
    const projY = centerY + p.y * scale;

    const dx = projX - px;
    const dy = projY - py;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < pushRadius) {
      const force = (1 - dist / pushRadius) * forceMultiplier;
      const angle = Math.atan2(dy, dx);
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
    }
  });
};`
  },
  {
    id: 'passgen',
    title: '6. Gerador de Senhas Criptográficas (passgen)',
    file: 'src/components/InteractiveCli.jsx',
    icon: Shield,
    desc: 'Gera senhas seguras utilizando a API nativa window.crypto.getRandomValues com suporte a cópia direta.',
    code: `// Gerador de senhas aleatórias de alta entropia
const generatePassword = (len = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  const array = new Uint32Array(len);
  window.crypto.getRandomValues(array);
  let pass = '';
  for (let i = 0; i < len; i++) {
    pass += chars[array[i] % chars.length];
  }
  navigator.clipboard.writeText(pass);
  return pass;
};`
  },
  {
    id: 'typing-wpm',
    title: '7. Medidor de Velocidade de Digitação WPM',
    file: 'src/components/DevTypingSpeedModal.jsx',
    icon: Cpu,
    desc: 'Algoritmo que calcula a precisão e velocidade em WPM (Words Per Minute) comparando os caracteres digitados com o snippet alvo.',
    code: `// Cálculo de WPM e Precisão em tempo real
const handleInputChange = (e) => {
  const val = e.target.value;
  if (!startTime && val.length > 0) setStartTime(Date.now());

  let correctChars = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i] === targetCode[i]) correctChars++;
  }
  const currentAcc = val.length > 0 ? Math.floor((correctChars / val.length) * 100) : 100;
  setAccuracy(currentAcc);

  const timeInMinutes = (Date.now() - startTime) / 60000;
  const currentWpm = Math.floor((val.length / 5) / (timeInMinutes || 0.001));
  setWpm(currentWpm);
};`
  },
  {
    id: 'mines-bot',
    title: '8. Bot Autopiloto Solver do Campo Minado',
    file: 'src/components/RetroMinesweeperModal.jsx',
    icon: Terminal,
    desc: 'Loop de dedução lógica passo a passo que analisa células abertas, marca minas seguras e revela tiles livres.',
    code: `// Bot Autopiloto com priorização dos cantos e deduções determinísticas
useEffect(() => {
  if (!isOpen || !isPlaying || !isAutopilot) return;
  const botInterval = setInterval(() => {
    setBoard((prevBoard) => {
      // Regra A: Se vizinhos ocultos + marcados == minas -> Marca todas como mina
      // Regra B: Se minas marcadas == número -> Revela vizinhos livres restantes
      // Fallback: Escolha aleatória em um dos 4 cantos
    });
  }, 140);
  return () => clearInterval(botInterval);
}, [isOpen, isPlaying, isAutopilot]);`
  }
];

export default function SiteCodeSnippetsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSnippet = SITE_SNIPPETS[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        padding: '24px'
      }}
    >
      <div
        className="terminal-card"
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(14, 10, 2, 0.98)',
          border: '1px solid var(--border-amber)',
          boxShadow: '0 0 50px var(--amber-glow)',
          padding: '28px'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-amber)', pb: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code size={20} color="var(--amber-bright)" />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--amber-bright)' }}>
                INSPETOR DE CÓDIGO DO SITE (perfil v2.1)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)' }}>
                TRECHOS SELECIONADOS DA ENGENHARIA DO TERMINAL
              </div>
            </div>
          </div>

          <button onClick={onClose} className="terminal-link" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
            <X size={15} />
            <span>FECHAR</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {SITE_SNIPPETS.map((snip, idx) => {
            const IconComp = snip.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={snip.id}
                onClick={() => setActiveTab(idx)}
                className="terminal-link"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  background: isActive ? 'var(--amber-primary)' : 'var(--amber-soft-glow)',
                  color: isActive ? '#070500' : 'var(--amber-primary)',
                  fontWeight: '800'
                }}
              >
                <IconComp size={13} />
                <span>{snip.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Snippet Header & Description */}
        <div style={{ marginBottom: '16px', borderLeft: '3px solid var(--amber-primary)', paddingLeft: '12px' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--amber-bright)', marginBottom: '4px' }}>
            {currentSnippet.title}
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--amber-primary)', opacity: 0.9, lineHeight: 1.6 }}>
            {currentSnippet.desc}
          </div>
        </div>

        {/* Code Box */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--amber-dim)', fontWeight: '700' }}>
              &gt; {currentSnippet.file}:
            </span>
            <button
              onClick={handleCopy}
              className="terminal-link"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {copied ? <CheckCircle2 size={13} color="var(--amber-bright)" /> : <Copy size={13} />}
              <span>{copied ? 'COPIADO!' : 'COPIAR SNIPPET'}</span>
            </button>
          </div>

          <pre
            style={{
              background: '#070500',
              border: '1px solid var(--border-amber)',
              borderRadius: '6px',
              padding: '16px',
              fontSize: '0.82rem',
              color: 'var(--amber-bright)',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
            }}
          >
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--amber-dim)' }}>
            perfil v2.1 // russiHT
          </div>
        </div>
      </div>
    </div>
  );
}
