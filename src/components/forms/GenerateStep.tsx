'use client';

import { Shield, ArrowLeft, Loader2, RotateCcw } from 'lucide-react';

interface GenerateStepProps {
  letter: string;
  jobTitle: string;
  company: string;
  onBack: () => void;
  onSecure: () => void;
  isSecuring: boolean;
  onChange: (val: string) => void;
}

export default function GenerateStep({
  letter,
  jobTitle,
  company,
  onBack,
  onSecure,
  isSecuring,
  onChange,
}: GenerateStepProps) {
  const wordCount = letter.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2
          className="text-3xl font-normal"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
        >
          Review your draft.
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
          Edit freely. When the document reflects your intent, secure it with a cryptographic receipt.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Editor */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid var(--border)',
            backgroundColor: '#FDFAF4',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          }}
        >
          {/* Document header bar */}
          <div
            className="flex items-center justify-between px-7 py-4"
            style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--ink)', fontFamily: "'Playfair Display', serif" }}
              >
                {jobTitle || 'Untitled Document'}
              </p>
              {company && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{company}</p>
              )}
            </div>
            <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
              {wordCount} words
            </span>
          </div>

          <textarea
            value={letter}
            onChange={e => onChange(e.target.value)}
            disabled={isSecuring}
            rows={20}
            className="w-full resize-none bg-transparent px-8 py-7 text-sm leading-[1.9] outline-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: 'var(--ink)',
              fontSize: '1rem',
            }}
          />

          <div
            className="flex items-center justify-between px-7 py-4"
            style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <button
              onClick={onBack}
              disabled={isSecuring}
              className="inline-flex items-center gap-1.5 text-sm cursor-pointer disabled:opacity-40"
              style={{ color: 'var(--ink-faint)' }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        </div>

        {/* Secure panel */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-6"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div
              className="seal-ring mx-auto mb-5 h-12 w-12"
              style={{ borderColor: 'var(--accent)' }}
            >
              <Shield className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            </div>

            <h3
              className="text-center text-lg font-normal mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
            >
              Ready to seal?
            </h3>
            <p className="text-center text-xs leading-relaxed mb-6" style={{ color: 'var(--ink-muted)' }}>
              A cryptographic fingerprint of this document will be permanently recorded on the Midnight blockchain.
              The content stays private — always.
            </p>

            <button
              onClick={onSecure}
              disabled={isSecuring}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-40"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
            >
              {isSecuring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sealing…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Secure on Midnight
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--ink-faint)' }}>
            Powered by the Midnight preprod network.
          </p>
        </div>
      </div>
    </div>
  );
}
