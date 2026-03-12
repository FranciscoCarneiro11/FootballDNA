import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/player/${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-20">

      {/* Left — Links pill */}
      <div className="flex items-center gap-2">
        <Link to="/"
          className="px-4 py-1.5 rounded-full text-sm font-medium text-white no-underline transition-all hover:bg-white/10"
          style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
          Home
        </Link>
        <Link to="/recommend"
          className="px-4 py-1.5 rounded-full text-sm font-medium text-white no-underline transition-all hover:bg-white/10"
          style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
          Recommendations
        </Link>
        <Link to="/compare"
          className="px-4 py-1.5 rounded-full text-sm font-medium text-white no-underline transition-all hover:bg-white/10"
          style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
          Compare
        </Link>
      </div>

      {/* Center — 'Logo' */}
      <Link to="/" className="absolute left-1/2 -translate-x-1/2 no-underline">
        <span className="font-extrabold text-2xl tracking-wide" style={{ color: '#e8c96d' }}>
          Football<span className="text-white">DNA</span>
        </span>
      </Link>

      {/* Right side */}
      {isHome ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs tracking-widest uppercase"
            style={{ letterSpacing: '2px' }}>
            2024/2025 Data
          </span>
        </div>
      ) : (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input type="text" placeholder="Pesquisar jogador..." value={query} onChange={(e) => setQuery(e.target.value)} className="px-4 py-1.5 rounded-full text-sm outline-none text-white w-48 placeholder-gray-400"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
          <button type="submit" className="px-5 py-1.5 rounded-full text-sm font-bold cursor-pointer transition-all hover:scale-105"
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent',
              color: 'white',
            }}>
            Search →
          </button>
        </form>
      )}

    </nav>
  )
}