'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

interface AlphaSession {
  user: any;
  key: string | null;
  loading: boolean;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
  init: (nickname: string) => Promise<string | null>;
  fetchAlpha: (url: string, options?: RequestInit) => Promise<Response>;
}

const AlphaContext = createContext<AlphaSession | undefined>(undefined);

export function AlphaProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('HAWKIN_ALPHA_KEY');
    if (savedKey) {
      validateKey(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const validateKey = async (accessKey: string) => {
    try {
      const res = await fetch('/api/auth/lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOGIN', key: accessKey })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setKey(accessKey);
        localStorage.setItem('HAWKIN_ALPHA_KEY', accessKey);
        return true;
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    return false;
  };

  const login = async (accessKey: string) => {
    setLoading(true);
    const success = await validateKey(accessKey);
    setLoading(false);
    return success;
  };

  const logout = () => {
    localStorage.removeItem('HAWKIN_ALPHA_KEY');
    setUser(null);
    setKey(null);
    window.location.href = '/';
  };

  const init = async (nickname: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/lite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'INIT', nickname })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setKey(data.key);
        localStorage.setItem('HAWKIN_ALPHA_KEY', data.key);
        setLoading(false);
        return data.key;
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    return null;
  };

  const fetchAlpha = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (key) {
      headers.set('Authorization', `Bearer ${key}`);
    }
    return fetch(url, { ...options, headers });
  };

  return (
    <AlphaContext.Provider value={{ user, key, loading, login, logout, init, fetchAlpha }}>
      {children}
    </AlphaContext.Provider>
  );
}

export const useAlpha = () => {
  const context = useContext(AlphaContext);
  if (!context) throw new Error("useAlpha debe usarse dentro de AlphaProvider");
  return context;
};
