import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{ status?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function AppointmentsPage({ searchParams, params }: Props) {
  const { locale } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/admin/login`);

  const barber = await prisma.barber.findFirst({
    where: { userId: user.id },
    select: { id: true, role: true },
  });

  if (!barber) redirect(`/${locale}/admin/login`);

  const where: Record<string, unknown> = {};
  if (barber.role !== 'admin') where.barberId = barber.id;
  if (filters.status) where.status = filters.status;

  const appointments = await prisma.appointment.findMany({
    where,
    include: { barber: true, service: true },
    orderBy: [{ appointmentDate: 'desc' }, { startTime: 'asc' }],
    take: 100,
  });

  const STATUS_BADGE: Record<string, 'pending' | 'success' | 'cancelled' | 'gold' | 'default'> = {
    pending: 'pending', confirmed: 'success', cancelled: 'cancelled',
    completed: 'gold', no_show: 'default',
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-cream mb-8">Appointments</h1>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <Link
            key={s}
            href={s === 'all' ? `/${locale}/admin/appointments` : `/${locale}/admin/appointments?status=${s}`}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              (filters.status ?? (s === 'all' ? undefined : '')) === (s === 'all' ? undefined : s)
                ? 'bg-gold text-dark border-gold'
                : 'border-gold/20 text-cream-muted hover:border-gold/50'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {appointments.map(appt => (
          <Link
            key={appt.id}
            href={`/${locale}/admin/appointments/${appt.id}`}
            className="flex items-center justify-between p-5 bg-dark-2 border border-gold/15 rounded-2xl hover:border-gold/40 transition-all"
          >
            <div>
              <span className="text-cream-dim text-xs">{appt.appointmentNumber}</span>
              <p className="text-cream font-medium">{appt.clientName}</p>
              <p className="text-cream-muted text-sm">
                {format(new Date(appt.appointmentDate), 'MMM d')} at {appt.startTime.slice(0,5)} · {appt.service.nameEn} · {appt.barber.name}
              </p>
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
