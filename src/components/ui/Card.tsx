import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-dark-2 border border-gold/20 rounded-2xl p-6',
        hover && 'transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(201,169,110,0.1)]',
        className
      )}
    >
      {children}
    </div>
  );
}
