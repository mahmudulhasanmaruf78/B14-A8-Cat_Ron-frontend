'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@heroui/react';
import { signIn } from '@/lib/auth-client';
import { PasswordInput } from './PasswordInput';
import { GoogleAuthButton } from './GoogleAuthButton';
import { isValidEmail, sanitizeRedirectUrl } from '@/lib/validations/auth-validation';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeRedirectUrl(searchParams.get('callbackUrl') || searchParams.get('redirectTo'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await signIn.email({
        email: email.trim(),
        password,
      });

      if (response.error) {
        const errorMsg = response.error.message || 'Invalid email or password. Please try again.';
        setErrors({ general: errorMsg });
        toast.danger(errorMsg);
      } else {
        toast.success('Successfully signed in to BookNook.');
        router.push(callbackUrl);
      }
    } catch {
      const fallbackMsg = 'An unexpected error occurred. Please check your credentials.';
      setErrors({ general: fallbackMsg });
      toast.danger(fallbackMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    setErrors({});

    try {
      const result = await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      });

      if (result?.error) {
        const errorMsg = result.error.message || 'Google authentication is currently unavailable.';
        setErrors({ general: errorMsg });
        toast.danger(errorMsg);
        setIsGoogleLoading(false);
      }
    } catch {
      const errorMsg = 'Google authentication configuration error. Please verify OAuth setup.';
      setErrors({ general: errorMsg });
      toast.danger(errorMsg);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Welcome back to <span className="text-amber-600 dark:text-amber-500">BookNook</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to access your borrowed books, lists, and library reading journey.
        </p>
      </div>

      {/* General Error Banner */}
      {errors.general && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errors.general}</span>
        </div>
      )}

      {/* Google Sign In */}
      <div className="space-y-4">
        <GoogleAuthButton
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          disabled={isSubmitting}
          text="Sign in with Google"
        />

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          <span className="absolute bg-white dark:bg-zinc-950 px-3 text-xs uppercase tracking-wider text-zinc-400">
            or continue with email
          </span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="you@example.com"
            className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Password
            </label>
            <span
              className="text-xs text-zinc-400 cursor-not-allowed hover:text-zinc-500 transition-colors"
              title="Password reset is not enabled in this phase"
            >
              Forgot password?
            </span>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Enter your password"
            error={errors.password}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-amber-600/25 transition-all duration-200 hover:shadow-amber-600/40 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 underline-offset-4 hover:underline"
        >
          Register for free
        </Link>
      </div>
    </div>
  );
}
