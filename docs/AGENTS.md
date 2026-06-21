# AGENTS.md — Claude Code Agent Instructions

> **This is the master instruction file for Claude Code.**
> Read this file completely before executing ANY task on this project.

---

## 🎯 Your Mission

You are a senior full-stack developer building the **GA BARBER SHOP** website — a professional, AI-powered, trilingual barbershop booking platform. Your job is to implement features exactly as specified in the phase files, following the architecture and database design documents without deviation.

---

## 📚 Mandatory Read Order

Before starting ANY task, read these files **in this exact order**:

1. `docs/README.md` — Project overview & tech stack
2. `docs/ARCHITECTURE.md` — System architecture & data flow
3. `docs/DATABASE-DESIGN.md` — Database schema (know this cold)
4. `docs/FOLDER-STRUCTURE.md` — Where every file lives
5. **The current phase file** (e.g., `docs/PHASE-1-FOUNDATION.md`)

When implementing a specific feature, also read:
- The relevant phase file for that feature
- Any referenced component or API spec within that phase file

---

## 🚫 Hard Rules — Never Break These

### Code Quality
- **Always use TypeScript strict mode** — no `any` types, no `// @ts-ignore`
- **Always handle errors** — every API route, every async function must have try/catch
- **Always validate input** — use Zod schemas for all user-facing inputs
- **Never hardcode secrets** — use `process.env.VARIABLE_NAME`, check it exists
- **Never commit sensitive data** — `.env.local` is gitignored, never log secrets

### Database
- **Never modify the schema without reading `DATABASE-DESIGN.md` first**
- **Always use Prisma for DB operations** (not raw SQL in application code)
- **Always check for RLS (Row Level Security)** — Supabase policies must match the action
- **Never delete data without a soft-delete first** (use `is_active = false` or `cancelled_at`)

### i18n
- **Every user-facing string must use `useTranslations()`** — no hardcoded text
- **All 3 languages (hy/ru/en) must have translations** for every new string
- **Never use the locale as a query param** — use the `[locale]` route segment

### Components
- **Never put business logic in components** — components call hooks, hooks call API routes
- **Always use server components by default** — add `'use client'` only when needed (interactivity/hooks)
- **Always add loading states and error boundaries** for async components

### Security
- **Admin routes must check auth** — use `requireAdmin()` middleware
- **Barber routes must check auth** — use `requireBarber()` middleware
- **Never trust client-side data** — re-validate on the server

---

## ✅ Workflow for Each Task

Follow this sequence for every implementation task:

```
1. READ the full phase file for this task
2. CHECK existing files — never duplicate, always extend
3. IMPLEMENT in this order:
   a. Types/interfaces first (src/types/)
   b. Database queries (Prisma)
   c. API routes (src/app/api/)
   d. Custom hooks (src/hooks/)
   e. UI components (src/components/)
   f. Page (src/app/[locale]/...)
4. ADD translations to all 3 locale files (messages/hy.json, ru.json, en.json)
5. TEST locally — does it run without errors?
6. CHECK mobile responsiveness
```

---

## 🗂 Key File Locations

```
src/
├── app/
│   ├── [locale]/          ← All public pages live here
│   │   ├── page.tsx       ← Landing page (/)
│   │   ├── booking/       ← Booking wizard (/booking)
│   │   ├── visualizer/    ← AI tool (/visualizer)
│   │   └── admin/         ← Protected admin area (/admin)
│   └── api/               ← All API routes (server-side only)
├── components/
│   ├── ui/                ← Reusable primitives (Button, Input, Modal...)
│   ├── layout/            ← Header, Footer, Navigation
│   ├── home/              ← Landing page sections
│   ├── booking/           ← Booking wizard steps
│   ├── visualizer/        ← AI visualizer components
│   └── admin/             ← Admin panel components
├── lib/
│   ├── supabase/          ← Supabase client (client.ts, server.ts, admin.ts)
│   ├── gemini/            ← Gemini API client
│   ├── email/             ← Resend email + templates
│   └── utils.ts           ← Shared utilities
├── hooks/                 ← Custom React hooks
├── types/                 ← TypeScript interfaces
└── i18n/                  ← next-intl routing config
messages/
├── hy.json                ← Armenian translations
├── ru.json                ← Russian translations
└── en.json                ← English translations
```

---

## 🎨 Design System Rules

**Color Palette (Classic Barber + AI)**
```css
--color-gold: #C9A96E;         /* Primary accent — gold */
--color-gold-light: #E8C98A;   /* Hover states */
--color-gold-dark: #A07840;    /* Active states */
--color-dark: #0A0A0A;         /* Primary background */
--color-dark-2: #141414;       /* Card backgrounds */
--color-dark-3: #1E1E1E;       /* Elevated elements */
--color-cream: #F5F0E8;        /* Primary text */
--color-cream-muted: #B8B0A0;  /* Secondary text */
--color-border: rgba(201,169,110,0.2); /* Gold border */
```

**Typography**
- Headings: `font-family: 'Playfair Display', serif` (vintage, elegant)
- Body: `font-family: 'Inter', sans-serif` (modern, readable)
- Accent/mono: `font-family: 'JetBrains Mono', monospace` (AI feel)

**Spacing**
- Use Tailwind spacing scale
- Section padding: `py-20` (desktop), `py-12` (mobile)
- Component gap: `gap-6` standard, `gap-8` for sections

**Component Rules**
- All buttons: rounded-full with gold border/background
- Cards: dark background (`bg-dark-2`) with gold border (`border-gold/20`)
- Inputs: dark background, gold focus ring
- Loading states: gold shimmer animation

---

## 🌐 i18n Implementation Pattern

```typescript
// Server Component
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('namespace');
  return <h1>{t('key')}</h1>;
}

// Client Component
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

**Translation file structure** (`messages/hy.json`):
```json
{
  "common": { "book": "Ամրագրել", "cancel": "Չեղարկել" },
  "nav": { "home": "Գլխավոր", "booking": "Ամրագրում" },
  "home": { "hero": { "title": "..." } },
  "booking": { "step1": { "title": "..." } },
  "admin": { "dashboard": { "title": "..." } }
}
```

---

## 🔌 API Route Pattern

Every API route must follow this exact pattern:

```typescript
// src/app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const CreateAppointmentSchema = z.object({
  serviceId: z.string().uuid(),
  barberId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8).max(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateAppointmentSchema.parse(body);

    // Business logic here...
    const appointment = await prisma.appointment.create({ data: { ...data } });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('[POST /api/appointments]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## 📧 Email Notification Rules

Send email notifications in these cases:
1. **Booking Created** → to customer (confirmation) + to admin (new booking alert)
2. **Booking Cancelled** → to customer + to admin
3. **Booking Reminder** → to customer (24h before appointment)

Email language: use the locale stored with the appointment (`appointment.locale`).

---

## 🤖 AI Visualizer Rules

- **Max file size**: 5MB for uploaded photos
- **Accepted formats**: JPEG, PNG, WebP
- **Gemini model**: `gemini-2.0-flash` with image generation capability
- **Prompt template**: see `PHASE-3-AI-VISUALIZER.md`
- **Never store user photos** beyond the session (no Supabase Storage for visualizer)
- **Always show disclaimer**: results are AI-generated approximations
- **Rate limit**: max 3 generations per session (store in sessionStorage)

---

## 🔐 Auth Pattern (Admin/Barber)

```typescript
// Protecting admin routes in middleware or layout
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: barber } = await supabase
    .from('barbers')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (barber?.role !== 'admin') redirect('/admin/login');

  return { user, barber };
}
```

---

## ⚠️ Common Pitfalls — Avoid These

1. **Hydration mismatch** — don't use `new Date()` directly in render, use date-fns with fixed locale
2. **Missing loading states** — every data fetch needs a Suspense boundary or loading.tsx
3. **Wrong Supabase client** — use `server.ts` in Server Components, `client.ts` in Client Components
4. **Missing translations** — after adding any text, immediately add to all 3 locale files
5. **Prisma not regenerated** — after schema changes, always run `npx prisma generate`
6. **AMD formatting** — always format prices as `${price.toLocaleString('hy-AM')} ֏`
7. **Time zones** — Armenia is UTC+4, always store UTC in DB and convert on display

---

## 📊 Current Phase Tracker

Update this section when you complete a phase:

- [ ] Phase 0: Project Setup
- [ ] Phase 1: Foundation & Landing Page
- [ ] Phase 2: Booking System
- [ ] Phase 3: AI Hairstyle Visualizer
- [ ] Phase 4: Admin Panel
- [ ] Phase 5: Polish & Launch Prep

**To start a phase**: Read `docs/PHASE-X-[NAME].md` fully, then execute each task in order.
**To resume a phase**: Read `docs/PHASE-X-[NAME].md`, check off completed items, continue from where you left off.
