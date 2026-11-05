import React from 'react';
import { PasswordValidationResult } from '@/lib/validations/auth-validation';

interface PasswordRequirementsProps {
  validation: PasswordValidationResult;
  showAlways?: boolean;
  value?: string;
}

export function PasswordRequirements({
  validation,
  value = '',
}: PasswordRequirementsProps) {
  if (!value) return null;

  const requirements = [
    {
      label: 'At least one uppercase letter (A-Z)',
      met: validation.hasUppercase,
    },
    {
      label: 'At least one lowercase letter (a-z)',
      met: validation.hasLowercase,
    },
    {
      label: 'Minimum 6 characters in length',
      met: validation.hasMinLength,
    },
  ];

  return (
    <div className="space-y-1.5 pt-1 pb-1">
      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Password requirements:
      </p>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs transition-colors">
            {req.met ? (
              <svg
                className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-zinc-400 dark:text-zinc-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              </svg>
            )}
            <span
              className={
                req.met
                  ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                  : 'text-zinc-500 dark:text-zinc-500'
              }
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
