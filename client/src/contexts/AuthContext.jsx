import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { apiFetch, readSession, writeSession } from '../api/base';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback((newSession) => {
    writeSession(newSession);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  // A stored session can have expired, or the account's name or admin access
  // can have changed, since this browser last checked. Ask the server once on
  // load. Only a definite "not signed in" signs out: a network error does not.
  useEffect(() => {
    const stored = readSession();
    if (!stored) return;
    apiFetch('/api/auth/me')
      .then(async (res) => {
        if (res.status === 401) return logout();
        if (res.ok) login({ token: stored.token, user: (await res.json()).user });
      })
      .catch(() => {});
  }, [login, logout]);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, isLoggedIn: Boolean(session), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
