'use client';
import Sidebar from '@/components/Sidebar';
import { Database, Zap, ShieldCheck } from 'lucide-react';

export default function CachePage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Semantic Cache Management</h1>
            <p className="text-sm text-slate-400">Configure embedding vector similarity thresholds and Redis cache parameters</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 max-w-2xl space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Similarity Threshold</label>
            <div className="flex items-center space-x-4">
              <input type="range" min="0.80" max="0.99" step="0.01" defaultValue="0.90" className="flex-1 accent-indigo-500" />
              <span className="font-mono font-bold text-indigo-400 text-sm">0.90 (90%)</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Queries with vector similarity score &gt;= threshold bypass the LLM and return cached answer.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Cache Time-To-Live (TTL)</label>
            <select defaultValue="86400" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200">
              <option value="3600">1 Hour</option>
              <option value="86400">24 Hours (1 Day)</option>
              <option value="604800">7 Days</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-lg text-xs">
              Save Cache Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
