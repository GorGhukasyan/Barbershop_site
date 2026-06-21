# DATABASE-DESIGN.md — Database Schema

> Run these SQL statements in the **Supabase SQL Editor** in order.
> After running, also update `prisma/schema.prisma` to match.

---

## Tables Overview

| Table | Description |
|-------|-------------|
| `barbers` | Barber profiles (linked to Supabase Auth users) |
| `services` | Services offered (haircut, beard, styling) |
| `barber_services` | Which barber performs which service |
| `working_hours` | Weekly schedule per barber |
| `time_off` | Specific days off per barber |
| `appointments` | All bookings (guest + info) |
| `gallery_images` | Photo gallery for the website |
| `contact_messages` | Messages from contact form |

---

## SQL: Create All Tables

```sql
-- ============================================================
-- STEP 1: Enable UUID extension (usually already enabled)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- STEP 2: BARBERS
-- ============================================================
CREATE TABLE barbers (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,       -- URL-friendly name
  bio_hy           TEXT DEFAULT '',
  bio_ru           TEXT DEFAULT '',
  bio_en           TEXT DEFAULT '',
  photo_url        TEXT DEFAULT '',
  specialties      TEXT[] DEFAULT '{}',        -- e.g. ['fade', 'beard']
  role             TEXT NOT NULL DEFAULT 'barber' CHECK (role IN ('admin', 'barber')),
  is_active        BOOLEAN NOT NULL DEFAULT true,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STEP 3: SERVICES
-- ============================================================
CREATE TABLE services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_hy          TEXT NOT NULL,
  name_ru          TEXT NOT NULL,
  name_en          TEXT NOT NULL,
  description_hy   TEXT DEFAULT '',
  description_ru   TEXT DEFAULT '',
  description_en   TEXT DEFAULT '',
  duration_minutes INTEGER NOT NULL,           -- e.g. 30, 45, 60
  price_amd        INTEGER NOT NULL,           -- price in AMD (e.g. 3500)
  category         TEXT NOT NULL CHECK (category IN ('haircut', 'beard', 'styling')),
  icon             TEXT DEFAULT 'scissors',    -- icon name for UI
  is_active        BOOLEAN NOT NULL DEFAULT true,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STEP 4: BARBER_SERVICES (junction)
-- ============================================================
CREATE TABLE barber_services (
  barber_id  UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (barber_id, service_id)
);

-- ============================================================
-- STEP 5: WORKING_HOURS
-- ============================================================
CREATE TABLE working_hours (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id    UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  day_of_week  INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_working   BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (barber_id, day_of_week)
);

-- ============================================================
-- STEP 6: TIME_OFF
-- ============================================================
CREATE TABLE time_off (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id    UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  reason       TEXT DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (barber_id, date)
);

-- ============================================================
-- STEP 7: APPOINTMENTS
-- ============================================================
CREATE TABLE appointments (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_number TEXT NOT NULL UNIQUE,     -- e.g. "GA-2025-001"
  barber_id          UUID NOT NULL REFERENCES barbers(id) ON DELETE RESTRICT,
  service_id         UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,

  -- Client info (guest — no account)
  client_name        TEXT NOT NULL,
  client_email       TEXT NOT NULL,
  client_phone       TEXT NOT NULL,

  -- Timing
  appointment_date   DATE NOT NULL,
  start_time         TIME NOT NULL,
  end_time           TIME NOT NULL,

  -- Status
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),

  -- Metadata
  notes              TEXT DEFAULT '',          -- internal notes by admin
  client_notes       TEXT DEFAULT '',          -- notes from customer
  locale             TEXT NOT NULL DEFAULT 'hy'
                     CHECK (locale IN ('hy', 'ru', 'en')),

  -- Timestamps
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at       TIMESTAMPTZ,
  cancelled_at       TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ
);

-- ============================================================
-- STEP 8: GALLERY_IMAGES
-- ============================================================
CREATE TABLE gallery_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url         TEXT NOT NULL,
  alt_hy      TEXT DEFAULT '',
  alt_ru      TEXT DEFAULT '',
  alt_en      TEXT DEFAULT '',
  category    TEXT NOT NULL CHECK (category IN ('haircut', 'beard', 'styling', 'interior', 'team')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STEP 9: CONTACT_MESSAGES
-- ============================================================
CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT DEFAULT '',
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## SQL: Indexes

```sql
-- appointments: frequent queries by date and barber
CREATE INDEX idx_appointments_barber_date
  ON appointments(barber_id, appointment_date);

CREATE INDEX idx_appointments_date_status
  ON appointments(appointment_date, status);

CREATE INDEX idx_appointments_email
  ON appointments(client_email);

-- working_hours: look up by barber
CREATE INDEX idx_working_hours_barber
  ON working_hours(barber_id);

-- time_off: look up by barber + date
CREATE INDEX idx_time_off_barber_date
  ON time_off(barber_id, date);

-- barbers: active only
CREATE INDEX idx_barbers_active
  ON barbers(is_active) WHERE is_active = true;

-- services: active, sorted
CREATE INDEX idx_services_active_sort
  ON services(is_active, sort_order) WHERE is_active = true;
```

---

## SQL: Auto-update `updated_at`

```sql
-- Function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trg_barbers_updated_at
  BEFORE UPDATE ON barbers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## SQL: Auto-generate Appointment Number

```sql
-- Sequence for appointment numbers
CREATE SEQUENCE appointment_number_seq START 1;

-- Function
CREATE OR REPLACE FUNCTION generate_appointment_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.appointment_number = 'GA-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD(NEXTVAL('appointment_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger (only on INSERT)
CREATE TRIGGER trg_appointment_number
  BEFORE INSERT ON appointments
  FOR EACH ROW EXECUTE FUNCTION generate_appointment_number();
```

---

## Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE barbers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE services        ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours   ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_off        ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ── PUBLIC READ policies (no auth required) ──────────────────

-- Anyone can read active barbers
CREATE POLICY "Public read active barbers"
  ON barbers FOR SELECT
  USING (is_active = true);

-- Anyone can read active services
CREATE POLICY "Public read active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Anyone can read barber_services (for booking)
CREATE POLICY "Public read barber_services"
  ON barber_services FOR SELECT
  USING (true);

-- Anyone can read working_hours (for availability)
CREATE POLICY "Public read working_hours"
  ON working_hours FOR SELECT
  USING (true);

-- Anyone can read time_off (for availability)
CREATE POLICY "Public read time_off"
  ON time_off FOR SELECT
  USING (true);

-- Anyone can read active gallery images
CREATE POLICY "Public read gallery"
  ON gallery_images FOR SELECT
  USING (is_active = true);

-- ── GUEST BOOKING policy ─────────────────────────────────────

-- Anyone can INSERT an appointment (guest booking)
CREATE POLICY "Guest can book appointment"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Anyone can SELECT their own appointment by email (for confirmation page)
CREATE POLICY "Guest can read own appointment"
  ON appointments FOR SELECT
  USING (true); -- We filter by appointment_number in the query

-- ── ADMIN policies (requires auth) ───────────────────────────

-- Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM barbers
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper: is the current user a barber or admin?
CREATE OR REPLACE FUNCTION is_barber()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM barbers
    WHERE user_id = auth.uid()
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin can read all barbers (including inactive)
CREATE POLICY "Admin read all barbers"
  ON barbers FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin can manage barbers
CREATE POLICY "Admin manage barbers"
  ON barbers FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin can manage services
CREATE POLICY "Admin manage services"
  ON services FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Barber can read their own working_hours
CREATE POLICY "Barber read own hours"
  ON working_hours FOR SELECT
  TO authenticated
  USING (
    barber_id = (SELECT id FROM barbers WHERE user_id = auth.uid())
  );

-- Admin can manage all working_hours
CREATE POLICY "Admin manage working_hours"
  ON working_hours FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin can read all appointments
CREATE POLICY "Admin read all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin can update appointments (confirm, cancel, complete)
CREATE POLICY "Admin update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Barber can read their own appointments
CREATE POLICY "Barber read own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    barber_id = (SELECT id FROM barbers WHERE user_id = auth.uid())
  );

-- Admin can read contact messages
CREATE POLICY "Admin read contacts"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin());

-- Anyone can send a contact message
CREATE POLICY "Public insert contact"
  ON contact_messages FOR INSERT
  WITH CHECK (true);
```

---

## SQL: Seed Data (Initial Setup)

```sql
-- Insert default services
INSERT INTO services (name_hy, name_ru, name_en, description_hy, description_ru, description_en,
                      duration_minutes, price_amd, category, sort_order) VALUES
(
  'Մազ կտրել',
  'Стрижка',
  'Haircut',
  'Դասական կամ ժամանակակից մազ կտրելու ծառայություն',
  'Классическая или современная стрижка волос',
  'Classic or modern hair cutting service',
  45, 3000, 'haircut', 1
),
(
  'Մորուք խնամել',
  'Стрижка бороды',
  'Beard Trim',
  'Մորուքի ձևավորում, խնամ և հարդարում',
  'Оформление, уход и подравнивание бороды',
  'Beard shaping, care and grooming',
  30, 2000, 'beard', 2
),
(
  'Ձևավորում',
  'Укладка',
  'Styling',
  'Մազի մատնոցավոր ձևավորում հատուկ պրոֆեսիոնալ նյութերով',
  'Профессиональная укладка волос с использованием специальных средств',
  'Professional hair styling with premium products',
  30, 1500, 'styling', 3
);

-- NOTE: Insert barbers manually after creating their Supabase Auth accounts.
-- After creating auth users in Supabase dashboard, run:
--
-- INSERT INTO barbers (user_id, name, slug, bio_hy, bio_ru, bio_en, role, sort_order) VALUES
-- ('<AUTH_USER_ID_1>', 'Gor', 'gor', '...', '...', '...', 'admin', 1),
-- ('<AUTH_USER_ID_2>', 'Barber Name', 'barber-name', '...', '...', '...', 'barber', 2);
--
-- Then insert working_hours for each barber:
-- Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6, Sunday=0
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Barber {
  id           String   @id @default(uuid())
  userId       String?  @map("user_id")
  name         String
  slug         String   @unique
  bioHy        String   @default("") @map("bio_hy")
  bioRu        String   @default("") @map("bio_ru")
  bioEn        String   @default("") @map("bio_en")
  photoUrl     String   @default("") @map("photo_url")
  specialties  String[] @default([])
  role         String   @default("barber")
  isActive     Boolean  @default(true) @map("is_active")
  sortOrder    Int      @default(0) @map("sort_order")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  services     BarberService[]
  workingHours WorkingHour[]
  timeOff      TimeOff[]
  appointments Appointment[]

  @@map("barbers")
}

model Service {
  id              String   @id @default(uuid())
  nameHy          String   @map("name_hy")
  nameRu          String   @map("name_ru")
  nameEn          String   @map("name_en")
  descriptionHy   String   @default("") @map("description_hy")
  descriptionRu   String   @default("") @map("description_ru")
  descriptionEn   String   @default("") @map("description_en")
  durationMinutes Int      @map("duration_minutes")
  priceAmd        Int      @map("price_amd")
  category        String
  icon            String   @default("scissors")
  isActive        Boolean  @default(true) @map("is_active")
  sortOrder       Int      @default(0) @map("sort_order")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  barbers      BarberService[]
  appointments Appointment[]

  @@map("services")
}

model BarberService {
  barberId  String @map("barber_id")
  serviceId String @map("service_id")
  barber    Barber  @relation(fields: [barberId], references: [id], onDelete: Cascade)
  service   Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  @@id([barberId, serviceId])
  @@map("barber_services")
}

model WorkingHour {
  id         String  @id @default(uuid())
  barberId   String  @map("barber_id")
  dayOfWeek  Int     @map("day_of_week")
  startTime  String  @map("start_time")   // "10:00"
  endTime    String  @map("end_time")     // "20:00"
  isWorking  Boolean @default(true) @map("is_working")
  barber     Barber  @relation(fields: [barberId], references: [id], onDelete: Cascade)

  @@unique([barberId, dayOfWeek])
  @@map("working_hours")
}

model TimeOff {
  id        String   @id @default(uuid())
  barberId  String   @map("barber_id")
  date      DateTime @db.Date
  reason    String   @default("")
  createdAt DateTime @default(now()) @map("created_at")
  barber    Barber   @relation(fields: [barberId], references: [id], onDelete: Cascade)

  @@unique([barberId, date])
  @@map("time_off")
}

model Appointment {
  id                String    @id @default(uuid())
  appointmentNumber String    @unique @map("appointment_number")
  barberId          String    @map("barber_id")
  serviceId         String    @map("service_id")
  clientName        String    @map("client_name")
  clientEmail       String    @map("client_email")
  clientPhone       String    @map("client_phone")
  appointmentDate   DateTime  @db.Date @map("appointment_date")
  startTime         String    @map("start_time")  // "14:30"
  endTime           String    @map("end_time")    // "15:15"
  status            String    @default("pending")
  notes             String    @default("")
  clientNotes       String    @default("") @map("client_notes")
  locale            String    @default("hy")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  confirmedAt       DateTime? @map("confirmed_at")
  cancelledAt       DateTime? @map("cancelled_at")
  completedAt       DateTime? @map("completed_at")

  barber  Barber  @relation(fields: [barberId], references: [id])
  service Service @relation(fields: [serviceId], references: [id])

  @@index([barberId, appointmentDate])
  @@index([appointmentDate, status])
  @@map("appointments")
}

model GalleryImage {
  id        String   @id @default(uuid())
  url       String
  altHy     String   @default("") @map("alt_hy")
  altRu     String   @default("") @map("alt_ru")
  altEn     String   @default("") @map("alt_en")
  category  String
  isActive  Boolean  @default(true) @map("is_active")
  sortOrder Int      @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("gallery_images")
}

model ContactMessage {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String   @default("")
  message   String
  isRead    Boolean  @default(false) @map("is_read")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("contact_messages")
}
```

---

## Supabase Storage Buckets

Create these buckets in Supabase Dashboard → Storage:

| Bucket | Public | Purpose |
|--------|--------|---------|
| `barber-photos` | ✅ Yes | Barber profile photos |
| `gallery` | ✅ Yes | Website gallery images |

**Storage policies** (run in SQL Editor):
```sql
-- barber-photos: public read, admin write
CREATE POLICY "Public read barber photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'barber-photos');

CREATE POLICY "Admin upload barber photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'barber-photos' AND is_admin());

-- gallery: public read, admin write
CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Admin upload gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND is_admin());
```
