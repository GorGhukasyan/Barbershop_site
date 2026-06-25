import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function ServicesAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-cream">Services</h1>
        <Link href={`/${locale}/admin/services/add`}>
          <Button>+ Add Service</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {services.map(s => (
          <div key={s.id} className="bg-dark-2 border border-gold/15 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-cream font-medium">{s.nameEn} / {s.nameHy}</p>
              <p className="text-cream-muted text-sm">{s.durationMinutes} min · {s.category}</p>
            </div>
            <div className="text-gold font-bold">{formatPrice(s.priceAmd)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
