"use client";

import { motion } from "framer-motion";
import {
  Users, CalendarCheck, Clock, Stethoscope,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { StatCard } from "./data";

/* ─────────────────────────────────────────────
   Icon Map
───────────────────────────────────────────── */
const ICON_MAP = {
  "users":           Users,
  "calendar-check":  CalendarCheck,
  "clock":           Clock,
  "stethoscope":     Stethoscope,
};

/* ─────────────────────────────────────────────
   Number formatter
───────────────────────────────────────────── */
function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".", ",") + "k";
  return n.toLocaleString("id-ID");
}

/* ─────────────────────────────────────────────
   StatCard Component
───────────────────────────────────────────── */
interface StatCardProps {
  card: StatCard;
  index: number;
}

export function StatCardItem({ card, index }: StatCardProps) {
  const Icon = ICON_MAP[card.iconName];
  const isPositive = card.trend > 0;
  const isNeutral  = card.trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-surface-card border border-neutral-200 p-6",
        "transition-all duration-300 hover:-translate-y-1 group",
        "shadow-[0_2px_8px_0_rgb(0_0_0/0.05)]",
        "hover:shadow-[0_8px_24px_0_rgb(0_0_0/0.08)]"
      )}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.07] transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={{ background: card.color }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4 relative">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: card.bgColor }}
        >
          <Icon size={22} style={{ color: card.color }} />
        </div>

        {/* Trend badge */}
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
          isNeutral  && "bg-neutral-100 text-neutral-500",
          isPositive && "bg-success-light text-success-dark",
          !isPositive && !isNeutral && "bg-danger-light text-danger-dark"
        )}>
          {isNeutral  && <Minus size={12} />}
          {isPositive && <TrendingUp size={12} />}
          {!isPositive && !isNeutral && <TrendingDown size={12} />}
          <span>
            {isNeutral ? "Stabil" : `${Math.abs(card.trend)}%`}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="relative">
        <p
          className="text-3xl font-extrabold leading-none mb-1 tracking-tight"
          style={{ color: card.color, fontFamily: "var(--font-sans)" }}
        >
          {formatNumber(card.value)}
          {card.unit && (
            <span className="text-lg ml-1 font-semibold">{card.unit}</span>
          )}
        </p>
        <p className="text-sm font-semibold text-neutral-700">{card.label}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{card.trendLabel}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Stats Grid
───────────────────────────────────────────── */
export function StatsGrid({ cards }: { cards: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <StatCardItem key={card.id} card={card} index={i} />
      ))}
    </div>
  );
}
