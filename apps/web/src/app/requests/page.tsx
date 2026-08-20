'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { FileCode2, Search, Filter, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<string>('ALL');

  useEffect(() => {
    apiFetch('/api/v1/requests')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error(err));
  }, []);

  const filtered = requests.filter(req => {
    const matchSearch =
      req.id.toLowerCase().includes(search.toLowerCase()) ||
      req.modelId.toLowerCase().includes(search.toLowerCase());
    if (filterMode === 'CACHE') return matchSearch && req.cacheHit;
    if (filterMode === 'OPTIMIZED') return matchSearch && !req.cacheHit;
    return matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Request History & Debugger</h1>
            <p className="text-sm text-slate-400">Inspect intercepted prompts, token reduction metrics, and visual diffs</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search request ID or model..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterMode === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              onClick={() => setFilterMode('OPTIMIZED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterMode === 'OPTIMIZED' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Optimized
            </button>
            <button
              onClick={() => setFilterMode('CACHE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filterMode === 'CACHE' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Cache Hits
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Model</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Original</th>
                <th className="p-4">Optimized</th>
                <th className="p-4">Savings</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filtered.map(req => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-indigo-400">
                    <Link href={`/requests/${req.id}`} className="hover:underline">
                      {req.id}
                    </Link>
                  </td>
                  <td className="p-4 text-slate-400 font-sans">{new Date(req.createdAt).toLocaleTimeString()}</td>
                  <td className="p-4">{req.modelId}</td>
                  <td className="p-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-sans text-[11px]">
                      {req.optimizationMode}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{req.originalInputTokens} tok</td>
                  <td className="p-4 text-emerald-400 font-bold">{req.optimizedInputTokens} tok</td>
                  <td className="p-4">
                    {req.cacheHit ? (
                      <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-sans font-bold text-[11px]">
                        Cache HIT (100%)
                      </span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-sans font-bold text-[11px]">
                        -{req.reductionPercentage}% ({req.tokensSaved} tok)
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{req.latencyMs}ms</td>
                  <td className="p-4 font-sans">
                    <Link
                      href={`/requests/${req.id}`}
                      className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <span>Inspect Diff</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
