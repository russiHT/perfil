import React, { useState } from 'react';
import { Terminal, ExternalLink, Code2 } from 'lucide-react';
import ProjectCodeInspectorModal from './ProjectCodeInspectorModal';

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 'perfil',
      tag: 'PROJ_01',
      title: 'perfil — CRT Terminal Portfolio',
      desc: 'Portfólio interativo com estética retrô CRT: sintetizador de áudio via Web Audio API, esfera de partículas em Canvas 2D, CLI interativo e integração com a API do GitHub.',
      techStack: 'React.js, Vite, Canvas 2D, Web Audio API, Anime.js',
      architecturePattern: 'SPA / Event Driven Audio & WebGL Engine',
      githubUrl: 'https://github.com/russiHT/perfil',
      snippetFile: 'src/components/InteractiveCli.jsx',
      highlights: [
        'Motor de síntese de áudio retrô feito do zero usando a Web Audio API (frequências 700Hz para Código Morse).',
        'Esfera de partículas com projeção 3D própria em Canvas 2D e ligações de vizinhança aceleradas por grade espacial.',
        'Sincronização em tempo real com a REST API oficial do GitHub.'
      ],
      codeSnippet: `// Sintetizador de áudio CRT para frequências de código morse
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
      id: 'streetwear-shop',
      tag: 'PROJ_02',
      title: 'streetwear-shop — E-commerce Experience',
      desc: 'Aplicação Web de loja de roupas streetwear com carrinho dinâmico, navegação responsiva e gerenciamento de estado do pedido.',
      techStack: 'JavaScript (ES6+), HTML5, CSS3 Grid/Flexbox',
      architecturePattern: 'Componentized Modular JS / LocalStorage State',
      githubUrl: 'https://github.com/russiHT/streetwear-shop',
      snippetFile: 'src/js/cartManager.js',
      highlights: [
        'Gerenciamento de estado do carrinho sem bibliotecas externas via LocalStorage.',
        'Filtro dinâmico em tempo real de produtos por categoria, tamanho e preço.',
        'Animações suaves de feedback visual de adição ao carrinho.'
      ],
      codeSnippet: `// Gerenciador de estado do carrinho de compras em JS Vanilla
export class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('streetwear_cart')) || [];
  }

  addItem(product, size = 'M') {
    const existingIndex = this.cart.findIndex(
      item => item.id === product.id && item.size === size
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
    } else {
      this.cart.push({ ...product, size, quantity: 1 });
    }

    this.saveAndNotify();
  }

  saveAndNotify() {
    localStorage.setItem('streetwear_cart', JSON.stringify(this.cart));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: this.cart }));
  }
}`
    },
    {
      id: 'radar-animal',
      tag: 'PROJ_03',
      title: 'radar-animal — Geolocalização & Mapeamento',
      desc: 'Sistema web para identificação, registro e localização no mapa de ocorrências de animais resgatados ou perdidos.',
      techStack: 'JavaScript, Leaflet.js, OpenStreetMap API, Geolocation API',
      architecturePattern: 'Async API Mapping / Dynamic Marker Pins',
      githubUrl: 'https://github.com/russiHT/radar-animal',
      snippetFile: 'src/js/mapService.js',
      highlights: [
        'Integração com a Geolocation API para capturar coordenadas exatas no GPS do usuário.',
        'Plotagem dinâmica de marcadores customizados no mapa usando Leaflet.js.',
        'Filtro de busca por raio de distância e tipo de animal.'
      ],
      codeSnippet: `// Serviço de captura de localização e inclusão no mapa Leaflet
export async function initRadarMap(containerId) {
  if (!navigator.geolocation) {
    throw new Error('Geolocalização não suportada no navegador');
  }

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const map = L.map(containerId).setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup('<b>Você está aqui</b><br>Radar ativo.')
      .openPopup();
  });
}`
    },
    {
      id: 'insinori',
      tag: 'PROJ_04',
      title: 'insinori — Sistema Backend Java Spring',
      desc: 'Aplicação backend desenvolvida em Java com Spring Boot, API RESTful, persistência com Hibernate/JPA e arquitetura em camadas.',
      techStack: 'Java 17, Spring Boot, PostgreSQL, Hibernate JPA, Maven',
      architecturePattern: 'Layered MVC (Controller - Service - Repository - DTO)',
      githubUrl: 'https://github.com/russiHT/insinori',
      snippetFile: 'src/main/java/com/insinori/controller/UsuarioController.java',
      highlights: [
        'Arquitetura em camadas limpas com isolamento entre DTOs e entidades de banco.',
        'Tratamento global de exceções customizado usando @ControllerAdvice.',
        'Persistência relacional otimizada com Spring Data JPA e PostgreSQL.'
      ],
      codeSnippet: `@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> criarUsuario(@Valid @RequestBody UsuarioCreateDTO dto) {
        UsuarioDTO novoUsuario = usuarioService.salvar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(novoUsuario.getId())
                .toUri();
        return ResponseEntity.created(location).body(novoUsuario);
    }
}`
    },
    {
      id: 'relatorio-pdf',
      tag: 'PROJ_05',
      title: 'relatorio-pdf — Gerador Automático em Python',
      desc: 'Script automatizado em Python para extração de dados tabulares e geração de relatórios corporativos em formato PDF estilizado.',
      techStack: 'Python 3.11, ReportLab, Pandas',
      architecturePattern: 'ETL Data Pipeline / PDF Canvas Exporter',
      githubUrl: 'https://github.com/russiHT/Gerador-relatorio-pdf',
      snippetFile: 'generator.py',
      highlights: [
        'Processamento automatizado de datasets em CSV/Excel usando Pandas.',
        'Desenho de tabelas e vetores direto no canvas PDF com a biblioteca ReportLab.',
        'Exportação rápida com cabeçalhos institucionais e numeração de páginas dinâmica.'
      ],
      codeSnippet: `# Gerador automático de relatório PDF com ReportLab e Pandas
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors

def gerar_pdf(caminho_csv, arquivo_saida):
    df = pd.read_csv(caminho_csv)
    doc = SimpleDocTemplate(arquivo_saida, pagesize=letter)
    elementos = []

    dados_tabela = [df.columns.to_list()] + df.values.tolist()
    tabela = Table(dados_tabela)
    tabela.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#ffb000')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.black),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#664600')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold')
    ]))
    elementos.append(tabela)
    doc.build(elementos)`
    },
    {
      id: 'carro',
      tag: 'PROJ_06',
      title: 'carro — Simulador & Telemetria ECU',
      desc: 'Simulador de ECU de injeção eletrônica desenvolvido em C acoplado a um painel de telemetria em tempo real (Python/Tkinter) via Sockets TCP local.',
      techStack: 'C (Sockets POSIX/Winsock), Python 3 (Tkinter, Sockets TCP)',
      architecturePattern: 'Client-Server / Real-Time TCP Telemetry Data Pipeline',
      githubUrl: 'https://github.com/russiHT/carro',
      snippetFile: 'simulator.c',
      highlights: [
        'Comunicação bidirecional em tempo real via Sockets TCP (127.0.0.1:5555) transmitindo JSON a ~50 Hz.',
        'Simulador de física de motor em C (curva de torque, arrasto, corte de giro 3-step e serrilha no limitador).',
        'Painel GUI responsivo em Python/Tkinter com reconexão automática e gravações de datalog.'
      ],
      codeSnippet: `/* simulator.c — Modelo de motor e transmissão de telemetria TCP em C */
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define IDLE_RPM   900.0
#define LIMIT_RPM  7800.0
#define LAUNCH_RPM 4200.0

/* Estado do motor e telemetria */
typedef struct {
  double rpm;
  double speed_kmh;
  double tps;
  double clt;
  double map_kpa;
  double afr;
  int gear;
  int cut_state;
} Engine;

// Transmissão de telemetria serializada em JSON por TCP (~50 Hz)
int enviar_frame_telemetria(sock_t client_fd, const Engine *e) {
  char payload[512];
  snprintf(payload, sizeof(payload),
    "{\\"rpm\\":%.1f,\\"tps\\":%.1f,\\"map\\":%.1f,\\"afr\\":%.2f,\\"gear\\":%d}\\n",
    e->rpm, e->tps, e->map_kpa, e->afr, e->gear);
  return send(client_fd, payload, strlen(payload), SEND_FLAGS);
}`
    }
  ];

  return (
    <section style={{ marginBottom: '80px' }}>
      {/* Section Title */}
      <div 
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          border: '1px solid var(--border-amber)',
          background: 'var(--amber-soft-glow)',
          fontSize: '0.8rem',
          color: 'var(--amber-primary)',
          fontWeight: '700',
          letterSpacing: '1px',
          marginBottom: '16px'
        }}
      >
        {'// registros_de_projetos'}
      </div>

      <h2 
        className="amber-glow-text"
        style={{
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '32px'
        }}
      >
        ## o que ando desenvolvendo
      </h2>

      {/* Projects Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
        {projects.map((proj) => (
          <div key={proj.id} className="terminal-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--amber-dim)', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={15} color="var(--amber-primary)" /> {proj.tag}
                </span>
                <span style={{ color: 'var(--amber-primary)', fontWeight: '700' }}>[VERIFIED]</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px', color: 'var(--amber-bright)' }}>
                {proj.title}
              </h3>

              <p style={{ color: 'var(--amber-primary)', opacity: 0.85, fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '18px' }}>
                {proj.desc}
              </p>

              <div style={{ fontSize: '0.78rem', color: 'var(--amber-dim)', marginBottom: '20px' }}>
                <strong style={{ color: 'var(--amber-primary)' }}>Stack:</strong> {proj.techStack}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedProject(proj)}
                className="terminal-link"
                style={{ padding: '8px 14px', fontSize: '0.8rem', background: 'var(--amber-primary)', color: '#0d0a00', fontWeight: '800' }}
              >
                <Code2 size={14} />
                <span>VER CÓDIGO & ARQUITETURA</span>
              </button>

              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="terminal-link"
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                title="Abrir no GitHub"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Code Inspector Drawer/Modal */}
      <ProjectCodeInspectorModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
