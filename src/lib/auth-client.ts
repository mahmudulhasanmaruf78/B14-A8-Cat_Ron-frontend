import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL:
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://b14-a8-cat-ron-frontend.vercel.app'
          : 'http://localhost:3000'),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

