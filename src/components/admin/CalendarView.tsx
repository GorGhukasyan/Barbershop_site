'use client';
import { useState } from 'react';
import { format, addDays, startOfDay, isSameDay, parseISO } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

interface CalendarAppointment {
  id: string;
  date: string;
  time: string;
  clientName: string;
  serviceName: string;
  barberName: string;
  status: string;
  price: number;
}

const STATUS_BADGE: Record<string, 'pending' | 'success' | 'cancelled' | 'gold' | 'default'> = {
  pending: 'pending', confirmed: 'success', cancelled: 'cancelled',
  completed: 'gold', no_show: 'default',
};

export function CalendarView({ appointments }: { appointments: CalendarAppointment[] }) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = addDays(startOfDay(new Date()), i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const count = appointments.filter(a => format(parseISO(a.date), 'yyyy-MM-dd') === dateStr).length;
    return { date: d, dateStr, count };
  });

  const selectedAppointments = appointments
    .filter(a => format(parseISO(a.date), 'yyyy-MM-dd') === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-6">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <div key={d} className="text-center text-cream-dim text-xs py-1">{d}</div>
        ))}
        {days.map(({ date, dateStr, count }) => {
          const isToday = isSameDay(date, new Date());
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`relative p-2 rounded-lg text-center text-sm transition-all ${
                isSelected
                  ? 'bg-gold text-dark font-bold'
                  : isToday
                    ? 'bg-gold/20 text-gold'
                    : 'text-cream-muted hover:bg-dark-3'
              }`}
            >
              {format(date, 'd')}
              {count > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                  isSelected ? 'bg-dark text-gold' : 'bg-gold text-dark'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {selectedAppointments.length === 0 ? (
          <p className="text-cream-dim text-sm text-center py-4">No appointments on this day</p>
        ) : (
          selectedAppointments.map(appt => (
            <Card key={appt.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gold font-bold">{appt.time}</span>
                  <div>
                    <p className="text-cream text-sm font-medium">{appt.clientName}</p>
                    <p className="text-cream-dim text-xs">{appt.serviceName} · {appt.barberName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold text-sm">{formatPrice(appt.price)}</span>
                  <Badge variant={STATUS_BADGE[appt.status]}>{appt.status}</Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
