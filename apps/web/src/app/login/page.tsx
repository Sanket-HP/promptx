'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@promptx.ai');
  const [password, setPassword] = useState('demo123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center space-x-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 font-bold text-white text-base flex items-center justify-center">
            PX
          </div>
          <span className="text-2xl font-bold text-white">PromptX</span>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-1">Sign in to your account</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Access your PromptX LLM Optimization Gateway</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-indigo-600/30"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Demo mode active. Click Sign In to enter dashboard instantly.
        </div>
      </div>
    </div>
  );
}
