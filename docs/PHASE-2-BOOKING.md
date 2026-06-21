# PHASE-2-BOOKING.md — Booking System

> **Prerequisite**: Phase 1 complete. Landing page renders with real data.
> **Goal**: Guests can complete a full 5-step booking without creating an account.

---

## Booking Flow Overview

```
Step 1: Choose Service   → (shows price + duration)
Step 2: Choose Barber    → (or "Any Available")
Step 3: Choose Date/Time → (real availability from DB)
Step 4: Enter Contact    → (name, phone, email)
Step 5: Confirm & Book   → (summary → submit → success page)
```

---

## Task 2.1 — Availability Algorithm

Create `src/lib/availability.ts`:
```typescript
import { prisma } from '@/lib/prisma';
import { addMinutes, format, parse, isAfter, isBefore } from 'date-fns';

export interface TimeSlot {
  time: string;    // "10:00"
  endTime: string; // "10:45"
  available: boolean;
}

export async function getAvailableSlots(
  barberId: string,
  date: Date,
  serviceDurationMinutes: number
): Promise<TimeSlot[]> {

  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ...

  // 1. Get working hours for this barber on this weekday
  const workingHours = await prisma.workingHour.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
  });

  if (!workingHours || !workingHours.isWorking) return [];

  // 2. Check if barber has time off on this date
  const dateStr = format(date, 'yyyy-MM-dd');
  const timeOff = await prisma.timeOff.findUnique({
    where: { barberId_date: { barberId, date } },
  });

  if (timeOff) return [];

  // 3. Get existing appointments for this barber on this date
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      appointmentDate: date,
      status: { notIn: ['cancelled'] },
    },
    select: { startTime: true, endTime: true },
  });

  // 4. Generate all possible slots
  const slots: TimeSlot[] = [];
  const workStart = parse(workingHours.startTime, 'HH:mm:ss', date);
  const workEnd = parse(workingHours.endTime, 'HH:mm:ss', date);
  const slotDuration = serviceDurationMinutes;

  let current = workStart;

  while (isBefore(addMinutes(current, slotDuration), workEnd) ||
         format(addMinutes(current, slotDuration), 'HH:mm') === format(workEnd, 'HH:mm')) {

    const slotStart = current;
    const slotEnd = addMinutes(current, slotDuration);

    // Check if slot overlaps with any existing appointment
    const isOccupied = appointments.some((appt) => {
      const apptStart = parse(appt.startTime, 'HH:mm:ss', date);
      const apptEnd = parse(appt.endTime, 'HH:mm:ss', date);
      return isBefore(slotStart, apptEnd) && isAfter(slotEnd, apptStart);
    });

    // Skip past slots (if date is today)
    const now = new Date();
    const isPast = isBefore(slotStart, now) && format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

    slots.push({
      time: format(slotStart, 'HH:mm'),
      endTime: format(slotEnd, 'HH:mm'),
      available: !isOccupied && !isPast,
    });

    current = addMinutes(current, slotDuration);
    if (isAfter(current, workEnd)) break;
  }

  return slots;
}
```

---

## Task 2.2 — Availability API Route

Create `src/app/api/availability/route.ts`:
```typescript
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

    // Validate date format
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isNaN(date.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid date format' }, { status: 400 });
    }

    // Get service duration
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
```

---

## Task 2.3 — Appointments API Route

Create `src/app/api/appointments/route.ts`:
```typescript
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

    // Get service to calculate end time
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    // Calculate end time
    const appointmentDate = parse(data.date, 'yyyy-MM-dd', new Date());
    const startDateTime = parse(data.time, 'HH:mm', appointmentDate);
    const endDateTime = addMinutes(startDateTime, service.durationMinutes);
    const endTime = format(endDateTime, 'HH:mm');

    // Double-check slot is still available (race condition protection)
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

    // Create appointment (appointment_number auto-generated by DB trigger)
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
        appointmentNumber: '', // will be set by trigger
      },
      include: {
        barber: true,
        service: true,
      },
    });

    // Send confirmation email (non-blocking)
    sendBookingConfirmation(appointment).catch(console.error);

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
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('[POST /api/appointments]', error);
    return NextResponse.json({ success: false, error: 'Booking failed' }, { status: 500 });
  }
}
```

---

## Task 2.4 — Email Setup

Create `src/lib/email/resend.ts`:
```typescript
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(appointment: any) {
  const locale = appointment.locale ?? 'hy';

  const subjects = {
    hy: `✅ Ամրագրումը հաստատված է — ${appointment.appointmentNumber}`,
    ru: `✅ Запись подтверждена — ${appointment.appointmentNumber}`,
    en: `✅ Booking Confirmed — ${appointment.appointmentNumber}`,
  };

  const messages = {
    hy: `Բարև ${appointment.clientName},\n\nՁեր ամրագրումը GA BARBER SHOP-ում հաստատված է:\n\n📋 Ամրագրման կոդ: ${appointment.appointmentNumber}\n✂️ Ծառայություն: ${appointment.service.nameHy}\n👤 Վարսավիր: ${appointment.barber.name}\n📅 Ամսաթիվ: ${appointment.appointmentDate.toLocaleDateString('hy-AM')}\n🕐 Ժամ: ${appointment.startTime.slice(0,5)}\n\nՀասցե: Totovents 1/2, Nor Nork, Yerevan\n📞 +374 77 06 01 32\n\nՇնորհակալ ենք!`,
    ru: `Здравствуйте ${appointment.clientName},\n\nВаша запись в GA BARBER SHOP подтверждена:\n\n📋 Код записи: ${appointment.appointmentNumber}\n✂️ Услуга: ${appointment.service.nameRu}\n👤 Мастер: ${appointment.barber.name}\n📅 Дата: ${appointment.appointmentDate.toLocaleDateString('ru-RU')}\n🕐 Время: ${appointment.startTime.slice(0,5)}\n\nАдрес: Totovents 1/2, Nor Nork, Yerevan\n📞 +374 77 06 01 32\n\nСпасибо!`,
    en: `Hello ${appointment.clientName},\n\nYour booking at GA BARBER SHOP is confirmed:\n\n📋 Booking #: ${appointment.appointmentNumber}\n✂️ Service: ${appointment.service.nameEn}\n👤 Barber: ${appointment.barber.name}\n📅 Date: ${appointment.appointmentDate.toLocaleDateString('en-US')}\n🕐 Time: ${appointment.startTime.slice(0,5)}\n\nAddress: Totovents 1/2, Nor Nork, Yerevan\n📞 +374 77 06 01 32\n\nThank you!`,
  };

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: appointment.clientEmail,
    subject: subjects[locale as keyof typeof subjects],
    text: messages[locale as keyof typeof messages],
  });
}

export async function sendCancellationEmail(appointment: any) {
  const locale = appointment.locale ?? 'hy';

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: appointment.clientEmail,
    subject: `❌ Booking Cancelled — ${appointment.appointmentNumber}`,
    text: `Your appointment ${appointment.appointmentNumber} has been cancelled. Please contact us to reschedule.`,
  });
}
```

---

## Task 2.5 — Booking State Hook

Create `src/hooks/useBooking.ts`:
```typescript
'use client';
import { useState } from 'react';

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  barberId: string;
  barberName: string;
  date: string;        // "2025-03-15"
  time: string;        // "14:30"
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientNotes: string;
}

const initialState: BookingState = {
  step: 1,
  serviceId: '', serviceName: '', servicePrice: 0, serviceDuration: 0,
  barberId: '', barberName: '',
  date: '', time: '',
  clientName: '', clientEmail: '', clientPhone: '', clientNotes: '',
};

export function useBooking() {
  const [state, setState] = useState<BookingState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateState(updates: Partial<BookingState>) {
    setState(prev => ({ ...prev, ...updates }));
  }

  function goToStep(step: BookingState['step']) {
    setState(prev => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setState(initialState);
    setError(null);
  }

  return { state, updateState, goToStep, loading, setLoading, error, setError, reset };
}
```

---

## Task 2.6 — Booking Wizard Pages

Create `src/app/[locale]/booking/page.tsx`:
```typescript
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Header } from '@/components/layout/Header';

export default async function BookingPage() {
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
      <main className="pt-20 min-h-screen">
        <BookingWizard services={services} barbers={barbers} />
      </main>
    </>
  );
}
```

Create `src/app/[locale]/booking/success/page.tsx`:
```typescript
import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Props {
  searchParams: Promise<{ number?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const t = await getTranslations('booking.success');
  const locale = await getLocale();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="font-serif text-3xl text-cream mb-4">{t('title')}</h1>
        <p className="text-cream-muted mb-2">{t('number_label')}</p>
        <div className="text-gold font-mono text-2xl font-bold mb-6">
          {params.number ?? '—'}
        </div>
        <p className="text-cream-muted text-sm mb-8">{t('email_sent')}</p>
        <div className="flex flex-col gap-3">
          <Link href={`/${locale}`}>
            <Button className="w-full">{t('back_home')}</Button>
          </Link>
          <Link href={`/${locale}/booking`}>
            <Button variant="outline" className="w-full">{t('book_another')}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

---

## Task 2.7 — BookingWizard Component

Create `src/components/booking/BookingWizard.tsx`:
```typescript
'use client';
import { useBooking } from '@/hooks/useBooking';
import { StepIndicator } from './StepIndicator';
import { Step1Service } from './Step1Service';
import { Step2Barber } from './Step2Barber';
import { Step3DateTime } from './Step3DateTime';
import { Step4Contact } from './Step4Contact';
import { Step5Confirm } from './Step5Confirm';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface Props {
  services: any[];
  barbers: any[];
}

export function BookingWizard({ services, barbers }: Props) {
  const { state, updateState, goToStep, loading, setLoading, error, setError } = useBooking();
  const locale = useLocale();
  const router = useRouter();

  async function submitBooking() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: state.serviceId,
          barberId: state.barberId,
          date: state.date,
          time: state.time,
          clientName: state.clientName,
          clientEmail: state.clientEmail,
          clientPhone: state.clientPhone,
          clientNotes: state.clientNotes,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === 'TIME_SLOT_TAKEN') {
          setError('slot_taken');
          goToStep(3);
        } else {
          setError('general');
        }
        return;
      }

      router.push(`/${locale}/booking/success?number=${data.data.appointmentNumber}`);

    } catch {
      setError('general');
    } finally {
      setLoading(false);
    }
  }

  const stepProps = { state, updateState, goToStep, loading, error, setError };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <StepIndicator currentStep={state.step} />

      <div className="mt-8">
        {state.step === 1 && <Step1Service {...stepProps} services={services} />}
        {state.step === 2 && <Step2Barber {...stepProps} barbers={barbers} />}
        {state.step === 3 && <Step3DateTime {...stepProps} />}
        {state.step === 4 && <Step4Contact {...stepProps} />}
        {state.step === 5 && <Step5Confirm {...stepProps} services={services} barbers={barbers} onSubmit={submitBooking} />}
      </div>
    </div>
  );
}
```

---

## Task 2.8 — Individual Step Components

### Step 1 — Service Selection
Create `src/components/booking/Step1Service.tsx`:
```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDuration } from '@/lib/utils';

const ICONS = { haircut: '✂️', beard: '🧔', styling: '💈' };

export function Step1Service({ services, updateState, goToStep }: any) {
  const t = useTranslations('booking.step1');
  const locale = useLocale();

  function selectService(service: any) {
    const name = locale === 'ru' ? service.nameRu : locale === 'en' ? service.nameEn : service.nameHy;
    updateState({
      serviceId: service.id,
      serviceName: name,
      servicePrice: service.priceAmd,
      serviceDuration: service.durationMinutes,
    });
    goToStep(2);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream mb-2">{t('title')}</h2>
      <p className="text-cream-muted text-sm mb-8">{t('subtitle')}</p>

      <div className="grid gap-4">
        {services.map((service: any) => {
          const name = locale === 'ru' ? service.nameRu : locale === 'en' ? service.nameEn : service.nameHy;
          return (
            <button
              key={service.id}
              onClick={() => selectService(service)}
              className="flex items-center justify-between p-5 rounded-2xl border border-gold/20 bg-dark-2 hover:border-gold/50 hover:bg-dark-3 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{ICONS[service.category as keyof typeof ICONS]}</span>
                <div>
                  <h3 className="text-cream font-medium group-hover:text-gold transition-colors">{name}</h3>
                  <p className="text-cream-dim text-xs mt-0.5">{formatDuration(service.durationMinutes, locale)}</p>
                </div>
              </div>
              <div className="text-gold font-bold text-lg">{formatPrice(service.priceAmd)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

### Step 3 — Date & Time Selection
Create `src/components/booking/Step3DateTime.tsx`:
```typescript
'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function Step3DateTime({ state, updateState, goToStep }: any) {
  const t = useTranslations('booking.step3');
  const locale = useLocale();

  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Generate next 14 days as options
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return { value: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE dd MMM'), date: d };
  });

  async function loadSlots(date: string) {
    setSelectedDate(date);
    setLoadingSlots(true);
    setSlots([]);
    try {
      const res = await fetch(
        `/api/availability?barberId=${state.barberId}&date=${date}&serviceId=${state.serviceId}`
      );
      const data = await res.json();
      setSlots(data.data ?? []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  function selectSlot(slot: any) {
    updateState({ date: selectedDate, time: slot.time });
    goToStep(4);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream mb-2">{t('title')}</h2>
      <p className="text-cream-muted text-sm mb-8">{t('subtitle')}</p>

      {/* Date selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => loadSlots(day.value)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border text-sm transition-all ${
              selectedDate === day.value
                ? 'bg-gold text-dark border-gold font-medium'
                : 'border-gold/20 text-cream-muted hover:border-gold/50'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Time slots */}
      {loadingSlots && <div className="flex justify-center py-8"><Spinner /></div>}

      {!loadingSlots && selectedDate && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => selectSlot(slot)}
              className={`py-3 rounded-xl border text-sm font-mono transition-all ${
                slot.available
                  ? 'border-gold/30 text-cream hover:bg-gold hover:text-dark hover:border-gold'
                  : 'border-dark-4 text-cream-dim opacity-40 cursor-not-allowed line-through'
              }`}
            >
              {slot.time}
            </button>
          ))}

          {slots.length === 0 && !loadingSlots && selectedDate && (
            <p className="col-span-4 text-center text-cream-muted py-8">{t('no_slots')}</p>
          )}
        </div>
      )}

      {!selectedDate && (
        <p className="text-center text-cream-muted py-8">{t('select_date_first')}</p>
      )}

      <div className="mt-8">
        <Button variant="outline" onClick={() => goToStep(2)}>← {t('back')}</Button>
      </div>
    </div>
  );
}
```

---

## Task 2.9 — Add Booking Translations

Add to all 3 locale files:
```json
"booking": {
  "step1": { "title": "...", "subtitle": "..." },
  "step2": { "title": "...", "subtitle": "...", "any_barber": "..." },
  "step3": { "title": "...", "subtitle": "...", "no_slots": "...", "select_date_first": "...", "back": "..." },
  "step4": { "title": "...", "name": "...", "email": "...", "phone": "...", "notes": "...", "back": "...", "next": "..." },
  "step5": { "title": "...", "service": "...", "barber": "...", "date": "...", "time": "...", "price": "...", "back": "...", "submit": "...", "submitting": "..." },
  "success": { "title": "...", "number_label": "...", "email_sent": "...", "back_home": "...", "book_another": "..." }
}
```

---

## Phase 2 Verification

- [ ] Full booking flow works (Step 1 → 5 → Success page)
- [ ] Availability only shows open slots
- [ ] After booking, that slot is no longer available
- [ ] Customer receives email with appointment details
- [ ] Error shown if slot gets taken between Step 3 and Step 5
- [ ] All steps show correct text in all 3 languages
- [ ] Mobile: booking wizard is usable on 375px screen

**If all pass → Phase 2 complete. Move to PHASE-3-AI-VISUALIZER.md.**
