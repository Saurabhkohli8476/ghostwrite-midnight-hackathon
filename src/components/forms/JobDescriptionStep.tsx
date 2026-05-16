'use client';

import { ArrowRight } from 'lucide-react';

interface JobDescriptionStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

export default function JobDescriptionStep({ value, onChange, onNext }: JobDescriptionStepProps) {
  const isValid = value.trim().length > 0;

  return (
    <div className="animate-fade-in-up mx-auto max-w-2xl">
      <div className="mb-8">
        <h2
          className="text-3xl font-normal"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
        >
          What are you creating?
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
          Describe your project, topic, or document goal. The AI will use this to shape a structured first draft.
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          boxShadow: value.length > 0 ? '0 2px 12px rgba(61,53,128,0.06)' : '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. A research paper on the social impact of large language models in education…"
          rows={10}
          className="w-full resize-none bg-transparent px-7 py-6 text-sm leading-relaxed outline-none"
          style={{ color: 'var(--ink)', caretColor: 'var(--accent)' }}
        />
        <div
          className="flex items-center justify-between px-7 py-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
            {value.length} characters
          </span>
          <button
            onClick={onNext}
            disabled={!isValid}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--accent-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
          >
            Continue
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
