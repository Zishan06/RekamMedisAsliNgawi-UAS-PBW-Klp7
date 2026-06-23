"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserPlus,
  CalendarCheck,
} from "lucide-react";
import type { PatientStat } from "./data";

/* ─────────────────────────────────────────────
   Icon Map
───────────────────────────────────────────── */
const ICON_MAP = {
  "users":          Users,
  "user-check":     UserCheck,
  "user-plus":      UserPlus,
  "calendar-check": CalendarCheck,
};

/* ─────────────────────────────────────────────
   PatientStatsBar
   4 mini stat cards untuk halaman pasien
───────────────────────────────────────────── */
export function PatientStatsBar({ stats }: { stats: PatientStat[] }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = ICON_MAP[stat.iconName];
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }}
            className="relative overflow-hidden rounded-2xl bg-surface-card border border-neutral-200 px-5 py-4 flex items-center gap-4 group transition-all duration-300 hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            {/* Background glow */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-300"
              style={{ background: stat.color }}
            />

            {/* Icon */}
            <div
              className="relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: stat.bgColor }}
            >
              <Icon size={21} style={{ color: stat.color }} />
            </div>

            {/* Text */}
            <div className="relative min-w-0">
              <p
                className="text-2xl font-extrabold leading-none tracking-tight"
                style={{ color: stat.color, fontFamily: "var(--font-sans)" }}
              >
                {stat.value.toLocaleString("id-ID")}
              </p>
              <p className="text-sm font-semibold text-neutral-700 mt-0.5 truncate">
                {stat.label}
              </p>
              <p className="text-xs text-neutral-400 truncate">{stat.subLabel}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
