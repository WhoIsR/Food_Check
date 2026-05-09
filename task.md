# FoodCheck MVP — Task Tracker

## Phase 1: Project Setup
- [/] Initialize Next.js project with TypeScript, Tailwind, App Router
- [ ] Install dependencies (framer-motion, phosphor-icons, @google/generative-ai, etc.)
- [x] **Setup Awal**
  - [x] Periksa dan validasi `NEXT_PUBLIC_SUPABASE_URL` dan `KEY` di `.env.local`.
  - [x] Install package Supabase (`@supabase/ssr` dan `@supabase/supabase-js`).
  - [x] Buat *utility client* Supabase untuk browser, server, dan middleware.

- [x] **Sistem Autentikasi (Google Auth)**
  - [x] Buat rute *callback* API (`/auth/callback`) untuk memproses login Google.
  - [x] Buat halaman `/login` dengan desain responsif dan tombol "Lanjutkan dengan Google".
  - [x] Update komponen `Navbar` untuk menampilkan foto profil user / tombol Login.
  - [x] Tambahkan tombol "Logout".

- [x] **Fitur Kamera In-App (WebRTC)**
  - [x] Buat komponen `WebCamera.tsx` yang menggunakan `navigator.mediaDevices.getUserMedia()`.
  - [x] Integrasikan `WebCamera` ke dalam `ImageInput.tsx` sebagai pengganti fitur `capture="environment"` yang bermasalah di Desktop.)

## Phase 2: Design System & Layout
- [ ] Create ThemeProvider (dark/light mode toggle + localStorage persistence)
- [ ] Build global CSS design tokens (colors, glassmorphism, typography)
- [ ] Build layout shell (Navbar + Footer)

## Phase 3: Core UI Components
- [ ] Health condition filter chips
- [ ] Ingredient textarea input with tactile CTA button
- [ ] Clean Score display (animated gauge)
- [ ] Ingredient result list (staggered animation, status badges)
- [ ] Loading skeleton states
- [ ] Empty / Error states

## Phase 4: API & AI Integration
- [ ] Create `/api/analyze` route with Gemini prompt
- [ ] Wire frontend form to API
- [ ] Handle loading, success, and error flows

## Phase 5: Polish & Verification
- [ ] Dark/Light mode visual QA
- [ ] Mobile responsiveness (360px–430px)
- [ ] Run `npm run build` to verify production readiness
- [ ] Browser test the full flow
