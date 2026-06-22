import { getLocale } from 'next-intl/server';

const LOCALES = [
  { code: 'hy', label: 'ՀԱՅ' },
  { code: 'ru', label: 'RUS' },
  { code: 'en', label: 'ENG' },
];

export async function LanguageSwitcher() {
  const locale = await getLocale();

  return (
    <div className="flex items-center gap-1 bg-dark-3 rounded-full p-1">
      {LOCALES.map(({ code, label }) => (
        <a
          key={code}
          href={`/${code}`}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            locale === code
              ? 'bg-gold text-dark'
              : 'text-cream-muted hover:text-cream'
          }`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
