import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['hy'] as const,
  defaultLocale: 'hy',
  localePrefix: 'always',
  localeDetection: false,
});
