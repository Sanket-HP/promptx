'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import {
  Zap,
  TrendingDown,
  DollarSign,
  Clock,
  Database,
  FileText,
  Sparkles,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { apiFetch } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/v1/analytics/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Dashboard</h1>
            <p className="text-sm text-slate-400">Real-time token optimization & gateway metrics</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Core Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Requests</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-extrabold text-white font-mono">
              {data ? data.totalRequests.toLocaleString() : '---'}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Across all models & projects</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Tokens Saved</span>
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">
              {data ? data.totalTokensSaved.toLocaleString() : '---'}
            </span>
            <span className="text-xs text-emerald-400 font-semibold block mt-1">
              Avg. Reduction: {data ? `${data.averageReductionPercentage}%` : '---'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Money Saved</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {data ? `$${data.totalMoneySaved}` : '---'}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              Optimized Cost: {data ? `$${data.totalOptimizedCost}` : '---'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Cache Hit Rate</span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">
              {data ? `${data.cacheHitRate}%` : '---'}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              Avg. Gateway Latency: {data ? `${data.averageLatencyMs}ms` : '---'}
            </span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Token Savings Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Token Usage vs Savings Over Time</h3>
                <p className="text-xs text-slate-400">Comparing original input tokens with TokenForge optimized tokens</p>
              </div>
            </div>
            <div className="h-72 w-full">
              {data?.timeSeries && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.timeSeries}>
                    <defs>
                      <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="originalTokens" name="Original Tokens" stroke="#818cf8" fillOpacity={1} fill="url(#colorOriginal)" />
                    <Area type="monotone" dataKey="optimizedTokens" name="Optimized Tokens" stroke="#34d399" fillOpacity={1} fill="url(#colorOptimized)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Model Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2">Requests by Model</h3>
            <p className="text-xs text-slate-400 mb-6">Distribution across target LLM models</p>
            <div className="space-y-4">
              {data?.requestsByModel &&
                Object.entries(data.requestsByModel).map(([model, count]: any) => (
                  <div key={model} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300 font-mono">{model}</span>
                      <span className="text-indigo-400 font-mono font-bold">{count} requests</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                        style={{ width: `${Math.min(100, (count / (data.totalRequests || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Inspector Link Callout */}
        <div className="bg-slate-900 border border-indigo-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Visual Request Inspector Ready</h4>
              <p className="text-xs text-slate-400">Inspect side-by-side BEFORE vs AFTER diffs for all intercepted requests.</p>
            </div>
          </div>
          <Link
            href="/requests"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
          >
            <span>View Request Logs</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
