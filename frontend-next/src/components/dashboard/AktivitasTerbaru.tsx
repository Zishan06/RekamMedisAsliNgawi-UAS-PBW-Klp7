"use client";

import { motion } from "framer-motion";
import {
  UserPlus, FileEdit, MessageSquareCheck, FlaskConical, Pill,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Aktivitas, AktivitasType } from "./data";

/* ─────────────────────────────────────────────
   Activity type config
───────────────────────────────────────────── */
const ACTIVITY_CONFIG: Record<AktivitasType, {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  dot: string;
}> = {
  "pasien-baru": {
    icon: UserPlus,
    iconBg: "var(--color-primary-50)",
    iconColor: "var(--color-primary-600)",
    dot: "var(--color-primary-500)",
  },
  "rekam-medis": {
    icon: FileEdit,
    iconBg: "var(--color-earth-50)",
    iconColor: "var(--color-earth-600)",
    dot: "var(--color-earth-500)",
  },
  "konsultasi": {
    icon: MessageSquareCheck,
    iconBg: "var(--color-success-light)",
    iconColor: "var(--color-success)",
    dot: "var(--color-success)",
  },
  "lab": {
    icon: FlaskConical,
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
    dot: "#7c3aed",
  },
  "resep": {
    icon: Pill,
    iconBg: "#ecfeff",
    iconColor: "#0891b2",
    dot: "#0891b2",
  },
};

/* ─────────────────────────────────────────────
   Aktivitas Terbaru Component
───────────────────────────────────────────── */
export function AktivitasTerbaru({ items }: { items: Aktivitas[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6 shadow-[0_2px_8px_0_rgb(0_0_0/0.05)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="relative">
          <div 
            className="absolute -left-4 -top-4 w-20 h-20 pointer-events-none opacity-[0.03]"
            style={{ 
              backgroundImage: "url('/patterns/gemini-pattern.svg')", 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10">
            <h2
              className="text-base font-bold text-neutral-900"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Aktivitas Terbaru
            </h2>
            <div className="flex items-center gap-1.5 mt-1 mb-1.5 opacity-80">
              <span className="text-[10px] leading-none text-primary-600">◇</span>
              <div className="h-[1px] w-12 bg-neutral-200" />
            </div>
            <p className="text-xs text-neutral-400">Update real-time</p>
          </div>
        </div>
        <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Lihat semua →
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {items.map((item, index) => {
          const config = ACTIVITY_CONFIG[item.type];
          const Icon = config.icon;
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="flex gap-3 group">
              {/* Timeline line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                  style={{ background: config.iconBg }}
                >
                  <Icon size={16} style={{ color: config.iconColor }} />
                </div>
                {!isLast && (
                  <div className="w-px flex-1 my-1 bg-neutral-100" />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-neutral-800">
                      <span className="font-semibold">{item.deskripsi}</span>
                      {" — "}
                      <span className="text-neutral-600">{item.subjek}</span>
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.aktor}</p>
                  </div>
                  <span className="text-2xs text-neutral-400 font-medium whitespace-nowrap flex-shrink-0 mt-0.5">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-2xs text-neutral-300 mt-1">{item.waktu}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
