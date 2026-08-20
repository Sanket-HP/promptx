'use client';
import Sidebar from '@/components/Sidebar';
import { Settings, ShieldCheck, Building } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Organization & Security Settings</h1>
            <p className="text-sm text-slate-400">Multi-tenancy isolation, billing tier, and enterprise configurations</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Organization Name</label>
            <input type="text" defaultValue="Acme Corp" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Plan Tier</label>
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div>
                <span className="font-bold text-white text-sm block">ENTERPRISE PLAN</span>
                <span className="text-xs text-slate-400">Unlimited requests, dedicated SLA, custom model routing policies.</span>
              </div>
              <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded">ACTIVE</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
