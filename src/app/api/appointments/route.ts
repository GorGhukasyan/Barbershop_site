import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmation } from '@/lib/email/resend';
import { parse, format, addMinutes } from 'date-fns';

const CreateBookingSchema = z.object({
  serviceId: z.string().uuid(),
  barberId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8).max(20),
  clientNotes: z.string().max(500).optional().default(''),
  locale: z.enum(['hy', 'ru', 'en']).default('hy'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateBookingSchema.parse(body);

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    const appointmentDate = parse(data.date, 'yyyy-MM-dd', new Date());
    const startDateTime = parse(data.time, 'HH:mm', appointmentDate);
    const endDateTime = addMinutes(startDateTime, service.durationMinutes);
    const endTime = format(endDateTime, 'HH:mm');

    const conflict = await prisma.appointment.findFirst({
      where: {
        barberId: data.barberId,
        appointmentDate,
        status: { notIn: ['cancelled'] },
        OR: [
          {
            AND: [
              { startTime: { lte: data.time + ':00' } },
              { endTime: { gt: data.time + ':00' } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime + ':00' } },
              { endTime: { gte: endTime + ':00' } },
            ],
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: 'TIME_SLOT_TAKEN' },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        barberId: data.barberId,
        serviceId: data.serviceId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientNotes: data.clientNotes,
        appointmentDate,
        startTime: data.time + ':00',
        endTime: endTime + ':00',
        status: 'pending',
        locale: data.locale,
        appointmentNumber: '',
      },
      include: {
        barber: true,
        service: true,
      },
    });

    sendBookingConfirmation(appointment as unknown as Record<string, unknown>).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        data: {
          appointmentNumber: appointment.appointmentNumber,
          id: appointment.id,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    console.error('[POST /api/appointments]', error);
    return NextResponse.json({ success: false, error: 'Booking failed' }, { status: 500 });
  }
}
