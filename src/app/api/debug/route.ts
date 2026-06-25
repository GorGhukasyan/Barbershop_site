import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, addDays } from 'date-fns';

export async function GET() {
  const now = new Date();
  const armeniaOffset = 4 * 60;
  const armeniaTime = new Date(now.getTime() + (armeniaOffset + now.getTimezoneOffset()) * 60000);
  const today = startOfDay(armeniaTime);
  const tomorrow = addDays(today, 1);

  const todayAppts = await prisma.appointment.findMany({
    where: { appointmentDate: { gte: today, lt: tomorrow } },
    include: { service: true },
  });

  return NextResponse.json({
    serverNow: now.toISOString(),
    timezoneOffset: now.getTimezoneOffset(),
    armeniaTime: armeniaTime.toISOString(),
    todayStart: today.toISOString(),
    tomorrowStart: tomorrow.toISOString(),
    todayAppointmentsCount: todayAppts.length,
    todayAppointments: todayAppts.map(a => ({
      client: a.clientName,
      date: a.appointmentDate.toISOString(),
      status: a.status,
      price: a.service.priceAmd,
    })),
  });
}
