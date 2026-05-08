import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { ingredients, conditions } = await request.json();

    if (!ingredients || typeof ingredients !== "string" || ingredients.trim().length === 0) {
      return NextResponse.json(
        { error: "Daftar bahan tidak boleh kosong." },
        { status: 400 }
      );
    }

    if (ingredients.length > 2000) {
      return NextResponse.json(
        { error: "Daftar bahan terlalu panjang (maks 2000 karakter)." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "paste_your_key_here") {
      return NextResponse.json(
        { error: "API Key belum dikonfigurasi. Silakan isi GEMINI_API_KEY di file .env.local" },
        { status: 500 }
      );
    }

    const conditionContext =
      conditions && conditions.length > 0
        ? `\n\nKondisi kesehatan pengguna yang perlu diperhatikan: ${conditions.join(", ")}. Berikan perhatian khusus pada bahan yang berbahaya atau perlu dihindari untuk kondisi-kondisi tersebut.`
        : "";

    const prompt = `Kamu adalah ahli keamanan pangan dan nutrisi. Analisis daftar bahan makanan berikut dan berikan penjelasan dalam Bahasa Indonesia yang mudah dipahami orang awam.

Daftar bahan:
${ingredients.trim()}
${conditionContext}

Berikan respons dalam format JSON SAJA (tanpa markdown, tanpa backtick, tanpa penjelasan tambahan di luar JSON) dengan struktur berikut:

{
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
1. Setiap bahan dianalisis secara individual
2. Penjelasan menggunakan bahasa sehari-hari, bukan istilah teknis
3. flag_for hanya diisi jika memang relevan untuk kondisi tersebut
4. Status "hindari" hanya untuk bahan yang benar-benar berisiko
5. Referensi ke standar BPOM, WHO, atau EFSA jika memungkinkan`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

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

    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menganalisis bahan. Coba lagi nanti.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
