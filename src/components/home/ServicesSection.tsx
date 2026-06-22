import { getTranslations, getLocale } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDuration } from '@/lib/utils';
import Link from 'next/link';

interface Service {
  id: string;
  nameHy: string; nameRu: string; nameEn: string;
  descriptionHy: string; descriptionRu: string; descriptionEn: string;
  durationMinutes: number;
  priceAmd: number;
  category: string;
}

const ICONS: Record<string, string> = { haircut: '✂️', beard: '🧔', styling: '💈' };

export async function ServicesSection({ services }: { services: Service[] }) {
  const t = await getTranslations('home.services');
  const locale = await getLocale();

  function getName(s: Service) {
    if (locale === 'ru') return s.nameRu;
    if (locale === 'en') return s.nameEn;
    return s.nameHy;
  }

  function getDescription(s: Service) {
    if (locale === 'ru') return s.descriptionRu;
    if (locale === 'en') return s.descriptionEn;
    return s.descriptionHy;
  }

  return (
    <section id="services" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-cream mb-4">{t('title')}</h2>
          <p className="text-cream-muted">{t('subtitle')}</p>
          <div className="mt-4 h-px w-24 bg-gold/40 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} hover className="flex flex-col">
              <div className="text-4xl mb-4">{ICONS[service.category] || '✂️'}</div>
              <h3 className="font-serif text-xl text-cream mb-2">{getName(service)}</h3>
              <p className="text-cream-muted text-sm leading-relaxed flex-1">{getDescription(service)}</p>

              <div className="mt-6 pt-4 border-t border-gold/15 flex items-center justify-between">
                <div>
                  <span className="text-gold font-bold text-xl">{formatPrice(service.priceAmd)}</span>
                  <span className="text-cream-dim text-xs ml-2">{formatDuration(service.durationMinutes, locale)}</span>
                </div>
                <Link href={`/${locale}/booking`}>
                  <Button size="sm">{t('book')}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
