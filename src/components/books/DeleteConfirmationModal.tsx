'use client';

import React from 'react';
import Image from 'next/image';
import { Book } from '@/types/book';

interface DeleteConfirmationModalProps {
  book: Book;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({
  book,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close delete modal"
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div className="space-y-1 pr-6">
            <h2 id="delete-dialog-title" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Delete Book?
            </h2>
            <p id="delete-dialog-description" className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Selected Book Summary Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
          {book.image && (
            <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 shadow-sm">
              <Image
                src={book.image}
                alt={book.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {book.title}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              By {book.author}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                {book.category}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {book.totalCopies} {book.totalCopies === 1 ? 'copy' : 'copies'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

