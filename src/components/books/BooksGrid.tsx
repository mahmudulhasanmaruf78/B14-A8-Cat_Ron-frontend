'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Book } from '@/types/book';
import { BooksService } from '@/services/books.service';
import { BookCard } from './BookCard';
import { BooksSkeletonGrid } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';

export function BooksGrid() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await BooksService.getAllBooks();

      if (!response.success) {
        setError(response.message || 'Unable to load books from server.');
        setBooks([]);
      } else {
        setBooks(response.data);
      }
    } catch {
      setError('Server connection failed. Please ensure the backend is running.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadInitialBooks() {
      try {
        const response = await BooksService.getAllBooks();
        if (!ignore) {
          if (!response.success) {
            setError(response.message || 'Unable to load books from server.');
            setBooks([]);
          } else {
            setBooks(response.data);
          }
        }
      } catch {
        if (!ignore) {
          setError('Server connection failed. Please ensure the backend is running.');
          setBooks([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialBooks();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <BooksSkeletonGrid />;
  }

  if (error) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Unable to load books</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchBooks}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        heading="No Books Available Yet"
        description="Our library is waiting for its first collection. Check back soon for new arrivals."
        actionText="Add the First Book"
        actionHref="/add-book"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
        <span>Showing {books.length} {books.length === 1 ? 'book' : 'books'}</span>
        <span>Sorted by newest</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {books.map((book) => (
          <BookCard key={book._id ? String(book._id) : book.title} book={book} />
        ))}
      </div>
    </div>
  );
}
