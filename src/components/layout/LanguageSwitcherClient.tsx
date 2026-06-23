'use client';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

const LOCALES = [
  { code: 'hy', label: 'ՀԱՅ' },
  { code: 'ru', label: 'RUS' },
  { code: 'en', label: 'ENG' },
];

export function LanguageSwitcherClient() {
  const locale = useLocale();
  const pathname = usePathname();

  function getHref(newLocale: string) {
    const parts = pathname.split('/');
    parts[1] = newLocale;
    return parts.join('/') || '/' + newLocale;
  }

  return (
    <div className="flex items-center gap-1 bg-dark-3 rounded-full p-1">
      {LOCALES.map(({ code, label }) => (
        <a
          key={code}
          href={getHref(code)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${locale === code ? 'bg-gold text-dark' : 'text-cream-muted hover:text-cream'}`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
