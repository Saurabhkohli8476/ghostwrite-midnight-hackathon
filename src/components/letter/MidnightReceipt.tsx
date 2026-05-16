'use client';

import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface MidnightReceiptProps {
  hash: string;
  txId: string;
  timestamp: string;
}

export default function MidnightReceipt({ hash, txId, timestamp }: MidnightReceiptProps) {
  const { toast } = useToast();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied`, 'success');
  };

  const formatted = new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) + ' · ' + new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return (
    <div
      className="animate-fade-in-up rounded-2xl"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      }}
    >
      {/* Certificate header */}
      <div
        className="flex items-center gap-5 px-8 py-6"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Seal */}
        <div
          className="seal-ring flex-shrink-0 h-14 w-14"
          style={{ borderColor: 'var(--accent)' }}
        >
          <span
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em' }}
          >
            GW
          </span>
        </div>
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: 'var(--accent)' }}
          >
            Certificate of Creation
          </p>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Secured by the Midnight Blockchain
          </p>
        </div>
        {/* Verified badge */}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>Verified</span>
        </div>
      </div>

      {/* Fields */}
      <div className="grid gap-0 sm:grid-cols-3" style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Hash */}
        <div className="px-8 py-6 sm:col-span-2" style={{ borderRight: '1px solid var(--border)' }}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ink-faint)' }}>
            Document Hash
          </p>
          <div className="flex items-center gap-3">
            <p className="flex-1 font-mono text-xs break-all leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              {hash}
            </p>
            <button
              onClick={() => handleCopy(hash, 'Document Hash')}
              className="shrink-0 rounded-lg p-1.5 transition-colors cursor-pointer"
              style={{ color: 'var(--ink-faint)' }}
              title="Copy hash"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Sealed */}
        <div className="px-8 py-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ink-faint)' }}>
            Sealed
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
            {formatted}
          </p>
        </div>
      </div>

      {/* Transaction */}
      <div className="flex items-center gap-4 px-8 py-5">
        <div className="flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ink-faint)' }}>
            Blockchain Transaction
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--ink-muted)' }}>{txId}</p>
        </div>
        <button
          onClick={() => handleCopy(txId, 'Transaction ID')}
          className="rounded-lg p-1.5 transition-colors cursor-pointer"
          style={{ color: 'var(--ink-faint)' }}
          title="Copy transaction ID"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid rgba(61,53,128,0.15)' }}
        >
          midnight-preprod
        </span>
      </div>
    </div>
  );
}
