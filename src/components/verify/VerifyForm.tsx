'use client';

import { useState } from 'react';
import { Search, Loader2, Clipboard } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface VerifyFormProps {
  onVerify: (hash: string) => void;
  isLoading: boolean;
  initialHash?: string;
}

export default function VerifyForm({
  onVerify,
  isLoading,
  initialHash = '',
}: VerifyFormProps) {
  const [hash, setHash] = useState(initialHash);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hash.trim()) {
      onVerify(hash.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setHash(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard text: ', err);
    }
  };

  return (
    <Card padding="lg" className="mx-auto max-w-xl animate-fade-in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Enter the Midnight receipt hash..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 pr-12 font-mono text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition-colors hover:text-white"
            title="Paste from clipboard"
            disabled={isLoading}
          >
            <Clipboard className="h-5 w-5" />
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!hash.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Verify Receipt
            </>
          )}
        </Button>

        <p className="mt-2 text-center text-sm text-slate-500">
          Enter the cryptographic hash from a GhostWrite receipt to verify its
          existence on the Midnight blockchain.
        </p>
      </form>
    </Card>
  );
}
