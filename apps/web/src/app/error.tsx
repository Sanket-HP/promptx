'use client';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-extrabold text-rose-400 font-mono">500</h1>
      <h2 className="text-2xl font-bold text-white mt-4">System Error</h2>
      <p className="text-slate-400 mt-2 max-w-md">{error.message || 'An unexpected error occurred in PromptX Gateway.'}</p>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => reset()}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
