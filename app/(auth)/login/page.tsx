'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockStore } from '@/lib/mock-store';
import { KeyRound, Mail, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate login by matching email in mock db
    const users = mockStore.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    setTimeout(() => {
      if (user) {
        mockStore.setCurrentUser(user.id);
        router.push('/');
        // Force refresh to update navigation state
        setTimeout(() => window.location.reload(), 100);
      } else {
        setError('Invalid email or password. (For testing, you can use one of the quick presets below).');
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (userId: string) => {
    mockStore.setCurrentUser(userId);
    router.push('/');
    setTimeout(() => window.location.reload(), 100);
  };

  const testUsers = mockStore.getUsers();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Logo & Intro */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-indigo-400 items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/20 mb-3">
            A
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Connect with students, alumni, and faculty
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 shadow-sm">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/50">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-interactive w-full py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Redirect to Signup */}
          <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-[var(--accent-primary)] hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Test Accounts Presets (Extremely helpful for local validation) */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 shadow-sm">
          <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 text-center">
            Quick Presets for Local Testing
          </h4>
          <div className="flex flex-col gap-2">
            {testUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleQuickLogin(u.id)}
                className="btn-interactive w-full px-3 py-2 text-left text-xs rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-primary)] bg-[var(--bg-tertiary)] flex items-center justify-between gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold uppercase text-[10px]">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)] ml-1.5">@{u.username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {u.role === 'STUDENT' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-medium">Student</span>
                  )}
                  {u.role === 'ALUMNI' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 font-medium flex items-center gap-0.5">
                      {u.isVerified && <CheckCircle2 className="w-2.5 h-2.5" />}
                      Alumni
                    </span>
                  )}
                  {u.role === 'FACULTY' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 font-medium flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" />
                      Faculty
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
