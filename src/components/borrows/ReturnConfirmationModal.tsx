'use client';

import React from 'react';
import Image from 'next/image';
import { BorrowRecord } from '@/types/borrow';

interface ReturnConfirmationModalProps {
  borrow: BorrowRecord;
  isOpen: boolean;
  isReturning: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReturnConfirmationModal({
  borrow,
  isOpen,
  isReturning,
  onClose,
  onConfirm,
}: ReturnConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="return-dialog-title"
      aria-describedby="return-dialog-description"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isReturning) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isReturning}
          aria-label="Close return modal"
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-1 pr-6">
            <h2 id="return-dialog-title" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Return Book?
            </h2>
            <p id="return-dialog-description" className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to return this book? This will release your borrow record and restore the copy for other readers.
            </p>
          </div>
        </div>

        {/* Selected Book Summary Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
          {borrow.bookImage && (
            <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 shadow-sm">
              <Image
                src={borrow.bookImage}
                alt={borrow.bookTitle}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {borrow.bookTitle}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              Borrowed on {new Date(borrow.borrowDate).toLocaleDateString()}
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1">
              Due Date: {new Date(borrow.returnDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isReturning}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isReturning}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
          >
            {isReturning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Returning...</span>
              </>
            ) : (
              'Confirm Return'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
