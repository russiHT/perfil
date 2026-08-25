import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, BookOpen, Users, RefreshCw } from 'lucide-react';

const CACHE_KEY = 'russi_github_stats_v1';

/** Lê o último resultado bem-sucedido gravado no navegador. */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function writeCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), payload }));
  } catch (err) {
    /* storage cheio ou bloqueado — seguimos sem cache */
  }
}

export default function GithubStatsCard() {
  // Hidrata na hora com o último dado real conhecido: o card já nasce
  // preenchido em vez de piscar "CONECTANDO...".
  const [stats, setStats] = useState(() => readCache()?.payload ?? null);
  const [loading, setLoading] = useState(() => readCache() === null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchGithubStats = async () => {
    setIsRefreshing(true);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch('https://api.github.com/users/russiHT'),
        fetch('https://api.github.com/users/russiHT/repos?per_page=100&sort=updated')
      ]);

      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API Rate Limit');

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      let totalStars = 0;
      let totalForks = 0;
      const langCounts = {};

      reposData.forEach(repo => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
      });

      const topLangs = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([lang]) => lang);

      const fresh = {
        publicRepos: userData.public_repos || reposData.length,
        followers: userData.followers || 0,
        totalStars,
        totalForks,
        topLangs,
        avatarUrl: userData.avatar_url || 'https://github.com/russiHT.png',
        bio: userData.bio || 'Desenvolvedor // russiHT',
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setStats(fresh);
      setIsStale(false);
      setHasError(false);
      writeCache(fresh);
    } catch (err) {
      // A API pública do GitHub permite 60 requisições por hora por IP.
      // Ao estourar esse limite mostramos o ÚLTIMO DADO REAL guardado, marcado
      // como desatualizado — antes eram exibidos números fixos e inventados
      // (12 repos, 18 stars) como se fossem estatísticas verdadeiras.
      console.warn('Falha ao consultar a API do GitHub:', err);
      const cached = readCache();

      if (cached?.payload) {
        setStats(cached.payload);
        setIsStale(true);
        setHasError(false);
      } else {
        setStats(null);
        setHasError(true);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGithubStats();
  }, []);

  return (
    <section style={{ marginBottom: '80px' }}>
      {/* Section Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2
          className="amber-glow-text"
          style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Github size={22} />
          <span>## /usr/github_live_stats</span>
        </h2>

        {/* Manual Refresh Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={fetchGithubStats}
            disabled={isRefreshing}
            className="terminal-link"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            title="Atualizar dados em tempo real com a API do GitHub"
          >
            <RefreshCw size={13} className={isRefreshing ? 'crt-flicker' : ''} />
            <span>{isRefreshing ? 'SYNCING...' : 'REFRESH API'}</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Card Container */}
      <div className="terminal-card" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--amber-dim)', fontSize: '0.9rem' }}>
            &gt; CONECTANDO À REST API DO GITHUB (api.github.com/users/russiHT)...
          </div>
        ) : hasError || !stats ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--amber-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <div>&gt; ESTATÍSTICAS INDISPONÍVEIS NO MOMENTO.</div>
            <div>&gt; A API pública do GitHub limita 60 consultas por hora. Tente novamente mais tarde.</div>
            <a
              href="https://github.com/russiHT"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--amber-primary)', textDecoration: 'underline' }}
            >
              Ver o perfil direto no GitHub
            </a>
          </div>
        ) : (
          <div>
            {isStale && (
              <div
                role="status"
                style={{
                  border: '1px solid var(--border-amber)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '16px',
                  fontSize: '0.78rem',
                  color: 'var(--amber-dim)'
                }}
              >
                &gt; Limite da API atingido — exibindo a última leitura real armazenada neste navegador.
              </div>
            )}

            {/* User Profile Header Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <img
                src={stats.avatarUrl}
                alt="russiHT GitHub Avatar"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '2px solid var(--amber-primary)',
                  boxShadow: '0 0 15px var(--amber-glow)'
                }}
              />
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--amber-bright)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>russiHT</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--amber-dim)', marginTop: '2px' }}>
                  {stats.bio} — Última sincronização: <span style={{ color: 'var(--amber-primary)' }}>{stats.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ border: '1px solid var(--border-amber)', padding: '14px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={13} /> REPOSITÓRIOS
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-bright)' }}>
                  {stats.publicRepos}
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-amber)', padding: '14px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={13} /> STARS TOTAIS
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-bright)' }}>
                  {stats.totalStars}
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-amber)', padding: '14px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GitFork size={13} /> FORKS
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-bright)' }}>
                  {stats.totalForks}
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-amber)', padding: '14px', borderRadius: '6px', background: 'var(--amber-soft-glow)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={13} /> SEGUIDORES
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--amber-bright)' }}>
                  {stats.followers}
                </div>
              </div>
            </div>

            {/* Top Languages Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--amber-dim)', fontWeight: '700' }}>&gt; Principais Linguagens:</span>
              {stats.topLangs.map((lang) => (
                <span
                  key={lang}
                  style={{
                    border: '1px solid var(--border-amber)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    color: 'var(--amber-primary)',
                    background: 'rgba(255, 176, 0, 0.08)',
                    fontWeight: '700'
                  }}
                >
                  #{lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
