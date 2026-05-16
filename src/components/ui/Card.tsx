interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const headerPadding: Record<string, string> = {
  none: 'px-0 py-0',
  sm: 'px-4 py-3',
  md: 'px-6 py-4',
  lg: 'px-8 py-5',
};

export default function Card({ children, className = '', header, footer, padding = 'md' }: CardProps) {
  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {header && (
        <div className={`${headerPadding[padding]}`} style={{ borderBottom: '1px solid var(--border)' }}>
          {header}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
      {footer && (
        <div className={`${headerPadding[padding]}`} style={{ borderTop: '1px solid var(--border)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
