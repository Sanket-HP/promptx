'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ShieldAlert, Activity, Users, Server, HardDrive } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function AdminPage() {
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    apiFetch('/api/v1/admin/overview')
      .then(res => res.json())
      .then(setAdminData)
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Admin Panel</h1>
            <p className="text-sm text-slate-400">System-wide metrics, tenant counts, gateway health, and error logs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">Total Organizations</span>
            <span className="text-2xl font-extrabold text-white font-mono">{adminData ? adminData.orgsCount : '---'}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">Active Projects</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">{adminData ? adminData.projectsCount : '---'}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">Total Requests Processed</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{adminData ? adminData.requestsCount : '---'}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">System Health</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{adminData ? adminData.systemHealth : '---'}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Active Provider Adapters</h3>
          <div className="flex flex-wrap gap-2">
            {adminData?.activeAdapters?.map((adapter: string) => (
              <span key={adapter} className="bg-slate-950 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-lg text-xs font-mono">
                {adapter}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
