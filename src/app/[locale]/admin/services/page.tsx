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
      </p>

      <div className="space-y-3">
        {services.map(s => (
          <div key={s.id} className="bg-dark-2 border border-gold/15 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-cream font-medium">{s.nameEn}</p>
              <p className="text-cream-muted text-sm">{s.durationMinutes} min · {s.category}</p>
            </div>
            <div className="text-gold font-bold">{formatPrice(s.priceAmd)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
