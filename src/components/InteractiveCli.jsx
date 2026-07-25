import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, Send, Maximize2, Minimize2 } from 'lucide-react';

const PHILOSOPHY_QUOTES = [
  { text: "A vida não examinada não vale a pena ser vivida.", author: "Sócrates" },
  { text: "Aquele que tem um porquê para viver pode suportar quase qualquer como.", author: "Friedrich Nietzsche" },
  { text: "Penso, logo existo.", author: "René Descartes" },
  { text: "Você tem poder sobre sua mente - não sobre eventos externos. Perceba isso e você encontrará força.", author: "Marco Aurélio" },
  { text: "Nós somos o que fazemos repetidamente. A excelência, portanto, não é um ato, mas um hábito.", author: "Aristóteles" },
  { text: "Quem vence a si mesmo é o guerreiro mais poderoso.", author: "Lao Tsé" }
];

export default function InteractiveCli({ onOpenDiag }) {
  const [history, setHistory] = useState([
    { type: 'sys', text: 'Terminal interativo v2.6. Digite "help" para ver os comandos disponíveis.' }
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
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: `russi@terminal:~$ ${cmd}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'sys',
          text: `Comandos disponíveis:
- about    : Resumo sobre Russi
- skills   : Lista de tecnologias & habilidades
- projects : Projetos recentes em destaque
- diag     : Painel de diagnóstico do hardware CRT
- reset    : Restaura as bolinhas para a esfera inicial
- matrix   : Iniciar Matrix
- quote    : Citação filosófica
- uptime   : Status do sistema e tempo de atividade
- theme    : Alternar tema de cores completo (OS Standard / Cyan / Emerald)
- secret   : Arquivos confidenciais
- github   : Abrir repositório GitHub (russiHT)
- contact  : Formas de contato
- clear    : Limpar tela`
        });
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
• Alocação de Memória: 64MB
• Estado da Esfera : Ativa & Calibrada`
        });
        break;

      case 'secret':
        newHistory.push({
          type: 'sys',
          text: `> [CYBERDECK SECRET DIRECTORY]:
drwx------ 2 russi russi 4096 /vault/emotion_engine.dat
-rw-r--r-- 1 russi russi 1024 /vault/blade_runner_logs.txt
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
        newHistory.push({ type: 'sys', text: '> [SYS]: Inicializando protocolo...' });
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
          placeholder="Digite 'help'..."
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
