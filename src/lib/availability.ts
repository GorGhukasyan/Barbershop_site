import { prisma } from '@/lib/prisma';
import { addMinutes, format, parse, isAfter, isBefore } from 'date-fns';

export interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
}

export async function getAvailableSlots(
  barberId: string,
  date: Date,
  serviceDurationMinutes: number
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay();

  const workingHours = await prisma.workingHour.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
  });

  if (!workingHours || !workingHours.isWorking) return [];

  const timeOff = await prisma.timeOff.findUnique({
    where: { barberId_date: { barberId, date } },
  });

  if (timeOff) return [];

  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      appointmentDate: date,
      status: { notIn: ['cancelled'] },
    },
    select: { startTime: true, endTime: true },
  });

  const slots: TimeSlot[] = [];
  const workStart = parse(workingHours.startTime, 'HH:mm:ss', date);
  const workEnd = parse(workingHours.endTime, 'HH:mm:ss', date);

  let current = workStart;

  while (isBefore(addMinutes(current, serviceDurationMinutes), workEnd) ||
         format(addMinutes(current, serviceDurationMinutes), 'HH:mm') === format(workEnd, 'HH:mm')) {

    const slotStart = current;
    const slotEnd = addMinutes(current, serviceDurationMinutes);

    const isOccupied = appointments.some((appt) => {
      const apptStart = parse(appt.startTime, 'HH:mm:ss', date);
      const apptEnd = parse(appt.endTime, 'HH:mm:ss', date);
      return isBefore(slotStart, apptEnd) && isAfter(slotEnd, apptStart);
    });

    const now = new Date();
    const isPast = isBefore(slotStart, now) && format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

    slots.push({
      time: format(slotStart, 'HH:mm'),
      endTime: format(slotEnd, 'HH:mm'),
      available: !isOccupied && !isPast,
    });

    current = addMinutes(current, serviceDurationMinutes);
    if (isAfter(current, workEnd)) break;
  }

  return slots;
}
