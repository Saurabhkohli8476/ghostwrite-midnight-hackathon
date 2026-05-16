'use client';

import { useState, useEffect, use } from 'react';
import { AlertCircle } from 'lucide-react';
import VerifyForm from '@/components/verify/VerifyForm';
import VerifyResult, { type VerifyResultData } from '@/components/verify/VerifyResult';

export default function DirectVerifyPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = use(params);
  const [result, setResult] = useState<VerifyResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hash) {
      handleVerify(hash);
    }
  }, [hash]);

  const handleVerify = async (hashToVerify: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(hashToVerify)}`);
      
      if (res.status === 404) {
        setResult({ verified: false });
      } else if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to verify receipt');
      } else {
        const data = await res.json();
        setResult(data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while verifying the receipt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Verify a Midnight Receipt
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Enter a cryptographic hash to verify document existence on the Midnight blockchain without revealing contents.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        <VerifyForm 
          onVerify={handleVerify} 
          isLoading={isLoading} 
          initialHash={hash} 
        />

        <div className="mt-8">
          <VerifyResult result={result} isLoading={isLoading} />
        </div>

      </div>
    </div>
  );
}
