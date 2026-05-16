'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CoverLetter } from '@/types';
import AuthGuard from '@/components/ui/AuthGuard';
import MidnightReceipt from '@/components/letter/MidnightReceipt';
import { useToast } from '@/components/ui/ToastProvider';
import { Copy, Download, ArrowLeft } from 'lucide-react';
import { generatePDF, downloadPDF } from '@/lib/pdf';
import { use } from 'react';
import Link from 'next/link';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} style={{ backgroundColor: 'var(--surface-alt)' }} />;
}

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const [letter, setLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetter = async () => {
      const { data } = await supabase.from('cover_letters').select('*').eq('id', id).single();
      if (data) {
        setLetter({
          id: data.id,
          userId: data.user_id,
          jobTitle: data.job_title,
          company: data.company,
          jobDescription: data.job_description,
          userExperience: data.user_experience,
          generatedLetter: data.generated_letter,
          midnightHash: data.midnight_hash,
          midnightTx: data.midnight_tx,
          isSecured: data.is_secured,
          securedAt: data.secured_at,
          createdAt: data.created_at,
        });
      }
      setLoading(false);
    };
    fetchLetter();
  }, [id]);

  const handleCopy = () => {
    if (letter) {
      navigator.clipboard.writeText(letter.generatedLetter);
      toast('Document copied to clipboard', 'success');
    }
  };

  const handleDownload = () => {
    if (letter) {
      const blob = generatePDF(letter.generatedLetter, letter.jobTitle || 'Document', letter.company || '');
      downloadPDF(blob, `GhostWrite_${(letter.jobTitle || 'Document').replace(/\s+/g, '_')}.pdf`);
      toast('PDF downloaded', 'success');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-96" />
            </div>
          ) : !letter ? (
            <div className="py-32 text-center">
              <p style={{ color: 'var(--ink-muted)' }}>Document not found.</p>
              <Link href="/dashboard" className="mt-4 inline-block text-sm underline" style={{ color: 'var(--accent)' }}>
                Return to archive
              </Link>
            </div>
          ) : (
            <div className="animate-fade-in-up space-y-10">
              {/* Back */}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
                style={{ color: 'var(--ink-faint)' }}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Archive
              </Link>

              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1
                    className="text-4xl font-normal leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
                  >
                    {letter.jobTitle || 'Untitled Document'}
                  </h1>
                  {letter.company && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--ink-faint)' }}>{letter.company}</p>
                  )}
                  <p className="mt-2 text-xs" style={{ color: 'var(--ink-faint)' }}>
                    {new Date(letter.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 cursor-pointer"
                    style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', backgroundColor: 'var(--surface)' }}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, { color: 'var(--ink)', backgroundColor: 'var(--surface-alt)' })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'var(--ink-muted)', backgroundColor: 'var(--surface)' })}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium text-white transition-all duration-200 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-light)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

              {/* Document body — premium paper card */}
              <div
                className="rounded-2xl p-10 shadow-sm"
                style={{
                  backgroundColor: '#FDFAF4',
                  border: '1px solid var(--border)',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  lineHeight: '1.9',
                  fontSize: '1.05rem',
                  color: 'var(--ink)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {letter.generatedLetter}
              </div>

              {/* Midnight Receipt */}
              {letter.isSecured && letter.midnightHash && letter.midnightTx && letter.securedAt && (
                <MidnightReceipt
                  hash={letter.midnightHash}
                  txId={letter.midnightTx}
                  timestamp={letter.securedAt}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
