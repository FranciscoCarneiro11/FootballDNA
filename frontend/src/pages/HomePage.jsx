import { useState, useEffect } from 'react'

const MOCK_PLAYERS = [
  { name: 'Erling Haaland', club: 'Man City', pos: 'FW', score: 74.2, stats: { Gls: 27, xG: 24.1, SCA90: 2.1 } },
  { name: 'Lamine Yamal', club: 'Barcelona', pos: 'FW', score: 74.2, stats: { Ast: 14, SCA90: 5.2, PrgP: 87 } },
  { name: 'Florian Wirtz', club: 'Leverkusen', pos: 'MF', score: 72.8, stats: { Ast: 11, SCA90: 4.8, KP: 64 } },
  { name: 'Pedri', club: 'Barcelona', pos: 'MF', score: 71.4, stats: { Ast: 8, PrgP: 124, Cmp: 91 } },
]

const LEAGUES = [
  { name: 'Premier League', abbr: 'PL', color: '#00ff87' },
  { name: 'La Liga', abbr: 'LL', color: '#ff6b35' },
  { name: 'Bundesliga', abbr: 'BL', color: '#ff4444' },
  { name: 'Serie A', abbr: 'SA', color: '#0099ff' },
  { name: 'Ligue 1', abbr: 'L1', color: '#ffffff' },
]

const POS_COLORS = {
  FW: { bg: 'rgba(255,80,80,0.15)', text: '#ff6b6b' },
  MF: { bg: 'rgba(0,255,135,0.15)', text: '#00ff87' },
  DF: { bg: 'rgba(0,180,255,0.15)', text: '#00b4ff' },
}

function PlayerCard({ player }) {
  const [hovered, setHovered] = useState(false)
  const posColor = POS_COLORS[player.pos] || POS_COLORS.MF

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer"
      style={{
        background: hovered ? 'rgba(255, 255, 255, 0.07)' : 'rgba(10, 10, 15, 0.5)',
        border: hovered ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        width: '230px', 
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white font-bold text-sm">{player.name}</p>
          <p className={`text-xs mt-0.5 transition-all duration-300 ${hovered ? 'text-gray-200 font-bold' : 'text-gray-500 font-medium'}`}>
            {player.club}
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{ background: posColor.bg, color: posColor.text }}>
          {player.pos}
        </span>
      </div>

      {/* Market Index Section */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] uppercase tracking-wider transition-all duration-300 ${hovered ? 'text-white font-bold' : 'text-gray-500 font-medium'}`}>
          Market Index
        </span>
        <span className="font-black text-lg" style={{ color: '#00ff87' }}>{player.score}</span>
      </div>
      
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full transition-all duration-500"
          style={{ width: `${player.score}%`, background: 'linear-gradient(90deg, #00ff87, #00b4ff)', }} />
      </div>

      {/* Stats Section (Gls, xG, SCA90, etc) */}
      <div className="flex flex-col gap-2 pt-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {Object.entries(player.stats).map(([key, val]) => (
          <div key={key} className="flex justify-between items-center">
            <span className={`text-[11px] transition-all duration-300 ${hovered ? 'text-white font-bold' : 'text-gray-500 font-medium'}`}>
              {key}
            </span>
            <span className={`text-xs transition-colors ${hovered ? 'text-[#00ff87] font-bold' : 'text-gray-300'}`}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [offset, setOffset] = useState(0)
  const repeated = [...LEAGUES, ...LEAGUES, ...LEAGUES, ...LEAGUES]

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 0.4) % (LEAGUES.length * 160))
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Fundo */}
        <div className="absolute inset-0 z-0">
          <img src="/src/images/estadio.avif" alt="stadium"
            className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(5,5,8,0.65) 0%, rgba(5,5,8,0.4) 40%, rgba(5,5,8,0.8) 85%, rgba(5,5,8,1) 100%)'
          }} />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full">

          {/* Título */}
          <div className="text-center">
            <h1 className="text-5xl font-black text-white mb-2">
              Discover the{' '} <span style={{ color: '#c9a84c' }}>DNA</span>{' '} of any player
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase"
              style={{ letterSpacing: '3px' }}> An powered scouting engine · 2210 players
            </p>
          </div>

          {/* Cards grid */}
          <div className="flex items-stretch gap-4 flex-wrap justify-center">
            {MOCK_PLAYERS.map((player, i) => (
              <PlayerCard key={i} player={player} />
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Ex: Erling Haaland..." className="px-6 py-3 rounded-full text-white w-72 outline-none placeholder-gray-500 text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',backdropFilter: 'blur(8px)', }}/>
            <button
              className="px-6 py-3 rounded-full text-sm font-bold cursor-pointer transition-all hover:scale-105"
              style={{ background: '#c9a84c', color: '#0d1117', }}>
              Search →
            </button>
          </div>

          {/* Carrossel ligas */}
          <div className="w-full overflow-hidden" style={{ maxWidth: '600px' }}>
            <div className="flex gap-4"
              style={{ transform: `translateX(-${offset}px)`, transition: 'none', width: 'max-content' }}>
              {repeated.map((league, i) => (
                <div key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', }}>
                  <span className="text-xs font-black" style={{ color: league.color }}>{league.abbr}</span>
                  <span className="text-gray-300 text-xs">{league.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Scroll to explore */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-gray-500 text-xs tracking-widest uppercase" style={{ letterSpacing: '4px' }}>
            Scroll to explore
          </span>
          <div className="w-px h-8 animate-pulse"
            style={{ background: 'linear-gradient(to bottom, rgba(0,255,135,0.6), transparent)' }} />
        </div>

      </div>
    </div>
  )
}