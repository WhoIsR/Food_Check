import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthModalProvider } from "@/context/AuthModalContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodCheck — AI Decoder Label Bahan Makanan",
  description:
    "Pahami bahan-bahan dalam makanan kemasanmu. FoodCheck menggunakan AI untuk menjelaskan setiap bahan dalam bahasa sehari-hari dan memberikan peringatan berdasarkan kondisi kesehatanmu.",
  keywords: [
    "cek bahan makanan",
    "keamanan pangan",
    "label makanan",
    "AI",
    "BPOM",
    "bahan berbahaya",
    "analisis makanan",
  ],
  openGraph: {
    title: "FoodCheck — AI Decoder Label Bahan Makanan",
    description:
      "Pahami bahan-bahan dalam makanan kemasanmu. Analisis AI cepat dan mudah.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent FOUC for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('foodcheck-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col relative">
        <ThemeProvider>
          <AuthModalProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
            <AuthModal />
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
