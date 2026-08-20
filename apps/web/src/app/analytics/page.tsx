'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { BarChart3, TrendingDown, DollarSign, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/analytics/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Advanced Token Analytics</h1>
            <p className="text-sm text-slate-400">Deep-dive into token savings, cost trends, and gateway performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">Total Original Tokens</span>
            <span className="text-3xl font-extrabold text-white font-mono">{data ? data.totalOriginalTokens.toLocaleString() : '---'}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">Optimized Tokens Forwarded</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{data ? data.totalOptimizedTokens.toLocaleString() : '---'}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">Overall Reduction %</span>
            <span className="text-3xl font-extrabold text-indigo-400 font-mono">{data ? `${data.averageReductionPercentage}%` : '---'}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Estimated Dollar Savings Trend ($)</h3>
          <div className="h-80 w-full">
            {data?.timeSeries && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Area type="monotone" dataKey="costSaved" name="Cost Saved ($)" stroke="#34d399" fill="#34d399" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
