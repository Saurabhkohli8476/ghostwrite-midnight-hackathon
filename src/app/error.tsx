'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center text-center p-8 rounded-xl bg-slate-900 border border-slate-800 shadow-xl animate-fade-in-up">
        <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">Something went wrong</h2>
        <p className="mb-8 text-sm text-slate-400">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <Button onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh page
        </Button>
      </div>
    </div>
  );
}
