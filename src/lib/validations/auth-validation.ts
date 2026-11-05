export interface PasswordValidationResult {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasMinLength: boolean;
  isValid: boolean;
}

export function validatePassword(password: string): PasswordValidationResult {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  return {
    hasUppercase,
    hasLowercase,
    hasMinLength,
    isValid: hasUppercase && hasLowercase && hasMinLength,
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeRedirectUrl(url: string | null | undefined): string {
  if (!url) return '/';
  // Allow only relative paths to prevent open redirect vulnerabilities
  if (url.startsWith('/') && !url.startsWith('//') && !url.includes('\\')) {
    return url;
  }
  return '/';
}
