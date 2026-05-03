'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A96E]/10">
        <AlertTriangle className="h-8 w-8 text-[#C9A96E]" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Admin Error</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || 'An error occurred in the admin panel. Please try again.'}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-full bg-[#C9A96E] px-5 py-2 text-sm font-semibold text-[#0F0F0F] hover:bg-[#C9A96E]/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}
