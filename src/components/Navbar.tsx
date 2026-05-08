"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, ShieldCheck } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-4">
        <nav className="glass-panel rounded-2xl px-5 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-subtle)" }}
            >
              <ShieldCheck
                size={20}
                weight="duotone"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-sm font-semibold tracking-tight leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                FoodCheck
              </span>
              <span
                className="text-[10px] tracking-wider uppercase leading-none mt-0.5"
                style={{ color: "var(--text-tertiary)" }}
              >
                AI Decoder
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
              aria-label={
                theme === "dark"
                  ? "Ganti ke mode terang"
                  : "Ganti ke mode gelap"
              }
            >
              {theme === "dark" ? (
                <Sun size={18} weight="duotone" />
              ) : (
                <Moon size={18} weight="duotone" />
              )}
            </motion.button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
