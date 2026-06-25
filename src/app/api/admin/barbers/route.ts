import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const CreateBarberSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  bioHy: z.string().optional().default(''),
  bioRu: z.string().optional().default(''),
  bioEn: z.string().optional().default(''),
  role: z.enum(['admin', 'barber']).default('barber'),
  specialties: z.array(z.string()).optional().default([]),
  workingHours: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isWorking: z.boolean(),
  })).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const adminBarber = await prisma.barber.findFirst({ where: { userId: user.id, role: 'admin' } });
    if (!adminBarber) return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const data = CreateBarberSchema.parse(body);

    const barber = await prisma.barber.create({
      data: {
        name: data.name,
        slug: data.slug,
        bioHy: data.bioHy,
        bioRu: data.bioRu,
        bioEn: data.bioEn,
        role: data.role,
        specialties: data.specialties,
        isActive: true,
        sortOrder: await prisma.barber.count() + 1,
      },
    });

    if (data.workingHours.length > 0) {
      await prisma.workingHour.createMany({
        data: data.workingHours.map(wh => ({
          barberId: barber.id,
          dayOfWeek: wh.dayOfWeek,
          startTime: wh.startTime,
          endTime: wh.endTime,
          isWorking: wh.isWorking,
        })),
      });
    }

    return NextResponse.json({ success: true, data: barber }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    console.error('[POST /api/admin/barbers]', error);
    return NextResponse.json({ success: false, error: 'Failed to create barber' }, { status: 500 });
  }
}
