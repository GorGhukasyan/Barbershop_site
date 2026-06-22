import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendBookingConfirmation(appointment: Record<string, unknown>) {
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not set, skipping email');
    return;
  }

  const appt = appointment as Record<string, any>;
  const locale = (appt.locale ?? 'hy') as string;

  const subjects: Record<string, string> = {
    hy: `Booking Confirmed — ${appt.appointmentNumber}`,
    ru: `Booking Confirmed — ${appt.appointmentNumber}`,
    en: `Booking Confirmed — ${appt.appointmentNumber}`,
  };

  const messages: Record<string, string> = {
    hy: `Hello ${appt.clientName},\n\nYour booking at GA BARBER SHOP is confirmed.\nBooking #: ${appt.appointmentNumber}\nTime: ${appt.startTime?.slice(0, 5)}\n\nThank you!`,
    ru: `Hello ${appt.clientName},\n\nYour booking at GA BARBER SHOP is confirmed.\nBooking #: ${appt.appointmentNumber}\nTime: ${appt.startTime?.slice(0, 5)}\n\nThank you!`,
    en: `Hello ${appt.clientName},\n\nYour booking at GA BARBER SHOP is confirmed.\nBooking #: ${appt.appointmentNumber}\nTime: ${appt.startTime?.slice(0, 5)}\n\nThank you!`,
  };

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'GA Barber <onboarding@resend.dev>',
    to: appt.clientEmail,
    subject: subjects[locale] || subjects.en,
    text: messages[locale] || messages.en,
  });
}

export async function sendCancellationEmail(appointment: Record<string, any>) {
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not set, skipping email');
    return;
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'GA Barber <onboarding@resend.dev>',
    to: appointment.clientEmail,
    subject: `Booking Cancelled — ${appointment.appointmentNumber}`,
    text: `Your appointment ${appointment.appointmentNumber} has been cancelled.`,
  });
}
