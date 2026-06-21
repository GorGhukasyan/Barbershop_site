# GA BARBER SHOP — Full-Stack Website & Booking Platform

> A professional, AI-powered, trilingual barbershop website built with Next.js 15, Supabase, and Google Gemini API.

---

## 🗂 Documentation Index

| File | Purpose |
|------|---------|
| `README.md` | This file — project overview & quick reference |
| `AGENTS.md` | **Claude Code agent instructions — READ THIS FIRST** |
| `ARCHITECTURE.md` | System architecture & data flow |
| `DATABASE-DESIGN.md` | Full database schema (Supabase/PostgreSQL) |
| `FOLDER-STRUCTURE.md` | Project directory layout with explanations |
| `ROADMAP.md` | High-level phases & milestones |
| `IMPLEMENTATION-PLAN.md` | Master implementation checklist |
| `PHASE-0-SETUP.md` | Phase 0: Project initialization & configuration |
| `PHASE-1-FOUNDATION.md` | Phase 1: Design system, layout & landing page |
| `PHASE-2-BOOKING.md` | Phase 2: Full booking system |
| `PHASE-3-AI-VISUALIZER.md` | Phase 3: AI Hairstyle Visualizer (Gemini) |
| `PHASE-4-ADMIN.md` | Phase 4: Admin panel & barber dashboard |
| `PHASE-5-POLISH.md` | Phase 5: i18n, SEO, testing & optimization |
| `.env.example` | All required environment variables |

---

## 🧠 Project Summary

**GA BARBER SHOP** is a full-stack web application for a barbershop in Nor Nork district, Yerevan, Armenia.

### Key Features
- **Online Guest Booking** — 5-step wizard, no account required
- **AI Hairstyle Visualizer** — Upload photo → select style → see AI-generated result → book (Google Gemini API)
- **Trilingual** — Armenian (HY), Russian (RU), English (EN), all equal priority
- **Admin Panel** — Owner + barbers manage appointments, schedules, and services
- **Email Notifications** — Booking confirmations and reminders (Resend)
- **Classic Barber Aesthetic** — Vintage, gold/amber, dark — but with a modern AI feel

### Business Context
- **Location**: Nor Nork district, Yerevan, Armenia
- **Team**: Owner (Gor) + 2-3 barbers
- **Services**: Haircut (Մազ), Beard (Մորուք), Styling (Ձևավորում)
- **Hours**: Mon–Fri 10:00–20:00 / Sat–Sun 11:00–18:00
- **Booking**: Guest (no login required for customers)
- **Currency**: AMD (Armenian Dram)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 3 + CSS Variables |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Prisma |
| **Auth** | Supabase Auth (admin/barbers only) |
| **Storage** | Supabase Storage (photos, gallery) |
| **AI** | Google Gemini API (`gemini-2.0-flash`) |
| **Email** | Resend |
| **i18n** | next-intl |
| **Forms** | React Hook Form + Zod |
| **Date/Time** | date-fns |
| **Hosting** | Local dev → Vercel (later) |

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone / navigate to project
cd ga-barbershop

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# 4. Set up database (run in Supabase SQL Editor)
# See DATABASE-DESIGN.md for the full SQL

# 5. Generate Prisma client
npx prisma generate

# 6. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 User Roles

| Role | Access | Auth |
|------|--------|------|
| **Customer (Guest)** | Public pages + booking | None (guest) |
| **Barber** | Their own appointments + schedule | Supabase Auth |
| **Admin (Owner)** | Full control of everything | Supabase Auth |

---

## 🗺 Development Phases

```
Phase 0: Setup          → Project init, config, DB connection
Phase 1: Foundation     → Design system, layout, landing page
Phase 2: Booking        → Full booking system + email
Phase 3: AI Visualizer  → Gemini API integration
Phase 4: Admin Panel    → Dashboard, appointments, schedules
Phase 5: Polish         → i18n finalize, SEO, testing
```

**See `ROADMAP.md` for detailed timeline and `IMPLEMENTATION-PLAN.md` for task breakdown.**
