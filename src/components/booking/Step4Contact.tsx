'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function Step4Contact({ state, updateState, goToStep }: any) {
  const t = useTranslations('booking.step4');
  const [name, setName] = useState(state.clientName);
  const [email, setEmail] = useState(state.clientEmail);
  const [phone, setPhone] = useState(state.clientPhone);
  const [notes, setNotes] = useState(state.clientNotes);

  function handleNext() {
    if (!name || !email || !phone) return;
    updateState({ clientName: name, clientEmail: email, clientPhone: phone, clientNotes: notes });
    goToStep(5);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream mb-2">{t('title')}</h2>
      <p className="text-cream-muted text-sm mb-8">{t('subtitle')}</p>

      <div className="space-y-5">
        <div>
          <label className="block text-cream-muted text-sm mb-2">{t('name')} *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-cream-muted text-sm mb-2">{t('email')} *</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-cream-muted text-sm mb-2">{t('phone')} *</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            required
            className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-cream-muted text-sm mb-2">{t('notes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => goToStep(3)}>{t('back')}</Button>
        <Button
          onClick={handleNext}
          disabled={!name || !email || !phone}
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
