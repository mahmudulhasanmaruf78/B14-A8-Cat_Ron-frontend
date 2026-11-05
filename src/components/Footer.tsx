import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">BookNook</span> — Digital Library Management System
        </div>
        <div>
          Next.js 16 • React 19 • Hero UI • Tailwind CSS • Express • TypeScript • MongoDB
        </div>
      </div>
    </footer>
  );
}

