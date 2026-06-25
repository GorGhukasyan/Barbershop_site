import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { format, startOfMonth, endOfMonth, addDays, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { CalendarView } from '@/components/admin/CalendarView';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/admin/login`);

  const barber = await prisma.barber.findFirst({
    where: { userId: user.id },
    select: { id: true, role: true, name: true },
  });

  if (!barber) redirect(`/${locale}/admin/login`);

  const now = new Date();
  const armeniaOffset = 4 * 60;
  const armeniaTime = new Date(now.getTime() + (armeniaOffset + now.getTimezoneOffset()) * 60000);
  const today = startOfDay(armeniaTime);
  const tomorrow = addDays(today, 1);
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const barberFilter = barber.role !== 'admin' ? { barberId: barber.id } : {};

  const [todayAppointments, pendingCount, monthAppointments, upcomingAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: { appointmentDate: { gte: today, lt: tomorrow }, ...barberFilter },
      include: { barber: true, service: true },
      orderBy: { startTime: 'asc' },
    }),
    prisma.appointment.count({
      where: { appointmentDate: { gte: today, lt: tomorrow }, status: 'pending', ...barberFilter },
    }),
    prisma.appointment.findMany({
      where: {
        appointmentDate: { gte: monthStart, lte: monthEnd },
        status: { notIn: ['cancelled'] },
        ...barberFilter,
      },
      include: { service: true },
    }),
    prisma.appointment.findMany({
      where: {
        appointmentDate: { gte: today, lt: addDays(today, 30) },
        status: { notIn: ['cancelled'] },
        ...barberFilter,
      },
      include: { barber: true, service: true },
      orderBy: [{ appointmentDate: 'asc' }, { startTime: 'asc' }],
    }),
  ]);

  const todayEarnings = todayAppointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.service.priceAmd, 0);

  const monthEarnings = monthAppointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.service.priceAmd, 0);

  const monthTotal = monthAppointments.length;

  const STATUS_BADGE: Record<string, 'pending' | 'success' | 'cancelled' | 'gold' | 'default'> = {
    pending: 'pending', confirmed: 'success', cancelled: 'cancelled',
    completed: 'gold', no_show: 'default',
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-cream mb-2">Dashboard</h1>
      <p className="text-cream-muted text-sm mb-8">{format(today, 'EEEE, MMMM d, yyyy')}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-cream-dim text-xs uppercase tracking-wider mb-1">Today</p>
          <div className="font-serif text-3xl text-gold font-bold">{todayAppointments.length}</div>
          <p className="text-cream-muted text-sm mt-1">Appointments</p>
        </Card>
        <Card>
          <p className="text-cream-dim text-xs uppercase tracking-wider mb-1">Pending</p>
          <div className="font-serif text-3xl text-yellow-400 font-bold">{pendingCount}</div>
          <p className="text-cream-muted text-sm mt-1">Need confirmation</p>
        </Card>
        <Card className="border-green-800/30">
          <p className="text-cream-dim text-xs uppercase tracking-wider mb-1">Today Earned</p>
          <div className="font-serif text-3xl text-green-400 font-bold">{formatPrice(todayEarnings)}</div>
          <p className="text-cream-muted text-sm mt-1">{todayAppointments.filter(a => a.status === 'completed').length} completed</p>
        </Card>
        <Card className="border-green-800/30">
          <p className="text-cream-dim text-xs uppercase tracking-wider mb-1">This Month</p>
          <div className="font-serif text-3xl text-green-400 font-bold">{formatPrice(monthEarnings)}</div>
          <p className="text-cream-muted text-sm mt-1">{monthTotal} total bookings</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-serif text-xl text-cream mb-4">Today&apos;s Schedule</h2>
          {todayAppointments.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-cream-muted">No appointments today</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map(appt => (
                <Card key={appt.id} hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[50px]">
                        <div className="font-mono text-gold text-lg font-bold">{appt.startTime.slice(0,5)}</div>
                        <div className="text-cream-dim text-xs">{appt.endTime.slice(0,5)}</div>
                      </div>
                      <div>
                        <p className="text-cream font-medium">{appt.clientName}</p>
                        <p className="text-cream-muted text-sm">{appt.service.nameHy} · {appt.barber.name}</p>
                        <p className="text-cream-dim text-xs">{appt.clientPhone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-gold font-medium">{formatPrice(appt.service.priceAmd)}</span>
                      <Badge variant={STATUS_BADGE[appt.status]}>{appt.status}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-serif text-xl text-cream mb-4">Upcoming (30 days)</h2>
          <CalendarView appointments={upcomingAppointments.map(a => ({
            id: a.id,
            date: a.appointmentDate.toISOString(),
            time: a.startTime.slice(0, 5),
            clientName: a.clientName,
            serviceName: a.service.nameHy,
            barberName: a.barber.name,
            status: a.status,
            price: a.service.priceAmd,
          }))} />
        </div>
      </div>
    </div>
  );
}
