'use client';

import { Lock } from 'lucide-react';

interface LoginCardProps {
  onLogin: () => void;
}

export default function LoginCard({ onLogin }: LoginCardProps) {
  return (
    <div className="w-full max-w-sm animate-fade-in-up">
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        {/* Top rule */}
        <div className="h-px w-full" style={{ backgroundColor: 'var(--accent)', opacity: 0.6 }} />

        <div className="px-8 py-10">
          {/* Monogram */}
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className="seal-ring h-14 w-14 mb-5"
              style={{ borderColor: 'var(--accent)' }}
            >
              <span style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em' }}>
                GW
              </span>
            </div>
            <h1
              className="text-2xl font-normal"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
            >
              GhostWrite
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              Your private authorship archive.<br />
              Secure and elegant.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {[
              { icon: Lock, title: 'Zero-knowledge privacy', desc: 'Only your document\'s fingerprint is stored, never the content.' },
              { icon: Lock, title: 'Blockchain provenance', desc: 'Immutable receipts on the Midnight blockchain prove you were first.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--accent-bg)', border: '1px solid rgba(61,53,128,0.15)' }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--ink-faint)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="divider-ornament mb-8 text-base" style={{ color: 'var(--ink-faint)' }}>·</div>

          {/* Google Sign-In */}
          <button
            onClick={onLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { backgroundColor: 'var(--accent-light)', transform: 'translateY(-1px)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: 'var(--accent)', transform: 'translateY(0)' })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.42 3.46 1.18 4.93l3.66-2.84Z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-5 text-center text-xs" style={{ color: 'var(--ink-faint)' }}>
            Your documents are private. Always.
          </p>
        </div>
      </div>
    </div>
  );
}
