'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-extrabold text-indigo-400 font-mono">404</h1>
      <h2 className="text-2xl font-bold text-white mt-4">Page Not Found</h2>
      <p className="text-slate-400 mt-2 max-w-md">The requested PromptX resource could not be found.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
