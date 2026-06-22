import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-8xl text-gold mb-4">404</div>
        <h2 className="font-serif text-2xl text-cream mb-6">Page not found</h2>
        <Link href="/hy"><Button>Go Home</Button></Link>
      </div>
    </div>
  );
}
