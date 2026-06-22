import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'gold' | 'success' | 'pending' | 'cancelled' | 'default';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    gold: 'bg-gold/20 text-gold border-gold/40',
    success: 'bg-green-900/50 text-green-400 border-green-800',
    pending: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
    cancelled: 'bg-red-900/50 text-red-400 border-red-800',
    default: 'bg-dark-3 text-cream-muted border-dark-4',
  };

  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
}
