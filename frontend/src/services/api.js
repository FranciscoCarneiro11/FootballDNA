import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

export const searchPlayers = (query) =>
  api.get('/players/search', { params: { q: query } })

export const getPlayer = (playerName) =>
  api.get(`/players/${encodeURIComponent(playerName)}`)

export const getRecommendations = (payload) =>
  api.post('/recommend', payload)

export default api

