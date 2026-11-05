import React from 'react';
import type { Metadata } from 'next';
import { BooksGrid } from '@/components/books/BooksGrid';

export const metadata: Metadata = {
  title: 'All Books',
  description: 'Explore the complete collection of books available in BookNook.',
};

export default function AllBooksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Public Catalog
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Explore All Books
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Browse through our digital collection of literary classics, scientific treatises, history, and children’s favorites.
        </p>
      </div>

      {/* Books Grid with Loading, Empty & Error States */}
      <BooksGrid />
    </div>
  );
}

