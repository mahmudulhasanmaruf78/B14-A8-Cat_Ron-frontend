export function formatUptime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function formatDate(isoString: string): string {
  try {
    // Use Intl.DateTimeFormat to avoid new Date() prerender issues in Next.js 16
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

