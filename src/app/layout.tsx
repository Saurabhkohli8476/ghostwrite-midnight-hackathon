import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/components/ui/AuthProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'GhostWrite — Cryptographic Provenance for Writers',
    template: '%s | GhostWrite',
  },
  description:
    'Ideas deserve provenance. Cryptographically prove your work existed — without revealing a single word. A privacy-first authorship archive for writers, researchers, and creators.',
  keywords: [
    'proof of creation',
    'authorship',
    'privacy',
    'Midnight blockchain',
    'writers',
    'researchers',
    'manuscript archive',
  ],
  openGraph: {
    title: 'GhostWrite',
    description: 'A privacy-first authorship archive built on the Midnight blockchain.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased" style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

