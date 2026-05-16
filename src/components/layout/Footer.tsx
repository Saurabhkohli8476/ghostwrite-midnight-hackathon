'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
            © {new Date().getFullYear()} GhostWrite — Midnight × MLH Hackathon 2026
          </p>
          <div className="flex items-center gap-6">
            <Link href="/verify" className="text-xs transition-colors duration-200" style={{ color: 'var(--ink-faint)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-faint)')}>
              Verify a Receipt
            </Link>
            <Link href="/dashboard" className="text-xs transition-colors duration-200" style={{ color: 'var(--ink-faint)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-faint)')}>
              Archive
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="text-xs transition-colors duration-200" style={{ color: 'var(--ink-faint)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-faint)')}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
