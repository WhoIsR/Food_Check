"use client";

import { HEALTH_CONDITIONS, type HealthCondition } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Drop,
  Heartbeat,
  Baby,
  GrainsSlash,
  Plant,
  Smiley,
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
  const toggle = (id: HealthCondition) => {
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <p
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-tertiary)" }}
      >
        Kondisi Kesehatan (opsional)
      </p>
      <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
