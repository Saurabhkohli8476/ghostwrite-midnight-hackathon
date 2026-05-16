'use client';

import Link from 'next/link';
import { Shield, Lock } from 'lucide-react';
import type { CoverLetter } from '@/types';

interface LetterCardProps {
  letter: CoverLetter;
}

export default function LetterCard({ letter }: LetterCardProps) {
  const formattedDate = new Date(letter.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <Link
      href={`/letter/${letter.id}`}
      className="group block rounded-xl transition-all duration-300"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, {
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transform: 'translateY(-2px)',
        borderColor: 'rgba(61,53,128,0.25)',
      })}
      onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, {
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        transform: 'translateY(0)',
        borderColor: 'var(--border)',
      })}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-medium leading-snug truncate"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
            >
              {letter.jobTitle || 'Untitled Document'}
            </h3>
            {letter.company && (
              <p className="mt-1 text-xs" style={{ color: 'var(--ink-faint)' }}>
                {letter.company}
              </p>
            )}
          </div>

          {letter.isSecured ? (
            <div
              className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: 'rgba(45,106,79,0.08)', color: 'var(--success)', border: '1px solid rgba(45,106,79,0.2)' }}
            >
              <Shield className="h-3 w-3" />
              Secured
            </div>
          ) : (
            <div
              className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--ink-faint)', border: '1px solid var(--border)' }}
            >
              Draft
            </div>
          )}
        </div>

        <p
          className="text-sm line-clamp-2 leading-relaxed"
          style={{ color: 'var(--ink-muted)' }}
        >
          {letter.generatedLetter?.slice(0, 140).trim()}…
        </p>
      </div>

      <div
        className="flex items-center justify-between px-6 py-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{formattedDate}</span>
        {letter.midnightHash ? (
          <span className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--ink-faint)' }}>
            <Lock className="h-2.5 w-2.5" />
            {letter.midnightHash.slice(0, 8)}…
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>Unsecured</span>
        )}
      </div>
    </Link>
  );
}
