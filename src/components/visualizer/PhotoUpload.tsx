'use client';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function PhotoUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const t = useTranslations('visualizer.upload');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    onUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
        dragging ? 'border-gold bg-gold/10' : 'border-gold/30 hover:border-gold/60 hover:bg-dark-2'
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <div className="text-5xl mb-4">📸</div>
      <h3 className="text-cream font-medium text-lg mb-2">{t('title')}</h3>
      <p className="text-cream-muted text-sm mb-4">{t('subtitle')}</p>
      <p className="text-cream-dim text-xs">{t('hint')}</p>
    </div>
  );
}
