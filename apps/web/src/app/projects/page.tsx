'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FolderKanban, Plus, CheckCircle2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [mode, setMode] = useState('BALANCED');

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const res = await fetch('http://localhost:4000/api/v1/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, optimizationMode: mode })
    });
    if (res.ok) {
      const proj = await res.json();
      setProjects([...projects, proj]);
      setName('');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Projects & Multi-Tenancy</h1>
            <p className="text-sm text-slate-400">Scoped environments, default optimization modes, and tenant isolation</p>
          </div>
        </div>

        <form onSubmit={createProject} className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
            <input
              type="text"
              placeholder="e.g. Production Gateway, Customer Support Bot"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Default Mode</label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="SAFE">SAFE (Highest Preservation)</option>
              <option value="BALANCED">BALANCED (Default)</option>
              <option value="AGGRESSIVE">AGGRESSIVE (Max Savings)</option>
            </select>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FolderKanban className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">{p.name}</h3>
                </div>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded text-xs font-semibold">
                  {p.optimizationMode} Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">ID: {p.id}</p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Semantic Cache: Enabled</span>
                <span>Similarity: {Math.round((p.cacheSimilarity || 0.9) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
