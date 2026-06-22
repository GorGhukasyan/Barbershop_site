'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function AppointmentActions({ appointment }: { appointment: { id: string; status: string } }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus(status: string) {
    setLoading(status);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (['completed', 'cancelled'].includes(appointment.status)) {
    return (
      <p className="text-cream-dim text-sm text-center">
        This appointment is {appointment.status} and cannot be changed.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {appointment.status === 'pending' && (
        <Button onClick={() => updateStatus('confirmed')} loading={loading === 'confirmed'}>
          Confirm
        </Button>
      )}
      {['pending', 'confirmed'].includes(appointment.status) && (
        <Button onClick={() => updateStatus('completed')} variant="outline" loading={loading === 'completed'}>
          Mark Complete
        </Button>
      )}
      {['pending', 'confirmed'].includes(appointment.status) && (
        <Button onClick={() => updateStatus('cancelled')} variant="danger" loading={loading === 'cancelled'}>
          Cancel
        </Button>
      )}
    </div>
  );
}
