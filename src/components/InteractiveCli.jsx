import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, Send, Maximize2, Minimize2, Gamepad2 } from 'lucide-react';

const PHILOSOPHY_QUOTES = [
  { text: "A vida não examinada não vale a pena ser vivida.", author: "Sócrates" },
  { text: "Aquele que tem um porquê para viver pode suportar quase qualquer como.", author: "Friedrich Nietzsche" },
  { text: "Penso, logo existo.", author: "René Descartes" },
  { text: "Você tem poder sobre sua mente - não sobre eventos externos. Perceba isso e você encontrará força.", author: "Marco Aurélio" },
  { text: "Nós somos o que fazemos repetidamente. A excelência, portanto, não é um ato, mas um hábito.", author: "Aristóteles" },
  { text: "Quem vence a si mesmo é o guerreiro mais poderoso.", author: "Lao Tsé" }
];

const MORSE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const REVERSE_MORSE_MAP = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

const encodeToMorse = (str) => {
  return str.toUpperCase().split('').map(char => MORSE_MAP[char] || char).join(' ');
};

const decodeFromMorse = (morseStr) => {
  return morseStr.split(' ').map(symbol => REVERSE_MORSE_MAP[symbol] || symbol).join('');
};

const playMorseBeeps = (morseString) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let startTime = audioCtx.currentTime + 0.05;
    const unit = 0.05; // 50ms unit

    // Play first 60 symbols max
    const symbols = morseString.slice(0, 60).split('');

    symbols.forEach(char => {
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
      } else if (char === ' ') {
        startTime += unit * 2;
      } else if (char === '/') {
        startTime += unit * 4;
      }
    });
  } catch (e) {
    // Audio Context fallback
  }
};

export default function InteractiveCli({ onOpenDiag }) {
  const [history, setHistory] = useState([
    { type: 'sys', text: 'Terminal interativo v2.1. Digite "help" para ver os comandos disponíveis.' }
  ]);
  const [input, setInput] = useState('');
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const outputRef = useRef(null);

  const triggerResetSphere = () => {
    window.dispatchEvent(new CustomEvent('reset-sphere'));
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (!isMatrixActive) return;

    const chars = '01ABCDEFGHJKLMNPQRSTUVWXYZ$#@%&*+=?/<>';
    let count = 0;

    const interval = setInterval(() => {
      count++;
      let matrixLine = '';
      for (let i = 0; i < 45; i++) {
        matrixLine += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
      }

      setHistory(prev => [
        ...prev,
        { type: 'matrix', text: `> MATRIX_STREAM [${count.toString().padStart(3, '0')}]: ${matrixLine}` }
      ]);

      if (count >= 15) {
        clearInterval(interval);
        setIsMatrixActive(false);
        setHistory(prev => [
          ...prev,
          { type: 'sys', text: '> [SYS]: Conexão Matrix finalizada. Linha de comando restaurada.' }
        ]);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isMatrixActive]);

  const handleCommand = (e) => {
    e.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) return;

    const parts = rawInput.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const newHistory = [...history, { type: 'user', text: `russi@terminal:~$ ${rawInput}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'sys',
          text: `Comandos disponíveis:
- about             : Resumo sobre Russi
- skills            : Habilidades & Tecnologias
- projects          : Projetos recentes em destaque
- snake / game   : Jogar mini-game retrô Cyber-Snake CRT
- morse <texto>     : Codificar texto para Código Morse (com áudio bip CRT)
- unmorse <código>  : Decodificar Código Morse para texto
- b64encode <texto> : Codificar texto para Base64
- b64decode <hash>  : Decodificar Base64 para texto
- json <string>     : Validar e formatar string JSON
- diag              : Painel de diagnóstico do hardware CRT
- reset             : Restaura as bolinhas para a esfera inicial
- matrix            : Iniciar chuva de código Matrix
- quote             : Citação filosófica
- uptime            : Status do sistema e tempo de atividade
- theme             : Alternar tema de cores (OS Standard / Cyan / Emerald)
- secret            : Arquivos confidenciais
- github            : Abrir repositório GitHub (russiHT)
- contact           : Formas de contato
- clear             : Limpar tela`
        });
        break;

      case 'snake':
      case 'game':
      case 'jogar':
        window.dispatchEvent(new CustomEvent('open-snake-game'));
        newHistory.push({ type: 'sys', text: '> [GAME ENGINE]: Inicializando Cyber-Snake CRT v2.1...' });
        break;

      case 'morse':
        if (!args) {
          newHistory.push({ type: 'sys', text: '> Uso: morse <texto_para_codificar> (ex: morse SOS)' });
        } else {
          const morseResult = encodeToMorse(args);
          playMorseBeeps(morseResult);
          newHistory.push({
            type: 'sys',
            text: `> [MORSE ENCODER]: "${args}" -> ${morseResult}\n> [AUDIO]: Transmitindo frequências de bip CRT (700Hz)...`
          });
        }
        break;

      case 'unmorse':
        if (!args) {
          newHistory.push({ type: 'sys', text: '> Uso: unmorse <codigo_morse> (ex: unmorse ... --- ...)' });
        } else {
          const decodedResult = decodeFromMorse(args);
          newHistory.push({
            type: 'sys',
            text: `> [MORSE DECODER]: ${args} -> "${decodedResult}"`
          });
        }
        break;

      case 'b64encode':
        if (!args) {
          newHistory.push({ type: 'sys', text: '> Uso: b64encode <texto> (ex: b64encode hello)' });
        } else {
          try {
            const b64 = btoa(args);
            newHistory.push({ type: 'sys', text: `> [BASE64 ENCODE]: "${args}" -> ${b64}` });
          } catch (err) {
            newHistory.push({ type: 'sys', text: '> [ERRO]: Texto inválido para codificação Base64.' });
          }
        }
        break;

      case 'b64decode':
        if (!args) {
          newHistory.push({ type: 'sys', text: '> Uso: b64decode <hash_base64> (ex: b64decode aGVsbG8=)' });
        } else {
          try {
            const decoded = atob(args);
            newHistory.push({ type: 'sys', text: `> [BASE64 DECODE]: ${args} -> "${decoded}"` });
          } catch (err) {
            newHistory.push({ type: 'sys', text: '> [ERRO]: Hash Base64 inválido.' });
          }
        }
        break;

      case 'json':
        if (!args) {
          newHistory.push({ type: 'sys', text: '> Uso: json <string_json> (ex: json {"status":"ok"})' });
        } else {
          try {
            const parsed = JSON.parse(args);
            const formatted = JSON.stringify(parsed, null, 2);
            newHistory.push({ type: 'sys', text: `> [JSON FORMATTER & VALIDATOR]: OK!\n${formatted}` });
          } catch (err) {
            newHistory.push({ type: 'sys', text: `> [ERRO JSON]: String JSON inválida — ${err.message}` });
          }
        }
        break;

      case 'diag':
      case 'status':
        if (onOpenDiag) onOpenDiag();
        newHistory.push({ type: 'sys', text: '> [SYS]: Painel de Diagnóstico do Sistema inicializado.' });
        break;

      case 'skills':
        newHistory.push({
          type: 'sys',
          text: `[HABILIDADES & TECNOLOGIAS]:
• Frontend   : React.js, JavaScript (ES6+), HTML5, CSS3
• Backend    : Java (Spring), Python
• Animações  : Anime.js v4, WebGL Canvas 3D, CSS Animations
• Ferramentas: Vite, Git, GitHub, Node.js, Maven`
        });
        break;

      case 'projects':
        newHistory.push({
          type: 'sys',
          text: `[PROJETOS DESTAQUE]:
1. perfil          — CRT Terminal Portfolio (JS/React) · github.com/russiHT/perfil
2. streetwear-shop — Streetwear Shop Experience (JS)   · github.com/russiHT/streetwear-shop
3. radar-animal    — Radar Animal (JavaScript)         · github.com/russiHT/radar-animal
4. insinori        — Projeto Java                     · github.com/russiHT/insinori
5. relatorio-pdf   — Gerador de Relatório PDF (Python) · github.com/russiHT/Gerador-relatorio-pdf`
        });
        break;

      case 'quote':
        const randomQuote = PHILOSOPHY_QUOTES[Math.floor(Math.random() * PHILOSOPHY_QUOTES.length)];
        newHistory.push({
          type: 'sys',
          text: `> "${randomQuote.text}" — ${randomQuote.author}.`
        });
        break;

      case 'uptime':
        newHistory.push({
          type: 'sys',
          text: `> [SYS STATUS]:
• Uptime           : 24/7 ONLINE
• Latência         : 0.4ms (Local Engine)
• Alocação Memória : 64MB
• Estado da Esfera : Ativa & Calibrada`
        });
        break;

      case 'secret':
        newHistory.push({
          type: 'sys',
          text: `> [CYBERDECK SECRET DIRECTORY]:
drwx------ 2 russi russi 4096 /vault/emotion_engine.dat
-rw-r--r-- 1 russi russi 1024 /vault/morse_frequencies.wav
-rw-r--r-- 1 russi russi 2048 /vault/3d_sphere_matrix.cpp
> Status: ACESSO AUTORIZADO. Nível de segurança: RUSSI_LEVEL_9.`
        });
        break;

      case 'theme':
        const root = document.documentElement;
        const currentAmber = getComputedStyle(root).getPropertyValue('--amber-primary').trim();

        if (currentAmber === '#00f0ff') {
          root.style.setProperty('--amber-primary', '#00ff66');
          root.style.setProperty('--amber-bright', '#55ff99');
          root.style.setProperty('--amber-glow', 'rgba(0, 255, 102, 0.6)');
          root.style.setProperty('--amber-soft-glow', 'rgba(0, 255, 102, 0.2)');
          root.style.setProperty('--amber-dim', '#009933');
          root.style.setProperty('--border-amber', 'rgba(0, 255, 102, 0.4)');
          newHistory.push({ type: 'sys', text: '> [TEMA COMPLETO]: Sistema alterado para Emerald Matrix (#00ff66).' });
        } else if (currentAmber === '#00ff66') {
          root.style.setProperty('--amber-primary', '#ffb000');
          root.style.setProperty('--amber-bright', '#ffd000');
          root.style.setProperty('--amber-glow', 'rgba(255, 176, 0, 0.6)');
          root.style.setProperty('--amber-soft-glow', 'rgba(255, 176, 0, 0.2)');
          root.style.setProperty('--amber-dim', '#b37b00');
          root.style.setProperty('--border-amber', 'rgba(255, 176, 0, 0.4)');
          newHistory.push({ type: 'sys', text: '> [TEMA COMPLETO]: Sistema restaurado para OS Standard (#ffb000).' });
        } else {
          root.style.setProperty('--amber-primary', '#00f0ff');
          root.style.setProperty('--amber-bright', '#70f5ff');
          root.style.setProperty('--amber-glow', 'rgba(0, 240, 255, 0.6)');
          root.style.setProperty('--amber-soft-glow', 'rgba(0, 240, 255, 0.2)');
          root.style.setProperty('--amber-dim', '#0088b3');
          root.style.setProperty('--border-amber', 'rgba(0, 240, 255, 0.4)');
          newHistory.push({ type: 'sys', text: '> [TEMA COMPLETO]: Sistema alterado para Cyan CRT (#00f0ff).' });
        }
        break;

      case 'reset':
      case 'sphere':
      case 'reset-sphere':
        triggerResetSphere();
        newHistory.push({
          type: 'sys',
          text: '> [SYS]: Esfera 3D recalibrada e restaurada às coordenadas matriciais iniciais'
        });
        break;

      case 'matrix':
        newHistory.push({ type: 'sys', text: '> [SYS]: Inicializando protocolo Matrix...' });
        setIsMatrixActive(true);
        break;

      case 'about':
        newHistory.push({ type: 'sys', text: 'Russi — Transmitindo da linha de comando. Apaixonado por código retrô, monitores CRT e estetismo mono.' });
        break;

      case 'github':
        newHistory.push({ type: 'sys', text: 'Abrindo https://github.com/russiHT...' });
        window.open('https://github.com/russiHT', '_blank');
        break;

      case 'contact':
        newHistory.push({ type: 'sys', text: 'Instagram: @grussi_\nGitHub: russiHT\nEmail: gustavorussi07@gmail.com\nDiscord: russizin' });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push({ type: 'sys', text: `Comando não reconhecido: "${cmd}". Digite "help" para ver as opções.` });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div
      className="terminal-card"
      style={{
        marginBottom: '80px',
        padding: '20px',
        ...(isFullscreen ? {
          position: 'fixed',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          zIndex: 150,
          marginBottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 0 50px var(--amber-glow)'
        } : {})
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber-dim)', fontSize: '0.8rem', fontWeight: '700' }}>
          <TermIcon size={16} color="var(--amber-primary)" />
          <span>CLI INTERATIVO // INTERACTIVE COMMAND PROMPT</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-snake-game'))}
            className="terminal-link"
            style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--amber-soft-glow)' }}
            title="Jogar Mini-Game Retrô"
          >
            <Gamepad2 size={13} />
            <span>JOGAR SNAKE</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="terminal-link"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? 'Sair Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      <div
        ref={outputRef}
        style={{
          maxHeight: isFullscreen ? 'calc(100vh - 160px)' : '220px',
          flex: isFullscreen ? 1 : 'none',
          overflowY: 'auto',
          marginBottom: '14px',
          fontFamily: 'monospace',
          fontSize: isFullscreen ? '0.95rem' : '0.85rem',
          lineHeight: 1.6
        }}
      >
        {history.map((h, i) => (
          <div
            key={i}
            style={{
              color: h.type === 'user'
                ? 'var(--amber-bright)'
                : h.type === 'matrix'
                  ? '#00ff66'
                  : 'var(--amber-primary)',
              opacity: h.type === 'user' ? 1 : 0.88,
              whiteSpace: 'pre-wrap',
              marginBottom: '4px',
              textShadow: h.type === 'matrix' ? '0 0 8px #00ff66' : 'none'
            }}
          >
            {h.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: 'var(--amber-bright)', fontWeight: '700' }}>russi@terminal:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite 'help', 'morse SOS', 'json'... "
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border-amber)',
            color: 'var(--amber-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            outline: 'none',
            padding: '4px 0'
          }}
        />
        <button
          type="submit"
          className="terminal-link"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
