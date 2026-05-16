// Skeleton Loader using template literals

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';
}

export default function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  let variantClasses = '';
  switch (variant) {
    case 'text':
      variantClasses = 'h-4 w-full rounded-md';
      break;
    case 'title':
      variantClasses = 'h-6 w-3/4 rounded-md';
      break;
    case 'avatar':
      variantClasses = 'h-10 w-10 rounded-full';
      break;
    case 'card':
      variantClasses = 'h-32 w-full rounded-xl';
      break;
    case 'button':
      variantClasses = 'h-10 w-24 rounded-lg';
      break;
  }

  return (
    <div
      className={`animate-pulse bg-slate-800 ${variantClasses} ${className}`}
    />
  );
}
