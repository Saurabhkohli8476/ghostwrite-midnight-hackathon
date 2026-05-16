'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/auth/UserMenu';

const navLinks = [
  { href: '/create', label: 'New Document' },
  { href: '/dashboard', label: 'Archive' },
  { href: '/verify', label: 'Verify' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'rgba(247,244,237,0.85)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          {/* Wax-seal-inspired monogram */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tracking-widest transition-opacity group-hover:opacity-70"
            style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)' }}
          >
            GW
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
          >
            GhostWrite
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'var(--ink-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: auth */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <UserMenu user={user} onLogout={signOut} />
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-light)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 transition-colors md:hidden cursor-pointer"
          style={{ color: 'var(--ink-muted)' }}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="animate-fade-in border-t md:hidden"
          style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium transition-colors"
                style={{ color: 'var(--ink-muted)' }}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              {user ? (
                <button
                  onClick={() => { setMobileOpen(false); signOut(); }}
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: 'var(--danger)' }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); signInWithGoogle(); }}
                  className="rounded-full px-5 py-2 text-sm font-medium cursor-pointer"
                  style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
