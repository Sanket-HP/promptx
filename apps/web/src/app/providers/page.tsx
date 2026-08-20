'use client';
import Sidebar from '@/components/Sidebar';
import { Boxes, CheckCircle2, ShieldCheck, Key } from 'lucide-react';

export default function ProvidersPage() {
  const providers = [
    { name: 'OpenAI Adapter', id: 'openai', status: 'ACTIVE', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] },
    { name: 'Anthropic Claude Adapter', id: 'anthropic', status: 'ACTIVE', models: ['claude-3-5-sonnet', 'claude-3-haiku'] },
    { name: 'Google Gemini Adapter', id: 'gemini', status: 'ACTIVE', models: ['gemini-1.5-pro', 'gemini-1.5-flash'] },
    { name: 'AWS Bedrock Adapter', id: 'bedrock', status: 'ACTIVE', models: ['anthropic.claude-3-sonnet-v1'] },
    { name: 'Ollama Local Adapter', id: 'ollama', status: 'ACTIVE', models: ['llama3', 'mistral'] },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">LLM Provider Adapters</h1>
            <p className="text-sm text-slate-400">Modular provider connectors for dispatching optimized requests</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map(p => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Boxes className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">{p.name}</h3>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded text-xs font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{p.status}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Encrypted keys stored at rest. Never exposed to browser client.</p>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Configured Models</span>
                <div className="flex flex-wrap gap-1.5">
                  {p.models.map(m => (
                    <span key={m} className="bg-slate-950 text-indigo-300 border border-slate-800 px-2 py-0.5 rounded text-xs font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
