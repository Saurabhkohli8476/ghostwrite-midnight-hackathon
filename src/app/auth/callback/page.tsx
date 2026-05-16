'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handle = async () => {
      // Check for OAuth error in URL hash (e.g. user denied, access_denied)
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace('#', '?'));
      const urlError = params.get('error') ?? new URLSearchParams(window.location.search).get('error');

      if (urlError) {
        setStatus('error');
        setErrorMsg(params.get('error_description') ?? 'Authentication was cancelled.');
        setTimeout(() => router.replace('/'), 2500);
        return;
      }

      try {
        // Exchange the code/token Supabase embedded in the URL
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          router.replace('/dashboard');
        } else {
          // No session — user may have hit Back. Give Supabase 1 more second
          // to resolve the token exchange before giving up.
          await new Promise(r => setTimeout(r, 1000));
          const { data: { session: retried } } = await supabase.auth.getSession();
          router.replace(retried?.user ? '/dashboard' : '/');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setErrorMsg('Something went wrong. Redirecting…');
        setTimeout(() => router.replace('/'), 2000);
      }
    };

    handle();
  }, [router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="flex flex-col items-center gap-5 rounded-2xl px-10 py-12 text-center"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          maxWidth: '360px',
          width: '100%',
        }}
      >
        {status === 'loading' ? (
          <>
            {/* Animated GW monogram instead of a spinner */}
            <div
              className="seal-ring h-14 w-14 animate-pulse-glow"
              style={{ borderColor: 'var(--accent)' }}
            >
              <span style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--accent)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}>
                GW
              </span>
            </div>
            <p
              className="text-lg font-normal"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
            >
              Completing sign in…
            </p>
            <p className="text-sm" style={{ color: 'var(--ink-faint)' }}>
              Please wait a moment.
            </p>
          </>
        ) : (
          <>
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(155,35,53,0.08)', border: '1px solid rgba(155,35,53,0.2)' }}
            >
              <span style={{ color: 'var(--danger)', fontSize: '1.25rem' }}>✕</span>
            </div>
            <p
              className="text-lg font-normal"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
            >
              Sign in cancelled
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              {errorMsg}
            </p>
            <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>Redirecting you back…</p>
          </>
        )}
      </div>
    </div>
  );
}
