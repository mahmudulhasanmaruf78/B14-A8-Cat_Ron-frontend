'use client';

import React from 'react';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { formatUptime, formatDate } from '../utils/formatters';

export function BackendStatusCard() {
  const { data, loading, error, refetch } = useBackendHealth();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Backend Connectivity Status
            {loading && (
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            )}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time health-check communication with Express server
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? 'Checking...' : 'Re-check Connection'}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
            <div className="flex items-start gap-3">
              <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Backend Unavailable
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  {error}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400/80 mt-2">
                  Please verify that the Express server is running on port 5000 (<code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">npm run dev</code> inside <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">server/</code>).
                </p>
              </div>
            </div>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                  Express Server
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connected (200 OK)
                </span>
              </div>
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {data.message}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-col gap-1 pt-1">
                <div>Uptime: {formatUptime(data.uptime)}</div>
                <div>Last ping: {formatDate(data.timestamp)}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                  MongoDB Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    data.database.connected
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      data.database.connected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {data.database.connected ? 'Connected' : 'Pending URI / Disconnected'}
                </span>
              </div>
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Database: <code className="text-amber-600 dark:text-amber-400">{data.database.name}</code>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                {data.database.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
