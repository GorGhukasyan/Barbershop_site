# GA BARBER SHOP

A professional barbershop website with online booking, AI hairstyle visualization, and an admin dashboard. Built with Next.js, Supabase, and Google Gemini API.

## Features

- **Landing Page** — Beautiful dark-themed homepage with services, barbers, working hours, and contact form
- **Online Booking** — 5-step booking wizard (choose service, barber, date/time, contact info, confirm)
- **AI Hairstyle Visualizer** — Upload a selfie, pick a hairstyle, see AI-generated preview of your new look
- **Admin Dashboard** — Manage appointments, view earnings (today & monthly), calendar view, add barbers & services
- **Multilingual** — Armenian, Russian, English
- **Mobile Responsive** — Works on all devices

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) |
| **TypeScript** | Type-safe code |
| **Tailwind CSS** | Styling |
| **Supabase** | Database (PostgreSQL) + Authentication |
| **Prisma** | ORM for database queries |
| **Google Gemini API** | AI hairstyle generation |
| **next-intl** | Internationalization (i18n) |
| **Resend** | Email notifications (optional) |

## Screenshots

### Homepage
Dark elegant design with gold accents — services, barbers, contact form

### Booking System
Step-by-step booking: Service > Barber > Date/Time > Contact > Confirm

### AI Visualizer
Upload photo > Choose hairstyle > See AI-generated result

### Admin Dashboard
Appointments, earnings, calendar view, barber & service management

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (free)
- Google AI Studio API key (free)

### Setup

1. **Clone the repo**
```bash
git clone https://github.com/GorGhukasyan/Barbershop_site.git
cd Barbershop_site
npm install
```

2. **Create Supabase project** at [supabase.com](https://supabase.com)

3. **Create database tables** — Run the SQL from `docs/DATABASE-DESIGN.md` in Supabase SQL Editor

4. **Create `.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_api_key
```

5. **Generate Prisma client**
```bash
npx prisma generate
```

6. **Run the dev server**
```bash
npm run dev
```

7. Open **http://localhost:3000/hy**

### Create Admin User
1. Go to Supabase Dashboard > Authentication > Add User
2. Copy the User UUID
3. Run in SQL Editor:
```sql
INSERT INTO barbers (user_id, name, slug, role, is_active, sort_order)
VALUES ('YOUR-UUID', 'Your Name', 'your-name', 'admin', true, 1);
```
4. Login at **http://localhost:3000/hy/admin/login**

## Project Structure

```
src/
  app/
    [locale]/            All pages (Armenian/Russian/English)
      page.tsx           Landing page
      booking/           Booking wizard
      visualizer/        AI hairstyle tool
      admin/             Admin panel (protected)
    api/                 API routes
  components/            React components
  lib/                   Utilities, database, AI clients
  hooks/                 Custom React hooks
  i18n/                  Internationalization config
```

## License

This project is proprietary. All rights reserved.

## Author

Built by **Gor Ghukasyan** with AI assistance from Claude (Anthropic).
