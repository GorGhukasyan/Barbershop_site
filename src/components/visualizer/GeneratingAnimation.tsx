'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function GeneratingAnimation() {
  const t = useTranslations('visualizer.generating');
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [t('msg1'), t('msg2'), t('msg3'), t('msg4')];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">✂️</span>
        </div>
      </div>
      <h3 className="font-serif text-2xl text-cream mb-3">{t('title')}</h3>
      <p className="text-gold text-sm animate-pulse">{messages[msgIndex]}</p>
      <p className="text-cream-dim text-xs mt-4">{t('wait')}</p>
    </div>
  );
}
