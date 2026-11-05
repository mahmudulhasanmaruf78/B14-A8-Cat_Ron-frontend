import React from 'react';

export function LoadingSpinner({ text = 'Loading books...' }: { text?: string }) {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
      </div>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{text}</p>
    </div>
  );
}

export function BooksSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-[4/5] bg-zinc-200 dark:bg-zinc-800" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

