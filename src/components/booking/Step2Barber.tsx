'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';

export function Step2Barber({ barbers, updateState, goToStep }: any) {
  const t = useTranslations('booking.step2');
  const locale = useLocale();

  function selectBarber(barber: any) {
    updateState({ barberId: barber.id, barberName: barber.name });
    goToStep(3);
  }

  function getBio(b: any) {
    if (locale === 'ru') return b.bioRu;
    if (locale === 'en') return b.bioEn;
    return b.bioHy;
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream mb-2">{t('title')}</h2>
      <p className="text-cream-muted text-sm mb-8">{t('subtitle')}</p>

      <div className="grid gap-4">
        {barbers.map((barber: any) => (
          <button
            key={barber.id}
            onClick={() => selectBarber(barber)}
            className="flex items-center gap-4 p-5 rounded-2xl border border-gold/20 bg-dark-2 hover:border-gold/50 hover:bg-dark-3 transition-all duration-200 text-left group"
          >
            <div className="w-14 h-14 rounded-full bg-dark-3 border-2 border-gold/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              {barber.photoUrl ? (
                <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl text-gold font-serif">{barber.name[0]}</span>
              )}
            </div>
            <div>
              <h3 className="text-cream font-medium group-hover:text-gold transition-colors">{barber.name}</h3>
              {getBio(barber) && <p className="text-cream-dim text-xs mt-0.5">{getBio(barber)}</p>}
            </div>
          </button>
        ))}

        {barbers.length === 0 && (
          <p className="text-center text-cream-muted py-8">{t('no_barbers')}</p>
        )}
      </div>

      <div className="mt-8">
        <Button variant="outline" onClick={() => goToStep(1)}>
          {t('back')}
        </Button>
      </div>
    </div>
  );
}
