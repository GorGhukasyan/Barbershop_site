import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/availability';
import { parse } from 'date-fns';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const barberId = searchParams.get('barberId');
    const dateStr = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!barberId || !dateStr || !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: barberId, date, serviceId' },
        { status: 400 }
      );
    }

    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isNaN(date.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid date format' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { durationMinutes: true },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    const slots = await getAvailableSlots(barberId, date, service.durationMinutes);

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error('[GET /api/availability]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}
