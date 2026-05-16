'use client';

import { useState } from 'react';
import { AlertCircle, Search, CheckCircle2, XCircle, Copy, FileText, AlertTriangle, Shield } from 'lucide-react';
import type { AuthorshipMatch } from '@/types';

interface VerifyResultData {
  verified: boolean;
  hash?: string;
  txId?: string;
  timestamp?: string;
  network?: string;
}

interface AuthorshipResultData {
  verified: boolean;
  hash?: string;
  authorshipMatch?: AuthorshipMatch;
}

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<'receipt' | 'authorship'>('receipt');
  
  // Receipt State
  const [receiptHash, setReceiptHash] = useState('');
  const [receiptResult, setReceiptResult] = useState<VerifyResultData | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  // Authorship State
  const [authorshipHash, setAuthorshipHash] = useState('');
  const [suspiciousText, setSuspiciousText] = useState('');
  const [authorshipResult, setAuthorshipResult] = useState<AuthorshipResultData | null>(null);
  const [authorshipLoading, setAuthorshipLoading] = useState(false);
  const [authorshipError, setAuthorshipError] = useState<string | null>(null);

  const handleVerifyReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = receiptHash.trim();
    if (!q) return;
    setReceiptLoading(true);
    setReceiptError(null);
    setReceiptResult(null);
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(q)}`);
      if (res.status === 404) {
        setReceiptResult({ verified: false });
      } else if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Verification failed');
      } else {
        setReceiptResult(await res.json());
      }
    } catch (err: any) {
      setReceiptError(err.message || 'An error occurred');
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleVerifyAuthorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorshipHash.trim() || !suspiciousText.trim()) return;
    setAuthorshipLoading(true);
    setAuthorshipError(null);
    setAuthorshipResult(null);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimedHash: authorshipHash.trim(),
          suspiciousText: suspiciousText.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      setAuthorshipResult(data);
    } catch (err: any) {
      setAuthorshipError(err.message || 'An error occurred');
    } finally {
      setAuthorshipLoading(false);
    }
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto max-w-2xl px-6 py-20 lg:px-8">

        {/* Header */}
        <div className="mb-14 text-center animate-fade-in-up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
            Provenance Check
          </p>
          <h1
            className="text-5xl font-normal leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
          >
            Verify a<br /><em>document.</em>
          </h1>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
            Confirm a document's existence on Midnight, or analyze a suspicious text against a secured fingerprint. The original contents remain entirely private.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center border-b" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'receipt' ? 'border-b-2' : 'opacity-60'}`}
            style={{ borderColor: activeTab === 'receipt' ? 'var(--accent)' : 'transparent', color: 'var(--ink)' }}
          >
            Verify Receipt
          </button>
          <button
            onClick={() => setActiveTab('authorship')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'authorship' ? 'border-b-2' : 'opacity-60'}`}
            style={{ borderColor: activeTab === 'authorship' ? 'var(--accent)' : 'transparent', color: 'var(--ink)' }}
          >
            Check Authorship
          </button>
        </div>

        {/* Tab 1: Verify Receipt */}
        {activeTab === 'receipt' && (
          <div className="animate-fade-in">
            <form onSubmit={handleVerifyReceipt}>
              <div
                className="flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-200"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
              >
                <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--ink-faint)' }} />
                <input
                  type="text"
                  value={receiptHash}
                  onChange={e => setReceiptHash(e.target.value)}
                  placeholder="Paste cryptographic hash…"
                  disabled={receiptLoading}
                  className="flex-1 bg-transparent text-sm outline-none font-mono"
                  style={{ color: 'var(--ink)', caretColor: 'var(--accent)' }}
                />
              </div>

              <button
                type="submit"
                disabled={!receiptHash.trim() || receiptLoading}
                className="mt-4 w-full rounded-2xl py-3.5 text-sm font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent)' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
              >
                {receiptLoading ? 'Verifying…' : 'Verify Receipt'}
              </button>
            </form>

            {receiptError && (
              <div
                className="mt-8 flex items-center gap-3 rounded-xl p-4 animate-fade-in"
                style={{ border: '1px solid rgba(155,35,53,0.2)', backgroundColor: 'rgba(155,35,53,0.05)' }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--danger)' }} />
                <p className="text-sm" style={{ color: 'var(--danger)' }}>{receiptError}</p>
              </div>
            )}

            {receiptResult && !receiptLoading && (
              <div className="mt-10 animate-fade-in-up">
                {receiptResult.verified ? (
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                  >
                    <div
                      className="flex items-center gap-4 px-8 py-6"
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      <div className="seal-ring h-12 w-12" style={{ borderColor: 'var(--accent)' }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent)', fontSize: '10px', fontWeight: 600 }}>GW</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--success)' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>Verified on Midnight</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>This receipt is authentic and unaltered.</p>
                      </div>
                    </div>

                    <div className="space-y-0">
                      {[
                        { label: 'Document Hash', value: receiptResult.hash || '', mono: true },
                        { label: 'Transaction ID', value: receiptResult.txId || '', mono: true },
                        {
                          label: 'Sealed At',
                          value: receiptResult.timestamp
                            ? new Date(receiptResult.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                              + ' · ' + new Date(receiptResult.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            : '',
                          mono: false,
                        },
                        { label: 'Network', value: receiptResult.network || 'midnight-preprod', mono: false },
                      ].map(({ label, value, mono }, i) => (
                        <div
                          key={label}
                          className="flex items-center justify-between gap-4 px-8 py-4"
                          style={{ borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs uppercase tracking-[0.12em] mb-1" style={{ color: 'var(--ink-faint)' }}>{label}</p>
                            <p className={`text-sm break-all ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--ink-muted)' }}>{value}</p>
                          </div>
                          {mono && (
                            <button onClick={() => copy(value)} className="shrink-0 cursor-pointer" style={{ color: 'var(--ink-faint)' }}>
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl px-8 py-12 text-center"
                    style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                  >
                    <XCircle className="mx-auto h-10 w-10 mb-4" style={{ color: 'var(--ink-faint)' }} />
                    <h3
                      className="text-xl font-normal mb-2"
                      style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
                    >
                      Receipt not found.
                    </h3>
                    <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--ink-muted)' }}>
                      No document matching this hash exists on the Midnight preprod network.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Check Authorship */}
        {activeTab === 'authorship' && (
          <div className="animate-fade-in">
            <form onSubmit={handleVerifyAuthorship}>
              <div className="space-y-4">
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                >
                  <textarea
                    value={suspiciousText}
                    onChange={e => setSuspiciousText(e.target.value)}
                    placeholder="Paste the suspicious document here..."
                    disabled={authorshipLoading}
                    rows={8}
                    className="w-full resize-none bg-transparent px-5 py-4 text-sm outline-none"
                    style={{ color: 'var(--ink)', caretColor: 'var(--accent)' }}
                  />
                </div>
                
                <div
                  className="flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-200"
                  style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                >
                  <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--ink-faint)' }} />
                  <input
                    type="text"
                    value={authorshipHash}
                    onChange={e => setAuthorshipHash(e.target.value)}
                    placeholder="Enter the claimed receipt hash"
                    disabled={authorshipLoading}
                    className="flex-1 bg-transparent text-sm outline-none font-mono"
                    style={{ color: 'var(--ink)', caretColor: 'var(--accent)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!authorshipHash.trim() || !suspiciousText.trim() || authorshipLoading}
                className="mt-6 w-full rounded-2xl py-3.5 text-sm font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent)' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
              >
                {authorshipLoading ? 'Analyzing...' : 'Analyze for Authorship'}
              </button>
            </form>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--ink-faint)' }}>
              <Shield className="h-3.5 w-3.5" />
              The original content remains private. Only statistical patterns are compared.
            </p>

            {authorshipError && (
              <div
                className="mt-8 flex items-center gap-3 rounded-xl p-4 animate-fade-in"
                style={{ border: '1px solid rgba(155,35,53,0.2)', backgroundColor: 'rgba(155,35,53,0.05)' }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--danger)' }} />
                <p className="text-sm" style={{ color: 'var(--danger)' }}>{authorshipError}</p>
              </div>
            )}

            {authorshipResult && !authorshipLoading && authorshipResult.authorshipMatch && (
              <div className="mt-10 animate-fade-in-up rounded-2xl p-6" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>Analysis Results</h3>
                  {authorshipResult.authorshipMatch.confidence === 'high' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(62,207,142,0.1)', color: 'var(--success)' }}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> High Confidence
                    </span>
                  )}
                  {authorshipResult.authorshipMatch.confidence === 'medium' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(234,179,8,0.1)', color: '#ca8a04' }}>
                      <AlertTriangle className="h-3.5 w-3.5" /> Medium Confidence
                    </span>
                  )}
                  {authorshipResult.authorshipMatch.confidence === 'low' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                      <XCircle className="h-3.5 w-3.5" /> Low Confidence
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
                    <span>Similarity Score</span>
                    <span className="font-mono font-medium">{authorshipResult.authorshipMatch.similarityScore}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${authorshipResult.authorshipMatch.similarityScore}%`,
                        backgroundColor: authorshipResult.authorshipMatch.confidence === 'high' ? 'var(--success)' : 
                                         authorshipResult.authorshipMatch.confidence === 'medium' ? '#ca8a04' : 'var(--danger)'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                    {authorshipResult.authorshipMatch.reasoning}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-faint)' }}>Style Match</p>
                      <p className="font-mono text-sm" style={{ color: 'var(--ink-muted)' }}>{authorshipResult.authorshipMatch.styleMatch}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-faint)' }}>Topic Overlap</p>
                      <p className="font-mono text-sm" style={{ color: 'var(--ink-muted)' }}>{authorshipResult.authorshipMatch.topicOverlap}%</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
