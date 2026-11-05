'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Book } from '@/types/book';
import { BooksService } from '@/services/books.service';
import { BookCard } from '@/components/books/BookCard';
import { BooksSkeletonGrid } from '@/components/common/Loading';

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch latest 6 books using server-side limit parameter
      const response = await BooksService.getAllBooks(6);

      if (!response.success) {
        setError(response.message || 'Unable to load new arrivals.');
        setBooks([]);
      } else {
        setBooks(response.data);
      }
    } catch {
      setError('Could not connect to the library server to fetch new arrivals.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadBooks() {
      try {
        const response = await BooksService.getAllBooks(6);
        if (!ignore) {
          if (!response.success) {
            setError(response.message || 'Unable to load new arrivals.');
            setBooks([]);
          } else {
            setBooks(response.data);
          }
        }
      } catch {
        if (!ignore) {
          setError('Could not connect to the library server to fetch new arrivals.');
          setBooks([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-zinc-50/50 dark:bg-zinc-900/30 border-y border-zinc-200/60 dark:border-zinc-800/60" aria-labelledby="new-arrivals-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Fresh Off The Press
          </div>
          <h2
            id="new-arrivals-heading"
            className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight"
          >
            New Arrivals
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Discover the latest additions to our growing library collection.
          </p>
        </div>

        {/* Content Area */}
        {loading ? (
          <BooksSkeletonGrid />
        ) : error ? (
          <div className="w-full py-12 px-4 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Unable to load new arrivals</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchLatestBooks}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="w-full py-14 px-4 flex flex-col items-center justify-center text-center space-y-3 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No new books have arrived yet.
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
              Our shelves are being stocked! Check back soon for exciting new titles and community donations.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 3 Columns Desktop, 2 Tablet, 1 Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {books.map((book) => (
                <BookCard key={book._id ? String(book._id) : book.title} book={book} />
              ))}
            </div>

            {/* See All Books Button */}
            <div className="flex justify-center pt-2">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-600/25 transition-all duration-200 hover:scale-105 hover:shadow-amber-600/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <span>See All Books</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
