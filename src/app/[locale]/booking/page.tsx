import { prisma } from '@/lib/prisma';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Header } from '@/components/layout/Header';

export default async function BookingPage() {
  const [services, barbers] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.barber.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <BookingWizard services={services} barbers={barbers} />
      </main>
    </>
  );
}
