'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PenLine } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLetters } from '@/hooks/useLetters';
import LetterCard from '@/components/dashboard/LetterCard';
import EmptyState from '@/components/dashboard/EmptyState';
import AuthGuard from '@/components/ui/AuthGuard';
import { useToast } from '@/components/ui/ToastProvider';

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl h-48 animate-shimmer" style={{ border: '1px solid var(--border)' }} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { letters, loading: lettersLoading, error } = useLetters();
  const { toast } = useToast();

  useEffect(() => {
    if (error) toast('Failed to load archive', 'error');
  }, [error, toast]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">

          {/* Header */}
          <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-fade-in-up">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent)' }}>
                Your Archive
              </p>
              <h1
                className="text-4xl font-normal sm:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
              >
                Good to see you,<br />
                <em>{firstName}.</em>
              </h1>
              <p className="mt-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
                {letters.length > 0
                  ? `${letters.length} document${letters.length !== 1 ? 's' : ''} in your archive.`
                  : 'Your secured documents live here.'}
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 self-start sm:self-auto"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'var(--accent-light)', transform: 'translateY(-1px)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'var(--accent)', transform: 'translateY(0)' })}
            >
              <PenLine className="h-3.5 w-3.5" />
              New Document
            </Link>
          </div>

          {/* Divider */}
          <div className="mb-10 h-px" style={{ backgroundColor: 'var(--border)' }} />

          {/* Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {lettersLoading ? (
              <DashboardSkeleton />
            ) : letters.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {letters.map((letter, i) => (
                  <div
                    key={letter.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <LetterCard letter={letter} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
