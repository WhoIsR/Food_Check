"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CleanScoreProps {
  score: number;
  label: string;
}

function getScoreColor(score: number): string {
  if (score >= 75) return "var(--status-safe)";
  if (score >= 50) return "var(--status-warn)";
  return "var(--status-danger)";
}

function getScoreBg(score: number): string {
  if (score >= 75) return "var(--status-safe-bg)";
  if (score >= 50) return "var(--status-warn-bg)";
  return "var(--status-danger-bg)";
}

export default function CleanScore({ score, label }: CleanScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const color = getScoreColor(score);
  const bg = getScoreBg(score);

  // Animated counter
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex flex-col items-center gap-4 py-8"
    >
      {/* SVG Ring Gauge */}
      <div className="relative w-36 h-36">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full score-ring"
        >
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            style={{ stroke: "var(--border-primary)" }}
          />
          {/* Foreground ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ stroke: color }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            strokeDasharray={circumference}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tracking-tighter"
            style={{ color, fontFamily: "var(--font-geist-mono)" }}
          >
            {displayScore}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            dari 100
          </span>
        </div>
      </div>

      {/* Label */}
      <div
        className="px-4 py-2 rounded-xl text-sm font-semibold"
        style={{
          background: bg,
          color: color,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
