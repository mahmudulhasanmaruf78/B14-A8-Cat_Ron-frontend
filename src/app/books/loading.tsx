import React from 'react';
import { BooksSkeletonGrid } from '@/components/common/Loading';

export default function BooksLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <div className="space-y-3 max-w-3xl animate-pulse">
        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
      <BooksSkeletonGrid />
    </div>
  );
}

