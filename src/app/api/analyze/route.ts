import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const ANALYSIS_PROMPT = `Kamu adalah ahli keamanan pangan dan nutrisi. Analisis daftar bahan makanan berikut dan berikan penjelasan dalam Bahasa Indonesia yang mudah dipahami orang awam.

Berikan respons dalam format JSON SAJA (tanpa markdown, tanpa backtick, tanpa penjelasan tambahan di luar JSON) dengan struktur berikut:

{
  "product_name": "<Tebak nama produk berdasarkan gambar atau nama merek jika ada di teks/foto, jika tidak tahu tulis 'Produk Makanan/Minuman'>",
  "clean_score": <angka 0-100, di mana 100 = semua bahan aman>,
  "score_label": "<salah satu dari: Sangat Bersih / Cukup Bersih / Perlu Waspada / Tidak Disarankan>",
  "ingredients": [
    {
      "original_name": "<nama bahan seperti tertulis di label>",
      "plain_name": "<nama dalam bahasa sehari-hari>",
      "category": "<kategori: Pemanis / Pengawet / Pewarna / Penyedap / Pengemulsi / Pengental / Antioksidan / Bahan Utama / Lainnya>",
      "status": "<aman / waspada / hindari>",
      "explanation": "<penjelasan singkat 1-2 kalimat dalam Bahasa Indonesia>",
      "flag_for": [<daftar kondisi kesehatan yang perlu waspada, contoh: "diabetes", "hipertensi", "ibu_hamil", "alergi_gluten", "alergi_kacang", "anak">],
      "adi": "<batas aman harian jika ada, contoh: '0-5 mg/kg berat badan per hari', atau null jika tidak tersedia>"
    }
  ]
}

Pedoman penilaian clean_score:
- 80-100: Mayoritas bahan alami dan aman
- 60-79: Beberapa bahan perlu perhatian tapi umumnya aman
- 40-59: Cukup banyak bahan buatan/berpotensi masalah
- 0-39: Banyak bahan yang sebaiknya dihindari

Pastikan:
1. Setiap bahan dianalisis secara individual (maksimal 20 bahan paling utama/kritis jika daftar terlalu panjang).
2. Penjelasan menggunakan bahasa sehari-hari, sangat singkat, dan langsung pada intinya (maksimal 1-2 kalimat).
3. flag_for hanya diisi jika memang relevan untuk kondisi tersebut.
4. Status "hindari" hanya untuk bahan yang benar-benar berisiko.
5. Referensi ke standar BPOM, WHO, atau EFSA jika memungkinkan
6. PENTING: Respons harus berupa JSON yang valid, lengkap, dan ditutup dengan benar (} dan ]). Jangan sampai terpotong.`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "paste_your_key_here") {
      return NextResponse.json(
        { error: "API Key belum dikonfigurasi. Silakan isi GEMINI_API_KEY di file .env.local" },
        { status: 500 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    let ingredients = "";
    let conditions: string[] = [];
    let scanMode = "AUTO";
    let imagePart: Part | null = null;

    // Handle multipart form data (image upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      ingredients = (formData.get("ingredients") as string) || "";
      scanMode = (formData.get("scanMode") as string) || "AUTO";
      const conditionsRaw = formData.get("conditions") as string;
      if (conditionsRaw) {
        try {
          conditions = JSON.parse(conditionsRaw);
        } catch {
          conditions = [];
        }
      }

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        imagePart = {
          inlineData: {
            mimeType: imageFile.type,
            data: base64,
          },
        };
      }
    } else {
      // Handle JSON body (text-only)
      const body = await request.json();
      ingredients = body.ingredients || "";
      conditions = body.conditions || [];
      scanMode = body.scanMode || "AUTO";
    }

    // Must have either text ingredients or an image
    if (!ingredients.trim() && !imagePart) {
      return NextResponse.json(
        { error: "Masukkan daftar bahan atau foto label kemasan." },
        { status: 400 }
      );
    }

    if (ingredients.length > 2000) {
      return NextResponse.json(
        { error: "Daftar bahan terlalu panjang (maks 2000 karakter)." },
        { status: 400 }
      );
    }

    const conditionContext =
      conditions && conditions.length > 0
        ? `\n\nKondisi kesehatan pengguna yang perlu diperhatikan: ${conditions.join(", ")}. Berikan perhatian khusus pada bahan yang berbahaya atau perlu dihindari untuk kondisi-kondisi tersebut.`
        : "";

    // Build the prompt based on input type and scanMode
    let contextualPrompt: string;

    if (imagePart && !ingredients.trim()) {
      if (scanMode === "OCR") {
        contextualPrompt = `FOKUS UTAMA: Anda sedang dalam mode OCR (Optical Character Recognition) untuk mengekstrak dan menganalisis teks daftar komposisi dari foto kemasan produk.

TUGAS UTAMA:
1. Pindai dan ekstrak semua teks yang ada di foto, khususnya bagian "Komposisi", "Ingredients", atau daftar bahan baku lainnya.
2. JANGAN mencoba menebak bahan dari foto makanan, JANGAN menggunakan asumsi. Hanya baca apa yang tertulis di kemasan.
3. Setelah teks diekstrak, lakukan analisis keamanan dan kesehatan sesuai panduan untuk setiap bahan yang berhasil Anda baca.
4. Jika tidak ada teks bahan komposisi yang terbaca sama sekali, kembalikan json dengan pesan error (jika struktur mengizinkan, tapi tetap pertahankan format JSON).
5. Abaikan informasi lain seperti berat bersih, barcode, atau instruksi penggunaan jika tidak relevan.

Pastikan kamu menganalisis bahan berdasarkan teks yang benar-benar tertulis di gambar.
${conditionContext}

${ANALYSIS_PROMPT}`;
      } else {
        contextualPrompt = `Lihat foto produk makanan/minuman ini dengan sangat teliti. Foto ini bisa berupa makanan langsung, label komposisi, atau kemasan.

TUGAS UTAMA:
1. Jika ini adalah foto makanan langsung (contoh: Nasi Goreng, Burger, Minuman), tebak bahan-bahan utama yang kemungkinan besar menyusun makanan/minuman tersebut berdasarkan penampilannya.
2. Jika ada DAFTAR BAHAN/KOMPOSISI (ingredients list), baca dan analisis setiap bahan satu per satu.
3. Jika yang terlihat adalah TABEL NILAI GIZI (Nutrition Facts) tanpa daftar bahan, identifikasi bahan-bahan utama berdasarkan informasi nutrisi yang terlihat.
4. Baca SEMUA teks yang terlihat di foto untuk mengekstrak informasi sebanyak mungkin.

Pastikan kamu menghasilkan minimal 3 bahan untuk dianalisis.
${conditionContext}

${ANALYSIS_PROMPT}`;
      }
    } else if (imagePart && ingredients.trim()) {
      // Both image and text
      contextualPrompt = `Lihat foto produk ini dengan teliti. Selain foto, pengguna juga memberikan deskripsi atau tambahan daftar bahan secara manual:

Teks/Daftar bahan dari pengguna:
${ingredients.trim()}

TUGAS: Gabungkan informasi dari KEDUA sumber (foto dan teks pengguna). Baca semua yang terlihat di foto (atau tebak bahan jika foto makanan langsung), lalu gabungkan dengan deskripsi yang ditulis pengguna. Analisis semua bahan yang ditemukan.
${conditionContext}

${ANALYSIS_PROMPT}`;
    } else {
      // Text only
      contextualPrompt = `Daftar bahan:
${ingredients.trim()}
${conditionContext}

${ANALYSIS_PROMPT}`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    // Build content parts
    const parts: (string | Part)[] = [contextualPrompt];
    if (imagePart) {
      parts.unshift(imagePart); // Image first, then prompt
    }

    console.log("[FoodCheck] Sending request to Gemini:", {
      hasImage: !!imagePart,
      hasText: !!ingredients.trim(),
      conditions,
      model: "gemini-3.1-flash-lite",
    });

    const result = await model.generateContent(parts);
    const text = result.response.text();

    console.log("[FoodCheck] Raw AI response length:", text.length);
    console.log("[FoodCheck] First 500 chars:", text.substring(0, 500));

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON from potential markdown wrapping
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Respons AI tidak dalam format yang diharapkan.");
      }
    }

    // Validate structure
    if (
      typeof parsed.clean_score !== "number" ||
      !parsed.score_label ||
      !Array.isArray(parsed.ingredients)
    ) {
      throw new Error("Struktur respons AI tidak valid.");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analysis error:", error);

    const errorMsg = error instanceof Error ? error.message : String(error);

    // Rate limit exceeded
    if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("Too Many Requests")) {
      return NextResponse.json(
        { error: "Kuota API telah habis. Silakan tunggu beberapa menit lalu coba lagi." },
        { status: 429 }
      );
    }

    // Invalid API key
    if (errorMsg.includes("API_KEY_INVALID") || errorMsg.includes("API key not valid")) {
      return NextResponse.json(
        { error: "API Key tidak valid. Pastikan GEMINI_API_KEY di file .env.local sudah benar." },
        { status: 401 }
      );
    }

    // Model not found
    if (errorMsg.includes("not found") || errorMsg.includes("404")) {
      return NextResponse.json(
        { error: "Model AI tidak ditemukan. Pastikan menggunakan model yang tersedia (gemini-2.0-flash)." },
        { status: 404 }
      );
    }

    // Generic fallback
    const message = errorMsg.length > 200
      ? "Terjadi kesalahan saat menganalisis bahan. Coba lagi nanti."
      : errorMsg;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
