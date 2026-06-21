# FOLDER-STRUCTURE.md — Project Directory Layout

## Root Structure

```
ga-barbershop/
├── docs/                    ← All planning & documentation (this folder)
├── prisma/                  ← Database ORM schema
├── messages/                ← i18n translation files
├── public/                  ← Static assets
├── src/                     ← All application source code
├── .env.example             ← Environment variable template
├── .env.local               ← Local secrets (gitignored!)
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Detailed Structure

```
ga-barbershop/
│
├── docs/
│   ├── README.md
│   ├── AGENTS.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE-DESIGN.md
│   ├── FOLDER-STRUCTURE.md    ← This file
│   ├── ROADMAP.md
│   ├── IMPLEMENTATION-PLAN.md
│   ├── PHASE-0-SETUP.md
│   ├── PHASE-1-FOUNDATION.md
│   ├── PHASE-2-BOOKING.md
│   ├── PHASE-3-AI-VISUALIZER.md
│   ├── PHASE-4-ADMIN.md
│   └── PHASE-5-POLISH.md
│
├── prisma/
│   └── schema.prisma          ← Prisma schema (see DATABASE-DESIGN.md)
│
├── messages/
│   ├── hy.json                ← Armenian translations (PRIMARY)
│   ├── ru.json                ← Russian translations
│   └── en.json                ← English translations
│
├── public/
│   ├── fonts/
│   │   ├── PlayfairDisplay-Regular.woff2
│   │   └── PlayfairDisplay-Bold.woff2
│   ├── images/
│   │   ├── logo.svg           ← GA BARBER SHOP logo
│   │   ├── logo-gold.svg      ← Gold variant
│   │   ├── hero-bg.jpg        ← Landing page hero background
│   │   └── og-image.jpg       ← Open Graph image for social sharing
│   └── favicon.ico
│
└── src/
    │
    ├── app/                   ← Next.js App Router
    │   │
    │   ├── [locale]/          ← All locale-aware pages
    │   │   │
    │   │   ├── layout.tsx     ← Root layout (fonts, metadata, providers)
    │   │   ├── page.tsx       ← Landing page (/)
    │   │   │
    │   │   ├── booking/
    │   │   │   ├── page.tsx   ← Booking wizard (/booking)
    │   │   │   └── success/
    │   │   │       └── page.tsx ← Booking confirmation (/booking/success)
    │   │   │
    │   │   ├── visualizer/
    │   │   │   └── page.tsx   ← AI Hairstyle Visualizer (/visualizer)
    │   │   │
    │   │   └── admin/
    │   │       ├── layout.tsx     ← Admin layout (auth check)
    │   │       ├── login/
    │   │       │   └── page.tsx   ← Admin login (/admin/login)
    │   │       ├── page.tsx       ← Admin dashboard (/admin)
    │   │       ├── appointments/
    │   │       │   ├── page.tsx   ← All appointments (/admin/appointments)
    │   │       │   └── [id]/
    │   │       │       └── page.tsx ← Single appointment detail
    │   │       ├── barbers/
    │   │       │   ├── page.tsx   ← Barber management
    │   │       │   └── [id]/
    │   │       │       └── page.tsx ← Edit barber + schedule
    │   │       └── services/
    │   │           └── page.tsx   ← Service management
    │   │
    │   ├── api/               ← API Route Handlers (server-side only)
    │   │   │
    │   │   ├── appointments/
    │   │   │   ├── route.ts   ← POST (create), GET (list - admin)
    │   │   │   └── [id]/
    │   │   │       └── route.ts ← GET, PATCH, DELETE
    │   │   │
    │   │   ├── barbers/
    │   │   │   ├── route.ts   ← GET (list active)
    │   │   │   └── [id]/
    │   │   │       └── route.ts ← GET single barber
    │   │   │
    │   │   ├── services/
    │   │   │   └── route.ts   ← GET (list active)
    │   │   │
    │   │   ├── availability/
    │   │   │   └── route.ts   ← GET ?barberId=&date=&serviceId=
    │   │   │
    │   │   ├── contact/
    │   │   │   └── route.ts   ← POST (submit contact form)
    │   │   │
    │   │   └── ai/
    │   │       └── visualizer/
    │   │           └── route.ts ← POST (generate hairstyle)
    │   │
    │   ├── globals.css        ← Global styles, CSS variables
    │   └── layout.tsx         ← Root layout (no locale)
    │
    ├── components/
    │   │
    │   ├── ui/                ← Reusable primitives
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Card.tsx
    │   │   ├── Spinner.tsx
    │   │   ├── Calendar.tsx   ← Date picker
    │   │   └── TimeSlot.tsx   ← Individual time slot button
    │   │
    │   ├── layout/
    │   │   ├── Header.tsx     ← Navigation + logo + language switcher
    │   │   ├── Footer.tsx     ← Contact info, links, hours
    │   │   └── LanguageSwitcher.tsx ← HY / RU / EN toggle
    │   │
    │   ├── home/              ← Landing page sections
    │   │   ├── Hero.tsx           ← Full-screen hero with CTA
    │   │   ├── ServicesSection.tsx ← Service cards with prices
    │   │   ├── BarbersSection.tsx  ← Barber team cards
    │   │   ├── VisualizerTeaser.tsx ← AI feature promo section
    │   │   ├── Gallery.tsx         ← Photo gallery grid
    │   │   ├── HoursSection.tsx    ← Working hours display
    │   │   └── ContactSection.tsx  ← Map + contact form
    │   │
    │   ├── booking/           ← Booking wizard components
    │   │   ├── BookingWizard.tsx    ← Main wizard container
    │   │   ├── StepIndicator.tsx    ← Progress bar (steps 1-5)
    │   │   ├── Step1Service.tsx     ← Select service
    │   │   ├── Step2Barber.tsx      ← Select barber
    │   │   ├── Step3DateTime.tsx    ← Select date + time slot
    │   │   ├── Step4Contact.tsx     ← Enter name/phone/email
    │   │   └── Step5Confirm.tsx     ← Review + submit
    │   │
    │   ├── visualizer/        ← AI Hairstyle Visualizer
    │   │   ├── VisualizerContainer.tsx  ← Main container
    │   │   ├── PhotoUpload.tsx          ← Drag-and-drop photo upload
    │   │   ├── StyleCatalog.tsx         ← Grid of hairstyle options
    │   │   ├── StyleCard.tsx            ← Single style option card
    │   │   ├── GeneratingAnimation.tsx  ← Loading state while AI works
    │   │   └── ResultView.tsx           ← Before/after + book CTA
    │   │
    │   └── admin/             ← Admin panel components
    │       ├── AdminSidebar.tsx      ← Side navigation
    │       ├── AppointmentTable.tsx  ← List of appointments
    │       ├── AppointmentCard.tsx   ← Single appointment detail
    │       ├── StatusBadge.tsx       ← Appointment status indicator
    │       ├── WeekCalendar.tsx      ← Weekly calendar view
    │       ├── BarberSchedule.tsx    ← Working hours editor
    │       └── StatsCard.tsx         ← Dashboard KPI cards
    │
    ├── hooks/                 ← Custom React hooks
    │   ├── useBooking.ts          ← Booking wizard state
    │   ├── useAvailability.ts     ← Fetch available slots
    │   ├── useVisualizer.ts       ← AI visualizer state
    │   ├── useAppointments.ts     ← Admin appointments
    │   └── useAuth.ts             ← Auth state (admin)
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts      ← Browser Supabase client (NEXT_PUBLIC_ keys)
    │   │   ├── server.ts      ← Server Supabase client (service role)
    │   │   └── middleware.ts  ← Auth middleware helper
    │   │
    │   ├── prisma.ts          ← Prisma client singleton
    │   │
    │   ├── gemini/
    │   │   ├── client.ts      ← Google Gemini API client
    │   │   └── prompts.ts     ← Hairstyle generation prompts
    │   │
    │   ├── email/
    │   │   ├── resend.ts      ← Resend client
    │   │   └── templates/
    │   │       ├── BookingConfirmation.tsx  ← Email template
    │   │       ├── BookingCancelled.tsx
    │   │       └── BookingReminder.tsx
    │   │
    │   ├── availability.ts    ← Time slot calculation logic
    │   ├── validations.ts     ← Shared Zod schemas
    │   └── utils.ts           ← Formatters, helpers
    │
    ├── types/
    │   ├── database.ts        ← Types from Prisma (auto-generated + custom)
    │   ├── booking.ts         ← Booking wizard types
    │   ├── api.ts             ← API request/response types
    │   └── visualizer.ts      ← AI visualizer types
    │
    └── i18n/
        ├── routing.ts         ← next-intl locale routing config
        └── request.ts         ← next-intl server-side config
```

---

## Configuration Files

### `next.config.ts`
```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
```

### `src/i18n/routing.ts`
```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['hy', 'ru', 'en'],
  defaultLocale: 'hy',
  localePrefix: 'always',
});
```

### `middleware.ts` (root level)
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### `tailwind.config.ts`
```typescript
// Extended with custom barbershop colors and fonts
// See PHASE-0-SETUP.md for full config
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `BookingWizard.tsx` |
| Hooks | camelCase + `use` prefix | `useAvailability.ts` |
| Utils | camelCase | `formatPrice.ts` |
| Types | PascalCase | `Appointment`, `Barber` |
| API routes | kebab-case folders | `ai/visualizer/route.ts` |
| DB fields | snake_case | `appointment_date` |
| TS props | camelCase | `appointmentDate` |
| CSS classes | Tailwind + `ga-` prefix | `ga-card`, `ga-btn-gold` |
| Translation keys | camelCase | `booking.step1.title` |
