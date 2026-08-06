'use client';

import { FormEvent, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, LoaderCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    search.get('error') === 'not_configured'
      ? 'Falta configurar ADMIN_PASSWORD en Netlify (mín. 8 caracteres).'
      : ''
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Acceso denegado');
        return;
      }
      router.replace(search.get('next') || '/admin');
      router.refresh();
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-white/10 rounded-xl bg-[#0a0a0a] p-8 space-y-6"
      >
        <div className="space-y-2 text-center">
          <div className="mx-auto w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
            <Lock size={18} />
          </div>
          <h1 className="text-lg font-black uppercase tracking-tight text-white">HAWKIN Admin</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Acceso restringido</p>
        </div>

        <label className="block space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Contraseña</span>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 rounded-lg bg-white text-black text-xs font-black uppercase tracking-widest disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? <LoaderCircle className="animate-spin" size={14} /> : null}
          Entrar
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginForm />
    </Suspense>
  );
}
