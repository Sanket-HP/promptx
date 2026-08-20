'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DiffViewer from '@/components/DiffViewer';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock, DollarSign, Zap, CheckCircle2 } from 'lucide-react';

export default function RequestInspectorPage({ params }: { params: { id: string } }) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/requests/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setRecord(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="p-8 flex items-center justify-center flex-1">
          <p className="text-slate-400 font-medium animate-pulse">Loading request inspector...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="p-8 flex flex-col items-center justify-center flex-1">
          <p className="text-slate-400 font-medium mb-4">Request log not found</p>
          <Link href="/requests" className="text-indigo-400 hover:underline text-sm font-semibold">
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  const origText = record.originalMessages.map((m: any) => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
  const optText = record.optimizedMessages.map((m: any) => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <Link href="/requests" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-semibold mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Requests</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white font-mono">{record.id}</h1>
                {record.cacheHit && (
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-0.5 rounded-full text-xs font-bold">
                    Cache HIT
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">Intercepted at {new Date(record.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Metrics Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Original Tokens</span>
            <span className="text-xl font-bold text-slate-200 font-mono">{record.originalInputTokens}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Optimized Tokens</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{record.optimizedInputTokens}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Tokens Saved</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">
              {record.tokensSaved} ({record.reductionPercentage}%)
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Money Saved</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">${record.estimatedCostSaved}</span>
          </div>
        </div>

        {/* Visual Diff Component */}
        <DiffViewer
          originalText={origText}
          optimizedText={optText}
          originalTokens={record.originalInputTokens}
          optimizedTokens={record.optimizedInputTokens}
          explainability={record.explainability}
        />
      </main>
    </div>
  );
}
