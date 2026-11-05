'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from '@heroui/react';
import { BorrowRecord } from '@/types/borrow';
import { BooksService } from '@/services/books.service';
import { BooksSkeletonGrid } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { ReturnConfirmationModal } from './ReturnConfirmationModal';

export function MyBorrowsClient() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Return modal state
  const [returningBorrow, setReturningBorrow] = useState<BorrowRecord | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  const fetchBorrows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await BooksService.getUserBorrows();
      if (!res.success) {
        setError(res.message || 'Failed to load your borrowed books.');
        return;
      }
      setBorrows(res.data || []);
    } catch {
      setError('An error occurred while loading your borrows. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const handleReturnConfirm = async () => {
    if (!returningBorrow || !returningBorrow._id || isReturning) return;

    setIsReturning(true);
    try {
      const res = await BooksService.returnBook(returningBorrow._id);
      if (res.success) {
        toast.success('Book returned successfully');
        // Instantly remove returned book from the local list
        setBorrows((prev) => prev.filter((b) => b._id !== returningBorrow._id));
        setReturningBorrow(null);
      } else {
        toast.danger(res.message || 'Failed to return book.');
      }
    } catch {
      toast.danger('An error occurred while returning the book.');
    } finally {
      setIsReturning(false);
    }
  };

  if (isLoading) {
    return <BooksSkeletonGrid />;
  }

  if (error) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40">
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="max-w-md space-y-1">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Unable to Load Borrow Records</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{error}</p>
        </div>
        <button
          onClick={fetchBorrows}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (borrows.length === 0) {
    return (
      <EmptyState
        heading="You Have No Borrowed Books"
        description="Looking for your next good read? Explore our online library catalog to borrow classic and modern books."
        actionText="Browse Books"
        actionHref="/books"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Total currently borrowed:{' '}
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
              {borrows.length}
            </span>
          </p>
        </div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all hover:scale-105"
        >
          <span>Borrow More Books</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Responsive Borrow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {borrows.map((borrow) => {
          const borrowId = String(borrow._id);
          const formattedBorrowDate = new Date(borrow.borrowDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          const formattedReturnDate = new Date(borrow.returnDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={borrowId}
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all duration-300"
            >
              {/* Cover Art */}
              <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                {borrow.bookImage ? (
                  <Image
                    src={borrow.bookImage}
                    alt={borrow.bookTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <span className="text-xs">No Cover Image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white shadow-sm backdrop-blur-md">
                    Active Borrow
                  </span>
                </div>
              </div>

              {/* Borrow Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {borrow.bookTitle}
                  </h3>
                  <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 dark:text-zinc-500">Borrowed On:</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formattedBorrowDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 dark:text-zinc-500">Due Return Date:</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400">{formattedReturnDate}</span>
                    </div>
                  </div>
                </div>

                {/* Return Action */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between gap-3">
                  <Link
                    href={`/books/${borrow.bookId}`}
                    className="text-xs font-semibold text-zinc-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
                  >
                    Book Details →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setReturningBorrow(borrow)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all hover:scale-105 inline-flex items-center gap-1.5"
                    aria-label={`Return ${borrow.bookTitle}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    Return Book
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Confirmation Modal */}
      {returningBorrow && (
        <ReturnConfirmationModal
          borrow={returningBorrow}
          isOpen={Boolean(returningBorrow)}
          isReturning={isReturning}
          onClose={() => {
            if (!isReturning) setReturningBorrow(null);
          }}
          onConfirm={handleReturnConfirm}
        />
      )}
    </div>
  );
}
