"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend,
} from "recharts";
import {
  CalendarCheck, UserPlus, Clock, Smile,
  TrendingUp, TrendingDown, BarChart3,
  Users, Activity, Award, AlertTriangle, Star,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  KPI_CARDS, KUNJUNGAN_HARIAN, KUNJUNGAN_MINGGUAN, KUNJUNGAN_BULANAN,
  DEMOGRAFI_UMUR, DEMOGRAFI_GENDER, POLI_TERPADAT, TOP_DIAGNOSA, INSIGHT_ITEMS,
} from "./data";
import type { KPICard, InsightItem } from "./data";

/* ─────────────────────────────────────────────
   Icon Map
───────────────────────────────────────────── */
const ICON_MAP = {
  "calendar-check": CalendarCheck,
  "user-plus": UserPlus,
  "clock": Clock,
  "smile": Smile,
};

const INSIGHT_ICON_MAP = {
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "alert": AlertTriangle,
  "star": Star,
  "clock": Clock,
};

/* ─────────────────────────────────────────────
   Custom Tooltip
───────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-neutral-200 p-3 shadow-lg text-xs"
      style={{ background: "var(--color-surface-card)" }}>
      <p className="font-semibold text-neutral-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-neutral-500">{p.name}</span>
          </div>
          <span className="font-bold text-neutral-800">{p.value.toLocaleString("id-ID")}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   KPI Card
───────────────────────────────────────────── */
function KPICardItem({ card, index }: { card: KPICard; index: number }) {
  const Icon = ICON_MAP[card.iconName];
  const isPos = card.trend > 0;
  const isNeg = card.trend < 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="relative overflow-hidden rounded-2xl bg-surface-card border border-neutral-200 p-6 group hover:-translate-y-0.5 transition-all duration-300"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.07] group-hover:opacity-[0.13] transition-opacity"
        style={{ background: card.color }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: card.bgColor }}>
          <Icon size={21} style={{ color: card.color }} />
        </div>
        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
          isPos && "bg-success-light text-success-dark",
          isNeg && "bg-danger-light text-danger-dark",
          !isPos && !isNeg && "bg-neutral-100 text-neutral-500"
        )}>
          {isPos ? <TrendingUp size={11} /> : isNeg ? <TrendingDown size={11} /> : null}
          <span>{isNeg ? "" : "+"}{card.trend}%</span>
        </div>
      </div>
      <p className="text-3xl font-extrabold leading-none tracking-tight mb-1"
        style={{ color: card.color, fontFamily: "var(--font-sans)" }}>
        {card.value}
        {card.unit && <span className="text-lg ml-1 font-semibold">{card.unit}</span>}
      </p>
      <p className="text-sm font-semibold text-neutral-700">{card.label}</p>
      <p className="text-xs text-neutral-400 mt-0.5">{card.trendLabel}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Kunjungan Chart with Tab
───────────────────────────────────────────── */
type ChartPeriod = "harian" | "mingguan" | "bulanan";

function KunjunganChartSection() {
  const [period, setPeriod] = useState<ChartPeriod>("harian");

  const chartData =
    period === "harian" ? KUNJUNGAN_HARIAN
    : period === "mingguan" ? KUNJUNGAN_MINGGUAN
    : KUNJUNGAN_BULANAN;

  const gradients = [
    { id: "gS1", color: "#2563eb" },
    { id: "gS2", color: "#d96430" },
    { id: "gS3", color: "#059669" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
      style={{ boxShadow: "var(--shadow-card)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <BarChart3 size={18} style={{ color: "var(--color-primary-600)" }} />
            <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
              Grafik Kunjungan Pasien
            </h2>
          </div>
          <p className="text-xs text-neutral-400">Tren kunjungan berdasarkan jenis layanan</p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
          {(["harian", "mingguan", "bulanan"] as ChartPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200",
                period === p
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {[
          { label: "Rawat Jalan", color: "#2563eb" },
          { label: "Rawat Inap",  color: "#d96430" },
          { label: "UGD",         color: "#059669" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-xs text-neutral-500">{item.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            {gradients.map((g) => (
              <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={g.color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={g.color} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="rawatJalan" name="Rawat Jalan" stroke="#2563eb" strokeWidth={2.5} fill="url(#gS1)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
          <Area type="monotone" dataKey="rawatInap"  name="Rawat Inap"  stroke="#d96430" strokeWidth={2.5} fill="url(#gS2)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
          <Area type="monotone" dataKey="ugd"        name="UGD"         stroke="#059669" strokeWidth={2.5} fill="url(#gS3)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Demografi Charts (Pie / Donut)
───────────────────────────────────────────── */
function DemografiSection() {
  const renderLabel = ({ name, value }: { name: string; value: number }) =>
    `${value}%`;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
      style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 mb-5">
        <Users size={18} style={{ color: "var(--color-primary-600)" }} />
        <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
          Demografi Pasien
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Umur Donut */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 text-center">
            Distribusi Umur
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={DEMOGRAFI_UMUR} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" paddingAngle={3}>
                {DEMOGRAFI_UMUR.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
            {DEMOGRAFI_UMUR.map((d) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-neutral-500">{d.name} <strong className="text-neutral-700">{d.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Donut */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 text-center">
            Distribusi Gender
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={DEMOGRAFI_GENDER} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" paddingAngle={3}>
                {DEMOGRAFI_GENDER.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
            {DEMOGRAFI_GENDER.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-neutral-500">{d.name} <strong className="text-neutral-700">{d.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Poli Terpadat
───────────────────────────────────────────── */
function PoliSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
      style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 mb-5">
        <Activity size={18} style={{ color: "var(--color-primary-600)" }} />
        <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
          Poli Terpadat
        </h2>
      </div>

      <div className="space-y-3">
        {POLI_TERPADAT.map((poli, i) => (
          <motion.div key={poli.rank}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
            className="flex items-center gap-3"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: poli.bgColor, color: poli.color }}>
              {poli.rank}
            </div>
            {/* Bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-neutral-700 truncate">{poli.nama}</span>
                <span className="text-xs font-bold ml-2 flex-shrink-0"
                  style={{ color: poli.color }}>{poli.jumlah.toLocaleString("id-ID")}</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${poli.persentase}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full"
                  style={{ background: poli.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Top 5 Diagnosa
───────────────────────────────────────────── */
function DiagnosaSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
      style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 mb-5">
        <Award size={18} style={{ color: "var(--color-primary-600)" }} />
        <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
          Top 5 Diagnosa
        </h2>
      </div>

      <div className="space-y-3">
        {TOP_DIAGNOSA.map((dx, i) => (
          <motion.div key={dx.rank}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.07 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: dx.color }}>
              {dx.rank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm font-medium text-neutral-700 truncate">{dx.nama}</span>
                  <span className="text-xs font-mono text-neutral-400 flex-shrink-0">{dx.icd}</span>
                </div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: dx.color }}>
                  {dx.jumlah}
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dx.persentase}%` }}
                  transition={{ duration: 0.8, delay: 0.45 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full"
                  style={{ background: dx.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Insight Cards
───────────────────────────────────────────── */
const INSIGHT_TYPE_CFG = {
  positive: { cls: "border-success/30 bg-success-light/40", iconCls: "text-success", dotCls: "bg-success" },
  warning:  { cls: "border-warning/30 bg-warning-light/40", iconCls: "text-warning", dotCls: "bg-warning" },
  info:     { cls: "border-primary-200 bg-primary-50/60",   iconCls: "text-primary-600", dotCls: "bg-primary-500" },
  negative: { cls: "border-danger/30 bg-danger-light/40",   iconCls: "text-danger", dotCls: "bg-danger" },
};

function InsightCards({ items }: { items: InsightItem[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
      style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 mb-5">
        <Star size={18} style={{ color: "var(--color-earth-500)" }} />
        <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
          Insight Otomatis
        </h2>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon = INSIGHT_ICON_MAP[item.icon];
          const cfg = INSIGHT_TYPE_CFG[item.type];
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
              className={cn("rounded-xl border p-4", cfg.cls)}
            >
              <div className="flex items-start gap-3">
                <div className={cn("flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white/70")}>
                  <Icon size={15} className={cfg.iconCls} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{item.body}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   StatistikView — Main Export
───────────────────────────────────────────── */
export function StatistikView() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
            style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))", boxShadow: "0 4px 12px rgb(37 99 235 / 0.25)" }}>
            <BarChart3 size={21} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-sans)" }}>
              Statistik & Analitik
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Pantau performa pelayanan dan aktivitas rumah sakit.
            </p>
          </div>
        </div>

        {/* Javanese motif */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-earth-200" />
          <div className="w-2 h-2 rotate-45 bg-earth-300 flex-shrink-0" />
          <div className="w-1.5 h-1.5 rotate-45 bg-primary-300 flex-shrink-0" />
          <div className="w-2 h-2 rotate-45 bg-earth-300 flex-shrink-0" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary-200" />
        </div>
      </motion.div>

      {/* ── KPI Cards ─────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((card, i) => <KPICardItem key={card.id} card={card} index={i} />)}
      </div>

      {/* ── Chart (full width) ────────────── */}
      <KunjunganChartSection />

      {/* ── Demografi + Poli ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemografiSection />
        <PoliSection />
      </div>

      {/* ── Diagnosa + Insight ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiagnosaSection />
        <InsightCards items={INSIGHT_ITEMS} />
      </div>
    </div>
  );
}
