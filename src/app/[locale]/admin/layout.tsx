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

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const barber = await prisma.barber.findFirst({
        where: { userId: user.id, isActive: true },
      });

      if (barber) {
        return (
          <div className="min-h-screen bg-dark">
            <AdminSidebar barberName={barber.name} role={barber.role} locale={locale} />
            <main className="p-8 pt-16">
              {children}
            </main>
          </div>
        );
      }
    }
  } catch {
    // Auth check failed, show without sidebar
  }

  return <div className="min-h-screen bg-dark">{children}</div>;
}
