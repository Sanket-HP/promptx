'use client';
import { useState } from 'react';
import { Calculator as CalcIcon, TrendingDown, DollarSign, Zap } from 'lucide-react';

export default function Calculator() {
  const [requests, setRequests] = useState<number>(500000);
  const [inputTokens, setInputTokens] = useState<number>(4500);
  const [outputTokens, setOutputTokens] = useState<number>(350);
  const [reductionPct, setReductionPct] = useState<number>(75);
  const [modelCostPer1k, setModelCostPer1k] = useState<number>(0.0025); // GPT-4o default

  const totalInputTokensMonthly = requests * inputTokens;
  const totalOutputTokensMonthly = requests * outputTokens;

  const currentInputCost = (totalInputTokensMonthly / 1000) * modelCostPer1k;
  const currentOutputCost = (totalOutputTokensMonthly / 1000) * 0.0100;
  const currentTotalCost = currentInputCost + currentOutputCost;

  const optimizedInputTokensMonthly = totalInputTokensMonthly * (1 - reductionPct / 100);
  const optimizedInputCost = (optimizedInputTokensMonthly / 1000) * modelCostPer1k;
  const optimizedTotalCost = optimizedInputCost + currentOutputCost;

  const tokensSavedMonthly = totalInputTokensMonthly - optimizedInputTokensMonthly;
  const moneySavedMonthly = currentTotalCost - optimizedTotalCost;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
          <CalcIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Interactive Token Savings Calculator</h3>
          <p className="text-sm text-slate-400">Estimate your monthly token and cost savings with PromptX</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span className="text-slate-300">Monthly Requests</span>
              <span className="text-indigo-400 font-mono font-bold">{requests.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={requests}
              onChange={(e) => setRequests(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span className="text-slate-300">Avg. Input Tokens / Request</span>
              <span className="text-indigo-400 font-mono font-bold">{inputTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={inputTokens}
              onChange={(e) => setInputTokens(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span className="text-slate-300">Expected Reduction Target</span>
              <span className="text-emerald-400 font-mono font-bold">{reductionPct}% Reduction</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="5"
              value={reductionPct}
              onChange={(e) => setReductionPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target LLM Model</label>
            <select
              value={modelCostPer1k}
              onChange={(e) => setModelCostPer1k(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value={0.0025}>GPT-4o ($2.50 / 1M input tokens)</option>
              <option value={0.00015}>GPT-4o Mini ($0.15 / 1M input tokens)</option>
              <option value={0.0030}>Claude 3.5 Sonnet ($3.00 / 1M input tokens)</option>
              <option value={0.00125}>Gemini 1.5 Pro ($1.25 / 1M input tokens)</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Current Monthly Cost</span>
              <span className="text-xl font-bold text-slate-200 font-mono">${Math.round(currentTotalCost).toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Optimized Monthly Cost</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">${Math.round(optimizedTotalCost).toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-950/40 border border-indigo-500/20 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-indigo-400" />
                <div>
                  <span className="text-xs text-indigo-300 font-medium uppercase tracking-wider block">Monthly Tokens Saved</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{Math.round(tokensSavedMonthly / 1000000).toLocaleString()} Million Tokens</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="text-xs text-emerald-300 font-medium uppercase tracking-wider block">Estimated Annual Savings</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">${Math.round(moneySavedMonthly * 12).toLocaleString()} / year</span>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                -{reductionPct}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center font-medium italic">
            * All figures are estimated based on model pricing schedules and PromptX compression benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
}
