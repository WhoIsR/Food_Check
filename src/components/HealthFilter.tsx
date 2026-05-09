"use client";

import { useState } from "react";
import { HEALTH_CONDITIONS, type HealthCondition } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Drop,
  Heartbeat,
  Baby,
  GrainsSlash,
  Plant,
  Smiley,
  Plus,
  X,
} from "@phosphor-icons/react";

const iconMap: Record<string, React.ElementType> = {
  drop: Drop,
  heartbeat: Heartbeat,
  baby: Baby,
  grain: GrainsSlash,
  nut: Plant,
  smiley: Smiley,
};

interface HealthFilterProps {
  selected: HealthCondition[];
  onChange: (conditions: HealthCondition[]) => void;
}

export default function HealthFilter({ selected, onChange }: HealthFilterProps) {
  const [customInput, setCustomInput] = useState("");

  const toggle = (id: HealthCondition) => {
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customInput.trim();
    if (val && !selected.includes(val)) {
      onChange([...selected, val]);
    }
    setCustomInput("");
  };

  const removeCustom = (id: string) => {
    onChange(selected.filter((c) => c !== id));
  };

  const customSelected = selected.filter(
    (s) => !HEALTH_CONDITIONS.find((hc) => hc.id === s)
  );

  return (
    <div className="space-y-4">
      <p
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-tertiary)" }}
      >
        Kondisi Kesehatan (opsional)
      </p>
      
      <div className="flex flex-wrap gap-2 items-center">
        {HEALTH_CONDITIONS.map((condition, index) => {
          const isActive = selected.includes(condition.id);
          const IconComponent = iconMap[condition.icon] || Smiley;

          return (
            <motion.button
              key={condition.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.04,
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(condition.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none"
              style={{
                background: isActive
                  ? "var(--accent-subtle)"
                  : "var(--bg-tertiary)",
                color: isActive
                  ? "var(--accent)"
                  : "var(--text-secondary)",
                border: `1px solid ${
                  isActive
                    ? "var(--accent)"
                    : "var(--border-secondary)"
                }`,
                boxShadow: isActive ? "var(--shadow-glow)" : "none",
              }}
            >
              <IconComponent size={14} weight={isActive ? "fill" : "regular"} />
              {condition.label}
            </motion.button>
          );
        })}

        <AnimatePresence>
          {customSelected.map((custom) => (
            <motion.div
              key={custom}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <span>{custom}</span>
              <button
                onClick={() => removeCustom(custom)}
                className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
              >
                <X size={12} weight="bold" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <form onSubmit={handleAddCustom} className="relative flex items-center">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Tambah kondisi lain..."
            className="pl-3 pr-8 py-2 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              width: "160px"
            }}
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="absolute right-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors disabled:opacity-50"
          >
            <Plus size={14} weight="bold" />
          </button>
        </form>
      </div>
    </div>
  );
}
