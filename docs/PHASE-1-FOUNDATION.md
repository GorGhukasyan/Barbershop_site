# PHASE-1-FOUNDATION.md — Design System & Landing Page

> **Prerequisite**: Phase 0 complete. `npm run dev` works.
> **Goal**: Beautiful, complete landing page that loads real data from DB.

---

## Design Language

**Concept**: "Classic Barbershop meets Modern AI"
- The site feels like a premium, vintage barber shop — dark tones, gold accents, elegant serif typography
- But it also hints at technology and intelligence — subtle animations, clean layout, AI section
- The result: sophisticated, creative, trustworthy, and a little exciting

**Visual References**: Think Peaky Blinders meets a premium tech product.

---

## Task 1.1 — Create Utility Functions

Create `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in AMD
export function formatPrice(amd: number): string {
  return `${amd.toLocaleString('hy-AM')} ֏`;
}

// Format duration
export function formatDuration(minutes: number, locale: string): string {
  if (locale === 'hy') return `${minutes} րոպե`;
  if (locale === 'ru') return `${minutes} мин`;
  return `${minutes} min`;
}

// Format Armenian date
export function formatDate(date: Date, locale: string): string {
  const localeMap = { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' };
  return date.toLocaleDateString(localeMap[locale as keyof typeof localeMap] ?? 'hy-AM', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time
export function formatTime(time: string): string {
  return time.slice(0, 5); // "14:30:00" → "14:30"
}
```

---

## Task 1.2 — Create UI Components

### Button Component
Create `src/components/ui/Button.tsx`:
```typescript
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gold', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-full';

    const variants = {
      gold: 'bg-gold text-dark hover:bg-gold-light active:bg-gold-dark shadow-[0_0_20px_rgba(201,169,110,0.3)] hover:shadow-[0_0_30px_rgba(201,169,110,0.5)]',
      outline: 'border border-gold/40 text-gold hover:border-gold hover:bg-gold/10 bg-transparent',
      ghost: 'text-cream-muted hover:text-cream hover:bg-dark-3 bg-transparent',
      danger: 'bg-red-900/80 text-red-200 hover:bg-red-900 border border-red-800',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-sm gap-1.5',
      md: 'px-6 py-2.5 text-sm gap-2',
      lg: 'px-8 py-3.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Card Component
Create `src/components/ui/Card.tsx`:
```typescript
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-dark-2 border border-gold/20 rounded-2xl p-6',
        hover && 'transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(201,169,110,0.1)]',
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Badge Component
Create `src/components/ui/Badge.tsx`:
```typescript
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'gold' | 'success' | 'pending' | 'cancelled' | 'default';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    gold: 'bg-gold/20 text-gold border-gold/40',
    success: 'bg-green-900/50 text-green-400 border-green-800',
    pending: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
    cancelled: 'bg-red-900/50 text-red-400 border-red-800',
    default: 'bg-dark-3 text-cream-muted border-dark-4',
  };

  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
}
```

### Spinner Component
Create `src/components/ui/Spinner.tsx`:
```typescript
import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}
```

---

## Task 1.3 — Language Switcher

Create `src/components/layout/LanguageSwitcher.tsx`:
```typescript
'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const LOCALES = [
  { code: 'hy', label: 'ՀԱՅ' },
  { code: 'ru', label: 'РУС' },
  { code: 'en', label: 'ENG' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    // Replace current locale in path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div className="flex items-center gap-1 bg-dark-3 rounded-full p-1">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            locale === code
              ? 'bg-gold text-dark'
              : 'text-cream-muted hover:text-cream'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

---

## Task 1.4 — Header Component

Create `src/components/layout/Header.tsx`:
```typescript
'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/Button';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}#barbers`, label: t('barbers') },
    { href: `/${locale}#gallery`, label: t('gallery') },
    { href: `/${locale}/visualizer`, label: t('visualizer') },
    { href: `/${locale}#contact`, label: t('contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/10 bg-dark-1/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-dark font-bold text-sm">
              GA
            </div>
            <span className="font-serif text-cream font-semibold tracking-wide hidden sm:block group-hover:text-gold transition-colors">
              BARBER SHOP
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-cream-muted hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              size="sm"
              onClick={() => window.location.href = `/${locale}/booking`}
              className="hidden sm:inline-flex"
            >
              {t('booking')}
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-cream-muted hover:text-cream p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gold/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-cream-muted hover:text-gold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button className="mt-4 w-full" onClick={() => window.location.href = `/${locale}/booking`}>
              {t('booking')}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
```

---

## Task 1.5 — Footer Component

Create `src/components/layout/Footer.tsx`:
```typescript
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-dark-2 border-t border-gold/15 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-dark font-bold">GA</div>
              <span className="font-serif text-xl text-cream">BARBER SHOP</span>
            </div>
            <p className="text-cream-muted text-sm leading-relaxed">{t('tagline')}</p>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif text-gold mb-4">{t('hours')}</h3>
            <div className="space-y-1 text-sm text-cream-muted">
              <p>{t('weekdays')}: 10:00 – 20:00</p>
              <p>{t('weekends')}: 11:00 – 18:00</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-gold mb-4">{t('contact')}</h3>
            <div className="space-y-2 text-sm text-cream-muted">
              <p>📍 {t('address')}</p>
              <p>📞 <a href="tel:+37477060132" className="hover:text-gold transition-colors">+374 77 06 01 32</a></p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold/10 text-center text-cream-dim text-xs">
          © {new Date().getFullYear()} GA BARBER SHOP. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
```

---

## Task 1.6 — Hero Section

Create `src/components/home/Hero.tsx`:
```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-1 via-dark-2 to-dark-1" />

      {/* Decorative barber pole */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-6 h-48 barber-pole rounded-full opacity-30" />
      </div>

      {/* Gold orb */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        {/* Pre-title */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-sm font-medium">{t('pretitle')}</span>
        </div>

        {/* Main title */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-cream">{t('title1')}</span>
          <br />
          <span className="text-gold-gradient">{t('title2')}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-cream-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${locale}/booking`}>
            <Button size="lg">{t('cta_book')}</Button>
          </Link>
          <Link href={`/${locale}/visualizer`}>
            <Button size="lg" variant="outline">
              ✨ {t('cta_visualize')}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex items-center justify-center gap-12">
          {[
            { value: '10+', label: t('stat_years') },
            { value: '2-3', label: t('stat_masters') },
            { value: '1000+', label: t('stat_clients') },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl font-bold text-gold">{stat.value}</div>
              <div className="text-cream-muted text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Task 1.7 — Services Section

Create `src/components/home/ServicesSection.tsx`:
```typescript
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDuration } from '@/lib/utils';
import Link from 'next/link';

interface Service {
  id: string;
  nameHy: string; nameRu: string; nameEn: string;
  descriptionHy: string; descriptionRu: string; descriptionEn: string;
  durationMinutes: number;
  priceAmd: number;
  category: string;
}

const ICONS = { haircut: '✂️', beard: '🧔', styling: '💈' };

export function ServicesSection({ services }: { services: Service[] }) {
  const t = useTranslations('home.services');
  const locale = useLocale();

  function getName(s: Service) {
    if (locale === 'ru') return s.nameRu;
    if (locale === 'en') return s.nameEn;
    return s.nameHy;
  }

  function getDescription(s: Service) {
    if (locale === 'ru') return s.descriptionRu;
    if (locale === 'en') return s.descriptionEn;
    return s.descriptionHy;
  }

  return (
    <section id="services" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-cream mb-4">{t('title')}</h2>
          <p className="text-cream-muted">{t('subtitle')}</p>
          <div className="mt-4 h-px w-24 bg-gold/40 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} hover className="flex flex-col">
              <div className="text-4xl mb-4">{ICONS[service.category as keyof typeof ICONS]}</div>
              <h3 className="font-serif text-xl text-cream mb-2">{getName(service)}</h3>
              <p className="text-cream-muted text-sm leading-relaxed flex-1">{getDescription(service)}</p>

              <div className="mt-6 pt-4 border-t border-gold/15 flex items-center justify-between">
                <div>
                  <span className="text-gold font-bold text-xl">{formatPrice(service.priceAmd)}</span>
                  <span className="text-cream-dim text-xs ml-2">{formatDuration(service.durationMinutes, locale)}</span>
                </div>
                <Link href={`/${locale}/booking`}>
                  <Button size="sm">{t('book')}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Task 1.8 — Update Landing Page to Fetch Data

Update `src/app/[locale]/page.tsx`:
```typescript
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { ServicesSection } from '@/components/home/ServicesSection';
import { BarbersSection } from '@/components/home/BarbersSection';
import { VisualizerTeaser } from '@/components/home/VisualizerTeaser';
import { HoursSection } from '@/components/home/HoursSection';
import { ContactSection } from '@/components/home/ContactSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('title'), description: t('description') };
}

export default async function HomePage() {
  const [services, barbers] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.barber.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <ServicesSection services={services} />
        <BarbersSection barbers={barbers} />
        <VisualizerTeaser />
        <HoursSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

---

## Task 1.9 — Add API Routes

Create `src/app/api/services/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('[GET /api/services]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
```

Create `src/app/api/barbers/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const barbers = await prisma.barber.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { services: { include: { service: true } } },
    });
    return NextResponse.json({ success: true, data: barbers });
  } catch (error) {
    console.error('[GET /api/barbers]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch barbers' }, { status: 500 });
  }
}
```

Create `src/app/api/contact/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = ContactSchema.parse(body);

    await prisma.contactMessage.create({ data });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('[POST /api/contact]', error);
    return NextResponse.json({ success: false, error: 'Failed to save message' }, { status: 500 });
  }
}
```

---

## Task 1.10 — Add Translation Strings

Add to all 3 locale files the following namespaces:
- `home.hero` (pretitle, title1, title2, subtitle, cta_book, cta_visualize, stat_years, stat_masters, stat_clients)
- `home.services` (title, subtitle, book)
- `home.barbers` (title, subtitle)
- `home.visualizer` (title, subtitle, cta)
- `home.hours` (title, weekdays, weekends)
- `home.contact` (title, form fields, submit)
- `footer` (tagline, hours, contact, address, weekdays, weekends, rights)
- `metadata` (title, description)

See full translation strings in Phase 5 for final review.

---

## Phase 1 Verification

- [ ] `npm run dev` — no console errors
- [ ] `/hy` — full landing page renders
- [ ] Services section shows real data from Supabase
- [ ] Barbers section shows real data from Supabase
- [ ] Language switcher changes all visible text
- [ ] Header is sticky and works on mobile
- [ ] Contact form submits (check Supabase `contact_messages` table)
- [ ] All sections visible on mobile (375px width)

**If all pass → Phase 1 complete. Move to PHASE-2-BOOKING.md.**
