# IMPLEMENTATION-PLAN.md — Master Task Checklist

> This is the single source of truth for what has been done and what remains.
> Claude Code: Check off items as you complete them. Read the phase file before starting each section.

---

## How to Use This File

1. Find the current phase (first uncompleted section)
2. Read `docs/PHASE-X-[NAME].md` for full details
3. Execute tasks in order, checking them off
4. Never skip tasks — each one is a dependency for the next

---

## ✅ PHASE 0 — Project Setup
> Read: `docs/PHASE-0-SETUP.md`

### 0.1 Project Initialization
- [ ] Create Next.js 15 project: `npx create-next-app@latest ga-barbershop --typescript --tailwind --app --src-dir`
- [ ] Install all required dependencies (see PHASE-0-SETUP.md)
- [ ] Configure `tsconfig.json` (strict mode, path aliases)
- [ ] Configure `tailwind.config.ts` (custom colors, fonts)
- [ ] Create `src/app/globals.css` (CSS variables, base styles)
- [ ] Initialize Git: `git init && git add . && git commit -m "Initial setup"`

### 0.2 Environment Configuration
- [ ] Create `.env.local` from `.env.example`
- [ ] Fill in `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Fill in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Fill in `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Fill in `DATABASE_URL` (Supabase connection string)
- [ ] Fill in `GEMINI_API_KEY`
- [ ] Fill in `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
- [ ] Fill in `NEXTAUTH_SECRET`

### 0.3 Database Setup
- [ ] Run all SQL from `DATABASE-DESIGN.md` in Supabase SQL Editor
- [ ] Verify tables exist: barbers, services, appointments, etc.
- [ ] Run seed data SQL (insert 3 services)
- [ ] Create Supabase Storage buckets: `barber-photos`, `gallery`
- [ ] Apply Storage policies

### 0.4 Prisma Setup
- [ ] Create `prisma/schema.prisma` (from DATABASE-DESIGN.md)
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db pull` to verify connection
- [ ] Create `src/lib/prisma.ts` (singleton client)

### 0.5 i18n Setup
- [ ] Install `next-intl`
- [ ] Create `src/i18n/routing.ts`
- [ ] Create `src/i18n/request.ts`
- [ ] Create `middleware.ts` (root level)
- [ ] Create `messages/hy.json` (skeleton structure)
- [ ] Create `messages/ru.json` (skeleton structure)
- [ ] Create `messages/en.json` (skeleton structure)
- [ ] Create `src/app/[locale]/layout.tsx`

### 0.6 Supabase Client Setup
- [ ] Create `src/lib/supabase/client.ts` (browser client)
- [ ] Create `src/lib/supabase/server.ts` (server client)
- [ ] Verify Supabase connection works from API route

### 0.7 Verify Phase 0
- [ ] `npm run dev` starts without errors
- [ ] `/hy` route renders a basic page
- [ ] `/ru` and `/en` routes work
- [ ] Supabase query returns services from DB

---

## ✅ PHASE 1 — Foundation & Landing Page
> Read: `docs/PHASE-1-FOUNDATION.md`

### 1.1 Design System
- [ ] Load Playfair Display + Inter fonts (Google Fonts or local)
- [ ] Define CSS variables in `globals.css`
- [ ] Configure Tailwind with custom colors (`gold`, `dark`, `cream`)
- [ ] Create base UI components:
  - [ ] `src/components/ui/Button.tsx`
  - [ ] `src/components/ui/Input.tsx`
  - [ ] `src/components/ui/Card.tsx`
  - [ ] `src/components/ui/Badge.tsx`
  - [ ] `src/components/ui/Spinner.tsx`

### 1.2 Layout Components
- [ ] `src/components/layout/Header.tsx` (logo + nav + language switcher)
- [ ] `src/components/layout/LanguageSwitcher.tsx`
- [ ] `src/components/layout/Footer.tsx` (hours + address + phone)
- [ ] Update `src/app/[locale]/layout.tsx` to include Header + Footer

### 1.3 Landing Page Sections
- [ ] `src/components/home/Hero.tsx`
- [ ] `src/components/home/ServicesSection.tsx` (fetch from DB)
- [ ] `src/components/home/BarbersSection.tsx` (fetch from DB)
- [ ] `src/components/home/VisualizerTeaser.tsx`
- [ ] `src/components/home/Gallery.tsx`
- [ ] `src/components/home/HoursSection.tsx`
- [ ] `src/components/home/ContactSection.tsx`

### 1.4 API Routes (public data)
- [ ] `src/app/api/barbers/route.ts` (GET active barbers)
- [ ] `src/app/api/services/route.ts` (GET active services)
- [ ] `src/app/api/contact/route.ts` (POST contact message)

### 1.5 Landing Page Assembly
- [ ] `src/app/[locale]/page.tsx` — compose all sections

### 1.6 Translations (Phase 1)
- [ ] Add all landing page strings to `messages/hy.json`
- [ ] Add all landing page strings to `messages/ru.json`
- [ ] Add all landing page strings to `messages/en.json`

### 1.7 Verify Phase 1
- [ ] Landing page renders all sections correctly
- [ ] Services and barbers load from DB
- [ ] Language switcher changes all text
- [ ] Mobile layout looks good
- [ ] Contact form submits and saves to DB

---

## ✅ PHASE 2 — Booking System
> Read: `docs/PHASE-2-BOOKING.md`

### 2.1 Availability Logic
- [ ] `src/lib/availability.ts` — slot generation algorithm
- [ ] `src/app/api/availability/route.ts` — GET endpoint

### 2.2 Booking API Routes
- [ ] `src/app/api/appointments/route.ts` — POST create booking
- [ ] `src/app/api/appointments/[id]/route.ts` — GET single appointment

### 2.3 Email Setup
- [ ] Install Resend: `npm install resend`
- [ ] `src/lib/email/resend.ts` — Resend client
- [ ] `src/lib/email/templates/BookingConfirmation.tsx`
- [ ] `src/lib/email/templates/BookingCancelled.tsx`
- [ ] Test email sending

### 2.4 Booking Wizard Components
- [ ] `src/components/booking/BookingWizard.tsx`
- [ ] `src/components/booking/StepIndicator.tsx`
- [ ] `src/components/booking/Step1Service.tsx`
- [ ] `src/components/booking/Step2Barber.tsx`
- [ ] `src/components/booking/Step3DateTime.tsx`
- [ ] `src/components/booking/Step4Contact.tsx`
- [ ] `src/components/booking/Step5Confirm.tsx`

### 2.5 Booking State Hook
- [ ] `src/hooks/useBooking.ts`
- [ ] `src/hooks/useAvailability.ts`

### 2.6 Booking Pages
- [ ] `src/app/[locale]/booking/page.tsx` — main wizard page
- [ ] `src/app/[locale]/booking/success/page.tsx` — success page

### 2.7 Booking UI Components
- [ ] `src/components/ui/Calendar.tsx` — date picker
- [ ] `src/components/ui/TimeSlot.tsx` — time slot button

### 2.8 Translations (Phase 2)
- [ ] Add all booking strings to all 3 locale files

### 2.9 Verify Phase 2
- [ ] Full booking flow works end-to-end
- [ ] Customer receives confirmation email
- [ ] Appointment appears in Supabase DB
- [ ] Slot becomes unavailable after booking

---

## ✅ PHASE 3 — AI Hairstyle Visualizer
> Read: `docs/PHASE-3-AI-VISUALIZER.md`

### 3.1 Gemini API Setup
- [ ] `src/lib/gemini/client.ts` — Gemini API client
- [ ] `src/lib/gemini/prompts.ts` — hairstyle prompts

### 3.2 Visualizer API Route
- [ ] `src/app/api/ai/visualizer/route.ts` — POST generate

### 3.3 Visualizer UI Components
- [ ] `src/components/visualizer/VisualizerContainer.tsx`
- [ ] `src/components/visualizer/PhotoUpload.tsx`
- [ ] `src/components/visualizer/StyleCatalog.tsx`
- [ ] `src/components/visualizer/StyleCard.tsx`
- [ ] `src/components/visualizer/GeneratingAnimation.tsx`
- [ ] `src/components/visualizer/ResultView.tsx`

### 3.4 Visualizer State Hook
- [ ] `src/hooks/useVisualizer.ts`

### 3.5 Visualizer Page
- [ ] `src/app/[locale]/visualizer/page.tsx`

### 3.6 Hairstyle Catalog Data
- [ ] Define ~12 hairstyle options with names (HY/RU/EN) and reference images
- [ ] Create `src/lib/hairstyles.ts` — static catalog

### 3.7 Translations (Phase 3)
- [ ] Add all visualizer strings to all 3 locale files

### 3.8 Verify Phase 3
- [ ] Photo upload works (drag-and-drop + click)
- [ ] Style selection works
- [ ] Gemini API returns generated image
- [ ] Before/after view works
- [ ] "Book This Look" navigates to booking with style pre-selected
- [ ] Rate limiting works (3 per session)

---

## ✅ PHASE 4 — Admin Panel
> Read: `docs/PHASE-4-ADMIN.md`

### 4.1 Auth Setup
- [ ] Create admin/barber users in Supabase Auth Dashboard
- [ ] Run `INSERT INTO barbers` SQL to link users to barber profiles
- [ ] `src/lib/supabase/middleware.ts` — auth check helper

### 4.2 Admin Layout & Auth
- [ ] `src/app/[locale]/admin/layout.tsx` — protected layout
- [ ] `src/app/[locale]/admin/login/page.tsx` — login form
- [ ] `src/hooks/useAuth.ts` — auth state
- [ ] Middleware: protect all `/admin/*` routes

### 4.3 Admin API Routes
- [ ] `src/app/api/appointments/route.ts` — add GET (admin)
- [ ] `src/app/api/appointments/[id]/route.ts` — add PATCH (confirm/cancel)
- [ ] Working hours API endpoints
- [ ] Time-off API endpoints

### 4.4 Admin Dashboard
- [ ] `src/app/[locale]/admin/page.tsx` — dashboard
- [ ] `src/components/admin/StatsCard.tsx`
- [ ] `src/components/admin/WeekCalendar.tsx`

### 4.5 Appointment Management
- [ ] `src/app/[locale]/admin/appointments/page.tsx`
- [ ] `src/components/admin/AppointmentTable.tsx`
- [ ] `src/components/admin/AppointmentCard.tsx`
- [ ] `src/components/admin/StatusBadge.tsx`
- [ ] Email: send when admin confirms or cancels

### 4.6 Barber Management
- [ ] `src/app/[locale]/admin/barbers/page.tsx`
- [ ] `src/app/[locale]/admin/barbers/[id]/page.tsx`
- [ ] `src/components/admin/BarberSchedule.tsx`
- [ ] Working hours editor
- [ ] Time-off calendar

### 4.7 Service Management
- [ ] `src/app/[locale]/admin/services/page.tsx`
- [ ] Edit service name, price, duration

### 4.8 Barber Panel (restricted view)
- [ ] Barber can see only their own appointments
- [ ] Barber can manage their own working hours

### 4.9 Verify Phase 4
- [ ] Admin can log in
- [ ] Admin can see all appointments
- [ ] Admin can confirm/cancel appointments
- [ ] Customer receives email when admin cancels
- [ ] Barber can log in and see their schedule
- [ ] Working hours correctly affect availability

---

## ✅ PHASE 5 — Polish & Launch Prep
> Read: `docs/PHASE-5-POLISH.md`

### 5.1 Translation Completion
- [ ] All strings in hy.json ✓
- [ ] All strings in ru.json ✓
- [ ] All strings in en.json ✓
- [ ] Language switcher preserves current page URL

### 5.2 SEO
- [ ] Page metadata (title, description) for all pages
- [ ] Open Graph tags
- [ ] `public/sitemap.xml`
- [ ] `public/robots.txt`

### 5.3 Performance
- [ ] All images use `next/image` with proper sizes
- [ ] Loading skeletons on all async data
- [ ] Suspense boundaries on all Server Component data fetches
- [ ] Error boundaries on all major sections
- [ ] No unused dependencies

### 5.4 Accessibility
- [ ] All images have alt text (from translations)
- [ ] Form inputs have labels
- [ ] Keyboard navigation works in booking wizard
- [ ] Color contrast passes WCAG AA

### 5.5 Final Testing
- [ ] Full booking flow (end-to-end)
- [ ] Full admin flow
- [ ] Full AI visualizer flow
- [ ] Language switching (all 3 languages)
- [ ] Mobile testing (iOS Safari + Android Chrome)

### 5.6 Deployment Prep
- [ ] All environment variables listed in `.env.example`
- [ ] `README.md` updated with deployment instructions
- [ ] Vercel project configured (future)

---

## Summary Status

| Phase | Status | Est. Days |
|-------|--------|-----------|
| Phase 0: Setup | ⬜ Not started | 1-2 |
| Phase 1: Foundation | ⬜ Not started | 3-5 |
| Phase 2: Booking | ⬜ Not started | 4-6 |
| Phase 3: AI Visualizer | ⬜ Not started | 2-3 |
| Phase 4: Admin Panel | ⬜ Not started | 4-6 |
| Phase 5: Polish | ⬜ Not started | 2-3 |

**Status legend**: ⬜ Not started | 🔄 In progress | ✅ Complete
