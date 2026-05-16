'use client';

import { useRef, useEffect, useCallback } from 'react';

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export default function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  maxLength,
  showCount = false,
  error,
  disabled = false,
  className = '',
  id,
  name,
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const charCount = value.length;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-slate-400"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          className={[
            'w-full rounded-lg px-4 py-2.5 resize-none',
            'bg-slate-900 text-white placeholder-slate-500',
            'border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
            error || isOverLimit
              ? 'border-red-500 focus:border-red-500'
              : 'border-slate-700 focus:border-purple-500',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            showCount ? 'pb-8' : '',
          ].join(' ')}
          style={{ transition: 'height 0.15s ease-out' }}
        />

        {showCount && (
          <span
            className={[
              'absolute bottom-2.5 right-3 text-xs select-none',
              isOverLimit ? 'text-red-400' : 'text-slate-500',
            ].join(' ')}
          >
            {charCount.toLocaleString()}
            {maxLength ? ` / ${maxLength.toLocaleString()}` : ''}
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
