'use client';
import { ExplainabilityItem } from '@promptx/shared';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  optimizedText: string;
  originalTokens: number;
  optimizedTokens: number;
  explainability?: ExplainabilityItem[];
}

export default function DiffViewer({
  originalText,
  optimizedText,
  originalTokens,
  optimizedTokens,
  explainability = []
}: DiffViewerProps) {
  const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
  const reductionPct = originalTokens > 0 ? ((tokensSaved / originalTokens) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Explainability Banner */}
      {explainability.length > 0 && (
        <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Applied Optimization Techniques ({explainability.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {explainability.map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-300 block uppercase tracking-wider">{item.technique}</span>
                  <p className="text-xs text-slate-300 mt-1">{item.description}</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-mono font-bold whitespace-nowrap ml-2">
                  -{item.tokensSaved} tokens
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Diff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-rose-950/30 border-b border-slate-800 p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-sm font-bold text-rose-300 uppercase tracking-wider">BEFORE (Original Payload)</span>
            </div>
            <span className="bg-slate-800 text-slate-300 text-xs font-mono px-2.5 py-1 rounded font-semibold">
              {originalTokens} tokens
            </span>
          </div>
          <div className="p-4 bg-slate-950/80 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96">
            {originalText}
          </div>
        </div>

        {/* AFTER */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-emerald-950/30 border-b border-slate-800 p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">AFTER (PromptX Optimized)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono px-2.5 py-1 rounded font-bold">
                -{reductionPct}% ({optimizedTokens} tokens)
              </span>
            </div>
          </div>
          <div className="p-4 bg-slate-950/80 font-mono text-xs text-emerald-200 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96">
            {optimizedText}
          </div>
        </div>
      </div>
    </div>
  );
}
