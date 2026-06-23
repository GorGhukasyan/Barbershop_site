'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function VisualizerTeaser() {
  const t = useTranslations('home.visualizer');
  const locale = useLocale();

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative bg-dark-2 border border-gold/20 rounded-2xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-sm font-medium">AI</span>
            </div>
            <h2 className="font-serif text-4xl text-cream mb-4">{t('title')}</h2>
            <p className="text-cream-muted text-lg max-w-2xl mx-auto mb-8">{t('subtitle')}</p>
            <Link href={`/${locale}/visualizer`}>
              <Button size="lg">{t('cta')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
