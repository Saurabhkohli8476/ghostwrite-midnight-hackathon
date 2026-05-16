interface BadgeProps {
  variant: 'secured' | 'draft' | 'pending';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  secured:
    'bg-green-500/10 text-green-400 border-green-500/20',
  draft:
    'bg-slate-700/50 text-slate-400 border-slate-600/50',
  pending:
    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

export default function Badge({
  variant,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1',
        'rounded-full border px-2.5 py-0.5',
        'text-xs font-medium leading-none',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {variant === 'secured' && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
      )}
      {variant === 'pending' && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
      )}
      {children}
    </span>
  );
}
