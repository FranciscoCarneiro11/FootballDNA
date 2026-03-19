import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

// MOCK SIMILARITY 

const MOCK_RESULTS = {
  'Erling Haaland': {
    balanced: [
      { name: 'Robert Lewandowski', club: 'Barcelona', pos: 'FW', age: 35, comp: 'La Liga', score: 71.2, similarity: 0.982, stats: { Gls: 24, xG: 21.3, SCA90: 1.8 } },
      { name: 'Ermedin Demirović', club: 'Stuttgart', pos: 'FW', age: 26, comp: 'Bundesliga', score: 58.4, similarity: 0.979, stats: { Gls: 18, xG: 14.2, SCA90: 2.1 } },
      { name: 'Serhou Guirassy', club: 'Dortmund', pos: 'FW', age: 28, comp: 'Bundesliga', score: 61.3, similarity: 0.975, stats: { Gls: 21, xG: 17.8, SCA90: 1.9 } },
      { name: 'Jean-Philippe Mateta', club: 'Crystal Palace', pos: 'FW', age: 27, comp: 'Premier League', score: 55.1, similarity: 0.974, stats: { Gls: 16, xG: 13.1, SCA90: 1.6 } },
      { name: 'Artem Dovbyk', club: 'Roma', pos: 'FW', age: 27, comp: 'Serie A', score: 57.8, similarity: 0.973, stats: { Gls: 17, xG: 15.4, SCA90: 1.7 } },
    ],
    finisher: [
      { name: 'Robert Lewandowski', club: 'Barcelona', pos: 'FW', age: 35, comp: 'La Liga', score: 71.2, similarity: 0.991, stats: { Gls: 24, xG: 21.3, SCA90: 1.8 } },
      { name: 'Serhou Guirassy', club: 'Dortmund', pos: 'FW', age: 28, comp: 'Bundesliga', score: 61.3, similarity: 0.988, stats: { Gls: 21, xG: 17.8, SCA90: 1.9 } },
      { name: 'Artem Dovbyk', club: 'Roma', pos: 'FW', age: 27, comp: 'Serie A', score: 57.8, similarity: 0.984, stats: { Gls: 17, xG: 15.4, SCA90: 1.7 } },
      { name: 'Ermedin Demirović', club: 'Stuttgart', pos: 'FW', age: 26, comp: 'Bundesliga', score: 58.4, similarity: 0.981, stats: { Gls: 18, xG: 14.2, SCA90: 2.1 } },
      { name: 'Viktor Gyökeres', club: 'Sporting CP', pos: 'FW', age: 26, comp: 'Liga Portugal', score: 62.1, similarity: 0.977, stats: { Gls: 29, xG: 22.1, SCA90: 2.4 } },
    ],
    creator: [
      { name: 'Kylian Mbappé', club: 'Real Madrid', pos: 'FW', age: 25, comp: 'La Liga', score: 68.9, similarity: 0.961, stats: { Gls: 22, xG: 18.4, SCA90: 3.8 } },
      { name: 'Lautaro Martínez', club: 'Inter', pos: 'FW', age: 26, comp: 'Serie A', score: 64.2, similarity: 0.958, stats: { Gls: 19, xG: 16.2, SCA90: 2.9 } },
      { name: 'Harry Kane', club: 'Bayern Munich', pos: 'FW', age: 31, comp: 'Bundesliga', score: 63.8, similarity: 0.954, stats: { Gls: 25, xG: 22.8, SCA90: 3.1 } },
      { name: 'Artem Dovbyk', club: 'Roma', pos: 'FW', age: 27, comp: 'Serie A', score: 57.8, similarity: 0.948, stats: { Gls: 17, xG: 15.4, SCA90: 1.7 } },
      { name: 'Ermedin Demirović', club: 'Stuttgart', pos: 'FW', age: 26, comp: 'Bundesliga', score: 58.4, similarity: 0.941, stats: { Gls: 18, xG: 14.2, SCA90: 2.1 } },
    ],
    defender: [
      { name: 'Lautaro Martínez', club: 'Inter', pos: 'FW', age: 26, comp: 'Serie A', score: 64.2, similarity: 0.932, stats: { Gls: 19, xG: 16.2, SCA90: 2.9 } },
      { name: 'Harry Kane', club: 'Bayern Munich', pos: 'FW', age: 31, comp: 'Bundesliga', score: 63.8, similarity: 0.928, stats: { Gls: 25, xG: 22.8, SCA90: 3.1 } },
      { name: 'Kylian Mbappé', club: 'Real Madrid', pos: 'FW', age: 25, comp: 'La Liga', score: 68.9, similarity: 0.921, stats: { Gls: 22, xG: 18.4, SCA90: 3.8 } },
      { name: 'Jean-Philippe Mateta', club: 'Crystal Palace', pos: 'FW', age: 27, comp: 'Premier League', score: 55.1, similarity: 0.918, stats: { Gls: 16, xG: 13.1, SCA90: 1.6 } },
      { name: 'Serhou Guirassy', club: 'Dortmund', pos: 'FW', age: 28, comp: 'Bundesliga', score: 61.3, similarity: 0.912, stats: { Gls: 21, xG: 17.8, SCA90: 1.9 } },
    ],
  },
  'Lamine Yamal': {
    balanced: [
      { name: 'Michael Olise', club: 'Bayern Munich', pos: 'FW', age: 22, comp: 'Bundesliga', score: 74.6, similarity: 0.978, stats: { Ast: 11, SCA90: 6.5, PrgC: 88 } },
      { name: 'Rayan Cherki', club: 'Lyon', pos: 'MF', age: 20, comp: 'Ligue 1', score: 70.7, similarity: 0.971, stats: { Ast: 9, SCA90: 6.4, PrgC: 76 } },
      { name: 'Cole Palmer', club: 'Chelsea', pos: 'MF', age: 22, comp: 'Premier League', score: 68.7, similarity: 0.964, stats: { Ast: 10, SCA90: 4.3, PrgC: 71 } },
      { name: 'Florian Wirtz', club: 'Leverkusen', pos: 'MF', age: 21, comp: 'Bundesliga', score: 72.8, similarity: 0.958, stats: { Ast: 11, SCA90: 4.8, PrgC: 78 } },
      { name: 'Bradley Barcola', club: 'Paris S-G', pos: 'FW', age: 21, comp: 'Ligue 1', score: 67.3, similarity: 0.951, stats: { Ast: 8, SCA90: 4.1, PrgC: 82 } },
    ],
    finisher: [
      { name: 'Michael Olise', club: 'Bayern Munich', pos: 'FW', age: 22, comp: 'Bundesliga', score: 74.6, similarity: 0.969, stats: { Ast: 11, SCA90: 6.5, PrgC: 88 } },
      { name: 'Cole Palmer', club: 'Chelsea', pos: 'MF', age: 22, comp: 'Premier League', score: 68.7, similarity: 0.961, stats: { Ast: 10, SCA90: 4.3, PrgC: 71 } },
      { name: 'Florian Wirtz', club: 'Leverkusen', pos: 'MF', age: 21, comp: 'Bundesliga', score: 72.8, similarity: 0.954, stats: { Ast: 11, SCA90: 4.8, PrgC: 78 } },
      { name: 'Bradley Barcola', club: 'Paris S-G', pos: 'FW', age: 21, comp: 'Ligue 1', score: 67.3, similarity: 0.947, stats: { Ast: 8, SCA90: 4.1, PrgC: 82 } },
      { name: 'Rayan Cherki', club: 'Lyon', pos: 'MF', age: 20, comp: 'Ligue 1', score: 70.7, similarity: 0.941, stats: { Ast: 9, SCA90: 6.4, PrgC: 76 } },
    ],
    creator: [
      { name: 'Rayan Cherki', club: 'Lyon', pos: 'MF', age: 20, comp: 'Ligue 1', score: 70.7, similarity: 0.989, stats: { Ast: 9, SCA90: 6.4, PrgC: 76 } },
      { name: 'Michael Olise', club: 'Bayern Munich', pos: 'FW', age: 22, comp: 'Bundesliga', score: 74.6, similarity: 0.984, stats: { Ast: 11, SCA90: 6.5, PrgC: 88 } },
      { name: 'Cole Palmer', club: 'Chelsea', pos: 'MF', age: 22, comp: 'Premier League', score: 68.7, similarity: 0.978, stats: { Ast: 10, SCA90: 4.3, PrgC: 71 } },
      { name: 'Florian Wirtz', club: 'Leverkusen', pos: 'MF', age: 21, comp: 'Bundesliga', score: 72.8, similarity: 0.971, stats: { Ast: 11, SCA90: 4.8, PrgC: 78 } },
      { name: 'Bradley Barcola', club: 'Paris S-G', pos: 'FW', age: 21, comp: 'Ligue 1', score: 67.3, similarity: 0.964, stats: { Ast: 8, SCA90: 4.1, PrgC: 82 } },
    ],
    defender: [
      { name: 'Bradley Barcola', club: 'Paris S-G', pos: 'FW', age: 21, comp: 'Ligue 1', score: 67.3, similarity: 0.952, stats: { Ast: 8, SCA90: 4.1, PrgC: 82 } },
      { name: 'Michael Olise', club: 'Bayern Munich', pos: 'FW', age: 22, comp: 'Bundesliga', score: 74.6, similarity: 0.944, stats: { Ast: 11, SCA90: 6.5, PrgC: 88 } },
      { name: 'Rayan Cherki', club: 'Lyon', pos: 'MF', age: 20, comp: 'Ligue 1', score: 70.7, similarity: 0.937, stats: { Ast: 9, SCA90: 6.4, PrgC: 76 } },
      { name: 'Florian Wirtz', club: 'Leverkusen', pos: 'MF', age: 21, comp: 'Bundesliga', score: 72.8, similarity: 0.929, stats: { Ast: 11, SCA90: 4.8, PrgC: 78 } },
      { name: 'Cole Palmer', club: 'Chelsea', pos: 'MF', age: 22, comp: 'Premier League', score: 68.7, similarity: 0.921, stats: { Ast: 10, SCA90: 4.3, PrgC: 71 } },
    ],
  },
}

// CONSTANTS

const POS_COLORS = {
  FW: { bg: 'rgba(224,117,117,0.15)', text: '#e07575' },
  MF: { bg: 'rgba(76,175,130,0.15)', text: '#4caf82' },
  DF: { bg: 'rgba(90,159,194,0.15)', text: '#5a9fc2' },
  GK: { bg: 'rgba(232,147,90,0.15)', text: '#e8935a' },
}

const PROFILES = [
  { key: 'balanced', label: 'Balanced', desc: 'All metrics equally weighted' },
  { key: 'finisher', label: 'Finisher', desc: 'Goals, xG, shots focus' },
  { key: 'creator', label: 'Creator', desc: 'Assists, SCA, key passes focus' },
  { key: 'defender', label: 'Defender', desc: 'Tackles, interceptions focus' },
]

const POSITIONS = ['All', 'FW', 'MF', 'DF', 'GK']
const LEAGUES = ['All', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1']
const MAX_AGES = [
  { label: 'Any age', value: 99 },
  { label: 'Under 21', value: 21 },
  { label: 'Under 23', value: 23 },
  { label: 'Under 25', value: 25 },
  { label: 'Under 28', value: 28 },
]

// COLLAPSIBLE FILTER BLOCK

function FilterBlock({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
        style={{ background: 'none', border: 'none' }}>
        <p className="text-white font-bold text-sm">{title}</p>
        <span className="text-gray-600 text-xs transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  )
}

// BASE PLAYER CARD 

function BasePlayerCard({ name, onClick }) {
  return (
    <div className="rounded-2xl p-4 mb-6 flex items-center justify-between cursor-pointer transition-all hover:opacity-80"
      onClick={onClick}
      style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Finding players similar to</p>
        <p className="text-white font-black text-lg">{name}</p>
      </div>
      <span className="text-xs px-3 py-1 rounded-full font-bold"
        style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
        View Profile →
      </span>
    </div>
  )
}

// RESULT CARD

function ResultCard({ result, rank, onClick }) {
  const [hovered, setHovered] = useState(false)
  const posColor = POS_COLORS[result.pos] || POS_COLORS.MF

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-6 cursor-pointer transition-all"
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hovered ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}>

      {/* Rank + similarity */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl font-black" style={{ color: 'rgba(255,255,255,0.08)' }}>
          #{rank}
        </span>
        <div className="text-right">
          <p className="text-xs text-gray-600 uppercase tracking-wider">Similarity</p>
          <p className="font-black text-lg" style={{ color: '#c9a84c' }}>
            {(result.similarity * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Player info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-2">
          <p className="text-white font-black leading-tight"
            style={{ fontSize: result.name.length > 16 ? '16px' : '20px' }}>{result.name}</p>
          <p className="text-gray-400 text-sm mt-1 font-medium">{result.club}</p>
          <p className="text-gray-600 text-xs mt-0.5">{result.comp} · {result.age} yrs</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
          style={{ background: 'transparent', border: `1px solid ${posColor.text}`, color: posColor.text }}>
          {result.pos}
        </span>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1.5 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {Object.entries(result.stats).map(([key, val]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600 text-xs">{key}</span>
            <span className="text-gray-300 text-xs font-bold">{val}</span>
          </div>
        ))}
      </div>

      {/* Market Index bar */}
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600 text-[10px] uppercase tracking-wider">Market Index</span>
          <span className="text-xs font-bold" style={{ color: '#c9a84c' }}>{result.score}</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-1 rounded-full"
            style={{ width: `${result.score}%`, background: 'linear-gradient(90deg, #c9a84c, #e8d5a0)' }} />
        </div>
      </div>
    </div>
  )
}

// MAIN COMPONENT 

export default function RecommendPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const playerFromUrl = searchParams.get('player') || 'Erling Haaland'

  // Filter state
  const [profile, setProfile] = useState('balanced')
  const [posFilter, setPosFilter] = useState('All')
  const [leagueFilter, setLeagueFilter] = useState('All')
  const [maxAge, setMaxAge] = useState(99)
  const [basePlayer, setBasePlayer] = useState(playerFromUrl)
  const [searchInput, setSearchInput] = useState(playerFromUrl)

  // Get raw results for current player + profile
  const rawResults = MOCK_RESULTS[basePlayer]?.[profile] || []

  // Apply filters
  const results = rawResults.filter(r => {
    if (posFilter !== 'All' && r.pos !== posFilter) return false
    if (leagueFilter !== 'All' && r.comp !== leagueFilter) return false
    if (r.age > maxAge) return false
    return true
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (MOCK_RESULTS[searchInput]) {
      setBasePlayer(searchInput)
    }
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* HEADER  */}
      <div className="pt-32 pb-12 px-8"
        style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)}
              className="text-gray-500 text-sm flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
              style={{ background: 'none', border: 'none' }}>
              ← Back
            </button>
            {(posFilter !== 'All' || leagueFilter !== 'All' || maxAge !== 99 || profile !== 'balanced') && (
              <button
                onClick={() => { setPosFilter('All'); setLeagueFilter('All'); setMaxAge(99); setProfile('balanced') }}
                className="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer"
                style={{ background: 'none', border: 'none' }}>
                ✕ Reset filters
              </button>
            )}
          </div>
          <h1 className="text-5xl font-black text-white mb-2">
            Similar Players
          </h1>
          <p className="text-gray-500">
            AI-powered recommendations based on statistical similarity across 47 metrics.
          </p>
        </div>
      </div>

      <div className="px-8 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Search player */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white font-bold text-sm mb-3">Base Player</p>
              <form onSubmit={handleSearch} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="e.g. Erling Haaland..."
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-gray-600"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <button type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all hover:opacity-90"
                  style={{ background: '#c9a84c', color: '#0d1117' }}>
                  Search →
                </button>
              </form>
              {basePlayer && (
                <p className="text-gray-600 text-xs mt-2">
                  Showing results for <span className="text-gray-400 font-bold">{basePlayer}</span>
                </p>
              )}
            </div>

            {/* Profile weights */}
            <FilterBlock title="Scouting Profile">
              <div className="flex flex-col gap-2">
                {PROFILES.map(p => (
                  <button key={p.key}
                    onClick={() => setProfile(p.key)}
                    className="text-left px-4 py-3 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: profile === p.key ? 'rgba(201,168,76,0.15)' : 'transparent',
                      border: profile === p.key ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    <p className="font-bold text-sm" style={{ color: profile === p.key ? '#c9a84c' : 'white' }}>
                      {p.label}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </FilterBlock>

            {/* Position filter */}
            <FilterBlock title="Position">
              <div className="flex flex-wrap gap-2">
                {POSITIONS.map(pos => (
                  <button key={pos}
                    onClick={() => setPosFilter(pos)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all"
                    style={{
                      background: posFilter === pos ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                      border: posFilter === pos ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: posFilter === pos ? '#c9a84c' : '#6b7280',
                    }}>
                    {pos}
                  </button>
                ))}
              </div>
            </FilterBlock>

            {/* League filter */}
            <FilterBlock title="League">
              <div className="flex flex-col gap-1.5">
                {LEAGUES.map(l => (
                  <button key={l}
                    onClick={() => setLeagueFilter(l)}
                    className="text-left px-3 py-2 rounded-lg text-xs cursor-pointer transition-all"
                    style={{
                      background: leagueFilter === l ? 'rgba(201,168,76,0.1)' : 'transparent',
                      color: leagueFilter === l ? '#c9a84c' : '#6b7280',
                      fontWeight: leagueFilter === l ? 700 : 400,
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </FilterBlock>

            {/* Max age filter */}
            <FilterBlock title="Max Age">
              <div className="flex flex-col gap-1.5">
                {MAX_AGES.map(a => (
                  <button key={a.value}
                    onClick={() => setMaxAge(a.value)}
                    className="text-left px-3 py-2 rounded-lg text-xs cursor-pointer transition-all"
                    style={{
                      background: maxAge === a.value ? 'rgba(201,168,76,0.1)' : 'transparent',
                      color: maxAge === a.value ? '#c9a84c' : '#6b7280',
                      fontWeight: maxAge === a.value ? 700 : 400,
                    }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </FilterBlock>
          </div>

          {/* ══ RESULTS ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3">

            {/* Base player card */}
            {basePlayer && (
              <BasePlayerCard
                name={basePlayer}
                onClick={() => navigate(`/player/${encodeURIComponent(basePlayer)}`)}
              />
            )}

            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white font-bold">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </p>
                <p className="text-gray-600 text-xs mt-0.5">
                  Profile: <span className="text-gray-400">{PROFILES.find(p => p.key === profile)?.label}</span>
                  {posFilter !== 'All' && <> · Position: <span className="text-gray-400">{posFilter}</span></>}
                  {leagueFilter !== 'All' && <> · League: <span className="text-gray-400">{leagueFilter}</span></>}
                  {maxAge !== 99 && <> · Max age: <span className="text-gray-400">{maxAge}</span></>}
                </p>
              </div>
            </div>

            {/* No results */}
            {results.length === 0 && (
              <div className="rounded-2xl p-12 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-gray-600 text-4xl mb-4">∅</p>
                <p className="text-white font-bold mb-2">No results match your filters</p>
                <p className="text-gray-600 text-sm">Try adjusting the position, league or age filters.</p>
              </div>
            )}

            {/* Result cards grid */}
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((result, i) => (
                  <ResultCard
                    key={result.name}
                    result={result}
                    rank={i + 1}
                    onClick={() => navigate(`/player/${encodeURIComponent(result.name)}`)}
                  />
                ))}
              </div>
            )}

            {/* No mock data for this player */}
            {!MOCK_RESULTS[basePlayer] && (
              <div className="rounded-2xl p-12 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-gray-600 text-4xl mb-4">?</p>
                <p className="text-white font-bold mb-2">Player not in mock dataset</p>
                <p className="text-gray-600 text-sm">
                  Try searching for <span className="text-gray-400">Erling Haaland</span> or <span className="text-gray-400">Lamine Yamal</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}