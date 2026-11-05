'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Fiction: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800/60',
  },
  Science: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800/60',
  },
  History: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/60',
  },
  Kids: {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800/60',
  },
  Others: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/60',
  },
};

export function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  const categoryStyle = CATEGORY_COLORS[book.category] || {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    border: 'border-zinc-200 dark:border-zinc-700',
  };

  const bookId = book._id ? String(book._id) : '';

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
      {/* Book Cover Image */}
      <div className="relative w-full aspect-[4/5] bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
        {book.image && !imageError ? (
          <Image
            src={book.image}
            alt={book.title || 'Book cover'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-400 dark:text-zinc-500">
            <svg className="w-12 h-12 mb-2 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-medium">Cover Preview</span>
          </div>
        )}

        {/* Category Floating Badge */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          >
            {book.category}
          </span>
        </div>

        {/* Total Copies Badge */}
        {typeof book.totalCopies === 'number' && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-zinc-950/80 text-white backdrop-blur-md">
              {book.totalCopies} {book.totalCopies === 1 ? 'copy' : 'copies'}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-4">
        <div className="space-y-1.5 flex-1">
          <h3
            className="text-lg font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-1">
            by <span className="text-zinc-800 dark:text-zinc-200">{book.author}</span>
          </p>
          {book.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 pt-1 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <Link
            href={`/books/${bookId}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-amber-600 dark:bg-zinc-800 dark:hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <span>View Details</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
