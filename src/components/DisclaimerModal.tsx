"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WarningCircle, ShieldCheck, X } from "@phosphor-icons/react";

const DISCLAIMER_KEY = "foodcheck-disclaimer-accepted";

export default function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show modal if user hasn't accepted yet
    const accepted = sessionStorage.getItem(DISCLAIMER_KEY);
    if (!accepted) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = useCallback(() => {
    sessionStorage.setItem(DISCLAIMER_KEY, Date.now().toString());
    setShow(false);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleAccept}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150 z-10"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-tertiary)",
              }}
            >
              <X size={14} weight="bold" />
            </button>

            {/* Warning stripe */}
            <div
              className="h-1.5 w-full"
              style={{
                background: "linear-gradient(90deg, var(--status-warn), var(--status-danger), var(--status-warn))",
              }}
            />

            <div className="px-6 pt-6 pb-4 space-y-5">
              {/* Icon + Title */}
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "var(--status-warn-bg)",
                  }}
                >
                  <WarningCircle size={32} weight="fill" style={{ color: "var(--status-warn)" }} />
                </div>
                <div className="space-y-1">
                  <h2
                    className="text-lg font-bold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Peringatan Penting
                  </h2>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Harap baca sebelum menggunakan FoodCheck
                  </p>
                </div>
              </div>

              {/* Disclaimer content */}
              <div
                className="rounded-xl p-4 space-y-3"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <ShieldCheck
                      size={18}
                      weight="fill"
                      style={{ color: "var(--status-warn)" }}
                    />
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    FoodCheck adalah{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      alat bantu informatif
                    </strong>{" "}
                    dan{" "}
                    <strong style={{ color: "var(--status-danger)" }}>
                      bukan pengganti saran medis profesional
                    </strong>
                    .
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <ShieldCheck
                      size={18}
                      weight="fill"
                      style={{ color: "var(--status-warn)" }}
                    />
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Selalu{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      konsultasikan dengan dokter atau ahli gizi
                    </strong>{" "}
                    untuk keputusan kesehatan Anda.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <ShieldCheck
                      size={18}
                      weight="fill"
                      style={{ color: "var(--status-warn)" }}
                    />
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Hasil analisis AI bisa{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      tidak 100% akurat
                    </strong>
                    . Gunakan sebagai referensi awal saja.
                  </p>
                </div>
              </div>

              {/* Source badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {["BPOM RI", "EFSA", "WHO", "Codex Alimentarius"].map((src) => (
                  <span
                    key={src}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--bg-tertiary)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Accept button */}
            <div className="px-6 pb-6">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAccept}
                className="w-full py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
                style={{
                  background: "var(--accent)",
                  color: "var(--text-inverse)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Saya Mengerti
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
