'use client';

import Link from 'next/link';
import { PenLine } from 'lucide-react';

export default function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl py-24 px-8 text-center"
      style={{
        border: '1px dashed var(--border)',
        backgroundColor: 'var(--surface)',
      }}
    >
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}
      >
        <PenLine className="h-6 w-6" style={{ color: 'var(--ink-faint)' }} />
      </div>

      <h3
        className="text-xl font-normal mb-2"
        style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
      >
        Your archive is empty.
      </h3>
      <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: 'var(--ink-muted)' }}>
        Create your first document and secure it with a cryptographic receipt on the Midnight blockchain.
      </p>

      <Link
        href="/create"
        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all duration-200"
        style={{ backgroundColor: 'var(--accent)' }}
        onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'var(--accent-light)', transform: 'translateY(-1px)' })}
        onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { backgroundColor: 'var(--accent)', transform: 'translateY(0)' })}
      >
        <PenLine className="h-3.5 w-3.5" />
        Begin writing
      </Link>
    </div>
  );
}
