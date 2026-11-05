import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { AddBookForm } from '@/components/books/AddBookForm';

export const metadata: Metadata = {
  title: 'Add a Book',
  description: 'Add a new book to the BookNook library collection.',
};

export default async function AddBookPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/add-book');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-zinc-200/40 dark:shadow-none space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Library Catalog
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Add a New Book
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Fill in the details below and upload a cover photo to make the book available for readers.
          </p>
        </div>

        {/* Add Book Form */}
        <AddBookForm user={session.user} />
      </div>
    </div>
  );
}

