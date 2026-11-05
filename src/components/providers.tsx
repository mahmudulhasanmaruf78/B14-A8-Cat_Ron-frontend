'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RouterProvider, ToastProvider } from '@heroui/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <ToastProvider />
      {children}
    </RouterProvider>
  );
}

