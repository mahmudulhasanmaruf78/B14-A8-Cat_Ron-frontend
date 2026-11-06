import React from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { BooksService } from '@/services/books.service';
import { BookDetailsClient } from '@/components/books/BookDetailsClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await BooksService.getBookById(id);
    if (res.success && res.data) {
      return {
        title: res.data.title,
        description: res.data.description || `Details for ${res.data.title}`,
      };
    }
  } catch {
    // ignore
  }

  return {
    title: 'Book Details',
    description: 'Explore single book details in the BookNook library.',
  };
}

export default async function BookDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect(`/login?callbackUrl=/books/${id}`);
  }

  const res = await BooksService.getBookById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <BookDetailsClient initialBook={res.data} user={session.user} />
    </div>
  );
}

