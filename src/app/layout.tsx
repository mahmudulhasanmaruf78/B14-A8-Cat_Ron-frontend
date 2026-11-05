import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/providers';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'BookNook | Digital Library Management System',
  description:
    'A modern full-stack digital library management system built with Next.js, Express, TypeScript, Hero UI, and MongoDB.',
  keywords: ['BookNook', 'Library Management', 'Books', 'Next.js', 'Express', 'TypeScript'],
  authors: [{ name: 'BookNook Development Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
