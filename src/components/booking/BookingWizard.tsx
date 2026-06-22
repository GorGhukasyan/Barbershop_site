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
