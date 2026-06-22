import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amd: number): string {
  const formatted = amd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ֏`;
}

export function formatDuration(minutes: number, locale: string): string {
  if (locale === 'hy') return `${minutes} րոպե`;
  if (locale === 'ru') return `${minutes} мин`;
  return `${minutes} min`;
}

export function formatDate(date: Date, locale: string): string {
  const localeMap = { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' };
  return date.toLocaleDateString(localeMap[locale as keyof typeof localeMap] ?? 'hy-AM', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}
