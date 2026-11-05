'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from '@heroui/react';
import { Book } from '@/types/book';
import { BooksService } from '@/services/books.service';

interface BorrowModalProps {
  book: Book;
  user: {
    name?: string | null;
    email?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onBorrowed: (updatedBook?: Book) => void;
}

export function BorrowModal({
  book,
  user,
  isOpen,
  onClose,
  onBorrowed,
}: BorrowModalProps) {
  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const [borrowDate, setBorrowDate] = useState<string>(todayStr);

  // Default return date: 14 days later
  const defaultReturn = new Date();
  defaultReturn.setDate(defaultReturn.getDate() + 14);
  const defaultReturnStr = defaultReturn.toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState<string>(defaultReturnStr);

  const [dateError, setDateError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateDates = (): boolean => {
    if (!borrowDate) {
      setDateError('Borrow date is required');
      return false;
    }
    if (!returnDate) {
      setDateError('Return date is required');
      return false;
    }

    const bDate = new Date(borrowDate);
    const rDate = new Date(returnDate);

    if (isNaN(bDate.getTime())) {
      setDateError('Please enter a valid borrow date');
      return false;
    }

    if (isNaN(rDate.getTime())) {
      setDateError('Please enter a valid return date');
      return false;
    }

    if (rDate.getTime() <= bDate.getTime()) {
      setDateError('Return date must be later than borrow date');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateDates()) return;

    if (!book._id) {
      toast.danger('Invalid book ID');
      return;
    }

    if (book.totalCopies <= 0) {
      toast.danger('No copies of this book are currently available.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format ISO string representation for API contract
      const bIso = new Date(borrowDate).toISOString();
      const rIso = new Date(returnDate).toISOString();

      const res = await BooksService.borrowBook({
        bookId: book._id,
        borrowDate: bIso,
        returnDate: rIso,
      });

      if (!res.success) {
        toast.danger(res.message || 'Failed to borrow book.');
        setIsSubmitting(false);
        return;
      }

      toast.success('Book borrowed successfully!');

      // Refetch latest book details from server to guarantee sync
      try {
        const bookRefresh = await BooksService.getBookById(book._id);
        if (bookRefresh.success && bookRefresh.data) {
          onBorrowed(bookRefresh.data);
        } else {
          onBorrowed({ ...book, totalCopies: Math.max(0, book.totalCopies - 1) });
        }
      } catch {
        onBorrowed({ ...book, totalCopies: Math.max(0, book.totalCopies - 1) });
      }

      onClose();
    } catch {
      toast.danger('An unexpected network error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="borrow-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 my-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close borrow modal"
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Library Checkout
            </span>
          </div>
          <h2 id="borrow-modal-title" className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Borrow This Book
          </h2>
        </div>

        {/* Selected Book Information */}
        <div className="flex items-center gap-4 p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
          {book.image && (
            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 shadow-sm">
              <Image
                src={book.image}
                alt={book.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {book.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              By {book.author}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                {book.category}
              </span>
              <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                Available: <strong className="text-amber-600 dark:text-amber-400">{book.totalCopies}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Read-Only Borrower Identity Info */}
        <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            Borrower Profile (Authenticated)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block">Name</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block">
                {user.name || 'Library Member'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block">Email</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block">
                {user.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Borrow & Return Date Form */}
        <form onSubmit={handleConfirmBorrow} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Borrow Date */}
            <div className="space-y-1.5">
              <label htmlFor="borrow-date" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Borrow Date *
              </label>
              <input
                id="borrow-date"
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Return Date */}
            <div className="space-y-1.5">
              <label htmlFor="return-date" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Return Date *
              </label>
              <input
                id="return-date"
                type="date"
                min={borrowDate}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {dateError && (
            <p className="text-xs text-red-500 font-semibold">{dateError}</p>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || book.totalCopies <= 0}
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Borrowing...</span>
                </>
              ) : (
                'Confirm Borrow'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

