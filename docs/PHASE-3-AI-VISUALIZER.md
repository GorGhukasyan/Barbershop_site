# PHASE-3-AI-VISUALIZER.md — AI Hairstyle Visualizer

> **Prerequisite**: Phase 2 complete. Booking system works end-to-end.
> **Goal**: Users upload a photo, choose a hairstyle, see AI-generated result, book appointment.

---

## Feature Overview

The AI Hairstyle Visualizer is the **flagship feature** of GA BARBER SHOP — it differentiates this site from every other local barbershop.

**User Journey**:
1. User clicks "Try AI Visualizer" from landing page or nav
2. Page explains the feature (privacy, steps)
3. User uploads a selfie (drag-and-drop or click)
4. User selects a hairstyle from the catalog (12 options)
5. Clicks "Generate" → loading animation (~8-15 seconds)
6. Sees before/after comparison of their new look
7. "Book This Look" button → goes to booking with style noted
8. Can generate up to 3 times per session (sessionStorage counter)

---

## Task 3.1 — Hairstyle Catalog

Create `src/lib/hairstyles.ts`:
```typescript
export interface Hairstyle {
  id: string;
  nameHy: string;
  nameRu: string;
  nameEn: string;
  category: 'classic' | 'modern' | 'beard' | 'combo';
  previewImage: string;       // Reference image path in /public/images/styles/
  geminiPrompt: string;       // English prompt for Gemini
}

export const HAIRSTYLES: Hairstyle[] = [
  // ─── Classic ───────────────────────────────────────────
  {
    id: 'classic-fade',
    nameHy: 'Դասական Ֆեյդ',
    nameRu: 'Классический Фейд',
    nameEn: 'Classic Fade',
    category: 'classic',
    previewImage: '/images/styles/classic-fade.jpg',
    geminiPrompt: 'Transform the hairstyle to a classic skin fade haircut: very short sides fading to skin, medium length on top, neatly combed back or to the side. Clean, professional look.',
  },
  {
    id: 'pompadour',
    nameHy: 'Պոմպադուր',
    nameRu: 'Помпадур',
    nameEn: 'Pompadour',
    category: 'classic',
    previewImage: '/images/styles/pompadour.jpg',
    geminiPrompt: 'Transform the hairstyle to a pompadour: voluminous hair swept upward and backward from the forehead, high fade on the sides, shiny and well-groomed finish.',
  },
  {
    id: 'crew-cut',
    nameHy: 'Կրու Քաթ',
    nameRu: 'Crew Cut',
    nameEn: 'Crew Cut',
    category: 'classic',
    previewImage: '/images/styles/crew-cut.jpg',
    geminiPrompt: 'Transform the hairstyle to a crew cut: short uniform length on top, tapered sides and back, clean and masculine look.',
  },
  {
    id: 'slick-back',
    nameHy: 'Սլիք Բեք',
    nameRu: 'Слик Бэк',
    nameEn: 'Slick Back',
    category: 'classic',
    previewImage: '/images/styles/slick-back.jpg',
    geminiPrompt: 'Transform the hairstyle to a slick back: all hair combed straight back with pomade, shiny finish, undercut or high fade on the sides, elegant and refined look.',
  },
  // ─── Modern ────────────────────────────────────────────
  {
    id: 'textured-crop',
    nameHy: 'Տեքստուրդ Կրոպ',
    nameRu: 'Текстурный кроп',
    nameEn: 'Textured Crop',
    category: 'modern',
    previewImage: '/images/styles/textured-crop.jpg',
    geminiPrompt: 'Transform the hairstyle to a textured crop: short on the sides with a skin or low fade, short choppy textured top with a forward fringe, modern European style.',
  },
  {
    id: 'french-crop',
    nameHy: 'Ֆրանսիական Կրոպ',
    nameRu: 'Французский кроп',
    nameEn: 'French Crop',
    category: 'modern',
    previewImage: '/images/styles/french-crop.jpg',
    geminiPrompt: 'Transform the hairstyle to a French crop: short fringe across the forehead, textured top, faded sides, contemporary and clean cut.',
  },
  {
    id: 'undercut',
    nameHy: 'Անդըրքաթ',
    nameRu: 'Андеркат',
    nameEn: 'Undercut',
    category: 'modern',
    previewImage: '/images/styles/undercut.jpg',
    geminiPrompt: 'Transform the hairstyle to an undercut: longer hair on top styled to the side, dramatically disconnected short or shaved sides, bold and edgy look.',
  },
  {
    id: 'buzz-cut',
    nameHy: 'Բազ Քաթ',
    nameRu: 'Бокс',
    nameEn: 'Buzz Cut',
    category: 'modern',
    previewImage: '/images/styles/buzz-cut.jpg',
    geminiPrompt: 'Transform the hairstyle to a buzz cut: uniform very short length all over the head, clean and minimalist masculine look.',
  },
  // ─── Beard ─────────────────────────────────────────────
  {
    id: 'beard-full',
    nameHy: 'Լիք Մորուք',
    nameRu: 'Полная борода',
    nameEn: 'Full Beard',
    category: 'beard',
    previewImage: '/images/styles/beard-full.jpg',
    geminiPrompt: 'Keep the existing hairstyle but transform the facial hair to a full beard: thick, even, well-groomed beard covering cheeks, chin and upper lip, sharp neckline, masculine and distinguished.',
  },
  {
    id: 'beard-short',
    nameHy: 'Կարճ Մորուք',
    nameRu: 'Короткая борода',
    nameEn: 'Short Beard',
    category: 'beard',
    previewImage: '/images/styles/beard-short.jpg',
    geminiPrompt: 'Keep the existing hairstyle but transform the facial hair to a short neat stubble beard: 5mm length, clean lines, sharp cheek and neckline fade.',
  },
  // ─── Combo ─────────────────────────────────────────────
  {
    id: 'fade-beard',
    nameHy: 'Ֆեյդ + Մորուք',
    nameRu: 'Фейд + Борода',
    nameEn: 'Fade + Beard',
    category: 'combo',
    previewImage: '/images/styles/fade-beard.jpg',
    geminiPrompt: 'Transform to a low skin fade haircut with a well-groomed medium beard: the fade blends seamlessly into the beard line, creating a connected and modern barbershop look.',
  },
  {
    id: 'pompadour-beard',
    nameHy: 'Պոմպ + Մորուք',
    nameRu: 'Помп + Борода',
    nameEn: 'Pompadour + Beard',
    category: 'combo',
    previewImage: '/images/styles/pompadour-beard.jpg',
    geminiPrompt: 'Transform to a high pompadour with a full thick beard: voluminous quiff on top, high fade sides, full groomed beard. Classic barbershop combination, distinguished and stylish.',
  },
];

export function getHairstyleById(id: string): Hairstyle | undefined {
  return HAIRSTYLES.find(h => h.id === id);
}
```

---

## Task 3.2 — Gemini Client

Create `src/lib/gemini/client.ts`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

Create `src/lib/gemini/prompts.ts`:
```typescript
export function buildVisualizerPrompt(hairstylePrompt: string): string {
  return `You are a professional photo editor for a barbershop.

TASK: Apply a new hairstyle to the person in this photo.

HAIRSTYLE TO APPLY: ${hairstylePrompt}

IMPORTANT RULES:
1. Keep the person's face, skin tone, and facial features EXACTLY the same
2. Only change the hair and/or beard as described
3. Make the result look realistic and natural, like a real photograph
4. Maintain the same lighting and background
5. The result should look like this person actually got this haircut
6. Do NOT add any text, watermarks, or filters to the image

Generate a realistic photo of this person with the specified hairstyle.`;
}
```

---

## Task 3.3 — Visualizer API Route

Create `src/app/api/ai/visualizer/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini/client';
import { buildVisualizerPrompt } from '@/lib/gemini/prompts';
import { getHairstyleById } from '@/lib/hairstyles';

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const photo = formData.get('photo') as File | null;
    const hairstyleId = formData.get('hairstyleId') as string | null;

    // Validate inputs
    if (!photo || !hairstyleId) {
      return NextResponse.json(
        { success: false, error: 'Missing photo or hairstyleId' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Use JPEG, PNG or WebP.' },
        { status: 400 }
      );
    }

    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max 5MB.' },
        { status: 400 }
      );
    }

    const hairstyle = getHairstyleById(hairstyleId);
    if (!hairstyle) {
      return NextResponse.json(
        { success: false, error: 'Invalid hairstyle ID' },
        { status: 400 }
      );
    }

    // Convert photo to base64
    const photoBuffer = await photo.arrayBuffer();
    const photoBase64 = Buffer.from(photoBuffer).toString('base64');

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = buildVisualizerPrompt(hairstyle.geminiPrompt);

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: photo.type as 'image/jpeg' | 'image/png' | 'image/webp',
          data: photoBase64,
        },
      },
      { text: prompt },
    ]);

    const response = result.response;

    // Extract generated image from response
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart?.inlineData) {
      // Gemini returned text instead of image — model doesn't support image generation
      // Fallback: return the text response so we can debug
      const textPart = parts.find((p: any) => p.text);
      console.error('[Visualizer] No image in response:', textPart?.text);
      return NextResponse.json(
        { success: false, error: 'AI could not generate image. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        imageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
        hairstyleName: hairstyle.nameEn,
      },
    });

  } catch (error) {
    console.error('[POST /api/ai/visualizer]', error);

    // Handle Gemini API rate limit
    if ((error as any)?.status === 429) {
      return NextResponse.json(
        { success: false, error: 'AI is busy. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate hairstyle. Please try again.' },
      { status: 500 }
    );
  }
}
```

---

## Task 3.4 — Visualizer Hook

Create `src/hooks/useVisualizer.ts`:
```typescript
'use client';
import { useState, useCallback } from 'react';
import { HAIRSTYLES } from '@/lib/hairstyles';

const SESSION_KEY = 'ga_visualizer_count';
const MAX_GENERATIONS = 3;

export type VisualizerStep = 'upload' | 'select' | 'generating' | 'result' | 'error';

export function useVisualizer() {
  const [step, setStep] = useState<VisualizerStep>('upload');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');
  const [error, setError] = useState<string>('');

  function getRemainingGenerations(): number {
    const count = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10);
    return Math.max(0, MAX_GENERATIONS - count);
  }

  function incrementGenerationCount() {
    const count = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10);
    sessionStorage.setItem(SESSION_KEY, String(count + 1));
  }

  function handlePhotoUpload(file: File) {
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setStep('select');
  }

  function handleStyleSelect(styleId: string) {
    setSelectedStyleId(styleId);
  }

  async function generate() {
    if (!photo || !selectedStyleId) return;

    const remaining = getRemainingGenerations();
    if (remaining <= 0) {
      setError('rate_limit');
      setStep('error');
      return;
    }

    setStep('generating');
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('hairstyleId', selectedStyleId);

      const res = await fetch('/api/ai/visualizer', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Unknown error');
        setStep('error');
        return;
      }

      incrementGenerationCount();
      setResultImage(`data:${data.data.mimeType};base64,${data.data.imageBase64}`);
      setStep('result');

    } catch {
      setError('network_error');
      setStep('error');
    }
  }

  function reset() {
    setStep('upload');
    setPhoto(null);
    setPhotoPreview('');
    setSelectedStyleId('');
    setResultImage('');
    setError('');
  }

  return {
    step, setStep,
    photo, photoPreview, handlePhotoUpload,
    selectedStyleId, handleStyleSelect,
    resultImage,
    error, setError,
    generate, reset,
    remainingGenerations: getRemainingGenerations(),
  };
}
```

---

## Task 3.5 — Visualizer Page & Components

Create `src/app/[locale]/visualizer/page.tsx`:
```typescript
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { VisualizerContainer } from '@/components/visualizer/VisualizerContainer';

export default async function VisualizerPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <VisualizerContainer />
      </main>
    </>
  );
}
```

Create `src/components/visualizer/VisualizerContainer.tsx`:
```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useVisualizer } from '@/hooks/useVisualizer';
import { PhotoUpload } from './PhotoUpload';
import { StyleCatalog } from './StyleCatalog';
import { GeneratingAnimation } from './GeneratingAnimation';
import { ResultView } from './ResultView';
import { Button } from '@/components/ui/Button';

export function VisualizerContainer() {
  const t = useTranslations('visualizer');
  const locale = useLocale();
  const v = useVisualizer();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10">
          <span className="text-gold text-sm">✨ AI Powered</span>
        </div>
        <h1 className="font-serif text-4xl text-cream mb-4">{t('title')}</h1>
        <p className="text-cream-muted max-w-xl mx-auto">{t('subtitle')}</p>

        {/* Remaining generations */}
        <p className="text-cream-dim text-sm mt-4">
          {t('remaining', { count: v.remainingGenerations })}
        </p>
      </div>

      {/* Steps */}
      {v.step === 'upload' && (
        <PhotoUpload onUpload={v.handlePhotoUpload} />
      )}

      {v.step === 'select' && (
        <div>
          <StyleCatalog
            selectedId={v.selectedStyleId}
            onSelect={v.handleStyleSelect}
            locale={locale}
          />
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={v.reset}>← {t('back')}</Button>
            <Button
              onClick={v.generate}
              disabled={!v.selectedStyleId}
            >
              ✨ {t('generate')}
            </Button>
          </div>
        </div>
      )}

      {v.step === 'generating' && (
        <GeneratingAnimation />
      )}

      {v.step === 'result' && (
        <ResultView
          originalImage={v.photoPreview}
          resultImage={v.resultImage}
          onTryAgain={v.reset}
          onBookNow={() => window.location.href = `/${locale}/booking`}
        />
      )}

      {v.step === 'error' && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-cream-muted mb-6">{t(`error.${v.error}`, { fallback: t('error.general') })}</p>
          <Button onClick={v.reset}>{t('try_again')}</Button>
        </div>
      )}

      {/* Privacy notice */}
      <p className="text-center text-cream-dim text-xs mt-8">
        🔒 {t('privacy_notice')}
      </p>
    </div>
  );
}
```

Create `src/components/visualizer/PhotoUpload.tsx`:
```typescript
'use client';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function PhotoUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const t = useTranslations('visualizer.upload');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB check
    onUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
        dragging ? 'border-gold bg-gold/10' : 'border-gold/30 hover:border-gold/60 hover:bg-dark-2'
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <div className="text-5xl mb-4">📸</div>
      <h3 className="text-cream font-medium text-lg mb-2">{t('title')}</h3>
      <p className="text-cream-muted text-sm mb-4">{t('subtitle')}</p>
      <p className="text-cream-dim text-xs">{t('hint')}</p>
    </div>
  );
}
```

Create `src/components/visualizer/GeneratingAnimation.tsx`:
```typescript
'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const MESSAGES_KEY = 'visualizer.generating.messages';

export function GeneratingAnimation() {
  const t = useTranslations('visualizer.generating');
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    t('msg1'), t('msg2'), t('msg3'), t('msg4'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* AI spinning logo */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">✂️</span>
        </div>
      </div>

      <h3 className="font-serif text-2xl text-cream mb-3">{t('title')}</h3>
      <p className="text-gold text-sm animate-pulse">{messages[msgIndex]}</p>
      <p className="text-cream-dim text-xs mt-4">{t('wait')}</p>
    </div>
  );
}
```

Create `src/components/visualizer/ResultView.tsx`:
```typescript
'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Props {
  originalImage: string;
  resultImage: string;
  onTryAgain: () => void;
  onBookNow: () => void;
}

export function ResultView({ originalImage, resultImage, onTryAgain, onBookNow }: Props) {
  const t = useTranslations('visualizer.result');

  function downloadResult() {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'ga-barbershop-style.jpg';
    link.click();
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-cream text-center mb-8">{t('title')}</h2>

      {/* Before / After */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-cream-muted text-xs text-center mb-2 uppercase tracking-wider">{t('before')}</p>
          <div className="rounded-2xl overflow-hidden border border-gold/20">
            <img src={originalImage} alt="Before" className="w-full h-64 object-cover" />
          </div>
        </div>
        <div>
          <p className="text-gold text-xs text-center mb-2 uppercase tracking-wider">{t('after')}</p>
          <div className="rounded-2xl overflow-hidden border border-gold/50 shadow-[0_0_30px_rgba(201,169,110,0.2)]">
            <img src={resultImage} alt="After" className="w-full h-64 object-cover" />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-cream-dim text-xs text-center mb-8">{t('disclaimer')}</p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={onBookNow}>
          ✂️ {t('book_this_look')}
        </Button>
        <Button variant="outline" onClick={downloadResult}>
          ⬇️ {t('download')}
        </Button>
        <Button variant="ghost" onClick={onTryAgain}>
          🔄 {t('try_again')}
        </Button>
      </div>
    </div>
  );
}
```

---

## Task 3.6 — Add Visualizer Translations

Add to all 3 locale files:
```json
"visualizer": {
  "title": "...",
  "subtitle": "...",
  "remaining": "...",
  "back": "...",
  "generate": "...",
  "try_again": "...",
  "privacy_notice": "Ձեր լուսանկարը չի պահվում",
  "upload": {
    "title": "...",
    "subtitle": "...",
    "hint": "JPEG, PNG, WebP — max 5MB"
  },
  "generating": {
    "title": "...",
    "wait": "...",
    "msg1": "...",
    "msg2": "...",
    "msg3": "...",
    "msg4": "..."
  },
  "result": {
    "title": "...",
    "before": "Առաջ",
    "after": "Հետո",
    "book_this_look": "Ամրագրել այս ոճը",
    "download": "...",
    "try_again": "...",
    "disclaimer": "AI-ի կողմից ստեղծված արդյունք, իրական կտրվածքը կարող է փոքր-ինչ տարբերվել"
  },
  "error": {
    "rate_limit": "...",
    "general": "...",
    "network_error": "..."
  }
}
```

---

## Phase 3 Verification

- [ ] `/hy/visualizer` page loads
- [ ] Photo upload works (drag-and-drop and click)
- [ ] Hairstyle catalog shows all 12 options
- [ ] Clicking "Generate" calls API (check Network tab)
- [ ] Loading animation shows while waiting
- [ ] Result shows before/after images
- [ ] "Book This Look" navigates to booking page
- [ ] Download button saves the result image
- [ ] After 3 generations, shows "rate limit" error
- [ ] Privacy notice visible

**If all pass → Phase 3 complete. Move to PHASE-4-ADMIN.md.**
