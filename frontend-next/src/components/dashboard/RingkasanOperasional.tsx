"use client";

import { motion } from "framer-motion";
import type { RingkasanItem } from "./data";

/* ─────────────────────────────────────────────
   Ringkasan Operasional Component
───────────────────────────────────────────── */
export function RingkasanOperasional({ items }: { items: RingkasanItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6 shadow-[0_2px_8px_0_rgb(0_0_0/0.05)]"
    >
      {/* Header */}
      <div className="mb-5 relative">
        <div 
          className="absolute -left-4 -top-4 w-20 h-20 pointer-events-none opacity-[0.03]"
          style={{ 
            backgroundImage: "url('/patterns/bg-pattern.svg')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10">
          <h2
            className="text-base font-bold text-neutral-900"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Ringkasan Operasional
          </h2>
          <div className="flex items-center gap-1.5 mt-1 mb-1.5 opacity-80">
            <span className="text-[10px] leading-none text-primary-600">◇</span>
            <div className="h-[1px] w-12 bg-neutral-200" />
          </div>
          <p className="text-xs text-neutral-400">Data hari ini</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.45 + index * 0.07 }}
            className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100"
          >
            <div>
              <p className="text-xs text-neutral-400 font-medium">{item.label}</p>
              <p
                className="text-base font-bold mt-0.5 leading-tight"
                style={{
                  color: item.color ?? "var(--color-neutral-800)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {item.value}
              </p>
              {item.sub && (
                <p className="text-2xs text-neutral-400 mt-0.5">{item.sub}</p>
              )}
            </div>

            {/* Color accent bar */}
            <div
              className="w-1 h-10 rounded-full flex-shrink-0"
              style={{ background: item.color ?? "var(--color-neutral-200)" }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
