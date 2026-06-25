'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

export default function AddBarberPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [bioHy, setBioHy] = useState('');
  const [bioRu, setBioRu] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [role, setRole] = useState<'barber' | 'admin'>('barber');
  const [workingDays, setWorkingDays] = useState<Record<number, { working: boolean; start: string; end: string }>>({
    1: { working: true, start: '10:00', end: '20:00' },
    2: { working: true, start: '10:00', end: '20:00' },
    3: { working: true, start: '10:00', end: '20:00' },
    4: { working: true, start: '10:00', end: '20:00' },
    5: { working: true, start: '10:00', end: '20:00' },
    6: { working: true, start: '11:00', end: '18:00' },
    0: { working: false, start: '11:00', end: '18:00' },
  });

  function handleNameChange(value: string) {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/barbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          bioHy,
          bioRu,
          bioEn,
          role,
          workingHours: DAYS.map(d => ({
            dayOfWeek: d.value,
            startTime: workingDays[d.value].start + ':00',
            endTime: workingDays[d.value].end + ':00',
            isWorking: workingDays[d.value].working,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.toString() || 'Failed to add barber');
        return;
      }

      router.push(`/${locale}/admin/barbers`);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors';

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-cream mb-8">Add New Barber</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-gold font-serif text-lg mb-4">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-cream-muted text-sm mb-1">Name *</label>
              <input value={name} onChange={e => handleNameChange(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Slug (URL name)</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value as 'barber' | 'admin')} className={inputClass}>
                <option value="barber">Barber</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-gold font-serif text-lg mb-4">Bio</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-cream-muted text-sm mb-1">Bio (Armenian)</label>
              <textarea value={bioHy} onChange={e => setBioHy(e.target.value)} rows={2} className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Bio (Russian)</label>
              <textarea value={bioRu} onChange={e => setBioRu(e.target.value)} rows={2} className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Bio (English)</label>
              <textarea value={bioEn} onChange={e => setBioEn(e.target.value)} rows={2} className={inputClass} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-gold font-serif text-lg mb-4">Working Hours</h2>
          <div className="space-y-3">
            {DAYS.map(day => (
              <div key={day.value} className="flex items-center gap-4">
                <label className="flex items-center gap-2 min-w-[120px]">
                  <input
                    type="checkbox"
                    checked={workingDays[day.value].working}
                    onChange={e => setWorkingDays(prev => ({
                      ...prev,
                      [day.value]: { ...prev[day.value], working: e.target.checked }
                    }))}
                    className="accent-gold"
                  />
                  <span className="text-cream text-sm">{day.label}</span>
                </label>
                {workingDays[day.value].working && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={workingDays[day.value].start}
                      onChange={e => setWorkingDays(prev => ({
                        ...prev,
                        [day.value]: { ...prev[day.value], start: e.target.value }
                      }))}
                      className="bg-dark-3 border border-gold/20 rounded px-2 py-1 text-cream text-sm"
                    />
                    <span className="text-cream-dim">–</span>
                    <input
                      type="time"
                      value={workingDays[day.value].end}
                      onChange={e => setWorkingDays(prev => ({
                        ...prev,
                        [day.value]: { ...prev[day.value], end: e.target.value }
                      }))}
                      className="bg-dark-3 border border-gold/20 rounded px-2 py-1 text-cream text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>Add Barber</Button>
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
