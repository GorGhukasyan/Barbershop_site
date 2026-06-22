'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-2 to-dark" />

      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-6 h-48 barber-pole rounded-full opacity-30" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-sm font-medium">{t('pretitle')}</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-cream">{t('title1')}</span>
          <br />
          <span className="text-gold-gradient">{t('title2')}</span>
        </h1>

        <p className="text-cream-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${locale}/booking`}>
            <Button size="lg">{t('cta_book')}</Button>
          </Link>
          <Link href={`/${locale}/visualizer`}>
            <Button size="lg" variant="outline">
              {t('cta_visualize')}
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-12">
          {[
            { value: '10+', label: t('stat_years') },
            { value: '2-3', label: t('stat_masters') },
            { value: '1000+', label: t('stat_clients') },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl font-bold text-gold">{stat.value}</div>
              <div className="text-cream-muted text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
