import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock data for demonstration purposes

const HERO_PLAYERS = [
  { name: 'Erling Haaland', club: 'Man City', pos: 'FW', score: 74.2, stats: { Gls: 27, xG: 24.1, SCA90: 2.1 } },
  { name: 'Lamine Yamal', club: 'Barcelona', pos: 'FW', score: 74.2, stats: { Ast: 14, SCA90: 5.2, PrgP: 87 } },
  { name: 'Florian Wirtz', club: 'Leverkusen', pos: 'MF', score: 72.8, stats: { Ast: 11, SCA90: 4.8, KP: 64 } },
  { name: 'Pedri', club: 'Barcelona', pos: 'MF', score: 71.4, stats: { Ast: 8, PrgP: 124, Cmp: 91 } },
]

const TOP_MARKET = [
  { rank: 1, name: 'Michael Olise', club: 'Bayern Munich', pos: 'FW', age: 22, score: 74.6 },
  { rank: 2, name: 'Lamine Yamal', club: 'Barcelona', pos: 'FW', age: 17, score: 74.2 },
  { rank: 3, name: 'Florian Wirtz', club: 'Leverkusen', pos: 'MF', age: 21, score: 72.8 },
  { rank: 4, name: 'Pedri', club: 'Barcelona', pos: 'MF', age: 21, score: 71.4 },
  { rank: 5, name: 'Rayan Cherki', club: 'Lyon', pos: 'MF', age: 20, score: 70.7 },
  { rank: 6, name: 'Cole Palmer', club: 'Chelsea', pos: 'MF', age: 22, score: 68.7 },
  { rank: 7, name: 'Bradley Barcola', club: 'Paris S-G', pos: 'FW', age: 21, score: 67.3 },
  { rank: 8, name: 'Xavi Simons', club: 'RB Leipzig', pos: 'MF', age: 21, score: 66.4 },
]

const TOP_BY_POS = [
  { pos: 'FW', label: 'Forward', player: 'Erling Haaland', club: 'Man City', stat: 'Gls', val: 27, score: 74.2 },
  { pos: 'MF', label: 'Midfielder', player: 'Florian Wirtz', club: 'Leverkusen', stat: 'SCA90', val: 4.8, score: 72.8 },
  { pos: 'DF', label: 'Defender', player: 'Rúben Dias', club: 'Man City', stat: 'Clr', val: 89, score: 64.1 },
  { pos: 'GK', label: 'Goalkeeper', player: 'Alisson', club: 'Liverpool', stat: 'Save%', val: '74%', score: 61.3 },
]

const DESTAQUES = [
  { name: 'Kylian Mbappé', club: 'Real Madrid', pos: 'FW', trend: '+12%', reason: '8 goals in the last 5 matches', score: 71.8 },
  { name: 'Cole Palmer', club: 'Chelsea', pos: 'MF', trend: '+8%', reason: 'SCA90 of 4.3 — top 5 in the league', score: 68.7 },
  { name: 'Nicolás Paz', club: 'Como', pos: 'MF', trend: '+15%', reason: 'Serie A breakout star — Market Index rising', score: 66.1 },
]

const LEAGUES = [
  { name: 'Premier League', abbr: 'PL', color: '#00ff87' },
  { name: 'La Liga', abbr: 'LL', color: '#ff6b35' },
  { name: 'Bundesliga', abbr: 'BL', color: '#ff4444' },
  { name: 'Serie A', abbr: 'SA', color: '#0099ff' },
  { name: 'Ligue 1', abbr: 'L1', color: '#ffffff' },
]

const POS_COLORS = {
  FW: { bg: 'rgba(255,80,80,0.15)', text: '#e07575' },
  MF: { bg: 'rgba(0,255,135,0.15)', text: '#4caf82' },
  DF: { bg: 'rgba(0,180,255,0.15)', text: '#5a9fc2' },
  GK: { bg: 'rgba(255,150,50,0.15)', text: '#e8935a' },
}

//HELPERS 

function PosTag({ pos, highlight = false }) {
  const c = POS_COLORS[pos] || POS_COLORS.MF
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
      style={{ background: 'transparent', border: `1px solid ${highlight ? c.text : '#2d2d2d'}`, color: c.text }}>
      {pos}
    </span>
  )
}
function ScoreBar({ score, color = 'linear-gradient(90deg,#c9a84c,#e8d5a0)' }) {
  return (
    <div className="h-1 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div className="h-1 rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: color }} />
    </div>
  )
}

// HERO PLAYER CARD 

function HeroPlayerCard({ player }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer"
      style={{
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,15,0.5)',
        border: hovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        width: '230px',
      }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white font-bold text-sm">{player.name}</p>
          <p className={`text-xs mt-0.5 transition-all duration-300 ${hovered ? 'text-gray-200 font-bold' : 'text-gray-500'}`}>{player.club}</p>
        </div>
        <PosTag pos={player.pos} />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] uppercase tracking-wider transition-all duration-300 ${hovered ? 'text-white font-bold' : 'text-gray-500'}`}>Market Index</span>
        <span className="font-black text-lg" style={{ color: '#c9a84c' }}>{player.score}</span>
      </div>
      <ScoreBar score={player.score} color="linear-gradient(90deg,#c9a84c,#e8d5a0)" />
      <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {Object.entries(player.stats).map(([key, val]) => (
          <div key={key} className="flex justify-between items-center">
            <span className={`text-[11px] transition-all duration-300 ${hovered ? 'text-white font-bold' : 'text-gray-500'}`}>{key}</span>
            <span className={`text-xs transition-colors ${hovered ? 'text-[#c9a84c] font-bold' : 'text-gray-300'}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// COUNT UP 

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, duration / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// SECTION HEADER 

function SectionHeader({ label, title, subtitle, light = false }) {
  return (
    <div className="text-center mb-12">
      <div className="mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full inline-block"
          style={{
            background: light ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.25)',
            color: '#c9a84c',
          }}>{label}</span>
      </div>
      <h2 className="text-4xl font-black mb-3"
        style={title === 'Players on Fire' ? {
          background: 'linear-gradient(90deg, #1a1a1a 0%, #c0392b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'inline-block',
        } : { color: light ? '#111827' : 'white' }}>{title}</h2>
      {subtitle && <p className={`text-sm max-w-md mx-auto ${light ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
    </div>
  )
}

// MAIN COMPONENT 
export default function HomePage() {
  const [query, setQuery] = useState('')
  const [leagueOffset, setLeagueOffset] = useState(0)
  const navigate = useNavigate()
  const repeated = [...LEAGUES, ...LEAGUES, ...LEAGUES, ...LEAGUES]

  useEffect(() => {
    const id = setInterval(() => {
      setLeagueOffset(prev => (prev + 0.4) % (LEAGUES.length * 160))
    }, 16)
    return () => clearInterval(id)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/player/${encodeURIComponent(query.trim())}`)
  }

  return (
    <div style={{ background: '#0a0a0f' }}>

      {/* HERO */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/src/images/estadio.avif" alt="stadium" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(5,5,8,0.65) 0%, rgba(5,5,8,0.4) 40%, rgba(5,5,8,0.8) 85%, rgba(5,5,8,1) 100%)'
          }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full">
          <div className="text-center">
            <h1 className="text-5xl font-black text-white mb-2">
              Discover the <span style={{ color: '#c9a84c' }}>DNA</span> of any player
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest" style={{ letterSpacing: '3px' }}>
              AI Scouting Engine · 2210 players · 2024/25 data
            </p>
          </div>

          <div className="flex items-stretch gap-4 flex-wrap justify-center">
            {HERO_PLAYERS.map((p, i) => <HeroPlayerCard key={i} player={p} />)}
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <input
              type="text" placeholder="e.g. Erling Haaland..."
              value={query} onChange={e => setQuery(e.target.value)}
              className="px-6 py-3 rounded-full text-white w-72 outline-none placeholder-gray-500 text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            />
            <button type="submit" className="px-6 py-3 rounded-full text-sm font-bold cursor-pointer transition-all hover:scale-105"
              style={{ background: '#c9a84c', color: '#0d1117' }}>
              Search 
            </button>
          </form>

          <div className="w-full overflow-hidden" style={{ maxWidth: '600px' }}>
            <div className="flex gap-4" style={{ transform: `translateX(-${leagueOffset}px)`, transition: 'none', width: 'max-content' }}>
              {repeated.map((l, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                  <span className="text-xs font-black" style={{ color: l.color }}>{l.abbr}</span>
                  <span className="text-gray-300 text-xs">{l.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-gray-500 text-xs tracking-widest uppercase" style={{ letterSpacing: '4px' }}>Scroll to explore</span>
          <div className="w-px h-8 animate-pulse" style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)' }} />
        </div>
      </div>

      {/* ANIMATED STATS */}
      <div className="py-24 px-8" style={{ background: '#0a0a0f' }}>
        <SectionHeader label="The Dataset" title="Numbers that speak for themselves" />
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: 2210, suffix: '', label: 'Players' },
            { val: 5, suffix: '', label: 'Top Leagues' },
            { val: 47, suffix: '', label: 'Metrics per Player' },
            { val: 270, suffix: '+', label: 'Minimum Minutes' },
          ].map((s, i) => (
            <div key={i} className="text-center p-8 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-5xl font-black mb-2" style={{ color: '#c9a84c' }}>
                <CountUp target={s.val} suffix={s.suffix} />
              </p>
              <p className="text-gray-500 text-sm uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TOP MARKET INDEX — light background  */}
      <div className="py-24 px-8" style={{ background: '#f5f3ee' }}>
        <SectionHeader light label="Ranking" title="Top Market Index" subtitle="Players with the highest market value calculated by our engine." />

        <div className="max-w-5xl mx-auto">
          {/* Top 3 — large cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {TOP_MARKET.slice(0, 3).map((p, i) => (
              <div key={i}
                className="rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1"
                style={{
                  background: i === 0 ? '#0a0a0f' : 'white',
                  border: i === 0 ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-black" style={{ color: i === 0 ? 'rgba(201,168,76,0.3)' : 'rgba(0,0,0,0.1)' }}>#{p.rank}</span>
                  <PosTag pos={p.pos} highlight />
                </div>
                <p className={`font-black text-xl mb-1 ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                <p className={`text-sm mb-4 ${i === 0 ? 'text-gray-500' : 'text-gray-400'}`}>{p.club} · {p.age} yrs</p>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs uppercase tracking-wider ${i === 0 ? 'text-gray-500' : 'text-gray-400'}`}>Market Index</span>
                  <span className="font-black text-2xl" style={{ color: '#c9a84c' }}>{p.score}</span>
                </div>
                <ScoreBar score={p.score} />
              </div>
            ))}
          </div>

          {/* Remaining — list */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            {TOP_MARKET.slice(3).map((p, i) => (
              <div key={i}
                className="flex items-center gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-gray-50"
                style={{ borderBottom: i < TOP_MARKET.slice(3).length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                <span className="text-xl font-black w-8 text-center" style={{ color: 'rgba(0,0,0,0.15)' }}>#{p.rank}</span>
                <div className="flex-1">
                  <p className="text-gray-900 font-bold text-sm">{p.name}</p>
                  <p className="text-gray-400 text-xs">{p.club} · {p.age} yrs</p>
                </div>
                <PosTag pos={p.pos} />
                <div className="w-24">
                  <ScoreBar score={p.score} color="#4a4a4a" />
                </div>
                <span className="font-black text-lg w-12 text-right" style={{ color: '#4a4a4a' }}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP BY POSITION */}
      <div className="py-24 px-8" style={{ background: '#0d1117' }}>
        <SectionHeader label="By Position" title="Best of Each Role" subtitle="The standout player at each position this season." />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {TOP_BY_POS.map((p, i) => {
            const c = POS_COLORS[p.pos] || POS_COLORS.MF
            return (
              <div key={i} className="rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${c.text}25`,
                }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.text }}>{p.label}</span>
                  <PosTag pos={p.pos} />
                </div>
                <p className="text-white font-black text-lg leading-tight mb-1">{p.player}</p>
                <p className="text-gray-500 text-xs mb-4">{p.club}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black" style={{ color: c.text }}>{p.val}</p>
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider">{p.stat}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black" style={{ color: '#99949e' }}>{p.score}</p>
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider">index</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* WEEKLY HIGHLIGHTS */}
      <div className="py-24 px-8" style={{ background: '#f5f3ee' }}>
        <SectionHeader light label="In Form" title="Players on Fire" subtitle="Players with the highest statistical growth recently." />
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {DESTAQUES.map((p, i) => (
            <div key={i}
              className="flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5"
              style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
              }}>
              <span className="text-3xl font-black w-8" style={{ color: 'rgba(0,0,0,0.1)' }}>{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-900 font-black text-lg">{p.name}</p>
                  <PosTag pos={p.pos} />
                </div>
                <p className="text-gray-400 text-sm">{p.club}</p>
                <p className="text-gray-500 text-xs mt-1">{p.reason}</p>
                {/* Progress bar tied to index score */}
                <div className="mt-3 h-1 rounded-full w-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <div className="h-1 rounded-full transition-all duration-700"
                    style={{ width: `${p.score}%`, background: 'linear-gradient(90deg, #1a1a1a, #c0392b)' }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black" style={{ color: '#22c55e' }}>{p.trend}</p>
                <p className="text-gray-400 text-xs">vs last week</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black" style={{ color: '#c9a84c' }}>{p.score}</p>
                <p className="text-gray-400 text-xs">index</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="py-32 px-8 text-center relative overflow-hidden" style={{ background: '#0a0a0f' }}>
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.5) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full inline-block mb-6"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c' }}>
            Get Started
          </span>
          <h2 className="text-5xl font-black text-white mb-4">
            Find the next<br /><span style={{ color: '#c9a84c' }}>hidden talent</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            2210 players. 47 metrics. One AI engine at your disposal.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/recommend')}
              className="px-8 py-4 rounded-full font-bold cursor-pointer transition-all hover:scale-105 text-sm"
              style={{ background: '#c9a84c', color: '#0d1117' }}>
              Explore Recommendations →
            </button>
            <button onClick={() => navigate('/compare')}
              className="px-8 py-4 rounded-full font-bold cursor-pointer transition-all hover:scale-105 text-sm text-white"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              Compare Players
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}