import React from 'react';
import { BackendStatusCard } from '../components/BackendStatusCard';
import { HealthCheckBadge } from '../features/health/HealthCheckBadge';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <HealthCheckBadge />
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-full">
              Phase 1 Setup Complete
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to <span className="text-amber-600 dark:text-amber-500">BookNook</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Your full-stack digital library management platform. Built with Next.js 16, React 19, Hero UI, Tailwind CSS, Express, TypeScript, and MongoDB.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              Next.js 16 (Port 3000)
            </span>
            <span className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              Express + TypeScript (Port 5000)
            </span>
            <span className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              Official MongoDB Node.js Driver
            </span>
          </div>
        </div>
      </section>

      {/* Backend Health Check Integration */}
      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
          Step 3 Verification • Live Backend Communication
        </h2>
        <BackendStatusCard />
      </section>

      {/* Architecture Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            FE
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Frontend Client
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Next.js App Router with React 19, Tailwind CSS v4, Hero UI providers, modular architecture, and typed API clients.
          </p>
          <div className="text-xs font-mono text-zinc-400 pt-2">
            client/src/
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            BE
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Backend Server
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Express application in TypeScript with tsx watcher, CORS configuration, centralized error handling, and GET / health probe.
          </p>
          <div className="text-xs font-mono text-zinc-400 pt-2">
            server/src/
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            DB
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Database Layer
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Native MongoDB driver connection manager, ping diagnostics, graceful disconnect, and dedicated environment configuration.
          </p>
          <div className="text-xs font-mono text-zinc-400 pt-2">
            DB: booknook
          </div>
        </div>
      </section>
    </div>
  );
}
