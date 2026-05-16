'use client';

import { forwardRef } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      type = 'text',
      error,
      helperText,
      disabled = false,
      className = '',
      id,
      name,
      autoComplete,
    },
    ref
  ) => {
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-400"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={[
            'w-full rounded-lg px-4 py-2.5',
            'bg-slate-900 text-white placeholder-slate-500',
            'border transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/30',
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-slate-700 focus:border-purple-500',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {!error && helperText && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
