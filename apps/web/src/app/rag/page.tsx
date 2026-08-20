'use client';
import Sidebar from '@/components/Sidebar';
import { Layers, FileText, CheckCircle2 } from 'lucide-react';

export default function RagPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">RAG Context Optimizer</h1>
            <p className="text-sm text-slate-400">Rerank, deduplicate, and prune irrelevant retrieved document chunks</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Top-K Reranking & Chunk Deduplication</h3>
              <p className="text-xs text-slate-400">Filters overlapping document sections and drops chunks below similarity threshold.</p>
            </div>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded text-xs font-bold">
              ENABLED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-medium">Relevance Threshold</span>
              <span className="text-lg font-bold text-white font-mono mt-1 block">0.25 (Cosine)</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-medium">Max Retained Chunks</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">Top 5 Chunks</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
