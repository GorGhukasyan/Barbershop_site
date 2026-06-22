import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Props {
  searchParams: Promise<{ number?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const t = await getTranslations('booking.success');
  const locale = await getLocale();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="font-serif text-3xl text-cream mb-4">{t('title')}</h1>
        <p className="text-cream-muted mb-2">{t('number_label')}</p>
        <div className="text-gold font-mono text-2xl font-bold mb-6">
          {params.number ?? '—'}
        </div>
        <p className="text-cream-muted text-sm mb-8">{t('email_sent')}</p>
        <div className="flex flex-col gap-3">
          <Link href={`/${locale}`}>
            <Button className="w-full">{t('back_home')}</Button>
          </Link>
          <Link href={`/${locale}/booking`}>
            <Button variant="outline" className="w-full">{t('book_another')}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
