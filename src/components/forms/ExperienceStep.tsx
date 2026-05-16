'use client';

import { ArrowLeft, ArrowRight, Loader2, RotateCcw, Wand2 } from 'lucide-react';

interface ExperienceStepProps {
  value: string;
  onChange: (val: string) => void;
  onRegenerate: () => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating?: boolean;
}

export default function ExperienceStep({
  value,
  onChange,
  onRegenerate,
  onNext,
  onBack,
  isGenerating = false,
}: ExperienceStepProps) {
  return (
    <div className="animate-fade-in-up mx-auto max-w-2xl">
      <div className="mb-8">
        <h2
          className="text-3xl font-normal"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
        >
          Add your notes.
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          Paste an existing draft, rough notes, or key points you want included. The AI will refine and structure them.
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          boxShadow: value.length > 0 ? '0 2px 12px rgba(61,53,128,0.06)' : '0 1px 4px rgba(0,0,0,0.04)',
          opacity: isGenerating ? 0.6 : 1,
        }}
      >
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Your draft, bullet points, raw notes, or ideas…"
          rows={10}
          disabled={isGenerating}
          className="w-full resize-none bg-transparent px-7 py-6 text-sm leading-relaxed outline-none"
          style={{ color: 'var(--ink)', caretColor: 'var(--accent)' }}
        />
        <div
          className="flex items-center justify-between px-7 py-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={onBack}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200 cursor-pointer disabled:opacity-40"
            style={{ color: 'var(--ink-faint)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onRegenerate}
              disabled={isGenerating || !value.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm cursor-pointer disabled:opacity-40 transition-colors"
              style={{ color: 'var(--ink-muted)' }}
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              {isGenerating ? 'Generating…' : 'Regenerate'}
            </button>
            <button
              onClick={onNext}
              disabled={isGenerating || !value.trim()}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-40"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
