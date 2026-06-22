'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

interface Props {
  originalImage: string;
  resultImage: string;
  onTryAgain: () => void;
  onBookNow: () => void;
}

export function ResultView({ originalImage, resultImage, onTryAgain, onBookNow }: Props) {
  const t = useTranslations('visualizer.result');

  function downloadResult() {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'ga-barbershop-style.jpg';
    link.click();
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream text-center mb-8">{t('title')}</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-cream-muted text-xs text-center mb-2 uppercase tracking-wider">{t('before')}</p>
          <div className="rounded-2xl overflow-hidden border border-gold/20">
            <img src={originalImage} alt="Before" className="w-full h-64 object-cover" />
          </div>
        </div>
        <div>
          <p className="text-gold text-xs text-center mb-2 uppercase tracking-wider">{t('after')}</p>
          <div className="rounded-2xl overflow-hidden border border-gold/50 shadow-[0_0_30px_rgba(201,169,110,0.2)]">
            <img src={resultImage} alt="After" className="w-full h-64 object-cover" />
          </div>
        </div>
      </div>

      <p className="text-cream-dim text-xs text-center mb-8">{t('disclaimer')}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={onBookNow}>{t('book_this_look')}</Button>
        <Button variant="outline" onClick={downloadResult}>{t('download')}</Button>
        <Button variant="ghost" onClick={onTryAgain}>{t('try_again')}</Button>
      </div>
    </div>
  );
}
