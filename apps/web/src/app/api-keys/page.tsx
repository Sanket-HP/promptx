'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Key, Plus, Copy, CheckCircle2 } from 'lucide-react';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [keyName, setKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const fetchKeys = () => {
    fetch('http://localhost:4000/api/v1/projects/proj-prod-001/api-keys')
      .then(res => res.json())
      .then(setKeys)
      .catch(console.error);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/v1/projects/proj-prod-001/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: keyName || 'Production API Key' })
    });
    if (res.ok) {
      const data = await res.json();
      setCreatedKey(data.apiKey);
      setKeyName('');
      fetchKeys();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">PromptX API Keys</h1>
            <p className="text-sm text-slate-400">Secure API keys for connecting applications to PromptX Gateway</p>
          </div>
        </div>

        {createdKey && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-xl mb-8 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>API Key Created Successfully</span>
            </div>
            <p className="text-xs text-slate-300">Please copy your secret key now. It will never be shown again.</p>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between">
              <span>{createdKey}</span>
              <button onClick={() => navigator.clipboard.writeText(createdKey)} className="text-slate-400 hover:text-white text-xs">
                Copy
              </button>
            </div>
          </div>
        )}

        <form onSubmit={createKey} className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Description</label>
            <input
              type="text"
              placeholder="e.g. Staging Environment, Production Gateway"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Generate New API Key</span>
          </button>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Key Name</th>
                <th className="p-4">Key Prefix</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {keys.map(k => (
                <tr key={k.id}>
                  <td className="p-4 font-bold text-white font-sans">{k.name}</td>
                  <td className="p-4 text-indigo-400">{k.keyPrefix}...</td>
                  <td className="p-4 text-slate-400 font-sans">{new Date(k.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-sans">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
