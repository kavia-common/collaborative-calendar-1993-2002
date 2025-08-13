import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access authentication state and functions.
 */
export function useAuth() {
  /** Provides access to the AuthContext. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Context provider that manages auth state and exposes methods to login, register, and logout.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => api.getToken());
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!token && !!user;

  // Load current user if token exists
  useEffect(() => {
    async function init() {
      if (token) {
        try {
          const me = await api.auth.getMe();
          setUser(me);
        } catch (e) {
          // token invalid; clear it
          api.clearToken();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    init();
  }, [token]);

  // PUBLIC_INTERFACE
  const login = useCallback(async (email, password) => {
    /** Logs user in using REST API and persists token in storage. */
    const { token: tkn, user: usr } = await api.auth.login({ email, password });
    api.setToken(tkn);
    setToken(tkn);
    setUser(usr);
    return usr;
  }, []);

  // PUBLIC_INTERFACE
  const register = useCallback(async (payload) => {
    /** Registers a new user using REST API and logs them in. */
    const { token: tkn, user: usr } = await api.auth.register(payload);
    api.setToken(tkn);
    setToken(tkn);
    setUser(usr);
    return usr;
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    /** Logs out the user and clears auth token. */
    api.clearToken();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(() => ({
    user, token, isAuthenticated, loading, login, register, logout
  }), [user, token, isAuthenticated, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
