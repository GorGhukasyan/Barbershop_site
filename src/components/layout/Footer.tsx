'use client';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-dark-2 border-t border-gold/15 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-dark font-bold">GA</div>
              <span className="font-serif text-xl text-cream">BARBER SHOP</span>
            </div>
            <p className="text-cream-muted text-sm leading-relaxed">{t('tagline')}</p>
          </div>
          <div>
            <h3 className="font-serif text-gold mb-4">{t('hours')}</h3>
            <div className="space-y-1 text-sm text-cream-muted">
              <p>{t('weekdays')}: 10:00 – 20:00</p>
              <p>{t('weekends')}: 11:00 – 18:00</p>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-gold mb-4">{t('contact')}</h3>
            <div className="space-y-2 text-sm text-cream-muted">
              <p>{t('address')}</p>
              <p><a href="tel:+37477060132" className="hover:text-gold transition-colors">+374 77 06 01 32</a></p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold/10 text-center text-cream-dim text-xs">
          © 2026 GA BARBER SHOP. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
