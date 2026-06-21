# ARCHITECTURE.md — System Architecture

## Overview

GA BARBER SHOP is a **monolithic Next.js 15 application** using the App Router. It combines a public-facing customer site, a guest booking system, an AI hairstyle visualizer, and a protected admin panel — all in one codebase.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Public Site │  │   Booking    │  │  AI Visualizer │   │
│  │  (Landing)   │  │   Wizard     │  │  (Gemini)      │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
│                          │                    │              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Admin Panel (Protected)                  │  │
│  │   Dashboard | Calendar | Barbers | Services           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  NEXT.JS 15 APP (SERVER)                    │
│                                                             │
│  ┌──────────────────────┐  ┌─────────────────────────────┐ │
│  │   App Router Pages   │  │       API Routes            │ │
│  │   (Server/Client)    │  │   /api/appointments         │ │
│  │                      │  │   /api/barbers              │ │
│  │  [locale]/           │  │   /api/services             │ │
│  │  ├─ page.tsx         │  │   /api/availability         │ │
│  │  ├─ booking/         │  │   /api/ai/visualizer        │ │
│  │  ├─ visualizer/      │  │   /api/email                │ │
│  │  └─ admin/           │  │   /api/admin/...            │ │
│  └──────────────────────┘  └─────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Service Layer                       │  │
│  │  lib/supabase/  lib/gemini/  lib/email/  lib/utils   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │                    │                │
    ┌─────────▼────────┐  ┌───────▼──────┐  ┌────▼──────────┐
    │  SUPABASE        │  │  GOOGLE      │  │   RESEND      │
    │  ─ PostgreSQL DB │  │  GEMINI API  │  │   Email API   │
    │  ─ Auth          │  │  (AI images) │  │               │
    │  ─ Storage       │  │              │  │               │
    └──────────────────┘  └──────────────┘  └───────────────┘
```

---

## Request Flow

### 1. Public Page Request
```
Browser → Next.js middleware (locale detection)
        → [locale]/page.tsx (Server Component)
        → Prisma → Supabase DB (fetch barbers, services)
        → Rendered HTML sent to browser
```

### 2. Guest Booking Flow
```
Browser → /booking (Client Component - wizard)
        → Step 1: GET /api/services → show services
        → Step 2: GET /api/barbers → show barbers
        → Step 3: GET /api/availability?barberId&date → show slots
        → Step 4: Client collects name/phone/email
        → Step 5: POST /api/appointments → create booking
               → Send email via Resend (confirmation)
               → Return appointment number to client
```

### 3. AI Visualizer Flow
```
Browser → /visualizer (Client Component)
        → User uploads photo (base64, client-side)
        → User selects hairstyle from catalog
        → POST /api/ai/visualizer
               → Server: validate input (file size, format)
               → Server: call Google Gemini API
               → Server: return generated image URL or base64
        → Display before/after comparison
        → CTA: "Book this look" → redirect to /booking
```

### 4. Admin Authentication Flow
```
Admin → /admin/login
     → POST /api/auth/login (Supabase Auth)
     → Supabase returns JWT token
     → Token stored in httpOnly cookie
     → Next.js middleware checks token on /admin/* routes
     → Redirect to /admin/login if invalid
```

### 5. Admin Appointment Management
```
Admin → /admin (Server Component, protected)
     → GET /api/admin/appointments → Prisma → Supabase DB
     → Admin confirms/cancels appointment
     → PATCH /api/admin/appointments/[id]
            → Update status in DB
            → Send email notification to customer
```

---

## Component Architecture

### Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/[locale]` (landing) | Server Component | SEO, no interactivity |
| `/[locale]/booking` | Client Component | Multi-step wizard, state |
| `/[locale]/visualizer` | Client Component | File upload, real-time AI |
| `/[locale]/admin/**` | Server + Client mix | Auth checks server-side |
| `/api/**` | Route Handlers | Server-only, never client |

### State Management

No external state management library (Redux/Zustand). State is managed by:
- **Server state**: React Server Components + Next.js cache
- **URL state**: Search params for shareable state (booking steps)
- **Local state**: `useState` for wizard steps, form data
- **Session state**: `sessionStorage` for AI visualizer (rate limiting)

---

## Middleware

```typescript
// middleware.ts — runs on every request
// 1. next-intl: detect and validate locale
// 2. Auth: protect /[locale]/admin/* routes
// 3. Rate limiting: protect /api/ai/visualizer
```

---

## Availability Calculation Logic

```
For a given (barberId, date):

1. Get barber's working_hours for that day_of_week
   → if not working: return []

2. Check time_off table for that barberId + date
   → if has time_off: return []

3. Get existing appointments for barberId on that date
   → filter: status NOT IN ['cancelled']
   → extract occupied (start_time, end_time) pairs

4. Generate all possible slots:
   → from working_hours.start_time to working_hours.end_time
   → step = service.duration_minutes
   → exclude slots that overlap with existing appointments

5. Return available slots as string array ["10:00", "10:45", ...]
```

---

## Security Architecture

### Public Routes (no auth needed)
- `GET /api/services`
- `GET /api/barbers`
- `GET /api/availability`
- `POST /api/appointments`
- `POST /api/ai/visualizer`

### Protected Routes (Supabase Auth required)
- All `/api/admin/**` routes → require `role: admin`
- `GET /api/barbers/[id]/schedule` → require authenticated barber
- `PATCH /api/appointments/[id]` → require admin OR the barber assigned

### Rate Limiting
- `/api/ai/visualizer`: max 3 requests per IP per hour
- `/api/appointments` (POST): max 10 requests per IP per hour

---

## File Upload Strategy

### AI Visualizer Photos
- **Client-side only** — converted to base64 in the browser
- **Never stored** — sent directly to Gemini API, not saved anywhere
- **Max 5MB**, JPEG/PNG/WebP only
- **Validated on server** before sending to Gemini

### Barber Photos (Admin Upload)
- Uploaded to **Supabase Storage** bucket `barber-photos`
- Public bucket, CDN-served
- Naming: `barbers/{barberId}/{timestamp}.{ext}`

### Gallery Images (Admin Upload)
- Uploaded to **Supabase Storage** bucket `gallery`
- Public bucket, CDN-served
- Naming: `gallery/{category}/{timestamp}.{ext}`

---

## Environment Variables

See `.env.example` for the full list. Key variables:

```
NEXT_PUBLIC_SUPABASE_URL        ← Supabase project URL (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY   ← Supabase anon key (public)
SUPABASE_SERVICE_ROLE_KEY       ← Supabase admin key (server only, secret)
DATABASE_URL                    ← Prisma connection string (server only, secret)
GEMINI_API_KEY                  ← Google Gemini API key (server only, secret)
RESEND_API_KEY                  ← Resend email API key (server only, secret)
RESEND_FROM_EMAIL               ← Sender email address
NEXTAUTH_SECRET                 ← Session encryption key
```

**Rule: Variables prefixed `NEXT_PUBLIC_` are visible in the browser. Never put secrets there.**
