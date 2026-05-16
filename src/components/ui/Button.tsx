'use client';

import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  className = '',
  type = 'button',
  title,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none';

  const sizeMap: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
    lg: 'px-7 py-3.5 text-base gap-2.5 rounded-xl',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: isDisabled ? 'var(--ink-faint)' : 'var(--accent)',
      color: '#fff',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--ink-muted)',
      border: '1px solid var(--border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--ink-muted)',
    },
    danger: {
      backgroundColor: 'transparent',
      color: 'var(--danger)',
      border: '1px solid rgba(155,35,53,0.2)',
    },
  };

  const hoverMap: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--accent-light)' },
    secondary: { backgroundColor: 'var(--surface-alt)', color: 'var(--ink)' },
    ghost: { backgroundColor: 'var(--surface-alt)' },
    danger: { backgroundColor: 'rgba(155,35,53,0.06)' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      style={variantStyles[variant]}
      onMouseEnter={!isDisabled ? (e) => Object.assign(e.currentTarget.style, hoverMap[variant]) : undefined}
      onMouseLeave={!isDisabled ? (e) => Object.assign(e.currentTarget.style, variantStyles[variant]) : undefined}
      className={[
        base,
        sizeMap[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
