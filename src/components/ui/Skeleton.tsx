import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('shimmer rounded-xl', className)} />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-dark-2 border border-gold/10 rounded-2xl p-6 space-y-4">
      <Skeleton className="w-12 h-12" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between items-center pt-4 border-t border-gold/10">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}
