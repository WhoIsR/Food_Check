"use client";

import { motion } from "framer-motion";

export default function AnalysisSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Score skeleton */}
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-36 h-36 rounded-full skeleton" />
        <div className="w-32 h-8 skeleton rounded-xl" />
      </div>

      {/* Divider */}
      <div className="h-px skeleton" />

      {/* Header skeleton */}
      <div className="w-48 h-4 skeleton" />

      {/* Card skeletons */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="w-8 h-8 rounded-lg skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-3/4 h-4 skeleton" />
            <div className="w-1/3 h-3 skeleton" />
          </div>
          <div className="w-16 h-6 skeleton rounded-lg shrink-0" />
        </motion.div>
      ))}
    </motion.div>
  );
}
