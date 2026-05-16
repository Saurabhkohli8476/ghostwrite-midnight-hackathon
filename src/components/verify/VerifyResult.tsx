'use client';

import { Loader2, CheckCircle2, XCircle, Shield, Clock, FileText, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export interface VerifyResultData {
  verified: boolean;
  hash?: string;
  txId?: string;
  timestamp?: string;
  network?: string;
  contentType?: string;
  creatorIdentity?: string;
  securedAt?: string;
}

interface VerifyResultProps {
  result: VerifyResultData | null;
  isLoading: boolean;
}

export default function VerifyResult({ result, isLoading }: VerifyResultProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="mt-4 text-slate-400">Verifying on Midnight...</p>
      </div>
    );
  }

  if (!result) return null;

  if (result.verified) {
    const formattedDate = result.timestamp
      ? new Date(result.timestamp).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'Unknown';

    return (
      <div className="animate-slide-up mt-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-green-500">
            Verified on Midnight
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            This receipt proves the document existed at the recorded time. The original content remains private.
          </p>
        </div>

        <Card className="mx-auto max-w-2xl border-green-500/30 bg-slate-900/80 shadow-lg shadow-green-500/5">
          <div className="space-y-6">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-400">
                <FileText className="h-4 w-4" />
                Document Hash
              </div>
              <p
                className="font-mono text-sm text-white break-all bg-slate-950 p-3 rounded-md border border-slate-800"
                title={result.hash}
              >
                {result.hash}
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-400">
                <Shield className="h-4 w-4" />
                Transaction ID
              </div>
              <p className="font-mono text-sm text-slate-300">
                {result.txId}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-slate-800 pt-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
                  <Clock className="h-4 w-4" />
                  Secured At
                </div>
                <p className="text-white">{formattedDate}</p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
                  Network
                </div>
                <Badge variant="secured" className="border-purple-500/30 text-purple-400 bg-purple-500/10">
                  {result.network}
                </Badge>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
                  Content Type
                </div>
                <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                  {result.contentType}
                </span>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
                  <User className="h-4 w-4" />
                  Creator Identity
                </div>
                <span className="inline-flex rounded-full border border-slate-600/50 bg-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                  {result.creatorIdentity}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Not verified (red state)
  return (
    <div className="animate-slide-up mt-8">
      <div className="flex flex-col items-center mb-6 text-center">
        <XCircle className="h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-red-500">
          Receipt Not Found
        </h2>
        <p className="mt-2 text-slate-400">
          This hash does not exist in the Midnight preprod network.
        </p>
      </div>

      <Card className="mx-auto max-w-xl border-red-500/30 bg-slate-900/80 text-center">
        <p className="text-slate-300">
          Double-check the hash or contact the document owner. Ensure you copied the entire hash string without extra spaces.
        </p>
      </Card>
    </div>
  );
}
