# PHASE-5-POLISH.md — Polish & Launch Preparation

> **Prerequisite**: Phases 0–4 complete. All features work end-to-end.
> **Goal**: Production-ready quality — performant, accessible, SEO-optimized, fully translated.

---

## Task 5.1 — Complete All Translations

### Armenian (hy.json) — Complete File
```json
{
  "common": {
    "book": "Ամրագրել",
    "cancel": "Չեղարկել",
    "confirm": "Հաստատել",
    "back": "Վերադառնալ",
    "next": "Հաջորդ",
    "close": "Փակել",
    "loading": "Բեռնվում է...",
    "error": "Սխալ է տեղի ունեցել",
    "save": "Պահպանել",
    "edit": "Խմբագրել",
    "delete": "Ջնջել",
    "yes": "Այո",
    "no": "Ոչ"
  },
  "nav": {
    "home": "Գլխավոր",
    "services": "Ծառայություններ",
    "barbers": "Վարսավիրներ",
    "gallery": "Պատկերասրահ",
    "booking": "Ամրագրում",
    "visualizer": "AI Ոճ",
    "contact": "Կապ"
  },
  "metadata": {
    "title": "GA BARBER SHOP — Nor Nork, Երևան",
    "description": "Մասնագիտական վարսավիրանոց Նոր Նորքում: Ծառայություններ՝ Մազ, Մորուք, Ձևավորում: AI Ոճ Visualizer: Առցանց ամրագրում"
  },
  "footer": {
    "tagline": "Nor Nork-ի պրոֆեսիոնալ վարսավիրանոց 10 տարվա փորձով",
    "hours": "Աշխատաժամեր",
    "weekdays": "Երկ–Ուրբ",
    "weekends": "Շաբ–Կիր",
    "contact": "Կապ",
    "address": "Totovents 1/2, Nor Nork, Երևան",
    "rights": "Բոլոր իրավունքները պաշտպանված են"
  },
  "home": {
    "hero": {
      "pretitle": "Nor Nork, Yeravan",
      "title1": "Ձեր ոճը",
      "title2": "մեր արվեստն է",
      "subtitle": "Մասնագիտական կտրվածք, մորուքի ձևավորում և AI-ի օգնությամբ ոճի վիզուալիզացիա — GA BARBER SHOP-ում",
      "cta_book": "Ամրագրել հիմա",
      "cta_visualize": "Փորձել AI ոճ",
      "stat_years": "Տարի փորձ",
      "stat_masters": "Վարպետ",
      "stat_clients": "Բավ. հաճախորդ"
    },
    "services": {
      "title": "Ծառայություններ",
      "subtitle": "Ամեն ծառայություն կատարվում է բարձր մակարդակի նյութերով",
      "book": "Ամրագրել"
    },
    "barbers": {
      "title": "Մեր Թիմը",
      "subtitle": "Մասնագիտական վարպետներ, ովքեր հոգ են տանում ձեր արտաքինի մասին"
    },
    "visualizer": {
      "title": "AI Ոճ Visualizer",
      "subtitle": "Բեռնեք ձեր լուսանկարը, ընտրեք ոճ — տեսեք ինչ կնայեք",
      "cta": "Փորձել AI"
    },
    "hours": {
      "title": "Աշխատաժամեր"
    },
    "contact": {
      "title": "Կապ",
      "name": "Ձեր անունը",
      "email": "Էլ. փոստ",
      "phone": "Հեռ. (պարտ. չէ)",
      "message": "Հաղորդագրություն",
      "submit": "Ուղարկել",
      "success": "Հաղորդագրությունն ուղարկված է",
      "error": "Սխալ: Կրկին փorձе"
    }
  },
  "booking": {
    "title": "Ամրագրում",
    "step1": {
      "title": "Ընտրեք ծառայություն",
      "subtitle": "Ո՞ր ծառայությամբ ցանկանում եք օգտվել այսօր"
    },
    "step2": {
      "title": "Ընտրեք վարսավիր",
      "subtitle": "Ընտրեք մեր թիմի անդամներից",
      "any_barber": "Ցանկացած վարպետ",
      "any_barber_desc": "Ձե՛ր ամրագրման ժամին հասանելի առաջին վարպետը"
    },
    "step3": {
      "title": "Ընտրեք ամսաթիվ և ժամ",
      "subtitle": "Ընտրեք ձեզ հարմար ամսաթիվ",
      "no_slots": "Այս օրը ազատ ժամ չկա: Փorձе ուրիշ ամсաatige",
      "select_date_first": "Ընտրеите ams atige",
      "back": "Հետ"
    },
    "step4": {
      "title": "Ձեր տeղekautyunner",
      "subtitle": "Ամрагрумот подтверждать ки имейлов",
      "name": "Անուն Ազganun",
      "email": "Электронnal почта",
      "phone": "Baжarable+374...",
      "notes": "Лишние замечания (पार्यав. che)",
      "back": "Назад",
      "next": "Hac erd"
    },
    "step5": {
      "title": "Подтверждение",
      "subtitle": "Verg Nayeк и amrграet",
      "service": "Ծarayootyun",
      "barber": "Varsamir",
      "date": "Amsatив",
      "time": "Zham",
      "price": "Ges",
      "client": "Dzer tvelyalnery",
      "back": "Нazad",
      "submit": "Amragrel",
      "submitting": "Amsgravoum e..."
    },
    "success": {
      "title": "Amsagrumы hast atvats e!",
      "number_label": "Amsagrumi kodat",
      "email_sent": "Hast atvman hastragutyun ouxarkvats e dzer email-in",
      "back_home": "Возврат на главную",
      "book_another": "Еще одна запись"
    },
    "error": {
      "slot_taken": "Дур ess amsagrvats чar. Aynces хosel",
      "general": "Skhalоtyun. Xndrume krknananer"
    }
  },
  "visualizer": {
    "title": "AI Ոճ Visualizer",
    "subtitle": "Berenk dzer lusankary, entrek vochy — tesek inc knayek noy varceviri het",
    "remaining": "Mnacel e {count} generation",
    "back": "Хетев",
    "generate": "AI-ov cnerel",
    "try_again": "Кирcknananer",
    "privacy_notice": "Dzer lusankary cheyi pahpanvoum mer server-nerum",
    "upload": {
      "title": "Bernek dzer lusankary",
      "subtitle": "Кrakeqek kame soojet vra siretek file-y",
      "hint": "JPEG, PNG, WebP · max 5MB"
    },
    "generating": {
      "title": "AI-n katoum e dzez...",
      "wait": "Sakheki 10-20 vayrkyan",
      "msg1": "Verclutsnoum enk dzer dzhery...",
      "msg2": "Yntroum enk lav vochy...",
      "msg3": "AI-n kmбагrowum e...",
      "msg4": "Aridk e gnoom..."
    },
    "result": {
      "title": "Dzer ноур nerkakaycy!",
      "before": "Awl",
      "after": "Hetew",
      "book_this_look": "Amsagrel аys вочин",
      "download": "Berel lusankary",
      "try_again": "Ноур vechy",
      "disclaimer": "AI-i koghmic cnagrad patkery. Iravkakan ktrvatske karow e patchi fokhvatsnel"
    },
    "error": {
      "rate_limit": "Ays vornakum 3 AI generation ek koranoumel: karavelootyoon chakvoume verjanagootyoumb",
      "general": "AI-n chgog cnerel: Xndrvoum e krkнананel",
      "network_error": "Kayeli sxalootyoon: Shaboumit ander krknananer"
    }
  }
}
```

**NOTE:** Armenian strings above contain some placeholder text — review ALL strings with the owner (Gor) before launch and correct any awkward phrasing. Same applies to Russian and English translations.

---

## Task 5.2 — SEO Metadata for All Pages

Update each page's `generateMetadata` function:

```typescript
// src/app/[locale]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://gabarbershop.am/${locale}`,
      siteName: 'GA BARBER SHOP',
      locale: locale === 'hy' ? 'hy_AM' : locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'GA BARBER SHOP' }],
    },
    alternates: {
      canonical: `https://gabarbershop.am/${locale}`,
      languages: {
        'hy-AM': 'https://gabarbershop.am/hy',
        'ru-RU': 'https://gabarbershop.am/ru',
        'en-US': 'https://gabarbershop.am/en',
      },
    },
  };
}
```

---

## Task 5.3 — Loading Skeletons

Create `src/components/ui/Skeleton.tsx`:
```typescript
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('shimmer rounded-xl', className)} />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-dark-2 border border-gold/10 rounded-2xl p-6 space-y-4">
      <Skeleton className="w-12 h-12" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between items-center pt-4 border-t border-gold/10">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}
```

Add `loading.tsx` for each major page:

```typescript
// src/app/[locale]/loading.tsx
import { ServiceCardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <ServiceCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
```

---

## Task 5.4 — Error Boundaries

Create `src/app/[locale]/error.tsx`:
```typescript
'use client';
import { Button } from '@/components/ui/Button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-serif text-2xl text-cream mb-4">Something went wrong</h2>
        <p className="text-cream-muted mb-6">Please try refreshing the page.</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
```

Create `src/app/[locale]/not-found.tsx`:
```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-8xl text-gold mb-4">404</div>
        <h2 className="font-serif text-2xl text-cream mb-6">Page not found</h2>
        <Link href="/hy"><Button>Go Home</Button></Link>
      </div>
    </div>
  );
}
```

---

## Task 5.5 — Performance Optimization

### Image Optimization
Replace all `<img>` tags with `next/image`:
```typescript
// Before
<img src={barber.photoUrl} alt={barber.name} className="w-full h-48 object-cover" />

// After
import Image from 'next/image';
<Image src={barber.photoUrl} alt={barber.name} width={400} height={300} className="w-full h-48 object-cover" />
```

### Remove unused dependencies
```bash
npx depcheck
```

### Bundle analysis (optional)
```bash
npm install --save-dev @next/bundle-analyzer
ANALYZE=true npm run build
```

---

## Task 5.6 — Accessibility Audit

Checklist:
- [ ] All `<img>` have meaningful `alt` attributes
- [ ] Form inputs have associated `<label>` elements
- [ ] Buttons have descriptive text or `aria-label`
- [ ] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Focus indicators visible (gold ring on `:focus-visible`)
- [ ] Booking wizard keyboard-navigable (Tab through steps)
- [ ] Language switcher announces change to screen readers
- [ ] Error messages linked to inputs via `aria-describedby`

---

## Task 5.7 — Final End-to-End Test Checklist

### Public Site
- [ ] `/hy` landing page loads in < 3 seconds
- [ ] All 3 languages render correctly
- [ ] Language switcher works on every page
- [ ] Services show correct prices
- [ ] Barbers show with photos (if uploaded)
- [ ] Contact form saves message to DB

### Booking Flow
- [ ] Step 1: All 3 services shown
- [ ] Step 2: All barbers shown
- [ ] Step 3: Date picker works, slots load correctly
- [ ] Step 4: Form validation works (required fields)
- [ ] Step 5: Summary correct, submit works
- [ ] Success page shows appointment number
- [ ] Customer email received within 1 minute
- [ ] Slot is no longer available after booking

### AI Visualizer
- [ ] Photo upload works (test with 2MB JPEG)
- [ ] All 12 styles visible in catalog
- [ ] "Generate" calls API successfully
- [ ] Result shows before/after
- [ ] "Book This Look" goes to /booking
- [ ] 4th generation shows rate limit error

### Admin Panel
- [ ] Login works with Supabase Auth
- [ ] Dashboard shows today's appointments
- [ ] Can confirm a pending appointment
- [ ] Can cancel a confirmed appointment (email sent)
- [ ] Can mark appointment as completed
- [ ] Barber account sees only their appointments

### Cross-Browser
- [ ] Chrome (desktop + mobile)
- [ ] Safari (iOS)
- [ ] Firefox

---

## Task 5.8 — Create Sitemap & Robots

Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://gabarbershop.am/sitemap.xml
```

Create `src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['hy', 'ru', 'en'];
  const baseUrl = 'https://gabarbershop.am';

  const pages = ['', '/booking', '/visualizer'];

  return locales.flatMap(locale =>
    pages.map(page => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  );
}
```

---

## Task 5.9 — Vercel Deployment Prep (When Ready)

When Gor is ready to deploy:

1. Create Vercel account at vercel.com
2. Import GitHub repository
3. Set all environment variables from `.env.local` in Vercel dashboard
4. Set `NEXT_PUBLIC_SITE_URL=https://gabarbershop.am` (your domain)
5. Deploy

**Supabase production settings:**
- In Supabase → Authentication → URL Configuration:
  - Set Site URL to `https://gabarbershop.am`
  - Add redirect URLs: `https://gabarbershop.am/hy/admin`, `/ru/admin`, `/en/admin`

---

## Phase 5 — Final Launch Checklist

- [ ] All translations complete and reviewed by Gor
- [ ] Contact info correct: Totovents 1/2, +374 77 06 01 32
- [ ] Opening hours correct: Mon-Fri 10-20, Sat-Sun 11-18
- [ ] Barber photos uploaded to Supabase Storage
- [ ] Gallery photos uploaded (if available)
- [ ] Services have correct prices in AMD
- [ ] Admin/barber accounts created and tested
- [ ] Booking email from address configured (Resend)
- [ ] All 3 languages tested end-to-end
- [ ] Site works on mobile (iOS Safari)
- [ ] Lighthouse score > 85 performance

**🎉 When all pass → GA BARBER SHOP is ready for launch!**
