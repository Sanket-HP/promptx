import Navigation from '@/components/Navigation';
import Calculator from '@/components/Calculator';
import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle,
  Database,
  Code2,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">
              More intelligence. Fewer tokens.
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Cut LLM Token Usage by <span className="gradient-text">Up to 99%</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            PromptX intelligently compresses context, removes redundancy, retrieves only what matters, and caches repeated requests before they reach your LLM.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <span>Start Optimizing</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-8 py-4 rounded-xl font-bold text-base transition-all"
            >
              <span>View Documentation</span>
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-2xl font-black text-indigo-400 font-mono">Up to 99%</span>
              <span className="block text-xs text-slate-400 font-medium mt-1">Token Reduction</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono">&lt; 15ms</span>
              <span className="block text-xs text-slate-400 font-medium mt-1">Semantic Cache Latency</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-2xl font-black text-cyan-400 font-mono">100%</span>
              <span className="block text-xs text-slate-400 font-medium mt-1">OpenAI API Compatible</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-2xl font-black text-purple-400 font-mono">Zero</span>
              <span className="block text-xs text-slate-400 font-medium mt-1">Code Refactoring Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Zero Code Drop-In Banner */}
      <section className="py-16 bg-slate-900/50 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">One Line API Base URL Change</h2>
            <p className="text-slate-400 text-sm mt-2">Replace standard OpenAI endpoint with PromptX Gateway for instant token savings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm max-w-4xl mx-auto">
            <div className="bg-slate-950 border border-rose-500/20 p-5 rounded-xl">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">Before (Standard API)</span>
              <code className="text-slate-300 text-xs block">https://api.openai.com/v1/chat/completions</code>
            </div>
            <div className="bg-slate-950 border border-emerald-500/30 p-5 rounded-xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">After (PromptX Gateway)</span>
              <code className="text-emerald-300 text-xs block">http://localhost:4000/v1/chat/completions</code>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How PromptX Optimizes Tokens</h2>
            <p className="text-slate-400 mt-4">An end-to-end intelligent pipeline sitting between your app and LLMs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Semantic Cache & Deduplication</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Checks request embeddings against previously served prompts. Identical or highly similar queries hit the cache instantly for 100% token savings.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-lg mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Prompt & Context Compression</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Strips repetitive AI preamble, redundant system instructions, and irrelevant document chunks while preserving critical code, entities, and constraints.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Smart Provider Routing</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Routes optimized requests to target providers (OpenAI, Anthropic, Gemini, Ollama) and tracks full explainability & cost savings analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Token Calculator Section */}
      <section id="calculator" className="py-24 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Calculator />
        </div>
      </section>

      {/* Supported Providers Section */}
      <section className="py-20 border-b border-slate-900 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Supported LLM Providers</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-80">
            <span className="text-xl font-bold text-slate-300">OpenAI</span>
            <span className="text-xl font-bold text-slate-300">Anthropic Claude</span>
            <span className="text-xl font-bold text-slate-300">Google Gemini</span>
            <span className="text-xl font-bold text-slate-300">AWS Bedrock</span>
            <span className="text-xl font-bold text-slate-300">Ollama (Local)</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Transparent SaaS Pricing</h2>
            <p className="text-slate-400 mt-4">Only pay a fraction of what you save on LLM tokens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">FREE</h3>
                <span className="text-3xl font-extrabold text-white mt-4 block">$0</span>
                <p className="text-xs text-slate-400 mt-1">For side projects & testing</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> 50,000 requests / mo</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> Basic Prompt Optimization</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> 1 Project</li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8 w-full py-2.5 rounded-lg bg-slate-800 text-white font-semibold text-center text-xs hover:bg-slate-700">Get Started</Link>
            </div>

            <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-indigo-600/10">
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">POPULAR</span>
              <div>
                <h3 className="text-lg font-bold text-white">PRO</h3>
                <span className="text-3xl font-extrabold text-white mt-4 block">$49<span className="text-xs text-slate-400">/mo</span></span>
                <p className="text-xs text-slate-400 mt-1">For growing applications</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-indigo-400 mr-2" /> 1,000,000 requests / mo</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-indigo-400 mr-2" /> Semantic Cache & Vector Search</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-indigo-400 mr-2" /> 5 Projects</li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8 w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-center text-xs hover:bg-indigo-500">Start Free Trial</Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">TEAM</h3>
                <span className="text-3xl font-extrabold text-white mt-4 block">$199<span className="text-xs text-slate-400">/mo</span></span>
                <p className="text-xs text-slate-400 mt-1">For engineering teams</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> 10,000,000 requests / mo</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> RAG & Conversation Memory</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> Unlimited Projects & RBAC</li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8 w-full py-2.5 rounded-lg bg-slate-800 text-white font-semibold text-center text-xs hover:bg-slate-700">Contact Sales</Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">ENTERPRISE</h3>
                <span className="text-3xl font-extrabold text-white mt-4 block">Custom</span>
                <p className="text-xs text-slate-400 mt-1">Dedicated infrastructure</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> Unlimited Volume</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> On-Prem / VPC Deployment</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> Dedicated SLA & Support</li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8 w-full py-2.5 rounded-lg bg-slate-800 text-white font-semibold text-center text-xs hover:bg-slate-700">Talk to Engineering</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-indigo-600 font-bold text-white text-[10px] flex items-center justify-center">PX</div>
            <span className="font-bold text-slate-200 text-sm">PromptX — Intelligent LLM Gateway</span>
          </div>
          <p>© 2026 PromptX Inc. "More intelligence. Fewer tokens."</p>
        </div>
      </footer>
    </div>
  );
}
