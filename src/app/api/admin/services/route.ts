import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const CreateServiceSchema = z.object({
  nameHy: z.string().min(1),
  nameRu: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionHy: z.string().optional().default(''),
  descriptionRu: z.string().optional().default(''),
  descriptionEn: z.string().optional().default(''),
  durationMinutes: z.number().min(15).max(240),
  priceAmd: z.number().min(100),
  category: z.enum(['haircut', 'beard', 'styling']),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const adminBarber = await prisma.barber.findFirst({ where: { userId: user.id, role: 'admin' } });
    if (!adminBarber) return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const data = CreateServiceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        ...data,
        isActive: true,
        sortOrder: await prisma.service.count() + 1,
      },
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    console.error('[POST /api/admin/services]', error);
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}
