'use client';
import Sidebar from '@/components/Sidebar';
import { Brain, Layers, CheckCircle2 } from 'lucide-react';

export default function MemoryPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Conversation Memory Engine</h1>
            <p className="text-sm text-slate-400">Intelligently summarize and prune long conversation histories to prevent 50,000+ token payloads</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Stateful Conversation Memory</h3>
              <p className="text-xs text-slate-400">Store short-term turns, long-term summaries, and extracted entities.</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-xs font-bold">
              ACTIVE
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-indigo-400 block mb-1 font-bold font-sans">Sample Memory Summarization:</span>
            Original 50,000 token conversation history compressed to 2,000 token structured memory context. (96% reduction)
          </div>
        </div>
      </main>
    </div>
  );
}
