'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AddServicePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameHy, setNameHy] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descHy, setDescHy] = useState('');
  const [descRu, setDescRu] = useState('');
  const [descEn, setDescEn] = useState('');
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(2000);
  const [category, setCategory] = useState<'haircut' | 'beard' | 'styling'>('haircut');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameHy, nameRu, nameEn,
          descriptionHy: descHy, descriptionRu: descRu, descriptionEn: descEn,
          durationMinutes: duration,
          priceAmd: price,
          category,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.toString() || 'Failed to add service');
        return;
      }

      router.push(`/${locale}/admin/services`);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full bg-dark-3 border border-gold/20 rounded-lg px-4 py-3 text-cream focus:border-gold focus:outline-none transition-colors';

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-cream mb-8">Add New Service</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-gold font-serif text-lg mb-4">Service Name</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-cream-muted text-sm mb-1">Name (Armenian) *</label>
              <input value={nameHy} onChange={e => setNameHy(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Name (Russian) *</label>
              <input value={nameRu} onChange={e => setNameRu(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Name (English) *</label>
              <input value={nameEn} onChange={e => setNameEn(e.target.value)} required className={inputClass} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-gold font-serif text-lg mb-4">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-cream-muted text-sm mb-1">Description (Armenian)</label>
              <textarea value={descHy} onChange={e => setDescHy(e.target.value)} rows={2} className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Description (Russian)</label>
              <textarea value={descRu} onChange={e => setDescRu(e.target.value)} rows={2} className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Description (English)</label>
              <textarea value={descEn} onChange={e => setDescEn(e.target.value)} rows={2} className={inputClass} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-gold font-serif text-lg mb-4">Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-cream-muted text-sm mb-1">Duration (min) *</label>
              <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={15} max={240} required className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Price (AMD) *</label>
              <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={100} required className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-muted text-sm mb-1">Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value as 'haircut' | 'beard' | 'styling')} className={inputClass}>
                <option value="haircut">Haircut</option>
                <option value="beard">Beard</option>
                <option value="styling">Styling</option>
              </select>
            </div>
          </div>
        </Card>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>Add Service</Button>
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
