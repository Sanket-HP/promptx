'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Cpu, DollarSign } from 'lucide-react';

export default function ModelsPage() {
  const [specs, setSpecs] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/models/pricing')
      .then(res => res.json())
      .then(setSpecs)
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Model Pricing Registry</h1>
            <p className="text-sm text-slate-400">Dynamic model pricing schedules used for cost optimization calculation</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Model Name</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Context Window</th>
                <th className="p-4">Input Cost / 1k</th>
                <th className="p-4">Output Cost / 1k</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {specs.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-sans flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    <span>{s.displayName} ({s.modelId})</span>
                  </td>
                  <td className="p-4 uppercase text-slate-400">{s.providerId}</td>
                  <td className="p-4 text-indigo-400 font-bold">{s.contextWindow.toLocaleString()} tokens</td>
                  <td className="p-4 text-emerald-400 font-bold">${s.inputCostPer1k}</td>
                  <td className="p-4 text-slate-300">${s.outputCostPer1k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
