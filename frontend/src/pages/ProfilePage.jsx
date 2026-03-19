import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts'

// MOCK DATA 
const MOCK_PLAYERS = {
  'Erling Haaland': {
    name: 'Erling Haaland',
    club: 'Man City',
    nation: 'Norway',
    pos: 'FW',
    age: 24,
    score: 74.2,
    comp: 'Premier League',
    min: 2456,
    stats: {
      // Attacking
      Gls: 27, Sh: 118, SoT: 58, xG: 24.1, npxG: 22.3, 'G/Sh': 0.23, 'G-xG': 2.9,
      // Passing
      Ast: 5, 'Cmp%': 71.2, KP: 18, PPA: 12, PrgP: 34,
      // Chance Creation
      SCA90: 2.1, GCA90: 0.8,
      // Defense
      Tkl: 8, Int: 4, Blocks: 6, Clr: 2, 'Tkl%': 42.1,
      // Possession
      Touches: 812, Succ: 22, 'Succ%': 55.0, PrgC: 38,
      // Misc
      CrdY: 2, CrdR: 0, Recov: 64, 'Won%': 48.3,
    },
    radar: [
      { metric: 'Finishing', value: 95 },
      { metric: 'Shot Volume', value: 88 },
      { metric: 'xG', value: 91 },
      { metric: 'Pressing', value: 52 },
      { metric: 'Passing', value: 48 },
      { metric: 'Dribbling', value: 61 },
    ],
    vsLeague: [
      { metric: 'Gls', player: 27, avg: 8.2 },
      { metric: 'xG', player: 24.1, avg: 6.8 },
      { metric: 'SoT', player: 58, avg: 22.4 },
      { metric: 'Ast', player: 5, avg: 4.1 },
      { metric: 'PrgC', player: 38, avg: 31.2 },
    ],
  },
  'Lamine Yamal': {
    name: 'Lamine Yamal',
    club: 'Barcelona',
    nation: 'Spain',
    pos: 'FW',
    age: 17,
    score: 74.2,
    comp: 'La Liga',
    min: 2180,
    stats: {
      Gls: 8, Sh: 62, SoT: 28, xG: 7.1, npxG: 6.8, 'G/Sh': 0.13, 'G-xG': 0.9,
      Ast: 14, 'Cmp%': 83.1, KP: 48, PPA: 31, PrgP: 87,
      SCA90: 5.2, GCA90: 1.4,
      Tkl: 22, Int: 18, Blocks: 9, Clr: 4, 'Tkl%': 58.3,
      Touches: 1842, Succ: 61, 'Succ%': 63.2, PrgC: 94,
      CrdY: 3, CrdR: 0, Recov: 112, 'Won%': 44.1,
    },
    radar: [
      { metric: 'Finishing', value: 55 },
      { metric: 'Shot Volume', value: 60 },
      { metric: 'xG', value: 52 },
      { metric: 'Pressing', value: 71 },
      { metric: 'Passing', value: 88 },
      { metric: 'Dribbling', value: 94 },
    ],
    vsLeague: [
      { metric: 'Ast', player: 14, avg: 3.8 },
      { metric: 'SCA90', player: 5.2, avg: 2.1 },
      { metric: 'KP', player: 48, avg: 18.2 },
      { metric: 'PrgC', player: 94, avg: 38.1 },
      { metric: 'Succ%', player: 63.2, avg: 48.4 },
    ],
  },
  'Florian Wirtz': {
    name: 'Florian Wirtz',
    club: 'Leverkusen',
    nation: 'Germany',
    pos: 'MF',
    age: 21,
    score: 72.8,
    comp: 'Bundesliga',
    min: 2341,
    stats: {
      Gls: 11, Sh: 74, SoT: 32, xG: 9.8, npxG: 9.1, 'G/Sh': 0.15, 'G-xG': 1.2,
      Ast: 11, 'Cmp%': 86.4, KP: 64, PPA: 42, PrgP: 118,
      SCA90: 4.8, GCA90: 1.2,
      Tkl: 31, Int: 24, Blocks: 14, Clr: 6, 'Tkl%': 61.2,
      Touches: 2014, Succ: 54, 'Succ%': 58.7, PrgC: 78,
      CrdY: 4, CrdR: 0, Recov: 98, 'Won%': 46.8,
    },
    radar: [
      { metric: 'Finishing', value: 72 },
      { metric: 'Shot Volume', value: 68 },
      { metric: 'xG', value: 71 },
      { metric: 'Pressing', value: 78 },
      { metric: 'Passing', value: 91 },
      { metric: 'Dribbling', value: 84 },
    ],
    vsLeague: [
      { metric: 'Gls', player: 11, avg: 5.4 },
      { metric: 'Ast', player: 11, avg: 4.2 },
      { metric: 'SCA90', player: 4.8, avg: 2.3 },
      { metric: 'KP', player: 64, avg: 22.1 },
      { metric: 'PrgP', player: 118, avg: 64.3 },
    ],
  },
  'Pedri': {
    name: 'Pedri',
    club: 'Barcelona',
    nation: 'Spain',
    pos: 'MF',
    age: 22,
    score: 71.4,
    comp: 'La Liga',
    min: 2089,
    stats: {
      Gls: 4, Sh: 38, SoT: 14, xG: 3.8, npxG: 3.5, 'G/Sh': 0.11, 'G-xG': 0.2,
      Ast: 8, 'Cmp%': 91.2, KP: 52, PPA: 38, PrgP: 124,
      SCA90: 3.9, GCA90: 0.7,
      Tkl: 44, Int: 38, Blocks: 18, Clr: 8, 'Tkl%': 66.4,
      Touches: 2218, Succ: 41, 'Succ%': 52.3, PrgC: 62,
      CrdY: 5, CrdR: 0, Recov: 134, 'Won%': 51.2,
    },
    radar: [
      { metric: 'Finishing', value: 42 },
      { metric: 'Shot Volume', value: 38 },
      { metric: 'xG', value: 41 },
      { metric: 'Pressing', value: 88 },
      { metric: 'Passing', value: 96 },
      { metric: 'Dribbling', value: 79 },
    ],
    vsLeague: [
      { metric: 'Cmp%', player: 91.2, avg: 78.4 },
      { metric: 'PrgP', player: 124, avg: 58.2 },
      { metric: 'KP', player: 52, avg: 19.8 },
      { metric: 'Tkl', player: 44, avg: 28.1 },
      { metric: 'Recov', player: 134, avg: 78.4 },
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

const STAT_GROUPS = [
  {
    label: 'Attacking',
    stats: ['Gls', 'Sh', 'SoT', 'xG', 'npxG', 'G/Sh', 'G-xG'],
  },
  {
    label: 'Passing',
    stats: ['Ast', 'Cmp%', 'KP', 'PPA', 'PrgP'],
  },
  {
    label: 'Chance Creation',
    stats: ['SCA90', 'GCA90'],
  },
  {
    label: 'Defense',
    stats: ['Tkl', 'Int', 'Blocks', 'Clr', 'Tkl%'],
  },
  {
    label: 'Possession',
    stats: ['Touches', 'Succ', 'Succ%', 'PrgC'],
  },
  {
    label: 'Discipline',
    stats: ['CrdY', 'CrdR', 'Recov', 'Won%'],
  },
]

const STAT_HINTS = {
  Gls: 'Goals scored',
  Sh: 'Shots (total attempts)',
  SoT: 'Shots on target',
  xG: 'Expected goals',
  npxG: 'Non-penalty expected goals',
  'G/Sh': 'Goals per shot',
  'G-xG': 'Goals minus xG (over/underperformance)',
  Ast: 'Assists',
  'Cmp%': 'Pass completion percentage',
  KP: 'Key passes',
  PPA: 'Passes into the penalty area',
  PrgP: 'Progressive passes',
  SCA90: 'Shot-creating actions per 90 minutes',
  GCA90: 'Goal-creating actions per 90 minutes',
  Tkl: 'Tackles',
  Int: 'Interceptions',
  Blocks: 'Blocked shots/passes',
  Clr: 'Clearances',
  'Tkl%': 'Tackle success percentage',
  Touches: 'Touches',
  Succ: 'Successful dribbles',
  'Succ%': 'Dribble success percentage',
  PrgC: 'Progressive carries',
  CrdY: 'Yellow cards',
  CrdR: 'Red cards',
  Recov: 'Ball recoveries',
  'Won%': 'Duels won percentage',
}

// CUSTOM TOOLTIP 
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-4 py-3 text-sm"
      style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

// MAIN COMPONENT 
export default function ProfilePage() {
  const { playerName } = useParams()
  const navigate = useNavigate()
  const name = decodeURIComponent(playerName)
  const player = MOCK_PLAYERS[name]

  const [openGroups, setOpenGroups] = useState(() => new Set([STAT_GROUPS[0]?.label]))
  const allGroupsOpen = openGroups.size === STAT_GROUPS.length

  const toggleGroup = (label) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const toggleAllGroups = () => {
    if (allGroupsOpen) setOpenGroups(new Set())
    else setOpenGroups(new Set(STAT_GROUPS.map((g) => g.label)))
  }

  // Player not found
  if (!player) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4"
        style={{ background: '#0a0a0f' }}>
        <p className="text-gray-500 text-6xl mb-4">?</p>
        <h1 className="text-white text-3xl font-black mb-2">Player not found</h1>
        <p className="text-gray-500 mb-8">"{name}" is not in our mock dataset yet.</p>
        <button onClick={() => navigate('/')}
          className="px-6 py-3 rounded-full font-bold text-sm cursor-pointer"
          style={{ background: '#c9a84c', color: '#0d1117' }}>
          ← Back to Home
        </button>
      </div>
    )
  }

  const posColor = POS_COLORS[player.pos] || POS_COLORS.MF

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* HEADER */}
      <div className="relative overflow-hidden pt-32 pb-16 px-8"
        style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-15 pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${posColor.text} 0%, transparent 70%)` }} />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Back button */}
          <button onClick={() => navigate('/')}
            className="text-gray-500 text-sm mb-8 flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
            style={{ background: 'none', border: 'none' }}>
            ← Back
          </button>

          <div className="flex items-start justify-between flex-wrap gap-8">
            {/* Left — player info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold"
                  style={{ background: posColor.bg, border: `1px solid ${posColor.text}`, color: posColor.text }}>
                  {player.pos}
                </span>
                <span className="text-gray-500 text-sm">{player.comp}</span>
              </div>
              <h1 className="text-6xl font-black text-white mb-2 leading-none">{player.name}</h1>
              <p className="text-gray-400 text-xl">{player.club} · {player.nation} · {player.age} yrs</p>
              <p className="text-gray-600 text-sm mt-2">{player.min.toLocaleString()} minutes played</p>
            </div>

            {/* Right — Market Index */}
            <div className="rounded-2xl p-6 min-w-52"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Market Index</p>
              <p className="text-6xl font-black mb-3" style={{ color: '#c9a84c' }}>{player.score}</p>
              <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-2 rounded-full"
                  style={{ width: `${player.score}%`, background: 'linear-gradient(90deg, #c9a84c, #e8d5a0)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="py-16 px-8" style={{ background: '#0a0a0f' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Radar Chart */}
          <div className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-bold mb-6">Performance Profile</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={player.radar}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric"
                  tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
                />
                <Radar dataKey="value" stroke={posColor.text} fill={posColor.text}
                  fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart vs League Avg */}
          <div className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-bold mb-2">vs League Average</h3>
            <p className="text-gray-600 text-xs mb-6">Key metrics compared to position average</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={player.vsLeague} layout="vertical" barCategoryGap="30%">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="metric" width={56}
                  tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="avg" name="League Avg" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="player" name={player.name} radius={[0, 4, 4, 0]}>
                  {player.vsLeague.map((_, i) => (
                    <Cell key={i} fill={posColor.text} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* STATS TABLE */}
      <div className="py-16 px-8" style={{ background: '#f5f3ee' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Detailed Statistics</h2>
              <p className="text-gray-500 text-sm">Full breakdown across all metrics — 2024/25 season</p>
              <p className="text-gray-400 text-xs mt-2">
                Metric abbreviations are shown in full next to each value.
              </p>
            </div>

            <button
              onClick={toggleAllGroups}
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              {allGroupsOpen ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {STAT_GROUPS.map((group) => (
              <div key={group.label} className="rounded-2xl overflow-hidden"
                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-6 py-3"
                  style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: posColor.text }}>
                    {group.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {openGroups.has(group.label) ? '▾' : '▸'}
                  </span>
                </button>

                {openGroups.has(group.label) && (
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    {group.stats.map((stat, i) => {
                      const hint = STAT_HINTS[stat]
                      return (
                        <div key={stat}
                          className="px-6 py-4"
                          style={{ borderRight: (i + 1) % 4 !== 0 ? '1px solid rgba(0,0,0,0.04)' : 'none', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                            {stat}{hint ? ` (${hint})` : ''}
                          </p>
                          <p className="text-gray-900 font-black text-xl">{player.stats[stat] ?? '—'}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-8 text-center" style={{ background: '#0d1117' }}>
        <div className="max-w-xl mx-auto">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">AI Engine</p>
          <h2 className="text-4xl font-black text-white mb-4">
            Find players similar to<br />
            <span style={{ color: '#c9a84c' }}>{player.name}</span>
          </h2>
          <p className="text-gray-500 mb-8">
            Our cosine similarity engine analyses all 47 metrics to find the closest statistical matches.
          </p>
          <button
            onClick={() => navigate(`/recommend?player=${encodeURIComponent(player.name)}`)}
            className="px-8 py-4 rounded-full font-bold text-sm cursor-pointer transition-all hover:scale-105"
            style={{ background: '#c9a84c', color: '#0d1117' }}>
            Find Similar Players →
          </button>
        </div>
      </div>

    </div>
  )
}