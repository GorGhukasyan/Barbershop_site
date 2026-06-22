'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';

export function Step5Confirm({ state, goToStep, loading, error, onSubmit }: any) {
  const t = useTranslations('booking.step5');
  const locale = useLocale();

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream mb-2">{t('title')}</h2>
      <p className="text-cream-muted text-sm mb-8">{t('subtitle')}</p>

      <Card className="space-y-4">
        <div className="flex justify-between py-2 border-b border-gold/10">
          <span className="text-cream-muted">{t('service')}</span>
          <span className="text-cream font-medium">{state.serviceName}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gold/10">
          <span className="text-cream-muted">{t('barber')}</span>
          <span className="text-cream font-medium">{state.barberName}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gold/10">
          <span className="text-cream-muted">{t('date')}</span>
          <span className="text-cream font-medium">{state.date}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gold/10">
          <span className="text-cream-muted">{t('time')}</span>
          <span className="text-cream font-mono font-medium">{state.time}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-cream-muted">{t('price')}</span>
          <span className="text-gold font-bold text-xl">{formatPrice(state.servicePrice)}</span>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-cream-muted text-sm">{state.clientName}</p>
        <p className="text-cream-muted text-sm">{state.clientEmail}</p>
        <p className="text-cream-muted text-sm">{state.clientPhone}</p>
        {state.clientNotes && <p className="text-cream-dim text-sm mt-2">{state.clientNotes}</p>}
      </Card>

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300 text-sm">
          {error === 'slot_taken' ? t('slot_taken') : t('error')}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => goToStep(4)}>{t('back')}</Button>
        <Button onClick={onSubmit} loading={loading}>
          {loading ? t('submitting') : t('submit')}
        </Button>
      </div>
    </div>
  );
}
