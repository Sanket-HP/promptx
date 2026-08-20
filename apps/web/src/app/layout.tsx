import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptX — Intelligent LLM Token Optimization Platform',
  description: 'Cut LLM Token Usage by Up to 99% with PromptX Gateway. Intelligently compress context, remove redundancy, and cache LLM requests.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
