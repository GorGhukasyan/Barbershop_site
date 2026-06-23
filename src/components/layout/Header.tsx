'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LanguageSwitcherClient } from './LanguageSwitcherClient';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}#barbers`, label: t('barbers') },
    { href: `/${locale}#gallery`, label: t('gallery') },
    { href: `/${locale}/visualizer`, label: t('visualizer') },
    { href: `/${locale}#contact`, label: t('contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/10 bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-dark font-bold text-sm">
              GA
            </div>
            <span className="font-serif text-cream font-semibold tracking-wide hidden sm:block group-hover:text-gold transition-colors">
              BARBER SHOP
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-cream-muted hover:text-gold transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcherClient />
            <a href={`/${locale}/booking`} className="hidden sm:inline-flex">
              <Button size="sm">{t('booking')}</Button>
            </a>
            <MobileMenu links={navLinks} bookingHref={`/${locale}/booking`} bookingLabel={t('booking')} />
          </div>
        </div>
      </div>
    </header>
  );
}
