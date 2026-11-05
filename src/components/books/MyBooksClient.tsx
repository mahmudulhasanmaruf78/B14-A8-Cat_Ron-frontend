'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from '@heroui/react';
import { Book } from '@/types/book';
import { BooksService } from '@/services/books.service';
import { BooksSkeletonGrid } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { EditBookModal } from './EditBookModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface MyBooksClientProps {
  userEmail: string;
  userName: string;
}

export function MyBooksClient({ userEmail }: MyBooksClientProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Delete modal state
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await BooksService.getAllBooks();
      if (!res.success) {
        setError(res.message || 'Failed to fetch books from library.');
        return;
      }

      // Filter books strictly added by the currently logged-in user
      const normalizedUserEmail = userEmail.trim().toLowerCase();
      const myFilteredBooks = (res.data || []).filter(
        (b) => b.userEmail && b.userEmail.trim().toLowerCase() === normalizedUserEmail
      );

      setBooks(myFilteredBooks);
    } catch {
      setError('An error occurred while loading your books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchMyBooks();
  }, [fetchMyBooks]);

  const handleBookUpdated = (updatedBook: Book) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? { ...b, ...updatedBook } : b))
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook || !deletingBook._id || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await BooksService.deleteBook(deletingBook._id);
      if (res.success) {
        toast.success('Book deleted successfully');
        // Remove deleted book immediately from the local state
        setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
        setDeletingBook(null);
      } else {
        toast.danger(res.message || 'Failed to delete book');
      }
    } catch {
      toast.danger('An unexpected error occurred while deleting the book');
    } finally {
      setIsDeleting(false);
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
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Unable to Load Books</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{error}</p>
        </div>
        <button
          onClick={fetchMyBooks}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        heading="You Haven't Added Any Books Yet"
        description="Contribute to the BookNook community by sharing your favorite books. Add your first book now!"
        actionText="Add a Book"
        actionHref="/add-book"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric header & Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Total books added by you:{' '}
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
              {books.length}
            </span>
          </p>
        </div>
        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Book
        </Link>
      </div>

      {/* Responsive Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const bookId = book._id ? String(book._id) : '';
          const formattedDate = book.createdAt
            ? new Date(book.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Recently added';

          return (
            <div
              key={bookId || book.title}
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all duration-300"
            >
              {/* Cover Image & Category */}
              <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {book.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/90 text-white shadow-sm">
                    {book.totalCopies} {book.totalCopies === 1 ? 'copy' : 'copies'}
                  </span>
                </div>
              </div>

              {/* Book Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    By <span className="font-medium text-zinc-700 dark:text-zinc-300">{book.author}</span>
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 pt-1">
                    {book.description}
                  </p>
                </div>

                <div className="pt-2 text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
                  <span>Added: {formattedDate}</span>
                </div>

                {/* Actions: View Details, Edit, Delete */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between gap-2">
                  <Link
                    href={`/books/${bookId}`}
                    className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    View Details →
                  </Link>
                  <div className="flex items-center gap-2">
                    {/* Functional Edit Button */}
                    <button
                      type="button"
                      onClick={() => setEditingBook(book)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      aria-label={`Edit ${book.title}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    {/* Functional Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeletingBook(book)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-bold transition-colors inline-flex items-center gap-1"
                      aria-label={`Delete ${book.title}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          isOpen={Boolean(editingBook)}
          onClose={() => setEditingBook(null)}
          onUpdated={handleBookUpdated}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingBook && (
        <DeleteConfirmationModal
          book={deletingBook}
          isOpen={Boolean(deletingBook)}
          isDeleting={isDeleting}
          onClose={() => {
            if (!isDeleting) setDeletingBook(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
