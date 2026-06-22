import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { sendCancellationEmail } from '@/lib/email/resend';

const UpdateSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'completed', 'no_show']),
  notes: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { barber: true, service: true },
    });
    if (!appointment) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: appointment });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { status, notes } = UpdateSchema.parse(body);

    const timestamps: Record<string, Date> = {};
    if (status === 'confirmed') timestamps.confirmedAt = new Date();
    if (status === 'cancelled') timestamps.cancelledAt = new Date();
    if (status === 'completed') timestamps.completedAt = new Date();

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status, ...(notes ? { notes } : {}), ...timestamps },
      include: { barber: true, service: true },
    });

    if (status === 'cancelled') {
      sendCancellationEmail(appointment).catch(console.error);
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    console.error('[PATCH /api/appointments/:id]', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
