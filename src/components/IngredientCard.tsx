"use client";

import type { IngredientResult, HealthCondition } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Warning,
  XCircle,
  CaretDown,
  Info,
} from "@phosphor-icons/react";
import { useState } from "react";

interface IngredientCardProps {
  ingredient: IngredientResult;
  index: number;
  activeConditions: HealthCondition[];
}

const statusConfig = {
  aman: {
    icon: CheckCircle,
    label: "Aman",
    color: "var(--status-safe)",
    bg: "var(--status-safe-bg)",
    border: "var(--status-safe-border)",
  },
  waspada: {
    icon: Warning,
    label: "Waspada",
    color: "var(--status-warn)",
    bg: "var(--status-warn-bg)",
    border: "var(--status-warn-border)",
  },
  hindari: {
    icon: XCircle,
    label: "Hindari",
    color: "var(--status-danger)",
    bg: "var(--status-danger-bg)",
    border: "var(--status-danger-border)",
  },
};

const conditionLabels: Record<string, string> = {
  diabetes: "Diabetes",
  hipertensi: "Hipertensi",
  ibu_hamil: "Ibu Hamil",
  alergi_gluten: "Alergi Gluten",
  alergi_kacang: "Alergi Kacang",
  anak: "Bayi/Anak",
};

export default function IngredientCard({
  ingredient,
  index,
  activeConditions,
}: IngredientCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[ingredient.status];
  const StatusIcon = config.icon;

  // Check if any active condition matches this ingredient's flags
  const matchedConditions = ingredient.flag_for.filter((flag) =>
    activeConditions.includes(flag as HealthCondition)
  );
  const isHighlighted = matchedConditions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
      className="group relative overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        background: isHighlighted ? config.bg : "var(--bg-secondary)",
        border: `1px solid ${
          isHighlighted ? config.border : "var(--border-primary)"
        }`,
        boxShadow: isHighlighted
          ? `0 0 20px ${config.border}`
          : "var(--shadow-sm)",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
      >
        {/* Status icon */}
        <div
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: config.bg }}
        >
          <StatusIcon size={18} weight="fill" style={{ color: config.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {ingredient.original_name}
            </span>
            {ingredient.original_name !== ingredient.plain_name && (
              <span
                className="text-xs truncate"
                style={{ color: "var(--text-tertiary)" }}
              >
                {ingredient.plain_name}
              </span>
            )}
          </div>
          <span
            className="text-[11px] uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            {ingredient.category}
          </span>
        </div>

        {/* Status badge */}
        <span
          className="shrink-0 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
          style={{
            background: config.bg,
            color: config.color,
          }}
        >
          {config.label}
        </span>

        {/* Expand chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
          style={{ color: "var(--text-tertiary)" }}
        >
          <CaretDown size={14} weight="bold" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 space-y-3"
              style={{ borderTop: `1px solid var(--divider)` }}
            >
              <p
                className="text-sm leading-relaxed pt-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {ingredient.explanation}
              </p>

              {/* ADI info */}
              {ingredient.adi && (
                <div
                  className="flex items-start gap-2 p-2.5 rounded-lg text-xs"
                  style={{
                    background: "var(--status-info-bg)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Info
                    size={14}
                    weight="fill"
                    className="shrink-0 mt-0.5"
                    style={{ color: "var(--status-info)" }}
                  />
                  <span>Batas aman harian (ADI): {ingredient.adi}</span>
                </div>
              )}

              {/* Health flags */}
              {ingredient.flag_for.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ingredient.flag_for.map((flag) => {
                    const isMatched = activeConditions.includes(
                      flag as HealthCondition
                    );
                    return (
                      <span
                        key={flag}
                        className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-md"
                        style={{
                          background: isMatched
                            ? "var(--status-danger-bg)"
                            : "var(--bg-tertiary)",
                          color: isMatched
                            ? "var(--status-danger)"
                            : "var(--text-tertiary)",
                          border: `1px solid ${
                            isMatched
                              ? "var(--status-danger-border)"
                              : "var(--border-secondary)"
                          }`,
                        }}
                      >
                        {conditionLabels[flag] || flag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
