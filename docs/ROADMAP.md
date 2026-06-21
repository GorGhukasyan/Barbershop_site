# ROADMAP.md — Project Roadmap

## Vision

Build a **professional, AI-powered, trilingual barbershop website** that serves as the digital face of GA BARBER SHOP in Yerevan, Armenia — with guest online booking, an AI hairstyle visualizer, and a full admin panel for the team.

---

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0 │ Setup & Config          │ ~1-2 days │ Foundation      │
├─────────────────────────────────────────────────────────────────┤
│ PHASE 1 │ Design + Landing Page   │ ~3-5 days │ Public Face     │
├─────────────────────────────────────────────────────────────────┤
│ PHASE 2 │ Booking System          │ ~4-6 days │ Core Feature    │
├─────────────────────────────────────────────────────────────────┤
│ PHASE 3 │ AI Hairstyle Visualizer │ ~2-3 days │ Differentiator  │
├─────────────────────────────────────────────────────────────────┤
│ PHASE 4 │ Admin Panel             │ ~4-6 days │ Operations      │
├─────────────────────────────────────────────────────────────────┤
│ PHASE 5 │ Polish & Launch Prep    │ ~2-3 days │ Quality Gate    │
└─────────────────────────────────────────────────────────────────┘

Total estimated: ~16-25 days of focused development
```

---

## Phase 0 — Project Setup
**Goal**: Working local development environment with all tools configured.

### Milestones
- [ ] Next.js 15 project created with TypeScript
- [ ] Tailwind CSS configured with custom design tokens
- [ ] Supabase connection established
- [ ] Prisma schema created and database tables exist
- [ ] next-intl configured (hy/ru/en)
- [ ] All environment variables documented and set
- [ ] Git initialized with proper .gitignore

### Definition of Done
Running `npm run dev` opens a working Next.js app with no errors. Database tables exist in Supabase. Prisma client generates successfully.

---

## Phase 1 — Design System & Landing Page
**Goal**: Beautiful, on-brand public landing page that makes a great first impression.

### Milestones
- [ ] Design tokens defined (colors, typography, spacing)
- [ ] Global CSS variables set up
- [ ] Playfair Display + Inter fonts loaded
- [ ] Header with navigation + language switcher (HY/RU/EN)
- [ ] Footer with business info + hours
- [ ] Hero section (full-screen, compelling, "Book Now" CTA)
- [ ] Services section (3 service cards with prices in AMD)
- [ ] Barbers section (team cards with photos + bios)
- [ ] AI Visualizer teaser section (highlight the flagship feature)
- [ ] Gallery section (photo grid)
- [ ] Hours & Location section
- [ ] Contact section (form + info)
- [ ] Fully responsive (mobile-first)

### Definition of Done
Landing page looks professional and renders correctly on mobile, tablet, and desktop in all 3 languages. No broken images or layout issues.

---

## Phase 2 — Booking System
**Goal**: Customers can book appointments online without creating an account.

### Milestones
- [ ] Booking wizard (5-step flow) fully functional
- [ ] Step 1: Service selection (shows duration + price)
- [ ] Step 2: Barber selection (or "any available")
- [ ] Step 3: Date + time selection (real availability from DB)
- [ ] Step 4: Contact info form (name, phone, email)
- [ ] Step 5: Confirmation summary + submit
- [ ] API: POST /api/appointments (create booking)
- [ ] API: GET /api/availability (check open slots)
- [ ] API: GET /api/barbers, /api/services (lookup data)
- [ ] Email: Customer confirmation email (in booking language)
- [ ] Email: Admin new-booking notification
- [ ] Success page with appointment number (GA-YYYY-NNNN)
- [ ] Error handling (slot taken, validation errors)

### Definition of Done
A guest can complete a full booking in under 2 minutes. Confirmation email is received. Booking appears in Supabase DB.

---

## Phase 3 — AI Hairstyle Visualizer
**Goal**: Customers upload a photo, choose a style, see AI-generated result, and book.

### Milestones
- [ ] Photo upload UI (drag-and-drop + click, client-side)
- [ ] Hairstyle catalog (pre-defined styles with images)
- [ ] Gemini API integration (server-side API route)
- [ ] Loading animation ("AI is working...")
- [ ] Before/after result display
- [ ] "Book This Look" CTA → pre-filled booking wizard
- [ ] Rate limiting (3 generations per session)
- [ ] Error handling (bad photo, API failure)
- [ ] Privacy notice (photo not stored)

### Definition of Done
A user can upload a photo, select a style, see an AI-generated result within ~10 seconds, and proceed to booking.

---

## Phase 4 — Admin Panel
**Goal**: Owner and barbers can manage appointments, schedules, and shop settings.

### Milestones
- [ ] Supabase Auth setup (login page for admin/barbers)
- [ ] Protected /admin/* routes (middleware auth check)
- [ ] Admin dashboard (today's appointments, quick stats)
- [ ] Appointment list (all upcoming, filters by barber/date/status)
- [ ] Appointment detail (confirm, cancel, mark complete)
- [ ] Weekly calendar view (visual schedule)
- [ ] Barber management (add, edit, deactivate)
- [ ] Working hours editor (per barber, per day)
- [ ] Time-off management (add vacation days)
- [ ] Service management (edit prices, durations)
- [ ] Contact messages inbox
- [ ] Barber panel (barbers see only their own schedule)

### Definition of Done
Owner can log in, see all appointments, confirm/cancel them, and manage the team's schedule. Email is sent on status changes.

---

## Phase 5 — Polish & Launch Prep
**Goal**: Production-ready quality — performant, accessible, SEO-optimized.

### Milestones
- [ ] All translations complete and reviewed (hy/ru/en)
- [ ] SEO metadata for all pages (title, description, OG tags)
- [ ] Loading skeletons everywhere data is fetched
- [ ] Error boundaries on all major sections
- [ ] Mobile UX polished (touch targets, scroll behavior)
- [ ] Image optimization (next/image, WebP, lazy loading)
- [ ] Performance audit (Core Web Vitals: LCP < 2.5s)
- [ ] Accessibility audit (keyboard navigation, ARIA labels)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Booking flow end-to-end test
- [ ] Email delivery test
- [ ] AI Visualizer end-to-end test
- [ ] Admin panel end-to-end test
- [ ] README updated with deployment instructions
- [ ] Vercel deployment guide prepared

### Definition of Done
Site passes Lighthouse performance > 85. All flows work end-to-end. Translations complete. Ready for Vercel deployment.

---

## Future Phases (Post-Launch)

These features are intentionally NOT in the MVP. Schedule them after the site is live.

### Phase 6 — Loyalty & Marketing
- Customer loyalty program (points per visit)
- SMS notifications (via Armenian carrier or Twilio)
- Email marketing campaigns
- Instagram integration (show @gabarbershop feed)

### Phase 7 — Business Intelligence
- Revenue analytics dashboard
- Most popular services / barbers
- Peak hours heatmap
- Customer retention tracking

### Phase 8 — Payments (Armenia-specific)
- ArCa card payment integration
- Idram integration
- Online prepayment option (deposit to reduce no-shows)

### Phase 9 — Mobile App
- Progressive Web App (PWA) optimization
- Push notifications
- "Book favorite barber" quick action

### Phase 10 — Advanced AI
- AI-powered style recommendations based on face shape
- AI-generated seasonal promo materials
- Chatbot for booking via Telegram

---

## Technology Evolution Path

```
NOW                          → LATER
─────────────────────────── → ─────────────────────────────
Local dev (npm run dev)      → Vercel deployment
Supabase free tier           → Supabase Pro
Resend free tier             → Resend paid (production volume)
Gemini free API              → Gemini paid (higher limits)
Guest booking                → Optional accounts + history
Email notifications          → Email + SMS + Telegram Bot
Single location              → Multi-location support (if needed)
```
