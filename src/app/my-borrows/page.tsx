import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { MyBorrowsClient } from '@/components/borrows/MyBorrowsClient';

export const metadata: Metadata = {
  title: 'My Borrows',
  description: 'Manage your borrowed books and return them when you are done reading.',
};

export default async function MyBorrowsPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/my-borrows');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Reader Circulation
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          My Borrows
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your borrowed books and return them when you are done reading.
        </p>
      </div>

      {/* Interactive Borrowed Books Client */}
      <MyBorrowsClient />
    </div>
  );
}

