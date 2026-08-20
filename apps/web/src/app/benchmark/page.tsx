'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DiffViewer from '@/components/DiffViewer';
import { Zap, Sparkles, ArrowRight } from 'lucide-react';

export default function BenchmarkPage() {
  const [prompt, setPrompt] = useState(
    `As an AI language model, please act as a senior software architect. I am going to ask you a question and I need you to answer carefully step by step without failing.\n\nDocument A:\nAcme Corporation was founded in 2010 in San Francisco, California.\nAcme Corporation was founded in 2010 in San Francisco, California.\n\nDocument B:\nThe headquarters of Acme Corporation is located in San Francisco.\n\nSystem Instruction: Make sure to provide a thorough, accurate, and detailed explanation.\n\nUser Question: Where is Acme Corporation located and what year was it founded?`
  );
  const [mode, setMode] = useState<'SAFE' | 'BALANCED' | 'AGGRESSIVE'>('BALANCED');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/benchmark/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode })
      });
      if (res.ok) {
        const json = await res.json();
        setResult(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Prompt Optimization Benchmark</h1>
            <p className="text-sm text-slate-400">Test any prompt real-time to compare token reduction, cost, and explainability</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Optimization Mode</label>
            <div className="flex space-x-2">
              {(['SAFE', 'BALANCED', 'AGGRESSIVE'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === m ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={6}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="Paste raw prompt or document context to benchmark..."
          />

          <div className="flex justify-end">
            <button
              onClick={runBenchmark}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Running Optimization Pipeline...' : 'Run Benchmark'}</span>
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block font-medium">Original Tokens</span>
                <span className="text-xl font-bold text-slate-200 font-mono">{result.originalTokens}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block font-medium">Optimized Tokens</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{result.optimizedTokens}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block font-medium">Reduction</span>
                <span className="text-xl font-bold text-indigo-400 font-mono">
                  {result.reductionPercentage}% ({result.tokensSaved} tok)
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block font-medium">Quality Score</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{Math.round(result.qualityScore * 100)}%</span>
              </div>
            </div>

            <DiffViewer
              originalText={result.originalPrompt}
              optimizedText={result.optimizedPrompt}
              originalTokens={result.originalTokens}
              optimizedTokens={result.optimizedTokens}
              explainability={result.explainability}
            />
          </div>
        )}
      </main>
    </div>
  );
}
