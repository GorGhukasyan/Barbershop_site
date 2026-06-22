import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { ServicesSection } from '@/components/home/ServicesSection';
import { BarbersSection } from '@/components/home/BarbersSection';
import { VisualizerTeaser } from '@/components/home/VisualizerTeaser';
import { HoursSection } from '@/components/home/HoursSection';
import { ContactSection } from '@/components/home/ContactSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: 'GA BARBER SHOP',
      locale: locale === 'hy' ? 'hy_AM' : locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
    },
    alternates: {
      languages: {
        'hy-AM': '/hy',
        'ru-RU': '/ru',
        'en-US': '/en',
      },
    },
  };
}

export default async function HomePage() {
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
      <main className="pt-16">
        <Hero />
        <ServicesSection services={services} />
        <BarbersSection barbers={barbers} />
        <VisualizerTeaser />
        <HoursSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
