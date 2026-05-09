"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { WarningCircle, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
  const [errorMsg, setErrorMsg] = useState("Terjadi kesalahan saat proses autentikasi.");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Supabase often passes the error in the hash fragment for implicit flow
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    let desc = searchParams.get("error_description");
    
    if (!desc && hash) {
      const hashParams = new URLSearchParams(hash.replace("#", "?"));
      desc = hashParams.get("error_description");
    }

    if (desc) {
      // Replace '+' with spaces and decode
      setErrorMsg(decodeURIComponent(desc.replace(/\+/g, " ")));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 rounded-3xl text-center shadow-2xl"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10 text-red-500">
            <WarningCircle size={32} weight="fill" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Autentikasi Gagal
        </h1>
        
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          {errorMsg}
        </p>

        <div className="space-y-4">
          <Link href="/">
            <button
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: "var(--accent)",
                color: "var(--text-inverse)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Kembali ke Beranda
            </button>
          </Link>
          
          <Link href="/?auth=true" className="block text-sm font-medium hover:underline" style={{ color: "var(--text-primary)" }}>
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Coba Login Lagi
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-t-[var(--accent)] animate-spin"></div></div>}>
      <ErrorContent />
    </Suspense>
  );
}
