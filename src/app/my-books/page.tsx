import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { MyBooksClient } from '@/components/books/MyBooksClient';

export const metadata: Metadata = {
  title: 'My Books',
  description: 'View and manage books you have contributed to the BookNook library.',
};

export default async function MyBooksPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/my-books');
  }

  const userEmail = session.user.email || '';
  const userName = session.user.name || 'User';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Personal Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            My Books
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage, update, and track the books you have added to the BookNook library.
          </p>
        </div>

        {/* Client Interactive Books List */}
        <MyBooksClient userEmail={userEmail} userName={userName} />
      </div>
    </div>
  );
}

