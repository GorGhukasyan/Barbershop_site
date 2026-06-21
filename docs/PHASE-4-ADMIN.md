# PHASE-4-ADMIN.md — Admin Panel

> **Prerequisite**: Phases 0–3 complete. Booking + AI Visualizer work.
> **Goal**: Owner and barbers can manage all appointments, schedules, and shop settings.

---

## Admin Panel Overview

```
/admin/login          ← Supabase Auth login
/admin                ← Dashboard (today's appointments, stats)
/admin/appointments   ← All appointments (filter/search)
/admin/appointments/[id] ← Single appointment detail + actions
/admin/barbers        ← Barber management
/admin/barbers/[id]   ← Edit barber + working hours + time-off
/admin/services       ← Service pricing & duration management
```

**Permission levels:**
- `admin` (owner Gor): full access to all routes
- `barber`: can only see `/admin` (their own daily schedule) + their appointments

---

## Task 4.1 — Create Admin/Barber Users in Supabase

**Do this FIRST (manual step in Supabase Dashboard):**

1. Go to **Supabase Dashboard → Authentication → Users → Add user**
2. Create user for each barber and the owner
3. Note the UUID for each user
4. Run in SQL Editor:

```sql
-- Insert owner (admin)
INSERT INTO barbers (user_id, name, slug, bio_hy, bio_ru, bio_en, role, is_active, sort_order)
VALUES (
  '<OWNER_AUTH_UUID>',
  'Gor',
  'gor',
  'GA BARBER SHOP-ի հիմնադիրը',
  'Основатель GA BARBER SHOP',
  'Founder of GA BARBER SHOP',
  'admin',
  true,
  1
);

-- Insert working hours for owner (Mon=1 to Sat=6 work, Sun=0 off)
INSERT INTO working_hours (barber_id, day_of_week, start_time, end_time, is_working)
SELECT id, unnest(ARRAY[1,2,3,4,5]), '10:00:00', '20:00:00', true
FROM barbers WHERE slug = 'gor';

INSERT INTO working_hours (barber_id, day_of_week, start_time, end_time, is_working)
SELECT id, unnest(ARRAY[6]), '11:00:00', '18:00:00', true
FROM barbers WHERE slug = 'gor';

INSERT INTO working_hours (barber_id, day_of_week, start_time, end_time, is_working)
SELECT id, 0, '11:00:00', '18:00:00', false
FROM barbers WHERE slug = 'gor';

-- Repeat for other barbers with their AUTH UUIDs
```

---

## Task 4.2 — Auth Middleware Helper

Create `src/lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /[locale]/admin/* routes (except /admin/login)
  const url = request.nextUrl;
  const isAdminRoute = url.pathname.includes('/admin') && !url.pathname.includes('/admin/login');

  if (isAdminRoute && !user) {
    const locale = url.pathname.split('/')[1] || 'hy';
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  return supabaseResponse;
}
```

Update root `middleware.ts` to also handle auth:
```typescript
import createNextIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';
import { routing } from './src/i18n/routing';

const intlMiddleware = createNextIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Handle auth first for admin routes
  if (request.nextUrl.pathname.includes('/admin')) {
    return updateSession(request);
  }
  // Handle i18n for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

---

## Task 4.3 — Admin Auth Hook

Create `src/hooks/useAuth.ts`:
```typescript
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  barberId: string;
  barberName: string;
  role: 'admin' | 'barber';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setUser(null); setLoading(false); return; }

      const { data: barber } = await supabase
        .from('barbers')
        .select('id, name, role')
        .eq('user_id', authUser.id)
        .single();

      if (barber) {
        setUser({ id: authUser.id, email: authUser.email!, barberId: barber.id, barberName: barber.name, role: barber.role });
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/hy/admin/login';
  }

  return { user, loading, signOut };
}
```

---

## Task 4.4 — Admin Login Page

Create `src/app/[locale]/admin/login/page.tsx`:
```typescript
'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    router.push(`/${locale}/admin`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-1">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-dark font-bold text-xl mx-auto mb-4">
            GA
          </div>
          <h1 className="font-serif text-2xl text-cream">Admin Login</h1>
          <p className="text-cream-muted text-sm mt-1">GA BARBER SHOP</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-cream-muted text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark-2 border border-gold/20 rounded-xl px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-cream-muted text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-dark-2 border border-gold/20 rounded-xl px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## Task 4.5 — Admin Layout (Protected)

Create `src/app/[locale]/admin/layout.tsx`:
```typescript
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/admin/login`);

  // Get barber info
  const barber = await prisma.barber.findFirst({
    where: { userId: user.id, isActive: true },
  });

  if (!barber) redirect(`/${locale}/admin/login`);

  return (
    <div className="flex min-h-screen bg-dark-1">
      <AdminSidebar barberName={barber.name} role={barber.role} locale={locale} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
```

---

## Task 4.6 — Admin Sidebar

Create `src/components/admin/AdminSidebar.tsx`:
```typescript
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface Props {
  barberName: string;
  role: string;
  locale: string;
}

export function AdminSidebar({ barberName, role, locale }: Props) {
  const pathname = usePathname();
  const isAdmin = role === 'admin';

  const links = [
    { href: `/${locale}/admin`, label: '📊 Dashboard', adminOnly: false },
    { href: `/${locale}/admin/appointments`, label: '📅 Appointments', adminOnly: false },
    ...(isAdmin ? [
      { href: `/${locale}/admin/barbers`, label: '👤 Barbers', adminOnly: true },
      { href: `/${locale}/admin/services`, label: '✂️ Services', adminOnly: true },
    ] : []),
  ];

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}/admin/login`;
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-2 border-r border-gold/15 flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-gold/15">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-dark font-bold text-sm">GA</div>
          <div>
            <p className="text-cream font-medium text-sm">{barberName}</p>
            <p className="text-cream-dim text-xs capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
              pathname === link.href
                ? 'bg-gold/20 text-gold'
                : 'text-cream-muted hover:text-cream hover:bg-dark-3'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-gold/15">
        <button
          onClick={signOut}
          className="w-full text-left px-4 py-3 text-cream-muted hover:text-red-400 text-sm rounded-xl hover:bg-dark-3 transition-all"
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
```

---

## Task 4.7 — Admin Dashboard

Create `src/app/[locale]/admin/page.tsx`:
```typescript
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const barber = await prisma.barber.findFirst({
    where: { userId: user!.id },
    select: { id: true, role: true, name: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's appointments
  const whereClause = barber?.role === 'admin'
    ? { appointmentDate: { gte: today, lt: tomorrow } }
    : { appointmentDate: { gte: today, lt: tomorrow }, barberId: barber?.id };

  const [todayAppointments, pendingCount, totalThisMonth] = await Promise.all([
    prisma.appointment.findMany({
      where: whereClause,
      include: { barber: true, service: true },
      orderBy: { startTime: 'asc' },
    }),
    prisma.appointment.count({ where: { ...whereClause, status: 'pending' } }),
    prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        },
        status: { notIn: ['cancelled'] },
        ...(barber?.role !== 'admin' ? { barberId: barber?.id } : {}),
      },
    }),
  ]);

  const STATUS_BADGE: Record<string, any> = {
    pending: 'pending', confirmed: 'success', cancelled: 'cancelled',
    completed: 'gold', no_show: 'default',
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-cream mb-2">Dashboard</h1>
      <p className="text-cream-muted text-sm mb-8">
        {format(today, 'EEEE, MMMM d, yyyy')}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Today's Appointments", value: todayAppointments.length, icon: '📅' },
          { label: 'Pending Confirmation', value: pendingCount, icon: '⏳' },
          { label: 'This Month', value: totalThisMonth, icon: '📊' },
        ].map(stat => (
          <div key={stat.label} className="bg-dark-2 border border-gold/20 rounded-2xl p-6">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="font-serif text-4xl text-gold font-bold">{stat.value}</div>
            <div className="text-cream-muted text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <h2 className="font-serif text-xl text-cream mb-4">Today's Schedule</h2>

      {todayAppointments.length === 0 ? (
        <div className="bg-dark-2 border border-gold/15 rounded-2xl p-12 text-center">
          <p className="text-cream-muted">No appointments today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todayAppointments.map(appt => (
            <div key={appt.id} className="bg-dark-2 border border-gold/15 rounded-2xl p-5 flex items-center justify-between hover:border-gold/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-mono text-gold text-lg font-bold">{appt.startTime.slice(0,5)}</div>
                  <div className="text-cream-dim text-xs">{appt.endTime.slice(0,5)}</div>
                </div>
                <div>
                  <p className="text-cream font-medium">{appt.clientName}</p>
                  <p className="text-cream-muted text-sm">{appt.service.nameEn} · {appt.barber.name}</p>
                  <p className="text-cream-dim text-xs">{appt.clientPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-gold font-medium">{formatPrice(appt.service.priceAmd)}</div>
                <Badge variant={STATUS_BADGE[appt.status]}>{appt.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Task 4.8 — Appointments Management Page

Create `src/app/[locale]/admin/appointments/page.tsx`:
```typescript
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

interface Props {
  searchParams: Promise<{ status?: string; date?: string; barber?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function AppointmentsPage({ searchParams, params }: Props) {
  const { locale } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const barber = await prisma.barber.findFirst({
    where: { userId: user!.id },
    select: { id: true, role: true },
  });

  const where: any = {};
  if (barber?.role !== 'admin') where.barberId = barber?.id;
  if (filters.status) where.status = filters.status;

  const appointments = await prisma.appointment.findMany({
    where,
    include: { barber: true, service: true },
    orderBy: [{ appointmentDate: 'desc' }, { startTime: 'asc' }],
    take: 100,
  });

  const STATUS_BADGE: Record<string, any> = {
    pending: 'pending', confirmed: 'success', cancelled: 'cancelled',
    completed: 'gold', no_show: 'default',
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-cream mb-8">Appointments</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <Link
            key={s}
            href={s === 'all' ? `/${locale}/admin/appointments` : `/${locale}/admin/appointments?status=${s}`}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              (filters.status ?? 'all') === s
                ? 'bg-gold text-dark border-gold'
                : 'border-gold/20 text-cream-muted hover:border-gold/50'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2">
        {appointments.map(appt => (
          <Link
            key={appt.id}
            href={`/${locale}/admin/appointments/${appt.id}`}
            className="flex items-center justify-between p-5 bg-dark-2 border border-gold/15 rounded-2xl hover:border-gold/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div>
                <span className="text-cream-dim text-xs">{appt.appointmentNumber}</span>
                <p className="text-cream font-medium">{appt.clientName}</p>
                <p className="text-cream-muted text-sm">
                  {format(new Date(appt.appointmentDate), 'MMM d')} at {appt.startTime.slice(0,5)} · {appt.service.nameEn} · {appt.barber.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gold text-sm">{formatPrice(appt.service.priceAmd)}</span>
              <Badge variant={STATUS_BADGE[appt.status]}>{appt.status}</Badge>
            </div>
          </Link>
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-12 text-cream-muted">No appointments found</div>
        )}
      </div>
    </div>
  );
}
```

---

## Task 4.9 — Appointment Detail & Actions

Create `src/app/[locale]/admin/appointments/[id]/page.tsx`:
```typescript
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { AppointmentActions } from '@/components/admin/AppointmentActions';
import { formatPrice } from '@/lib/utils';

interface Props { params: Promise<{ id: string; locale: string }> }

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { barber: true, service: true },
  });

  if (!appointment) notFound();

  const STATUS_BADGE: Record<string, any> = {
    pending: 'pending', confirmed: 'success', cancelled: 'cancelled',
    completed: 'gold', no_show: 'default',
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-serif text-3xl text-cream">{appointment.appointmentNumber}</h1>
        <Badge variant={STATUS_BADGE[appointment.status]}>{appointment.status}</Badge>
      </div>

      {/* Details Grid */}
      <div className="bg-dark-2 border border-gold/20 rounded-2xl p-6 space-y-4 mb-6">
        {[
          { label: 'Client', value: appointment.clientName },
          { label: 'Email', value: appointment.clientEmail },
          { label: 'Phone', value: appointment.clientPhone },
          { label: 'Service', value: `${appointment.service.nameEn} — ${formatPrice(appointment.service.priceAmd)}` },
          { label: 'Barber', value: appointment.barber.name },
          { label: 'Date', value: format(new Date(appointment.appointmentDate), 'EEEE, MMMM d, yyyy') },
          { label: 'Time', value: `${appointment.startTime.slice(0,5)} – ${appointment.endTime.slice(0,5)}` },
          { label: 'Booked via', value: appointment.locale.toUpperCase() },
          ...(appointment.clientNotes ? [{ label: 'Client notes', value: appointment.clientNotes }] : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start">
            <span className="text-cream-muted text-sm">{label}</span>
            <span className="text-cream text-sm text-right max-w-xs">{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <AppointmentActions appointment={appointment} />
    </div>
  );
}
```

Create `src/components/admin/AppointmentActions.tsx`:
```typescript
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function AppointmentActions({ appointment }: { appointment: any }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus(status: string) {
    setLoading(status);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (['completed', 'cancelled'].includes(appointment.status)) {
    return (
      <p className="text-cream-dim text-sm text-center">
        This appointment is {appointment.status} and cannot be changed.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {appointment.status === 'pending' && (
        <Button
          onClick={() => updateStatus('confirmed')}
          loading={loading === 'confirmed'}
        >
          ✅ Confirm
        </Button>
      )}

      {['pending', 'confirmed'].includes(appointment.status) && (
        <Button
          onClick={() => updateStatus('completed')}
          variant="outline"
          loading={loading === 'completed'}
        >
          ✓ Mark Complete
        </Button>
      )}

      {['pending', 'confirmed'].includes(appointment.status) && (
        <Button
          onClick={() => {
            if (confirm('Cancel this appointment? Customer will be notified.')) {
              updateStatus('cancelled');
            }
          }}
          variant="danger"
          loading={loading === 'cancelled'}
        >
          ✕ Cancel
        </Button>
      )}
    </div>
  );
}
```

---

## Task 4.10 — Appointment Update API Route

Create `src/app/api/appointments/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { sendCancellationEmail } from '@/lib/email/resend';

const UpdateSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'completed', 'no_show']),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { barber: true, service: true },
    });
    if (!appointment) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { status, notes } = UpdateSchema.parse(body);

    const timestamps: any = {};
    if (status === 'confirmed') timestamps.confirmedAt = new Date();
    if (status === 'cancelled') timestamps.cancelledAt = new Date();
    if (status === 'completed') timestamps.completedAt = new Date();

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status, notes, ...timestamps },
      include: { barber: true, service: true },
    });

    // Send cancellation email
    if (status === 'cancelled') {
      sendCancellationEmail(appointment).catch(console.error);
    }

    return NextResponse.json({ success: true, data: appointment });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('[PATCH /api/appointments/:id]', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
```

---

## Task 4.11 — Services Management (Admin Only)

Create `src/app/[locale]/admin/services/page.tsx`:
```typescript
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-cream mb-8">Services</h1>
      <p className="text-cream-muted text-sm mb-6">
        Edit prices and durations in Supabase Dashboard for now.
        Service editing UI will be added in a future update.
      </p>

      <div className="space-y-3">
        {services.map(s => (
          <div key={s.id} className="bg-dark-2 border border-gold/15 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-cream font-medium">{s.nameEn} / {s.nameHy} / {s.nameRu}</p>
              <p className="text-cream-muted text-sm">{s.durationMinutes} min · {s.category}</p>
            </div>
            <div className="text-gold font-bold">{formatPrice(s.priceAmd)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Phase 4 Verification

- [ ] Admin login page works at `/hy/admin/login`
- [ ] Login with Supabase Auth credentials succeeds
- [ ] Admin redirected to `/hy/admin` dashboard after login
- [ ] Dashboard shows today's appointments from DB
- [ ] Non-admin barber can log in and sees their appointments only
- [ ] `/hy/admin/appointments` shows all appointments
- [ ] Clicking an appointment opens detail page
- [ ] "Confirm" button changes status to confirmed
- [ ] "Cancel" sends email to customer
- [ ] "Mark Complete" marks appointment as completed
- [ ] Signing out redirects to login page
- [ ] Accessing `/hy/admin` without auth redirects to login

**If all pass → Phase 4 complete. Move to PHASE-5-POLISH.md.**
