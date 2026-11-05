'use client';

import React from 'react';
import { useBackendHealth } from '../../hooks/useBackendHealth';

export function HealthCheckBadge() {
  const { data, loading, error } = useBackendHealth();

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        Checking Backend...
      </span>
    );
  }

  if (error || !data) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Backend Offline
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      API Online ({data.database.connected ? 'DB Connected' : 'DB Pending'})
    </span>
  );
}

