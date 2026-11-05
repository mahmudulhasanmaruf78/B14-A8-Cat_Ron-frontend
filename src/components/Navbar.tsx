'use client';

import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
              Book<span className="text-amber-600 dark:text-amber-500">Nook</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium">
              Phase 1
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="http://localhost:5000/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
          >
            Backend API (Port 5000)
          </a>
        </nav>
      </div>
    </header>
  );
}
