export const INITIAL_USER = {
  username: "octocat",
  name: "The Octocat",
  bio: "Creative Full-Stack Architect & Open Source Craftsman ⚡ Building high-performance web experiences & UI design systems.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  location: "San Francisco, CA",
  website: "https://github.com",
  followers: 14200,
  following: 89,
  starsTotal: 4890,
  reposCount: 38
};

export const MOCK_PROJECTS = [
  {
    id: 1,
    name: "cyber-streetwear-ecommerce",
    title: "Streetwear Cyberpunk Store",
    description: "Futuristic e-commerce platform featuring 3D custom cursor interactive apparel preview, glassmorphism UI, and real-time inventory management.",
    language: "JavaScript",
    languageColor: "#f7df1e",
    stars: 1240,
    forks: 312,
    aspectRatio: "1.33", // Height multiplier for masonry
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
    topics: ["react", "threejs", "css-animations", "ecommerce", "tailwind"],
    updatedAt: "2026-07-20",
    homepage: "https://cyber-streetwear-demo.vercel.app",
    html_url: "https://github.com/octocat/cyber-streetwear-ecommerce",
    readme: `# Cyber Streetwear E-Commerce
An avant-garde online shopping experience inspired by cyberpunk aesthetics and high-end street fashion.

### Key Features:
- ⚡ **3D Interactive Preview**: Custom WebGL 3D cursor interactions.
- 🎨 **UI/UX Pro Max System**: Ultra dark mode with dynamic RGB neon glow effects.
- 🛒 **Instant Checkout**: Cart state sync with local storage & Stripe integration.
`
  },
  {
    id: 2,
    name: "ai-prompt-studio",
    title: "AI Prompt Studio Pro",
    description: "A sleek workspace for prompt engineers to design, test, benchmark, and optimize LLM prompts across GPT-4, Gemini 1.5, and Claude 3.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 2890,
    forks: 480,
    aspectRatio: "0.85",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    topics: ["typescript", "ai", "llm", "nextjs", "tailwindcss"],
    updatedAt: "2026-07-22",
    homepage: "https://ai-prompt-studio.dev",
    html_url: "https://github.com/octocat/ai-prompt-studio",
    readme: `# AI Prompt Studio Pro
Next-generation playground for engineering and version-controlling prompts.

### Features:
- 🧪 **Multi-Model Evaluation**: Side-by-side comparison.
- 📊 **Token & Latency Metrics**: Real-time cost calculations.
`
  },
  {
    id: 3,
    name: "quantum-ui-design-system",
    title: "Quantum UI Design System",
    description: "Accessible, zero-dependency component library built with modern CSS custom properties, micro-animations, and liquid glass visuals.",
    language: "CSS",
    languageColor: "#563d7c",
    stars: 890,
    forks: 145,
    aspectRatio: "1.15",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    topics: ["design-system", "css-animations", "web-components", "accessibility"],
    updatedAt: "2026-07-15",
    homepage: "https://quantum-ui.design",
    html_url: "https://github.com/octocat/quantum-ui-design-system",
    readme: `# Quantum UI Design System
84 UI styles, fluid layout tokens, and 60fps GPU-accelerated CSS animations.
`
  },
  {
    id: 4,
    name: "retro-synthwave-player",
    title: "Synthwave Audio Workstation",
    description: "Web Audio API synthesizer & visualizer featuring 80s neon aesthetic, custom audio filters, cassette deck controls, and MIDI device support.",
    language: "JavaScript",
    languageColor: "#f7df1e",
    stars: 760,
    forks: 98,
    aspectRatio: "1.45",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    topics: ["audio-api", "canvas", "synthwave", "retro", "javascript"],
    updatedAt: "2026-07-18",
    homepage: "https://synth-audio-workstation.app",
    html_url: "https://github.com/octocat/retro-synthwave-player",
    readme: `# Synthwave Audio Workstation
Interactive browser synth with retro VHS glitch filters and visualizer.
`
  },
  {
    id: 5,
    name: "hyper-matrix-dashboard",
    title: "HyperMatrix Financial Analytics",
    description: "Real-time crypto and stock analytics dashboard with SVG charting, live WebSocket ticker, and predictive sentiment graphs.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 1650,
    forks: 230,
    aspectRatio: "0.95",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80",
    topics: ["python", "fintech", "websockets", "charts", "analytics"],
    updatedAt: "2026-07-23",
    homepage: "https://hypermatrix-finance.io",
    html_url: "https://github.com/octocat/hyper-matrix-dashboard",
    readme: `# HyperMatrix Financial Analytics
High-frequency market data dashboard built with Python backend and React frontend.
`
  },
  {
    id: 6,
    name: "neon-game-engine-3d",
    title: "Neon WebGL 3D Engine",
    description: "Lightweight browser 3D game engine supporting deferred rendering, soft shadows, spatial audio, and physics collision system.",
    language: "Rust",
    languageColor: "#dea584",
    stars: 3400,
    forks: 512,
    aspectRatio: "1.25",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    topics: ["rust", "wasm", "webgl", "game-engine", "3d"],
    updatedAt: "2026-07-24",
    homepage: "https://neon-engine.org",
    html_url: "https://github.com/octocat/neon-game-engine-3d",
    readme: `# Neon WebGL 3D Engine
WebAssembly powered 3D engine built in Rust for ultra fast rendering.
`
  },
  {
    id: 7,
    name: "zen-minimal-notes",
    title: "Zen Minimalist Notes & Tasks",
    description: "Distraction-free markdown workspace with local encryption, bidirectional linking, graph view, and seamless cloud backup.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 520,
    forks: 64,
    aspectRatio: "1.10",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    topics: ["markdown", "note-taking", "pwa", "productivity"],
    updatedAt: "2026-07-12",
    homepage: "https://zen-notes.app",
    html_url: "https://github.com/octocat/zen-minimal-notes",
    readme: `# Zen Minimalist Notes
Local-first offline note application with Obsidian-style graph connection visuals.
`
  },
  {
    id: 8,
    name: "orbit-dev-tools-extension",
    title: "Orbit Chrome Developer Suite",
    description: "Browser extension for real-time CSS inspection, performance layout tracing, contrast checker, and instant snippet export.",
    language: "JavaScript",
    languageColor: "#f7df1e",
    stars: 940,
    forks: 110,
    aspectRatio: "0.90",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    topics: ["chrome-extension", "devtools", "productivity", "css"],
    updatedAt: "2026-07-19",
    homepage: "https://chromewebstore.google.com",
    html_url: "https://github.com/octocat/orbit-dev-tools-extension",
    readme: `# Orbit Chrome Developer Suite
Enhance your frontend workflow with instant layout auditing and CSS variable inspector.
`
  }
];

// Helper to map GitHub API repo response to portfolio format
export function transformGitHubRepo(repo, index) {
  const images = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  ];
  
  const ratios = ["0.9", "1.2", "1.4", "0.85", "1.1", "1.3"];
  
  const langColors = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    PHP: "#4F5D95",
    C: "#555555",
    "C++": "#f34b7d",
    Ruby: "#701516"
  };

  return {
    id: repo.id,
    name: repo.name,
    title: repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    description: repo.description || "No description provided for this GitHub repository.",
    language: repo.language || "Code",
    languageColor: langColors[repo.language] || "#6366f1",
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    aspectRatio: ratios[index % ratios.length],
    image: images[index % images.length],
    topics: repo.topics && repo.topics.length ? repo.topics : [(repo.language || "open-source").toLowerCase()],
    updatedAt: new Date(repo.updated_at).toISOString().split('T')[0],
    homepage: repo.homepage || repo.html_url,
    html_url: repo.html_url,
    readme: `# ${repo.name}\n\n${repo.description || "Explore this open-source repository directly on GitHub."}\n\nPrimary Language: ${repo.language || "N/A"}\nStars: ⭐ ${repo.stargazers_count}`
  };
}
