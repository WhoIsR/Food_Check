"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass,
  ArrowRight,
  Sparkle,
  Lightning,
  Eraser,
  ShieldCheck,
  ListMagnifyingGlass,
} from "@phosphor-icons/react";
import HealthFilter from "@/components/HealthFilter";
import CleanScore from "@/components/CleanScore";
import IngredientCard from "@/components/IngredientCard";
import AnalysisSkeleton from "@/components/AnalysisSkeleton";
import type { AnalysisState, HealthCondition } from "@/lib/types";

const EXAMPLE_INGREDIENTS =
  "Gula, Tepung Terigu, Minyak Nabati (Mengandung Antioksidan BHA), Pewarna Tartrazin CI 19140, Perisa Identik Alami Vanila, Natrium Benzoat, Lesitin Kedelai, Aspartam, MSG";

export default function HomePage() {
  const [ingredients, setIngredients] = useState("");
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conditions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("foodcheck-conditions");
    if (saved) {
      try {
        setConditions(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Save conditions to localStorage
  useEffect(() => {
    localStorage.setItem("foodcheck-conditions", JSON.stringify(conditions));
  }, [conditions]);

  const handleAnalyze = async () => {
    if (!ingredients.trim()) return;

    setAnalysis({ status: "loading" });

    // Scroll to results area
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          conditions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnalysis({
          status: "error",
          message: data.error || "Terjadi kesalahan. Coba lagi.",
        });
        return;
      }

      setAnalysis({ status: "success", data });
    } catch {
      setAnalysis({
        status: "error",
        message: "Tidak bisa terhubung ke server. Periksa koneksi internet.",
      });
    }
  };

  const handleClear = () => {
    setIngredients("");
    setAnalysis({ status: "idle" });
    textareaRef.current?.focus();
  };

  const handleExampleFill = () => {
    setIngredients(EXAMPLE_INGREDIENTS);
    textareaRef.current?.focus();
  };

  const charCount = ingredients.length;
  const isOverLimit = charCount > 2000;
  const canAnalyze =
    ingredients.trim().length > 0 &&
    !isOverLimit &&
    analysis.status !== "loading";

  return (
    <main className="min-h-[100dvh] flex flex-col">
      {/* Navbar spacer */}
      <div className="h-20" />

      {/* Hero section - asymmetric split */}
      <section className="px-4 sm:px-6 max-w-[1400px] mx-auto w-full pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "var(--accent-subtle)",
                  color: "var(--accent)",
                }}
              >
                <Sparkle size={12} weight="fill" />
                Didukung AI
              </div>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              Pahami apa yang
              <br />
              kamu{" "}
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                makan
              </span>
            </h1>

            <p
              className="text-base leading-relaxed max-w-[50ch]"
              style={{ color: "var(--text-secondary)" }}
            >
              Tempel daftar bahan dari label kemasan, dapatkan penjelasan mudah
              dipahami beserta peringatan untuk kondisi kesehatanmu.
            </p>

            {/* Quick stats */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Lightning
                  size={16}
                  weight="fill"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Hasil dalam 3 detik
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  weight="fill"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Tanpa registrasi
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Decorative element (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div
              className="relative w-48 h-48 rounded-3xl flex items-center justify-center"
              style={{
                background: "var(--accent-subtle)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <ListMagnifyingGlass
                size={72}
                weight="duotone"
                style={{ color: "var(--accent)", opacity: 0.6 }}
              />
              {/* Floating dots */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full"
                style={{ background: "var(--status-safe)", opacity: 0.5 }}
              />
              <motion.div
                animate={{ y: [3, -3, 3] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full"
                style={{ background: "var(--status-warn)", opacity: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Input section */}
      <section className="px-4 sm:px-6 max-w-[1400px] mx-auto w-full py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {/* Health conditions */}
          <HealthFilter selected={conditions} onChange={setConditions} />

          {/* Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ingredients-input"
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: "var(--text-tertiary)" }}
              >
                Daftar Bahan
              </label>
              <span
                className="text-[11px] font-mono"
                style={{
                  color: isOverLimit
                    ? "var(--status-danger)"
                    : "var(--text-tertiary)",
                }}
              >
                {charCount}/2000
              </span>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                background: "var(--bg-secondary)",
                border: `1px solid var(--border-primary)`,
              }}
            >
              <textarea
                ref={textareaRef}
                id="ingredients-input"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Contoh: Gula, Tepung Terigu, Minyak Nabati, Pewarna Tartrazin CI 19140, Natrium Benzoat..."
                rows={4}
                className="w-full px-4 py-3.5 bg-transparent resize-none text-sm leading-relaxed"
                style={{
                  color: "var(--text-primary)",
                  caretColor: "var(--accent)",
                }}
                maxLength={2100}
              />

              {/* Bottom toolbar */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: `1px solid var(--divider)` }}
              >
                <button
                  onClick={handleExampleFill}
                  className="text-xs font-medium transition-colors duration-150 cursor-pointer"
                  style={{ color: "var(--accent)" }}
                >
                  Coba contoh
                </button>

                <div className="flex items-center gap-2">
                  {ingredients.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleClear}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer"
                      style={{
                        background: "var(--bg-tertiary)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Eraser size={12} />
                      Hapus
                    </motion.button>
                  )}

                  <motion.button
                    whileTap={canAnalyze ? { scale: 0.96 } : {}}
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      background: canAnalyze
                        ? "var(--accent)"
                        : "var(--bg-tertiary)",
                      color: canAnalyze
                        ? "var(--text-inverse)"
                        : "var(--text-tertiary)",
                      boxShadow: canAnalyze
                        ? "var(--shadow-glow)"
                        : "none",
                    }}
                  >
                    {analysis.status === "loading" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <MagnifyingGlass size={16} />
                        </motion.div>
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        Analisis
                        <ArrowRight size={16} weight="bold" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Results section */}
      <section
        ref={resultRef}
        className="px-4 sm:px-6 max-w-[1400px] mx-auto w-full py-6 flex-1"
      >
        <AnimatePresence mode="wait">
          {/* Loading */}
          {analysis.status === "loading" && (
            <motion.div key="loading">
              <AnalysisSkeleton />
            </motion.div>
          )}

          {/* Error */}
          {analysis.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-6 text-center space-y-3"
              style={{
                background: "var(--status-danger-bg)",
                border: "1px solid var(--status-danger-border)",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "var(--status-danger)" }}
              >
                {analysis.message}
              </p>
              <button
                onClick={handleAnalyze}
                className="text-xs font-medium underline cursor-pointer"
                style={{ color: "var(--status-danger)" }}
              >
                Coba lagi
              </button>
            </motion.div>
          )}

          {/* Success */}
          {analysis.status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Clean Score */}
              <CleanScore
                score={analysis.data.clean_score}
                label={analysis.data.score_label}
              />

              {/* Divider */}
              <div
                className="h-px"
                style={{ background: "var(--divider)" }}
              />

              {/* Results header */}
              <div className="flex items-center justify-between">
                <h2
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Detail Bahan ({analysis.data.ingredients.length})
                </h2>
                <div className="flex items-center gap-3">
                  {["aman", "waspada", "hindari"].map((status) => {
                    const count = analysis.data.ingredients.filter(
                      (i) => i.status === status
                    ).length;
                    if (count === 0) return null;
                    const colorMap: Record<string, string> = {
                      aman: "var(--status-safe)",
                      waspada: "var(--status-warn)",
                      hindari: "var(--status-danger)",
                    };
                    return (
                      <span
                        key={status}
                        className="text-[11px] font-mono font-medium"
                        style={{ color: colorMap[status] }}
                      >
                        {count} {status}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Ingredient list */}
              <div className="space-y-2">
                {analysis.data.ingredients.map((ingredient, index) => (
                  <IngredientCard
                    key={`${ingredient.original_name}-${index}`}
                    ingredient={ingredient}
                    index={index}
                    activeConditions={conditions}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Idle / Empty state */}
          {analysis.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--bg-tertiary)" }}
              >
                <MagnifyingGlass
                  size={28}
                  weight="duotone"
                  style={{ color: "var(--text-tertiary)" }}
                />
              </div>
              <div className="text-center space-y-1">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Belum ada hasil analisis
                </p>
                <p
                  className="text-xs max-w-[40ch]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Tempel daftar bahan dari label kemasan di kolom di atas, lalu
                  klik &ldquo;Analisis&rdquo;
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
