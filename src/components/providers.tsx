'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RouterProvider, ToastProvider } from '@heroui/react';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider>
      <RouterProvider navigate={router.push}>
        <ToastProvider />
        {children}
      </RouterProvider>
    </ThemeProvider>
  );
}

