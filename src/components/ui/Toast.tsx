'use client';

import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
}

export default function Toast({ id, message, type, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(id), 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const config = {
    success: { icon: <CheckCircle className="h-4 w-4" />, borderColor: 'rgba(45,106,79,0.3)', iconColor: 'var(--success)' },
    error:   { icon: <XCircle className="h-4 w-4" />,    borderColor: 'rgba(155,35,53,0.3)', iconColor: 'var(--danger)' },
    info:    { icon: <Info className="h-4 w-4" />,        borderColor: 'rgba(61,53,128,0.3)', iconColor: 'var(--accent)' },
  }[type];

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-xs items-center gap-3 rounded-xl px-4 py-3 shadow-md transition-all duration-400 ${
        isLeaving ? 'opacity-0 translate-x-4' : 'animate-fade-in-up'
      }`}
      style={{
        backgroundColor: 'var(--surface)',
        border: `1px solid ${config.borderColor}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      <span style={{ color: config.iconColor }}>{config.icon}</span>
      <p className="flex-1 text-sm font-medium" style={{ color: 'var(--ink)' }}>{message}</p>
      <button
        onClick={() => { setIsLeaving(true); setTimeout(() => onDismiss(id), 400); }}
        className="shrink-0 cursor-pointer transition-opacity hover:opacity-60"
        style={{ color: 'var(--ink-faint)' }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
