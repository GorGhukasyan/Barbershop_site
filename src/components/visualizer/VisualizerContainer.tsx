'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useVisualizer } from '@/hooks/useVisualizer';
import { PhotoUpload } from './PhotoUpload';
import { StyleCatalog } from './StyleCatalog';
import { GeneratingAnimation } from './GeneratingAnimation';
import { ResultView } from './ResultView';
import { Button } from '@/components/ui/Button';

export function VisualizerContainer() {
  const t = useTranslations('visualizer');
  const locale = useLocale();
  const v = useVisualizer();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10">
          <span className="text-gold text-sm">AI Powered</span>
        </div>
        <h1 className="font-serif text-4xl text-cream mb-4">{t('title')}</h1>
        <p className="text-cream-muted max-w-xl mx-auto">{t('subtitle')}</p>
        <p className="text-cream-dim text-sm mt-4">
          {t('remaining', { count: v.getRemainingGenerations() })}
        </p>
      </div>

      {v.step === 'upload' && (
        <PhotoUpload onUpload={v.handlePhotoUpload} />
      )}

      {v.step === 'select' && (
        <div>
          <StyleCatalog
            selectedId={v.selectedStyleId}
            onSelect={v.handleStyleSelect}
            locale={locale}
          />
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={v.reset}>{t('back')}</Button>
            <Button onClick={v.generate} disabled={!v.selectedStyleId}>
              {t('generate')}
            </Button>
          </div>
        </div>
      )}

      {v.step === 'generating' && <GeneratingAnimation />}

      {v.step === 'result' && (
        <ResultView
          originalImage={v.photoPreview}
          resultImage={v.resultImage}
          onTryAgain={v.reset}
          onBookNow={() => window.location.href = `/${locale}/booking`}
        />
      )}

      {v.step === 'error' && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">&#x26A0;&#xFE0F;</div>
          <p className="text-cream-muted mb-6">{t('error_general')}</p>
          <Button onClick={v.reset}>{t('try_again')}</Button>
        </div>
      )}

      <p className="text-center text-cream-dim text-xs mt-8">
        {t('privacy_notice')}
      </p>
    </div>
  );
}
