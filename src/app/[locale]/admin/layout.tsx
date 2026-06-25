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

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <>{children}</>;

    const barber = await prisma.barber.findFirst({
      where: { userId: user.id, isActive: true },
    });

    if (!barber) return <>{children}</>;

    return (
      <div className="flex min-h-screen bg-dark">
        <AdminSidebar barberName={barber.name} role={barber.role} locale={locale} />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    );
  } catch {
    return <>{children}</>;
  }
}
