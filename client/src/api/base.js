// Where the Express API lives. Set VITE_API_BASE_URL at build time (no trailing
// slash); with nothing set it falls back to the local dev server.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// The signed-in session ({ token, user }) is kept in this browser so a refresh
// does not sign you out. Storage can be unavailable (private windows, blocked
// site data), in which case you are simply signed out.
const SESSION_KEY = 'revive:session'

export function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export function writeSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // Nothing to do: the session just will not survive a refresh.
  }
}

// fetch() against the API, as JSON, carrying the session when there is one.
export function apiFetch(path, options = {}) {
  const token = readSession()?.token
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}
