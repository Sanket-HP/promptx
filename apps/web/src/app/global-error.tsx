'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="bg-slate-950 text-white flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold text-rose-400">System Error</h1>
        <p className="text-slate-400 mt-2">{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => reset()}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
