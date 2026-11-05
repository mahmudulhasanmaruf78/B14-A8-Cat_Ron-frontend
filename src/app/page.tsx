import React, { Suspense } from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { HowItWorks } from '../components/home/HowItWorks';
import { BookCategories } from '../components/home/BookCategories';
import { BackendStatusCard } from '../components/BackendStatusCard';
import { HealthCheckBadge } from '../features/health/HealthCheckBadge';

export default function HomePage() {
  return (
    <>
      {/* Phase 2: Hero Slider */}
      <HeroSlider />

      {/* Phase 2: How Borrowing Works */}
      <HowItWorks />

      {/* Phase 2: Book Categories */}
      <BookCategories />

      {/* Phase 1: Architecture Info (preserved) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 p-8 sm:p-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Suspense fallback={<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Checking...</span>}>
                <HealthCheckBadge />
              </Suspense>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-full">
                Phase 1 Setup Complete
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome to <span className="text-amber-600 dark:text-amber-500">BookNook</span>
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Your full-stack digital library management platform. Built with Next.js 16, React 19, Hero UI, Tailwind CSS, Express, TypeScript, and MongoDB.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
            Live Backend Communication
          </h2>
          <Suspense fallback={<div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-sm text-zinc-500">Loading backend status...</div>}>
            <BackendStatusCard />
          </Suspense>
        </section>
      </div>
    </>
  );
}
