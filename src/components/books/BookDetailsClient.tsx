'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/types/book';
import { BorrowModal } from './BorrowModal';

interface BookDetailsClientProps {
  initialBook: Book;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function BookDetailsClient({ initialBook, user }: BookDetailsClientProps) {
  const [book, setBook] = useState<Book>(initialBook);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [hasBorrowed, setHasBorrowed] = useState(false);

  const isAvailable = (book.totalCopies ?? 0) > 0;

  const handleBorrowedSuccess = (updatedBook?: Book) => {
    if (updatedBook) {
      setBook(updatedBook);
    } else {
      setBook((prev) => ({
        ...prev,
        totalCopies: Math.max(0, (prev.totalCopies ?? 1) - 1),
      }));
    }
    setHasBorrowed(true);
  };

  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to All Books
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cover Art Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              {book.image ? (
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                  <svg className="w-16 h-16 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-xs font-medium mt-2">No Cover Image</span>
                </div>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-3 mt-6">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                {book.category}
              </span>
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  isAvailable
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60'
                }`}
              >
                {isAvailable ? `${book.totalCopies} Available Copies` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Book Details Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {book.title}
              </h1>
              <p className="text-base sm:text-lg font-medium text-zinc-600 dark:text-zinc-400">
                Written by <span className="text-zinc-900 dark:text-zinc-200 font-bold">{book.author}</span>
              </p>
            </div>

            {/* Meta Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block">Category</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{book.category}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block">Available Copies</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {book.totalCopies}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block">Added To Library</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formattedDate}</span>
              </div>
            </div>

            {/* Book Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                About this book
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {book.description || 'No description provided for this book.'}
              </p>
            </div>

            {/* Contributor Card */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800/70 rounded-2xl flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Contributed by: <strong className="text-zinc-800 dark:text-zinc-200">{book.userName}</strong></span>
              <span>Owner: {book.userEmail}</span>
            </div>

            {/* Borrow Action Section */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              {hasBorrowed ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>You have an active borrow record for this book. Check your borrows in My Borrows.</span>
                </div>
              ) : isAvailable ? (
                <button
                  type="button"
                  onClick={() => setIsBorrowModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl shadow-amber-600/25 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Borrow This Book</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 font-bold text-sm cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                  <p className="text-xs text-red-500 font-medium">
                    All copies of this book have been borrowed. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {isBorrowModalOpen && (
        <BorrowModal
          book={book}
          user={user}
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
          onBorrowed={handleBorrowedSuccess}
        />
      )}
    </div>
  );
}

