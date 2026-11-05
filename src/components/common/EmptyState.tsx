import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  heading?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  heading = 'No Books Available Yet',
  description = 'Our library is waiting for its first collection. Check back soon for new arrivals.',
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center text-center space-y-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{heading}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
      </div>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-md shadow-amber-600/20 transition-all hover:scale-105"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

