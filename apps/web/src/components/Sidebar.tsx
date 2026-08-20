'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Key,
  FileCode2,
  BarChart3,
  Database,
  Sliders,
  Zap,
  Cpu,
  Boxes,
  Brain,
  Layers,
  Settings,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'API Keys', href: '/api-keys', icon: Key },
    { label: 'Request History', href: '/requests', icon: FileCode2 },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Semantic Cache', href: '/cache', icon: Database },
    { label: 'Optimization Rules', href: '/optimization', icon: Sliders },
    { label: 'Benchmark Tool', href: '/benchmark', icon: Zap },
    { label: 'Models & Pricing', href: '/models', icon: Cpu },
    { label: 'LLM Providers', href: '/providers', icon: Boxes },
    { label: 'Conversation Memory', href: '/memory', icon: Brain },
    { label: 'RAG Optimizer', href: '/rag', icon: Layers },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Admin Panel', href: '/admin', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
          PX
        </div>
        <div>
          <span className="font-bold text-white tracking-tight">PromptX Platform</span>
          <span className="block text-xs text-slate-400">PromptX LLM Gateway</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname ? (pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))) : false;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 text-xs">
          <p className="text-slate-400 font-medium">Active Organization</p>
          <p className="text-white font-semibold mt-0.5">Acme Corp (Enterprise)</p>
          <div className="mt-2 flex items-center justify-between text-slate-400">
            <span>Project: Production</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
}
