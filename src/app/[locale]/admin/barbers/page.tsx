import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function BarbersAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const barbers = await prisma.barber.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      services: { include: { service: true } },
      workingHours: { orderBy: { dayOfWeek: 'asc' } },
    },
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-cream">Barbers</h1>
        <Link href={`/${locale}/admin/barbers/add`}>
          <Button>+ Add Barber</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {barbers.map(barber => (
          <Card key={barber.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-dark-3 border-2 border-gold/30 flex items-center justify-center">
                  {barber.photoUrl ? (
                    <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xl text-gold font-serif">{barber.name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-cream font-medium text-lg">{barber.name}</h3>
                  <p className="text-cream-dim text-sm">{barber.slug} · {barber.bioEn || barber.bioHy}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={barber.role === 'admin' ? 'gold' : 'default'}>{barber.role}</Badge>
                <Badge variant={barber.isActive ? 'success' : 'cancelled'}>{barber.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>

            {barber.workingHours.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gold/10">
                <p className="text-cream-dim text-xs uppercase tracking-wider mb-2">Working Hours</p>
                <div className="flex flex-wrap gap-2">
                  {barber.workingHours.map(wh => (
                    <span key={wh.id} className={`text-xs px-2 py-1 rounded ${wh.isWorking ? 'bg-gold/10 text-gold' : 'bg-dark-3 text-cream-dim line-through'}`}>
                      {dayNames[wh.dayOfWeek]} {wh.isWorking ? `${wh.startTime.slice(0,5)}-${wh.endTime.slice(0,5)}` : 'Off'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {barbers.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-cream-muted">No barbers yet</p>
          </Card>
        )}
      </div>

    </div>
  );
}
