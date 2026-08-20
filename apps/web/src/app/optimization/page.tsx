'use client';
import Sidebar from '@/components/Sidebar';
import { Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function OptimizationPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Prompt Optimization Rules</h1>
            <p className="text-sm text-slate-400">Configure SAFE, BALANCED, and AGGRESSIVE prompt optimization controls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2">SAFE Mode</h3>
            <p className="text-xs text-slate-400 mb-4">Minimal compression with strict instruction & context preservation.</p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" /> Whitespace & line break cleanup</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" /> Basic AI preamble stripping</li>
            </ul>
          </div>

          <div className="bg-slate-900 border-2 border-indigo-500 rounded-xl p-6 relative">
            <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">DEFAULT</span>
            <h3 className="text-base font-bold text-white mb-2">BALANCED Mode</h3>
            <p className="text-xs text-slate-400 mb-4">Optimal tradeoff between high token reduction and prompt quality preservation.</p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2" /> Duplicate system instruction merge</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2" /> Cross-turn context deduplication</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2" /> Verbose conversational filler removal</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2">AGGRESSIVE Mode</h3>
            <p className="text-xs text-slate-400 mb-4">Maximum token reduction where semantic intent allows.</p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Deep background text summarization</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Decorative syntax & divider pruning</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
