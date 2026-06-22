'use client';
import { HAIRSTYLES } from '@/lib/hairstyles';
import { cn } from '@/lib/utils';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  locale: string;
}

export function StyleCatalog({ selectedId, onSelect, locale }: Props) {
  function getName(h: typeof HAIRSTYLES[number]) {
    if (locale === 'ru') return h.nameRu;
    if (locale === 'en') return h.nameEn;
    return h.nameHy;
  }

  const categories = ['classic', 'modern', 'beard', 'combo'] as const;
  const categoryLabels: Record<string, Record<string, string>> = {
    classic: { hy: 'Classic', ru: 'Classic', en: 'Classic' },
    modern: { hy: 'Modern', ru: 'Modern', en: 'Modern' },
    beard: { hy: 'Beard', ru: 'Beard', en: 'Beard' },
    combo: { hy: 'Combo', ru: 'Combo', en: 'Combo' },
  };

  return (
    <div className="space-y-8">
      {categories.map(cat => {
        const styles = HAIRSTYLES.filter(h => h.category === cat);
        if (styles.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="text-gold font-serif text-lg mb-4">{categoryLabels[cat][locale] || cat}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => onSelect(style.id)}
                  className={cn(
                    'p-4 rounded-xl border text-center transition-all duration-200',
                    selectedId === style.id
                      ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,169,110,0.2)]'
                      : 'border-gold/20 hover:border-gold/50 bg-dark-2'
                  )}
                >
                  <div className="text-2xl mb-2">✂️</div>
                  <p className="text-cream text-sm font-medium">{getName(style)}</p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
