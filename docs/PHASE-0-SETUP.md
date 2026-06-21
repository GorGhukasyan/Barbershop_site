# PHASE-0-SETUP.md — Project Setup & Configuration

> **Claude Code**: Execute ALL tasks in this file before moving to Phase 1.
> After completing this phase, `npm run dev` should run with no errors.

---

## Task 0.1 — Create Next.js Project

```bash
npx create-next-app@latest ga-barbershop \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-eslint

cd ga-barbershop
```

---

## Task 0.2 — Install Dependencies

```bash
# Database & ORM
npm install @prisma/client prisma
npm install @supabase/supabase-js @supabase/ssr

# i18n
npm install next-intl

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Date/Time
npm install date-fns

# Email
npm install resend

# AI
npm install @google/generative-ai

# UI Utilities
npm install clsx tailwind-merge
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-slot

# Dev Dependencies
npm install -D @types/node
```

---

## Task 0.3 — Configure TypeScript

Replace `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Task 0.4 — Configure Tailwind CSS

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E8C98A',
          dark: '#A07840',
          muted: 'rgba(201,169,110,0.3)',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          2: '#141414',
          3: '#1E1E1E',
          4: '#2A2A2A',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          muted: '#B8B0A0',
          dim: '#7A7265',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A96E 0%, #E8C98A 50%, #A07840 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(201,169,110,0.4)' },
          '50%': { opacity: '.8', boxShadow: '0 0 0 8px rgba(201,169,110,0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Task 0.5 — Create Global CSS

Create `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Core Brand Colors */
  --gold: #C9A96E;
  --gold-light: #E8C98A;
  --gold-dark: #A07840;
  --gold-muted: rgba(201, 169, 110, 0.2);

  /* Dark Backgrounds */
  --dark-1: #0A0A0A;
  --dark-2: #141414;
  --dark-3: #1E1E1E;
  --dark-4: #2A2A2A;

  /* Text */
  --cream: #F5F0E8;
  --cream-muted: #B8B0A0;
  --cream-dim: #7A7265;

  /* Typography */
  --font-playfair: 'Playfair Display', Georgia, serif;
  --font-inter: 'Inter', system-ui, sans-serif;

  /* Misc */
  --border-gold: 1px solid rgba(201, 169, 110, 0.25);
  --border-gold-hover: 1px solid rgba(201, 169, 110, 0.6);
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: var(--dark-1);
  color: var(--cream);
  font-family: var(--font-inter);
}

/* Gold shimmer for loading states */
.shimmer {
  background: linear-gradient(
    90deg,
    var(--dark-3) 25%,
    var(--dark-4) 50%,
    var(--dark-3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--dark-2);
}
::-webkit-scrollbar-thumb {
  background: var(--gold-dark);
  border-radius: 3px;
}

/* Gold text gradient */
.text-gold-gradient {
  background: linear-gradient(135deg, #C9A96E, #E8C98A, #A07840);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Barbershop pole stripe animation */
@keyframes pole-spin {
  from { background-position: 0 0; }
  to { background-position: 0 -60px; }
}

.barber-pole {
  background: repeating-linear-gradient(
    -45deg,
    #fff 0px, #fff 10px,
    #C9252D 10px, #C9252D 20px,
    #0033A0 20px, #0033A0 30px
  );
  background-size: 100% 60px;
  animation: pole-spin 2s linear infinite;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}
```

---

## Task 0.6 — Create Prisma Client Singleton

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Task 0.7 — Create Supabase Clients

Create `src/lib/supabase/client.ts` (browser):
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `src/lib/supabase/server.ts` (server):
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

---

## Task 0.8 — Setup i18n

Create `src/i18n/routing.ts`:
```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['hy', 'ru', 'en'] as const,
  defaultLocale: 'hy',
  localePrefix: 'always',
});
```

Create `src/i18n/request.ts`:
```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

Create root `middleware.ts`:
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

---

## Task 0.9 — Create Base Message Files

Create `messages/hy.json` (skeleton):
```json
{
  "common": {
    "book": "Ամրագրել",
    "cancel": "Չեղարկել",
    "confirm": "Հաստատել",
    "back": "Վերադառնալ",
    "next": "Հաջորդ",
    "close": "Փակել",
    "loading": "Բեռնվում է...",
    "error": "Սխալ է տեղի ունեցել"
  },
  "nav": {
    "home": "Գլխավոր",
    "services": "Ծառայություններ",
    "barbers": "Վարսավիրներ",
    "gallery": "Պատկերասրահ",
    "booking": "Ամրագրում",
    "visualizer": "AI Ոճ",
    "contact": "Կապ"
  }
}
```

Create `messages/ru.json` (skeleton):
```json
{
  "common": {
    "book": "Записаться",
    "cancel": "Отменить",
    "confirm": "Подтвердить",
    "back": "Назад",
    "next": "Далее",
    "close": "Закрыть",
    "loading": "Загрузка...",
    "error": "Произошла ошибка"
  },
  "nav": {
    "home": "Главная",
    "services": "Услуги",
    "barbers": "Барберы",
    "gallery": "Галерея",
    "booking": "Запись",
    "visualizer": "AI Стиль",
    "contact": "Контакты"
  }
}
```

Create `messages/en.json` (skeleton):
```json
{
  "common": {
    "book": "Book Now",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "close": "Close",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "nav": {
    "home": "Home",
    "services": "Services",
    "barbers": "Barbers",
    "gallery": "Gallery",
    "booking": "Book",
    "visualizer": "AI Style",
    "contact": "Contact"
  }
}
```

---

## Task 0.10 — Create Base App Layout

Create `src/app/[locale]/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: 'GA BARBER SHOP',
  description: 'Professional barbershop in Nor Nork, Yerevan',
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Create `src/app/[locale]/page.tsx` (placeholder):
```typescript
export default function Home() {
  return (
    <main>
      <h1 style={{ color: '#C9A96E', padding: '2rem', fontFamily: 'Georgia, serif' }}>
        GA BARBER SHOP — Coming Soon
      </h1>
    </main>
  );
}
```

---

## Task 0.11 — Create .gitignore

Ensure `.gitignore` includes:
```
# env files
.env
.env.local
.env.*.local

# next.js
/.next/
/out/

# production
/build

# dependencies
/node_modules

# debug logs
npm-debug.log*

# misc
.DS_Store
*.pem
```

---

## Task 0.12 — Create next.config.ts

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
```

---

## Task 0.13 — Initialize Prisma

```bash
# Initialize Prisma (creates prisma/schema.prisma)
npx prisma init --datasource-provider postgresql

# Copy the schema from DATABASE-DESIGN.md into prisma/schema.prisma

# Generate Prisma client
npx prisma generate
```

---

## Phase 0 Verification Checklist

Run these commands and verify all pass:

```bash
# 1. No TypeScript errors
npx tsc --noEmit

# 2. Dev server starts
npm run dev
# → Open http://localhost:3000/hy — should show "GA BARBER SHOP — Coming Soon"
# → Open http://localhost:3000/ru — should work
# → Open http://localhost:3000/en — should work

# 3. Prisma connects to DB
npx prisma db pull
# → Should list all tables without errors
```

**If all pass → Phase 0 is complete. Move to PHASE-1-FOUNDATION.md.**
