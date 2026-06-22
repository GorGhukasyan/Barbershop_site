import { getTranslations, getLocale } from 'next-intl/server';
import { Card } from '@/components/ui/Card';

interface Barber {
  id: string;
  name: string;
  slug: string;
  bioHy: string;
  bioRu: string;
  bioEn: string;
  photoUrl: string;
  specialties: string[];
}

export async function BarbersSection({ barbers }: { barbers: Barber[] }) {
  const t = await getTranslations('home.barbers');
  const locale = await getLocale();

  function getBio(b: Barber) {
    if (locale === 'ru') return b.bioRu;
    if (locale === 'en') return b.bioEn;
    return b.bioHy;
  }

  return (
    <section id="barbers" className="py-24 px-4 bg-dark-2/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-cream mb-4">{t('title')}</h2>
          <p className="text-cream-muted">{t('subtitle')}</p>
          <div className="mt-4 h-px w-24 bg-gold/40 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} hover className="text-center">
              <div className="w-24 h-24 rounded-full bg-dark-3 border-2 border-gold/30 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {barber.photoUrl ? (
                  <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-gold font-serif">{barber.name[0]}</span>
                )}
              </div>
              <h3 className="font-serif text-xl text-cream mb-2">{barber.name}</h3>
              {getBio(barber) && (
                <p className="text-cream-muted text-sm leading-relaxed">{getBio(barber)}</p>
              )}
              {barber.specialties.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {barber.specialties.map((s) => (
                    <span key={s} className="px-3 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
