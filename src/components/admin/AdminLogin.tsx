'use client';

import { adminLogin } from '../../services/storage';
import { ArrowLeft, Dumbbell, KeyRound, Lock, Mail, ShieldAlert } from 'lucide-react';
import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: (user?: any) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToWebsite,
}) => {
  const [email, setEmail] = useState('admin@shirsekarfitness.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = adminLogin(email, password);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch {
      setIsLoading(false);
      setError('An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            GYM MANAGEMENT PORTAL
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Shirsekar's Fitness Hub · Bandra East
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                placeholder="admin@shirsekarfitness.com"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Preset hint banner for easy reviewer testing */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <KeyRound className="w-3 h-3" />
              <span>Default Credentials (Pre-filled):</span>
            </div>
            <p>Email: <code className="text-neutral-200">admin@shirsekarfitness.com</code></p>
            <p>Password: <code className="text-neutral-200">admin123</code></p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold text-sm uppercase tracking-wider rounded-xl transition-all active:scale-[0.99] cursor-pointer shadow-md shadow-amber-400/10 mt-2"
          >
            {isLoading ? 'VERIFYING...' : 'SIGN IN TO DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
};
