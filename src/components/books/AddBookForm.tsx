'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@heroui/react';
import { BOOK_CATEGORIES, BookCategory } from '@/types/book';
import { BooksService } from '@/services/books.service';
import { BookImageUpload } from './BookImageUpload';
import { validateBookForm, BookFormValidationErrors } from '@/lib/validations/book-validation';

interface AddBookFormProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AddBookForm({ user }: AddBookFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<BookCategory | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [totalCopies, setTotalCopies] = useState<number | string>(1);

  const [errors, setErrors] = useState<BookFormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>('');

  const userName = user.name || 'Anonymous Reader';
  const userEmail = user.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateBookForm({
      title,
      author,
      category,
      imageFile,
      description,
      totalCopies,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.danger('Please review and correct the form errors before submitting.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Step 1: Upload Image to imgbb through server API
      setSubmitStep('Uploading book cover to imgbb...');
      const uploadRes = await BooksService.uploadImage(imageFile!);

      if (!uploadRes.success || !uploadRes.url) {
        toast.danger(uploadRes.error || 'Failed to upload book cover image.');
        setIsSubmitting(false);
        setSubmitStep('');
        return;
      }

      // Step 2: Post book data to backend API
      setSubmitStep('Saving book details to catalog...');
      const bookRes = await BooksService.createBook({
        title: title.trim(),
        author: author.trim(),
        category: category as BookCategory,
        image: uploadRes.url,
        description: description.trim(),
        userName,
        userEmail,
        totalCopies: Number(totalCopies),
      });

      if (!bookRes.success) {
        toast.danger(bookRes.message || 'Failed to add book to library.');
        setIsSubmitting(false);
        setSubmitStep('');
        return;
      }

      toast.success('Book has been added to the library collection successfully!');

      // Reset form fields
      setTitle('');
      setAuthor('');
      setCategory('');
      setImageFile(null);
      setDescription('');
      setTotalCopies(1);

      // Redirect to books list
      router.push('/books');
    } catch {
      toast.danger('Unexpected network error occurred. Please verify backend connection.');
    } finally {
      setIsSubmitting(false);
      setSubmitStep('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Title */}
        <div className="space-y-1.5">
          <label htmlFor="book-title" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Book Title <span className="text-amber-600">*</span>
          </label>
          <input
            id="book-title"
            type="text"
            value={title}
            disabled={isSubmitting}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Enter book title"
            className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Author Name */}
        <div className="space-y-1.5">
          <label htmlFor="book-author" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Author Name <span className="text-amber-600">*</span>
          </label>
          <input
            id="book-author"
            type="text"
            value={author}
            disabled={isSubmitting}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
            }}
            placeholder="Enter author name"
            className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.author
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20'
            }`}
          />
          {errors.author && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.author}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="book-category" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Category <span className="text-amber-600">*</span>
          </label>
          <select
            id="book-category"
            value={category}
            disabled={isSubmitting}
            onChange={(e) => {
              setCategory(e.target.value as BookCategory);
              if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
            }}
            className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 transition-all ${
              errors.category
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20'
            }`}
          >
            <option value="" disabled>
              Select a book category
            </option>
            {BOOK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.category}</p>
          )}
        </div>

        {/* Total Copies */}
        <div className="space-y-1.5">
          <label htmlFor="book-copies" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Total Copies <span className="text-amber-600">*</span>
          </label>
          <input
            id="book-copies"
            type="number"
            min={1}
            step={1}
            value={totalCopies}
            disabled={isSubmitting}
            onChange={(e) => {
              setTotalCopies(e.target.value);
              if (errors.totalCopies) setErrors((prev) => ({ ...prev, totalCopies: undefined }));
            }}
            placeholder="1"
            className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.totalCopies
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20'
            }`}
          />
          {errors.totalCopies && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.totalCopies}</p>
          )}
        </div>
      </div>

      {/* Book Image Upload Area */}
      <BookImageUpload
        imageFile={imageFile}
        onImageSelect={(file) => {
          setImageFile(file);
          if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
        }}
        error={errors.image}
        disabled={isSubmitting}
      />

      {/* Short Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="book-description" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Short Description <span className="text-amber-600">*</span>
          </label>
          <span className="text-xs text-zinc-400">
            {description.length}/1000 characters
          </span>
        </div>
        <textarea
          id="book-description"
          rows={4}
          maxLength={1000}
          value={description}
          disabled={isSubmitting}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          placeholder="Write a brief overview of the book's plot, theme, or topics..."
          className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
            errors.description
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20'
          }`}
        />
        {errors.description && (
          <p className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.description}</p>
        )}
      </div>

      {/* Read-only User Information */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Uploader Information (Auto-populated)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500">User Name</label>
            <input
              type="text"
              readOnly
              value={userName}
              tabIndex={-1}
              className="mt-1 w-full px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 cursor-not-allowed border-none focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">User Email</label>
            <input
              type="text"
              readOnly
              value={userEmail}
              tabIndex={-1}
              className="mt-1 w-full px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 cursor-not-allowed border-none focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/20 transition-all duration-200 hover:shadow-amber-600/35 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{submitStep || 'Processing...'}</span>
            </>
          ) : (
            <span>Add Book</span>
          )}
        </button>
      </div>
    </form>
  );
}
