'use client';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';

export function HoursSection() {
  const t = useTranslations('home.hours');

  return (
    <section className="py-24 px-4 bg-dark-2/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-cream mb-4">{t('title')}</h2>
          <div className="mt-4 h-px w-24 bg-gold/40 mx-auto" />
        </div>
        <Card className="max-w-lg mx-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gold/10">
              <span className="text-cream">{t('weekdays')}</span>
              <span className="text-gold font-medium">10:00 – 20:00</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-cream">{t('weekends')}</span>
              <span className="text-gold font-medium">11:00 – 18:00</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
