# PRD — FoodCheck: AI Decoder Label Bahan Makanan

**Versi:** 1.0  
**Tanggal:** Mei 2026  
**Status:** Draft  

---

## 1. Executive Summary

FoodCheck adalah web app berbasis AI yang membantu pengguna memahami bahan-bahan dalam produk makanan kemasan. Pengguna cukup memfoto atau mengetik daftar bahan, lalu AI akan menjelaskan setiap bahan dalam bahasa sehari-hari, memberikan peringatan berdasarkan kondisi kesehatan tertentu, dan memberikan skor keamanan produk secara keseluruhan.

**Masalah inti:** Mayoritas konsumen Indonesia tidak memahami daftar bahan di kemasan makanan. Label seperti *"Natrium Benzoat, Tartrazin CI 19140, BHT"* tidak bermakna apa-apa bagi orang awam, padahal informasi ini krusial untuk keputusan konsumsi sehari-hari.

**Solusi:** Ubah label teknis menjadi penjelasan yang mudah dimengerti, dengan konteks relevan untuk kondisi kesehatan pengguna.

---

## 2. Problem Statement

### 2.1 Masalah yang Diselesaikan

Regulasi BPOM mewajibkan pencantuman bahan pada label makanan — namun nama-nama bahan tersebut ditulis dalam istilah teknis/kimia yang tidak dipahami konsumen umum. Akibatnya:

- Konsumen tidak bisa membuat keputusan berdasarkan informasi yang cukup
- Penderita penyakit tertentu (diabetes, hipertensi, alergi) tidak tahu bahan apa yang perlu dihindari
- Orang tua tidak bisa menilai keamanan produk untuk anak-anak
- Ibu hamil tidak tahu bahan mana yang berisiko

### 2.2 Mengapa Sekarang

- Penetrasi smartphone Indonesia >80%, kamera HP sudah umum
- AI Vision sudah cukup akurat untuk ekstrak teks dari foto
- Kesadaran gizi masyarakat Indonesia meningkat pasca-pandemi
- Belum ada solusi lokal yang memadai untuk masalah ini

### 2.3 Kenapa Solusi yang Ada Belum Cukup

| Solusi Saat Ini | Kekurangan |
|---|---|
| Google/Wikipedia | Harus cari satu per satu, tidak ada konteks kondisi kesehatan |
| Yuka (app luar negeri) | Tidak ada di Indonesia, database produk lokal kosong |
| Tanya dokter/ahli gizi | Mahal, tidak real-time, tidak praktis saat belanja |
| Label BPOM | Hanya ada rating, tidak ada penjelasan per bahan |

---

## 3. Target Pengguna

### 3.1 Primary User

**Ibu Rumah Tangga / "Ibu yang Aware"**
- Usia 25–45 tahun
- Berbelanja untuk keluarga, termasuk anak kecil
- Mulai peduli bahan makanan tapi tidak punya latar belakang gizi
- Sering belanja di supermarket atau online
- Pain point: *"Aku mau beli yang sehat tapi nggak ngerti bacanya"*

### 3.2 Secondary Users

**Penderita Penyakit Kronis**
- Diabetes tipe 2, hipertensi, kolesterol tinggi
- Perlu tahu kandungan yang harus dihindari (gula tersembunyi, sodium, lemak trans)
- Pain point: *"Dokter bilang hindari ini-itu tapi di label nggak jelas mana yang mana"*

**Ibu Hamil**
- Perlu menghindari bahan tertentu (kafein berlebih, sakarin, dll)
- Sangat aktif mencari informasi keamanan makanan
- Pain point: *"Takut salah makan, tapi nggak tahu harus cek ke mana"*

**Health-Conscious Millenial / Gen Z**
- Usia 18–35, mulai peduli clean eating
- Aktif di sosmed, suka share konten kesehatan
- Pain point: *"Mau makan clean tapi bingung mana yang beneran clean"*

### 3.3 Bukan Target (untuk MVP)

- Profesional kesehatan (butuh data klinis, bukan simplified)
- Pengguna tanpa smartphone
- Anak-anak

---

## 4. Goals & Success Metrics

### 4.1 Goals Produk

| Goal | Keterangan |
|---|---|
| Akurasi | Penjelasan bahan harus benar secara ilmiah |
| Kecepatan | Hasil analisis < 5 detik |
| Aksesibilitas | Bisa dipakai tanpa registrasi |
| Relevansi Lokal | Mengenal bahan dan produk yang umum di Indonesia |

### 4.2 Success Metrics (3 bulan pertama)

| Metrik | Target |
|---|---|
| MAU (Monthly Active Users) | 5.000 |
| Scan per user per bulan | ≥ 3 |
| Bounce rate | < 60% |
| Penyelesaian analisis (tidak drop di tengah) | > 75% |
| Share rate (hasil di-screenshot/share) | > 15% |
| NPS (Net Promoter Score) | > 40 |

---

## 5. Fitur & Requirement

### 5.1 Feature List — MVP (Fase 1)

#### F-01: Input Teks Bahan
- **Deskripsi:** Pengguna mengetik atau paste daftar bahan dari label
- **Priority:** Must Have
- **Detail:**
  - Textarea dengan placeholder contoh format
  - Tombol "Analisis Sekarang"
  - Batas karakter: 2000 karakter
  - Tidak perlu login untuk menggunakan

#### F-02: Analisis AI per Bahan
- **Deskripsi:** Setiap bahan dianalisis dan dijelaskan secara individual
- **Priority:** Must Have
- **Detail:**
  - Nama bahan versi sehari-hari (misal: "Tartrazin" → "Pewarna kuning sintetis")
  - Status: Aman / Waspada / Hindari
  - Penjelasan 1–2 kalimat dalam Bahasa Indonesia
  - Flag kondisi khusus (misal: "hindari jika diabetes")
  - Sumber referensi singkat (BPOM, WHO, EFSA)

#### F-03: Clean Score
- **Deskripsi:** Skor keseluruhan 0–100 untuk produk
- **Priority:** Must Have
- **Detail:**
  - Kalkulasi berdasarkan jumlah dan tingkat keparahan bahan bermasalah
  - Label teks: Sangat Bersih / Cukup Bersih / Perlu Waspada / Tidak Disarankan
  - Visual indikator (bar atau angka besar)

#### F-04: Filter Kondisi Kesehatan
- **Deskripsi:** Pengguna bisa set kondisi kesehatan, hasil di-flag sesuai
- **Priority:** Must Have
- **Detail:**
  - Pilihan: Diabetes, Hipertensi, Ibu Hamil, Alergi Gluten, Alergi Kacang, Bayi/Anak
  - Multi-select diperbolehkan
  - Filter ini mempengaruhi highlight dan urutan peringatan
  - Tersimpan di localStorage (tidak perlu login)

#### F-05: Tombol Share Hasil
- **Deskripsi:** Generate gambar hasil scan yang bisa di-share
- **Priority:** Should Have
- **Detail:**
  - Tombol "Bagikan Hasil" menghasilkan PNG summary
  - Berisi: nama produk (opsional), clean score, top 3 bahan bermasalah
  - Branding FoodCheck kecil di bagian bawah (viral loop)

---

### 5.2 Feature List — Fase 2 (Minggu 2–3)

#### F-06: Input Foto Label
- **Deskripsi:** Pengguna memfoto label, AI ekstrak dan analisis sekaligus
- **Priority:** Must Have (Fase 2)
- **Detail:**
  - Upload gambar dari galeri atau ambil foto langsung (mobile)
  - Gemini Vision membaca teks bahan dari foto
  - Jika teks tidak terbaca jelas, tampilkan pesan error yang helpful
  - Format yang didukung: JPG, PNG, HEIC
  - Ukuran maksimal: 10MB

#### F-07: Riwayat Scan
- **Deskripsi:** Simpan produk yang pernah di-scan
- **Priority:** Should Have
- **Detail:**
  - Disimpan di localStorage (tanpa backend)
  - Tampilkan nama produk (jika diisi), tanggal, dan clean score
  - Bisa dihapus per item
  - Maksimal 20 item tersimpan

#### F-08: Scan Ulang Cepat
- **Deskripsi:** Produk populer yang sering di-scan tersimpan di cache server
- **Priority:** Nice to Have
- **Detail:**
  - Cache hasil analisis selama 30 hari
  - Jika produk sudah pernah di-scan pengguna lain, hasilnya langsung muncul (< 1 detik)

---

### 5.3 Feature List — Fase 3 (Bulan 2)

#### F-09: PWA (Progressive Web App)
- **Deskripsi:** Bisa di-install ke homescreen seperti native app
- **Priority:** Should Have
- **Detail:**
  - Web App Manifest
  - Service worker untuk cache aset
  - Push notification reminder (opsional, opt-in)

#### F-10: Perbandingan Produk
- **Deskripsi:** Bandingkan 2 produk serupa side-by-side
- **Priority:** Nice to Have
- **Detail:**
  - Scan atau input 2 produk, tampilkan perbandingan clean score dan bahan bermasalah
  - Rekomendasi "pilih yang mana"

#### F-11: Glosarium Bahan
- **Deskripsi:** Ensiklopedia bahan makanan yang bisa dicari
- **Priority:** Nice to Have
- **Detail:**
  - Search bahan by nama teknis atau nama awam
  - Konten: penjelasan, risiko, batasan aman (ADI), produk yang sering mengandungnya

---

## 6. User Stories

### Epic 1: Analisis Bahan

| ID | User Story | Priority |
|---|---|---|
| US-01 | Sebagai pengguna, saya ingin mengetik daftar bahan dan mendapat penjelasannya dalam Bahasa Indonesia yang mudah dipahami | Must |
| US-02 | Sebagai pengguna, saya ingin tahu bahan mana yang perlu saya waspadai | Must |
| US-03 | Sebagai pengguna, saya ingin mendapat satu skor yang menggambarkan "seberapa aman" produk ini secara keseluruhan | Must |
| US-04 | Sebagai ibu hamil, saya ingin tahu bahan mana yang berbahaya untuk kehamilan saya | Must |
| US-05 | Sebagai penderita diabetes, saya ingin tahu bahan mana yang meningkatkan gula darah | Must |

### Epic 2: Input Foto

| ID | User Story | Priority |
|---|---|---|
| US-06 | Sebagai pengguna yang sedang di supermarket, saya ingin langsung foto label tanpa harus mengetik | Should |
| US-07 | Sebagai pengguna, saya ingin tahu jika foto saya terlalu buram dan tidak bisa dibaca AI | Should |

### Epic 3: Share & Sosial

| ID | User Story | Priority |
|---|---|---|
| US-08 | Sebagai pengguna, saya ingin share hasil scan ke WhatsApp/Instagram untuk memberitahu teman | Should |
| US-09 | Sebagai pengguna, saya ingin menyimpan hasil scan produk yang sering saya beli | Could |

---

## 7. User Flows

### Flow 1: Analisis via Teks (Happy Path)

```
[Buka FoodCheck] 
    → [Pilih kondisi kesehatan (opsional)] 
    → [Paste/ketik daftar bahan] 
    → [Klik "Analisis"] 
    → [Loading ~3 detik] 
    → [Tampil hasil: Clean Score + daftar bahan dengan status] 
    → [User baca penjelasan] 
    → [User share atau scan produk lain]
```

### Flow 2: Analisis via Foto (Fase 2)

```
[Buka FoodCheck]
    → [Tap "Foto Label"]
    → [Kamera/galeri terbuka]
    → [Ambil/pilih foto]
    → [Preview + konfirmasi]
    → [AI ekstrak teks bahan]
    → [Tampil teks yang diekstrak — user bisa koreksi]
    → [Analisis berjalan]
    → [Tampil hasil]
```

### Flow 3: Error — Foto Tidak Terbaca

```
[Upload foto]
    → [AI tidak bisa baca teks]
    → [Tampil pesan: "Label tidak terbaca. Coba ambil foto lebih dekat atau dengan cahaya lebih terang"]
    → [Tawarkan: "Coba foto lagi" atau "Ketik manual"]
```

---

## 8. Arsitektur Teknis

### 8.1 Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR/SSG, Vercel native, ecosystem besar |
| Styling | Tailwind CSS | Cepat, tidak perlu setup |
| AI | Google Gemini 1.5 Flash API | Gratis tier cukup, ada Vision, respons cepat |
| OCR | Gemini Vision (built-in) | Tidak perlu library OCR terpisah |
| Image share | html-to-image (npm) | Generate PNG dari DOM |
| Storage | localStorage saja (MVP) | Tidak perlu backend/DB di awal |
| Hosting | Vercel (free tier) | Deploy otomatis, CDN global |
| Analytics | Vercel Analytics | Gratis, privacy-friendly |

### 8.2 Arsitektur Aplikasi

```
[Browser / PWA]
    │
    ├── /app (Next.js pages)
    │     ├── page.tsx          → Halaman utama (input + hasil)
    │     ├── history/page.tsx  → Riwayat scan
    │     └── about/page.tsx    → Tentang + disclaimer
    │
    └── /app/api
          └── analyze/route.ts  → API route → panggil Gemini API
                                   (API key aman di server side)
```

### 8.3 Prompt Design

Prompt ke Gemini dirancang untuk menghasilkan JSON terstruktur:

```typescript
// Struktur output yang diharapkan
interface AnalysisResult {
  clean_score: number;          // 0-100
  score_label: string;          // "Sangat Bersih" | "Cukup Bersih" | dst.
  ingredients: IngredientResult[];
}

interface IngredientResult {
  original_name: string;        // nama di label
  plain_name: string;           // nama awam
  category: string;             // "Pewarna" | "Pengawet" | "Pemanis" | dst.
  status: "aman" | "waspada" | "hindari";
  explanation: string;          // maks 2 kalimat, Bahasa Indonesia
  flag_for: string[];           // ["diabetes", "ibu hamil", dst.]
  adi?: string;                 // Acceptable Daily Intake jika ada
}
```

### 8.4 Penanganan Data & Privasi

- Tidak ada data pengguna yang disimpan di server
- Teks bahan atau foto tidak di-log atau disimpan pasca analisis
- Kondisi kesehatan pengguna hanya di localStorage
- Gemini API dikonfigurasi tanpa data logging (tersedia di Google AI Studio)
- Disclaimer jelas: bukan pengganti saran medis profesional

---

## 9. UI/UX Guidelines

### 9.1 Prinsip Desain

- **Mobile-first:** mayoritas pengguna akses dari HP saat belanja
- **Satu tindakan per layar:** jangan membingungkan dengan terlalu banyak opsi
- **Warna sebagai kode:** Hijau = aman, Kuning = waspada, Merah = hindari (konsisten di seluruh app)
- **Bahasa Indonesia sepenuhnya:** tidak ada jargon atau istilah asing tanpa penjelasan

### 9.2 Halaman Utama — Struktur

```
┌─────────────────────────────────┐
│  FoodCheck logo + tagline       │
├─────────────────────────────────┤
│  [Filter kondisi kesehatan]     │ ← chip/toggle kecil
│  Diabetes  Hamil  Anak  dst     │
├─────────────────────────────────┤
│  [Tab: Foto Label] [Tab: Teks]  │
├─────────────────────────────────┤
│  Fase 1:                        │
│  ┌────────────────────────────┐ │
│  │ Paste daftar bahan di sini │ │
│  │ Contoh: Gula, Tepung...    │ │
│  └────────────────────────────┘ │
│  [Analisis Sekarang →]          │
├─────────────────────────────────┤
│  HASIL:                         │
│  Clean Score: 72/100            │
│  ████████░░ Cukup Bersih        │
│                                 │
│  ● Gula             [AMAN]      │
│  ● Tartrazin        [WASPADA]   │
│    Pewarna kuning sintetis...   │
│  ● Natrium Benzoat  [WASPADA]   │
│    Pengawet yang dapat...       │
└─────────────────────────────────┘
```

### 9.3 Status Warna

| Status | Warna | Penggunaan |
|---|---|---|
| Aman | Hijau (#22C55E) | Bahan yang umumnya tidak bermasalah |
| Waspada | Kuning (#EAB308) | Bahan yang perlu diperhatikan dalam jumlah banyak |
| Hindari | Merah (#EF4444) | Bahan yang sebaiknya dihindari untuk kondisi tertentu |
| Info | Abu-abu | Bahan yang data-nya terbatas |

---

## 10. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Performance** | Analisis teks selesai < 5 detik. Analisis foto < 8 detik |
| **Availability** | Uptime > 99% (Vercel SLA) |
| **Mobile** | Fully responsive, terutama layar 360px–430px |
| **Aksesibilitas** | Kontras warna WCAG AA, font min 16px |
| **Bahasa** | Semua UI dan output dalam Bahasa Indonesia |
| **Browser** | Chrome 90+, Safari 14+, Firefox 88+ |
| **Offline** | Fase 3: cache halaman utama untuk buka tanpa internet (PWA) |
| **SEO** | Meta tags lengkap, OG image untuk share link |

---

## 11. Out of Scope (MVP)

Fitur berikut **tidak** dikerjakan di MVP dan mungkin dipertimbangkan di masa depan:

- Barcode scanner / lookup database produk
- Kalkulasi kalori atau nilai gizi (bukan hanya bahan)
- Akun pengguna / login
- Rekomendasi produk alternatif
- Integrasi dengan e-commerce
- Versi aplikasi native (iOS/Android)
- Multiple language support
- API publik untuk developer lain
- Chatbot / Q&A lanjutan tentang bahan

---

## 12. Risiko & Mitigasi

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| AI memberikan penjelasan tidak akurat | Medium | Tinggi | Selalu tampilkan disclaimer; review manual untuk bahan umum; tautkan ke sumber |
| Foto label tidak terbaca AI | Tinggi | Medium | Fallback ke input teks; pesan error yang jelas dengan panduan foto yang baik |
| Gemini API rate limit terlampaui (free tier) | Medium | Tinggi | Implementasi rate limiting di sisi app; siapkan migrasi ke paid tier |
| Pengguna menafsirkan sebagai saran medis | Medium | Tinggi | Disclaimer prominent di hasil dan halaman utama; konsultasi BPOM/dokter |
| Data bahan produk lokal tidak dikenal AI | Medium | Medium | Fine-tune prompt dengan contoh bahan Indonesia umum |
| Kontroversi hasil (merek tertentu nilai jelek) | Low | Tinggi | Jelaskan metodologi di halaman About; analisis adalah informatif, bukan judgment |

---

## 13. Timeline & Milestones

### Fase 1 — MVP Teks 
- Setup Next.js + Tailwind
- Integrasi Gemini API
- Halaman utama: input teks + hasil analisis
- Filter kondisi kesehatan
- Clean score
- Deploy ke VPS saya
- **Deliverable:** Live URL yang bisa dipakai

### Fase 2 — Foto & Polish 
- Upload foto + Gemini Vision
- Riwayat scan (localStorage)
- Tombol share → PNG
- Error handling lengkap
- Responsif di mobile
- **Deliverable:** Versi yang layak di-share ke publik

### Fase 3 — Growth 
- PWA manifest + install prompt
- SEO: landing page, meta tags, sitemap
- Cache produk populer
- Analytics
- Halaman Glosarium (opsional)
- **Deliverable:** Versi yang siap untuk akuisisi pengguna organik

---

## 14. Open Questions

Pertanyaan-pertanyaan ini perlu dijawab sebelum atau selama development:

1. **Nama produk:** Apakah "FoodCheck" adalah nama final? Perlu cek ketersediaan domain.
2. **Sumber data bahan:** Apakah cukup mengandalkan pengetahuan Gemini, atau perlu database bahan tambahan (BPOM, EFSA)?
3. **Disclaimer hukum:** Apakah perlu konsultasi hukum sebelum launch untuk menghindari klaim terhadap merek/produk tertentu?
4. **Monetisasi:** Kapan dan bagaimana modexl monetisasi diterapkan tanpa merusak UX gratis di awal?
5. **Bahasa:** Apakah perlu mendukung bahasa Inggris untuk bahan-bahan impor yang labelnya berbahasa Inggris?

---

## 15. Appendix

### 15.1 Contoh Bahan yang Perlu Dideteksi

| Nama Teknis | Nama Awam | Kategori | Perhatian |
|---|---|---|---|
| Tartrazin (CI 19140) | Pewarna kuning sintetis | Pewarna | Hiperaktivitas pada anak |
| Natrium Benzoat | Pengawet | Pengawet | Reaksi pada penderita asma |
| Aspartam | Pemanis buatan | Pemanis | Dihindari penderita fenilketonuria |
| MSG (Monosodium Glutamat) | Vetsin | Penyedap | Batasan wajar pada hipertensi |
| BHT/BHA | Antioksidan sintetis | Antioksidan | Diperdebatkan pada dosis tinggi |
| Karagenan | Pengental alga | Pengental | Iritasi usus pada sebagian orang |
| HFCS (High Fructose Corn Syrup) | Pemanis jagung fruktosa tinggi | Pemanis | Sangat relevan untuk diabetes |
| Natrium Nitrit | Pengawet daging | Pengawet | Daging olahan, karsinogen potensial |

### 15.2 Referensi

- BPOM RI — Peraturan bahan tambahan pangan: [bpom.go.id](https://bpom.go.id)
- EFSA — European Food Safety Authority database
- WHO — Guidelines on food additives
- Codex Alimentarius — International food standards
