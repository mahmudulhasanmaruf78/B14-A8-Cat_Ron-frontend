'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from '@heroui/react';
import { Book, BOOK_CATEGORIES, BookCategory } from '@/types/book';
import { BooksService } from '@/services/books.service';

interface EditBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedBook: Book) => void;
}

function isValidHttpUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function EditBookModal({ book, isOpen, onClose, onUpdated }: EditBookModalProps) {
  const [title, setTitle] = useState(book.title || '');
  const [author, setAuthor] = useState(book.author || '');
  const [category, setCategory] = useState<BookCategory>(book.category || 'Fiction');
  const [image, setImage] = useState(book.image || '');
  const [description, setDescription] = useState(book.description || '');
  const [totalCopies, setTotalCopies] = useState<number | string>(book.totalCopies ?? 1);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!author.trim()) {
      newErrors.author = 'Author name is required';
    }
    if (!category || !BOOK_CATEGORIES.includes(category)) {
      newErrors.category = 'Select a valid category';
    }
    if (!image.trim() || !isValidHttpUrl(image.trim())) {
      newErrors.image = 'A valid HTTP or HTTPS image URL is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    const copies = Number(totalCopies);
    if (
      totalCopies === '' ||
      totalCopies === undefined ||
      isNaN(copies) ||
      !Number.isInteger(copies) ||
      copies <= 0
    ) {
      newErrors.totalCopies = 'Total copies must be a positive integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    if (!book._id) {
      toast.danger('Invalid book ID');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send ONLY permitted editable fields; immutable fields (_id, userName, userEmail, createdAt) are excluded
      const updateRes = await BooksService.updateBook(book._id, {
        title: title.trim(),
        author: author.trim(),
        category,
        image: image.trim(),
        description: description.trim(),
        totalCopies: Number(totalCopies),
      });

      if (!updateRes.success || !updateRes.data) {
        toast.danger(updateRes.message || 'Failed to update book');
        setIsSubmitting(false);
        return;
      }

      toast.success('Book updated successfully!');
      onUpdated(updateRes.data);
      onClose();
    } catch {
      toast.danger('An unexpected network error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-book-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Edit Book
              </span>
            </div>
            <h2 id="edit-book-modal-title" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Update Book Information
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close edit modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Book Title *
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title}</p>}
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label htmlFor="edit-author" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Author Name *
              </label>
              <input
                id="edit-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.author && <p className="text-xs text-red-500 font-medium">{errors.author}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="edit-category" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Category *
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {BOOK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category}</p>}
            </div>

            {/* Total Copies */}
            <div className="space-y-1.5">
              <label htmlFor="edit-copies" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Total Copies *
              </label>
              <input
                id="edit-copies"
                type="number"
                min={1}
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.totalCopies && <p className="text-xs text-red-500 font-medium">{errors.totalCopies}</p>}
            </div>

            {/* Image URL */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="edit-image" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Image URL *
              </label>
              <input
                id="edit-image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={isSubmitting}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.image && <p className="text-xs text-red-500 font-medium">{errors.image}</p>}
            </div>
          </div>

          {/* Current Image Preview */}
          {image && isValidHttpUrl(image) && (
            <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
                <Image
                  src={image}
                  alt={title || 'Book Preview'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">Cover Preview</p>
                <p className="truncate max-w-[280px] sm:max-w-md">{image}</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Short Description *
            </label>
            <textarea
              id="edit-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
          </div>

          {/* Read-Only Owner Information */}
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap justify-between gap-2 border border-zinc-200/50 dark:border-zinc-700/50">
            <span>Owner: <strong className="text-zinc-700 dark:text-zinc-300">{book.userName}</strong> (Read-only)</span>
            <span>Email: <strong className="text-zinc-700 dark:text-zinc-300">{book.userEmail}</strong> (Protected)</span>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

