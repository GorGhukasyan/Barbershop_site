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
  date: string;
  time: string;
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
