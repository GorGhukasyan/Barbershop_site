'use client';
import { Button } from '@/components/ui/Button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">&#x26A0;&#xFE0F;</div>
        <h2 className="font-serif text-2xl text-cream mb-4">Something went wrong</h2>
        <p className="text-cream-muted mb-6">Please try refreshing the page.</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
