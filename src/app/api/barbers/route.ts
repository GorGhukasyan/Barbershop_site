import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const barbers = await prisma.barber.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { services: { include: { service: true } } },
    });
    return NextResponse.json({ success: true, data: barbers });
  } catch (error) {
    console.error('[GET /api/barbers]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch barbers' }, { status: 500 });
  }
}
