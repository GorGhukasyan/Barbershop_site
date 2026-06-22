'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ContactSection() {
  const t = useTranslations('home.contact');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to send');
      setSent(true);
      form.reset();
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-cream mb-4">{t('title')}</h2>
          <div className="mt-4 h-px w-24 bg-gold/40 mx-auto" />
        </div>

        <Card>
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <p className="text-gold font-serif text-xl">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cream-muted text-sm mb-2">{t('name')}</label>
                <input
                  name="name"
                  required
                  minLength={2}
                  className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-cream-muted text-sm mb-2">{t('email')}</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-cream-muted text-sm mb-2">{t('phone')}</label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-cream-muted text-sm mb-2">{t('message')}</label>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={4}
                  className="w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button type="submit" loading={loading} className="w-full">
                {t('submit')}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}
