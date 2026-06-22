'use client';
import { useTranslations, useLocale } from 'next-intl';
import { formatPrice, formatDuration } from '@/lib/utils';

const ICONS: Record<string, string> = { haircut: '✂️', beard: '🧔', styling: '💈' };

export function Step1Service({ services, updateState, goToStep }: any) {
  const t = useTranslations('booking.step1');
  const locale = useLocale();

  function selectService(service: any) {
    const name = locale === 'ru' ? service.nameRu : locale === 'en' ? service.nameEn : service.nameHy;
    updateState({
      serviceId: service.id,
      serviceName: name,
      servicePrice: service.priceAmd,
      serviceDuration: service.durationMinutes,
    });
    goToStep(2);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream mb-2">{t('title')}</h2>
      <p className="text-cream-muted text-sm mb-8">{t('subtitle')}</p>

      <div className="grid gap-4">
        {services.map((service: any) => {
          const name = locale === 'ru' ? service.nameRu : locale === 'en' ? service.nameEn : service.nameHy;
          return (
            <button
              key={service.id}
              onClick={() => selectService(service)}
              className="flex items-center justify-between p-5 rounded-2xl border border-gold/20 bg-dark-2 hover:border-gold/50 hover:bg-dark-3 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{ICONS[service.category] || '✂️'}</span>
                <div>
                  <h3 className="text-cream font-medium group-hover:text-gold transition-colors">{name}</h3>
                  <p className="text-cream-dim text-xs mt-0.5">{formatDuration(service.durationMinutes, locale)}</p>
                </div>
              </div>
              <div className="text-gold font-bold text-lg">{formatPrice(service.priceAmd)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
