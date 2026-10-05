# SHIRSEKARS' FITNESS HUB (MANAGED BY FIT MANTRAS)

> **Next.js App Router · TypeScript · Tailwind CSS · Prisma ORM · PostgreSQL (Neon/Supabase) · Vercel Blob**  
> Complete production gym website & SaaS administration platform for Shirsekar's Fitness Hub, Bandra East, Mumbai. Built specifically for direct deployment to **Vercel**.

---

## 🚀 Architecture & Tech Stack

- **Framework:** Next.js 15+ (App Router with Server Components & Server Actions)
- **Language:** TypeScript 5+ (Strict typing)
- **Styling:** Tailwind CSS v4 (Athletic dark gym aesthetic, zero-pill metadata discipline, WCAG AA compliant)
- **Database & ORM:** PostgreSQL (Neon Serverless / Supabase / Vercel Postgres) via **Prisma ORM**
- **Cloud Media Storage:** **Vercel Blob** (`@vercel/blob`) for serverless cloud image uploads
- **Authentication:** Edge/Serverless-compatible JWT session cookies via **jose** (Web Crypto API, zero native crypto bindings)
- **SEO & Structured Data:** `LocalBusiness` / `ExerciseGym` JSON-LD schema with Bandra East Mumbai geo coordinates and verified 3.9 Google rating

---

## 📋 Vercel Deployment Guide (Step-by-Step)

### 1. Push to GitHub
Initialize git and push this codebase to your GitHub account:
```bash
git init
git add .
git commit -m "Initial commit of Shirsekar's Fitness Hub"
git branch -M main
git remote add origin https://github.com/<your-username>/shirsekar-fitness-hub.git
git push -u origin main
```

### 2. Import into Vercel
1. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository `shirsekar-fitness-hub`.
3. Framework Preset: **Next.js** (detected automatically).
4. Root Directory: `./` (default).

### 3. Provision PostgreSQL Database (Neon or Supabase)
You can provision PostgreSQL directly inside Vercel or through Neon/Supabase:
- **Option A (Vercel Marketplace - Recommended):**  
  In your Vercel Project Dashboard, navigate to the **Storage** tab, click **Create Database**, and select **Neon** or **Vercel Postgres**. Click **Connect**. Vercel will automatically inject `DATABASE_URL` into your environment variables.
- **Option B (External Neon/Supabase):**  
  Create a free project at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com). Copy the pooled connection string (with `?sslmode=require`).

### 4. Create Vercel Blob Store (for Cloud Image Uploads)
1. In your Vercel Project Dashboard, go to **Storage** → **Create**.
2. Select **Blob** and name it `sfh-gallery-blob`.
3. Click **Create & Connect to Project**.
4. Vercel automatically injects `BLOB_READ_WRITE_TOKEN`.

### 5. Configure Environment Variables
In the **Settings** → **Environment Variables** panel in Vercel, verify or add:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL pooled connection string | `postgresql://user:pass@ep-cool-fog.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | Non-pooled connection string (for migrations) | `postgresql://user:pass@ep-cool-fog.neon.tech/neondb?sslmode=require` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token | `vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxx` |
| `ADMIN_JWT_SECRET` | 32+ character random string for signing admin JWT | `shirsekar_fitness_hub_bandra_secret_token_key_2026_vercel` |
| `ADMIN_DEFAULT_EMAIL` | Super admin login email | `admin@shirsekarfitness.com` |
| `ADMIN_DEFAULT_PASSWORD`| Super admin login password | `admin123` |
| `NEXT_PUBLIC_APP_URL` | Canonical production domain | `https://shirsekar-fitness-hub.vercel.app` |

### 6. Run Database Migrations
Before or immediately after deploying, apply the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```
*(On first load, the application automatically seeds all default verified gym data, facilities, programs, memberships, and FAQs if the tables are empty).*

### 7. Deploy
Click **Deploy** in Vercel. Your build will run:
```bash
prisma generate && next build
```
Once deployed, Vercel will assign a production URL (e.g. `https://shirsekar-fitness-hub.vercel.app`).

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build & Start Production Mode
```bash
npm run build
npm start
```

---

## 🔐 Admin Dashboard Access

- **Route:** Visit `/admin` (or click "Admin / Staff Portal" in the website footer/header).
- **Default Email:** `admin@shirsekarfitness.com`
- **Default Password:** `admin123`
- **Modules Available:**
  1. **Dashboard Overview:** Metric counters for Total Leads, New Leads, Follow-ups, Converted, and Trial Bookings with real-time conversion rates.
  2. **Lead & Trial Management:** Search, status filters (`New`, `Contacted`, `Follow-up`, `Converted`, `Lost`), follow-up notes, and direct WhatsApp / Phone call triggers.
  3. **Membership Packages CRUD:** Create, update, or hide gym membership plans, pricing text, features, and seasonal offers.
  4. **Training Programs CMS:** Manage fitness programs, descriptions, target audiences, and difficulty levels.
  5. **Facilities & Equipment:** Edit descriptions, equipment lists, and photos.
  6. **Gallery & Cloud Upload:** Upload gym photos directly to **Vercel Blob** CDN, categorize, and mark featured items.
  7. **Google Reviews & Testimonials:** Manage verified member reviews and transparent feedback.
  8. **FAQs Management:** Update gym hours, address, beginner guidance, and trial instructions.
  9. **Contact Messages:** View inquiries received through the contact desk.
  10. **Business Settings:** Edit phone, WhatsApp number, physical address, timings, SEO titles, or export full JSON data backups.

---

## 🛡️ Production & Serverless Resilience

1. **Zero Cold-Start Crashes:** The database service in `src/lib/db.ts` uses connection caching and handles serverless pool reconnections gracefully.
2. **Graceful Preview Fallback:** If `DATABASE_URL` is omitted in staging/preview environments, the app falls back to the verified seed dataset without throwing database connection errors.
3. **No Local Filesystem State:** All uploads flow through `@vercel/blob` and all state lives in PostgreSQL, eliminating `EROFS` (read-only filesystem) errors on Vercel.
4. **Edge-Safe Auth:** JWT signing and validation use the standard Web Crypto API (`jose`), compatible with Vercel Edge Middleware and Serverless functions.

---

## 📍 Business Information Reference

- **Business Name:** Shirsekar's Fitness Hub (Managed by Fit Mantras)
- **Local Name:** शिरसेकर्स' फिटनेस हब — मॅनेज्ड बाय - फिट मंत्रास
- **Address:** Mahatma Gandhi Vidyamandir, JL Shirshekar Marg, Government Colony, Bandra East, Mumbai, Maharashtra 400051, India
- **Phone:** 077100 39324 / +91 77100 39324
- **Google Rating:** 3.9 / 5 (43 Verified Reviews)
- **Operating Hours:** Mon – Sat: 6:00 AM – 10:30 PM | Sun: 7:00 AM – 1:00 PM
