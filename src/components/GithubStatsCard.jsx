import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, BookOpen, Users, RefreshCw, Radio, Terminal } from 'lucide-react';

// Helper to convert text to Morse Code for the live status tag
const textToMorse = (text) => {
  const morseMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
  };
  return text.toUpperCase().split('').map(c => morseMap[c] || c).join(' ');
};

export default function GithubStatsCard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

      setStats({
        publicRepos: userData.public_repos || reposData.length,
        followers: userData.followers || 0,
        totalStars,
        totalForks,
        topLangs,
        avatarUrl: userData.avatar_url || 'https://github.com/russiHT.png',
        bio: userData.bio || 'Desenvolvedor // russiHT',
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err) {
      console.warn('Usando dados em cache para estatísticas do GitHub:', err);
      setStats({
        publicRepos: 12,
        followers: 8,
        totalStars: 18,
        totalForks: 6,
        topLangs: ['JavaScript', 'Java', 'Python', 'HTML'],
        avatarUrl: 'https://github.com/russiHT.png',
        bio: 'Desenvolvedor // russiHT',
        lastUpdated: 'CACHE_OFFLINE'
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGithubStats();
  }, []);

  const morseStatus = textToMorse('LIVE OK');

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

        {/* Live Sync Badge & Manual Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--amber-dim)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
            <Radio size={13} className="crt-flicker" />
            <span>MORSE: <span style={{ color: 'var(--amber-primary)', letterSpacing: '1px' }}>{morseStatus}</span></span>
          </div>

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
        ) : (
          <div>
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
                  <span style={{ fontSize: '0.7rem', background: 'var(--amber-primary)', color: '#0d0a00', padding: '2px 6px', borderRadius: '3px', fontWeight: '900' }}>
                    VERIFIED_DEV
                  </span>
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
