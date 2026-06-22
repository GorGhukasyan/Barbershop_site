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

  const STATUS_BADGE: Record<string, 'pending' | 'success' | 'cancelled' | 'gold' | 'default'> = {
    pending: 'pending', confirmed: 'success', cancelled: 'cancelled',
    completed: 'gold', no_show: 'default',
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-serif text-3xl text-cream">{appointment.appointmentNumber}</h1>
        <Badge variant={STATUS_BADGE[appointment.status]}>{appointment.status}</Badge>
      </div>

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

      <AppointmentActions appointment={appointment} />
    </div>
  );
}
