'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ArrowRight, Shield, FileText, Lock, Brain, Hash, CheckCircle } from 'lucide-react';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function RevealSection({ children, delay = '0ms', className = '' }: { children: React.ReactNode; delay?: string; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s ease ${delay}, transform 0.8s ease ${delay}`,
      }}
    >
      {children}
    </div>
  );
}

function FeaturePill({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
      style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', backgroundColor: 'var(--surface)' }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
      {label}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  if (user) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-6 text-center pt-16 pb-24">
        {/* Subtle watermark ring */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
          style={{ border: '1px solid rgba(61,53,128,0.06)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
          style={{ border: '1px solid rgba(61,53,128,0.08)' }}
          aria-hidden
        />

        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium animate-fade-in"
          style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', backgroundColor: 'var(--surface)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
          Midnight Preprod Network · Live
        </div>

        <h1
          className="animate-fade-in-up text-6xl font-normal leading-[1.1] tracking-tight sm:text-7xl md:text-8xl"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)', animationDelay: '80ms' }}
        >
          Ideas deserve<br />
          <em style={{ color: 'var(--accent)' }}>provenance.</em>
        </h1>

        <p
          className="mt-8 max-w-xl text-lg leading-relaxed animate-fade-in-up"
          style={{ color: 'var(--ink-muted)', animationDelay: '200ms' }}
        >
          Cryptographically prove your work existed — without revealing a single word.
          A private authorship archive for writers, researchers, and creators.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: '320ms' }}>
          <button
            onClick={signInWithGoogle}
            className="group inline-flex items-center gap-3 rounded-2xl px-7 py-3.5 text-base font-medium text-white transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { backgroundColor: 'var(--accent-light)', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(61,53,128,0.2)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: 'var(--accent)', transform: 'translateY(0)', boxShadow: 'none' })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.42 3.46 1.18 4.93l3.66-2.84Z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
            </svg>
            Begin with Google
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-medium transition-all duration-200"
            style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)', backgroundColor: 'transparent' }}
          >
            Verify a Receipt
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-14 flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '440ms' }}>
          <FeaturePill icon={Lock} label="Zero-knowledge privacy" />
          <FeaturePill icon={Shield} label="Midnight blockchain receipts" />
          <FeaturePill icon={FileText} label="AI-assisted drafting" />
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-6">
        <div className="divider-ornament text-lg" style={{ color: 'var(--ink-faint)' }}>✦</div>
      </div>

      {/* ── THE PIPELINE ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 overflow-hidden">
        <RevealSection>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-px" style={{ backgroundColor: 'var(--border)' }} />
            
            {[
              { icon: FileText, label: 'Document' },
              { icon: Brain, label: 'AI Semantic Fingerprint' },
              { icon: Hash, label: 'Cryptographic Hash' },
              { icon: Shield, label: 'Midnight Receipt' },
              { icon: CheckCircle, label: 'Private Verification' }
            ].map((step, i, arr) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center group w-40">
                <div 
                  className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                  style={{ 
                    border: '1px solid var(--border)', 
                    backgroundColor: 'var(--surface)', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.04)' 
                  }}
                >
                  <step.icon className="h-6 w-6 transition-colors duration-500" style={{ color: 'var(--accent)' }} />
                </div>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-center leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {step.label}
                </p>
                {/* Mobile connecting line */}
                {i !== arr.length - 1 && (
                  <div className="md:hidden h-10 w-px my-2" style={{ backgroundColor: 'var(--border)' }} />
                )}
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-28">
        <RevealSection>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>The Method</p>
          <h2 className="text-4xl font-normal sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}>
            How authorship<br /><em>is proven.</em>
          </h2>
        </RevealSection>

        <div className="mt-16 grid gap-16 lg:grid-cols-3">
          {[
            { n: 'I',   title: 'Write or describe your work', body: "Provide context and notes. GhostWrite\u2019s AI assistant synthesizes a structured draft \u2014 or simply helps you articulate what you already have." },
            { n: 'II',  title: 'Review and refine', body: 'Edit the draft in a calm, distraction-free environment. When the document reflects your intent, it is ready to be sealed.' },
            { n: 'III', title: 'Secure the receipt', body: 'A SHA-256 fingerprint of your text is committed to the Midnight blockchain. The receipt proves the work existed \u2014 your content stays private.' },
          ].map(({ n, title, body }, i) => (
            <RevealSection key={n} delay={`${i * 120}ms`}>
              <p
                className="mb-5 text-5xl font-light"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--border)' }}
              >
                {n}
              </p>
              <h3 className="mb-3 text-lg font-semibold" style={{ color: 'var(--ink)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>{body}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── RECEIPT SHOWCASE ─────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-5xl px-6 py-28">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <RevealSection>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>The Receipt</p>
              <h2 className="text-4xl font-normal sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}>
                An authenticity<br /><em>certificate.</em>
              </h2>
              <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                Every secured document receives an immutable cryptographic receipt — a permanent, public record of the work's existence at a specific moment in time. Share the hash. Keep the words.
              </p>
            </RevealSection>

            {/* Certificate mockup */}
            <RevealSection delay="200ms">
              <div
                className="animate-float rounded-2xl px-8 py-10"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
                }}
              >
                {/* Seal */}
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className="seal-ring h-12 w-12"
                    style={{ borderColor: 'var(--accent)' }}
                  >
                    <span style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em' }}>GW</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Certificate of Creation</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>Secured by Midnight</p>
                  </div>
                </div>

                <div className="space-y-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'var(--ink-faint)' }}>Document Hash</p>
                    <p className="font-mono text-xs break-all" style={{ color: 'var(--ink-muted)' }}>16f02b449a535a804d6319...4007480ab0dfa14e</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'var(--ink-faint)' }}>Transaction</p>
                    <p className="font-mono text-xs" style={{ color: 'var(--ink-muted)' }}>tx_1778935257875_knjd29f1</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'var(--ink-faint)' }}>Sealed</p>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>16 May 2026 · 18:10 IST</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>Verified on Midnight Preprod</span>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── FOR EVERY CREATOR ────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <RevealSection>
          <h2 className="text-4xl font-normal sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}>
            For every kind of <em>maker.</em>
          </h2>
          <p className="mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Whoever you are, your ideas deserve protection.
          </p>
        </RevealSection>
        <RevealSection delay="150ms">
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['Journalists', 'Researchers', 'Novelists', 'Songwriters', 'Students', 'Screenwriters', 'Essayists', 'Scientists', 'Poets', 'Developers', 'Designers', 'Academics'].map((role, i) => (
              <span
                key={role}
                className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--ink-muted)',
                  backgroundColor: 'var(--surface)',
                  animationDelay: `${i * 40}ms`,
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="mx-auto max-w-2xl px-6 py-28 text-center">
          <RevealSection>
            <div
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)' }}
            >
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em' }}>GW</span>
            </div>
            <h2 className="text-4xl font-normal sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}>
              Your work.<br /><em>Permanently yours.</em>
            </h2>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              Start your private authorship archive today.<br />Free, elegant, and built on verifiable truth.
            </p>
            <button
              onClick={signInWithGoogle}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-medium text-white transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { backgroundColor: 'var(--accent-light)', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(61,53,128,0.2)' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: 'var(--accent)', transform: 'translateY(0)', boxShadow: 'none' })}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.42 3.46 1.18 4.93l3.66-2.84Z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
              </svg>
              Open my Archive
              <ArrowRight className="h-4 w-4" />
            </button>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
