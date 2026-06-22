'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function Step3DateTime({ state, updateState, goToStep }: any) {
  const t = useTranslations('booking.step3');
  const locale = useLocale();

  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return { value: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE dd MMM'), date: d };
  });

  async function loadSlots(date: string) {
    setSelectedDate(date);
    setLoadingSlots(true);
    setSlots([]);
    try {
      const res = await fetch(
        `/api/availability?barberId=${state.barberId}&date=${date}&serviceId=${state.serviceId}`
      );
      const data = await res.json();
      setSlots(data.data ?? []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  function selectSlot(slot: any) {
    updateState({ date: selectedDate, time: slot.time });
    goToStep(4);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream mb-2">{t('title')}</h2>
      <p className="text-cream-muted text-sm mb-8">{t('subtitle')}</p>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => loadSlots(day.value)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border text-sm transition-all ${
              selectedDate === day.value
                ? 'bg-gold text-dark border-gold font-medium'
                : 'border-gold/20 text-cream-muted hover:border-gold/50'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {loadingSlots && <div className="flex justify-center py-8"><Spinner /></div>}

      {!loadingSlots && selectedDate && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {slots.map((slot: any) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => selectSlot(slot)}
              className={`py-3 rounded-xl border text-sm font-mono transition-all ${
                slot.available
                  ? 'border-gold/30 text-cream hover:bg-gold hover:text-dark hover:border-gold'
                  : 'border-dark-4 text-cream-dim opacity-40 cursor-not-allowed line-through'
              }`}
            >
              {slot.time}
            </button>
          ))}

          {slots.length === 0 && (
            <p className="col-span-4 text-center text-cream-muted py-8">{t('no_slots')}</p>
          )}
        </div>
      )}

      {!selectedDate && (
        <p className="text-center text-cream-muted py-8">{t('select_date_first')}</p>
      )}

      <div className="mt-8">
        <Button variant="outline" onClick={() => goToStep(2)}>{t('back')}</Button>
      </div>
    </div>
  );
}
