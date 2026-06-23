"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, TrendingUp, TrendingDown, Star, AlertTriangle,
  Clock, ChevronRight, Search, Filter,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { TENAGA_MEDIS, STAFF_INSIGHTS } from "./data";
import type { TenagaMedis, PerformanceGrade, StaffInsight } from "./data";
import { StaffModal } from "./StaffModal";

/* ─────────────────────────────────────────────
   Grade Config
───────────────────────────────────────────── */
const GRADE_CFG: Record<PerformanceGrade, { bg: string; text: string; ring: string }> = {
  A: { bg: "bg-success-light",   text: "text-success-dark",   ring: "ring-success/40" },
  B: { bg: "bg-primary-100",     text: "text-primary-700",    ring: "ring-primary-300" },
  C: { bg: "bg-warning-light",   text: "text-warning-dark",   ring: "ring-warning/40" },
  D: { bg: "bg-danger-light",    text: "text-danger-dark",    ring: "ring-danger/40" },
};

const STATUS_CFG = {
  Aktif:         { dot: "bg-success", text: "text-success-dark",   bg: "bg-success-light" },
  Cuti:          { dot: "bg-warning", text: "text-warning-dark",   bg: "bg-warning-light" },
  "Tidak Aktif": { dot: "bg-neutral-400", text: "text-neutral-500", bg: "bg-neutral-100" },
};

/* ─────────────────────────────────────────────
   Avatar Initials (table size)
───────────────────────────────────────────── */
function TableAvatar({ nama, grade }: { nama: string; grade: PerformanceGrade }) {
  const initials = nama
    .replace(/^(dr\.|Sp\.\w+|S\.\w+|A\.Md\.\w+)\s*/gi, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ring-2", GRADE_CFG[grade].ring)}
      style={{
        background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
        fontFamily: "var(--font-sans)",
      }}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Score Badge (visual pill)
───────────────────────────────────────────── */
function GradeBadge({ grade, score }: { grade: PerformanceGrade; score: number }) {
  const g = GRADE_CFG[grade];
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold", g.bg, g.text)}
        style={{ fontFamily: "var(--font-sans)" }}>
        {grade}
      </div>
      <div className="flex-1">
        <div className="w-16 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${score}%`,
              background: grade === "A" ? "var(--color-success)"
                : grade === "B" ? "var(--color-primary-500)"
                : grade === "C" ? "var(--color-warning)"
                : "var(--color-danger)",
            }}
          />
        </div>
        <p className="text-xs text-neutral-400 mt-0.5">{score}/100</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Satisfaction Bar
───────────────────────────────────────────── */
function SatisfactionBar({ value }: { value: number }) {
  const color = value >= 95 ? "var(--color-success)"
    : value >= 85 ? "var(--color-primary-500)"
    : "var(--color-warning)";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Insight Cards
───────────────────────────────────────────── */
const INSIGHT_CFG = {
  positive: { cls: "border-success/30 bg-success-light/40", iconCls: "text-success" },
  warning:  { cls: "border-warning/30 bg-warning-light/40", iconCls: "text-warning" },
  info:     { cls: "border-primary-200 bg-primary-50/60",   iconCls: "text-primary-600" },
  negative: { cls: "border-danger/30 bg-danger-light/40",   iconCls: "text-danger" },
};

const INSIGHT_ICON_MAP = {
  "star":         Star,
  "trending-up":  TrendingUp,
  "trending-down":TrendingDown,
  "alert":        AlertTriangle,
  "clock":        Clock,
};

function StaffInsightCards({ items }: { items: StaffInsight[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
      style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Star size={17} style={{ color: "var(--color-earth-500)" }} />
        <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
          Insight Performa
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => {
          const Icon = INSIGHT_ICON_MAP[item.icon];
          const cfg = INSIGHT_CFG[item.type];
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
              className={cn("rounded-xl border p-4", cfg.cls)}>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/70 flex-shrink-0">
                  <Icon size={14} className={cfg.iconCls} />
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
   Summary KPIs
───────────────────────────────────────────── */
function StaffKPIs() {
  const aktif = TENAGA_MEDIS.filter((t) => t.status === "Aktif").length;
  const avgKepuasan = (TENAGA_MEDIS.reduce((s, t) => s + t.kepuasan, 0) / TENAGA_MEDIS.length).toFixed(1);
  const gradeA = TENAGA_MEDIS.filter((t) => t.grade === "A").length;
  const avgDurasi = Math.round(TENAGA_MEDIS.reduce((s, t) => s + t.durasiRataRata, 0) / TENAGA_MEDIS.length);

  const stats = [
    { label: "Tenaga Aktif",      value: aktif.toString(),   unit: "orang", color: "var(--color-success)",     bg: "var(--color-success-light)" },
    { label: "Rata-rata Kepuasan",value: avgKepuasan,         unit: "%",     color: "var(--color-primary-600)", bg: "var(--color-primary-50)" },
    { label: "Grade A",           value: gradeA.toString(),  unit: "dokter",color: "var(--color-earth-500)",   bg: "var(--color-earth-100)" },
    { label: "Rata-rata Durasi",  value: avgDurasi.toString(),unit: "mnt",  color: "var(--color-warning)",     bg: "var(--color-warning-light)" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="rounded-2xl bg-surface-card border border-neutral-200 p-5 group hover:-translate-y-0.5 transition-all duration-300"
          style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-3xl font-extrabold mb-1" style={{ color: s.color, fontFamily: "var(--font-sans)" }}>
            {s.value}
            <span className="text-base font-semibold ml-1">{s.unit}</span>
          </p>
          <p className="text-sm font-medium text-neutral-600">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Staff Table
───────────────────────────────────────────── */
interface StaffTableProps {
  staff: TenagaMedis[];
  onSelect: (s: TenagaMedis) => void;
}

function StaffTable({ staff, onSelect }: StaffTableProps) {
  return (
    <div className="rounded-2xl bg-surface-card border border-neutral-200 overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/60">
              {["Tenaga Medis", "Profesi / Poli", "Pasien", "Durasi Rata-rata", "Kepuasan", "Grade", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap first:pl-6 last:pr-6 last:text-right">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <AnimatePresence>
              {staff.map((s, i) => {
                const st = STATUS_CFG[s.status];
                return (
                  <motion.tr key={s.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    onClick={() => onSelect(s)}
                    className="group hover:bg-primary-50/40 transition-colors duration-150 cursor-pointer"
                  >
                    {/* Tenaga Medis */}
                    <td className="px-4 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <TableAvatar nama={s.nama} grade={s.grade} />
                        <div>
                          <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors">
                            {s.nama}
                          </p>
                          <p className="text-xs text-neutral-400 font-mono mt-0.5">{s.nip}</p>
                        </div>
                      </div>
                    </td>

                    {/* Profesi */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-neutral-700">{s.profesi}</p>
                      <p className="text-xs text-neutral-400">{s.poli}</p>
                    </td>

                    {/* Pasien */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold" style={{ fontFamily: "var(--font-sans)" }}>
                        {s.jumlahPasien}
                      </span>
                      <span className="text-xs text-neutral-400 ml-1">pasien</span>
                    </td>

                    {/* Durasi */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-700">{s.durasiRataRata} mnt</span>
                      </div>
                    </td>

                    {/* Kepuasan */}
                    <td className="px-4 py-4">
                      <SatisfactionBar value={s.kepuasan} />
                    </td>

                    {/* Grade */}
                    <td className="px-4 py-4">
                      <GradeBadge grade={s.grade} score={s.performanceScore} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={cn("badge gap-1.5", st.bg, st.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", st.dot)} />
                        {s.status}
                      </span>
                    </td>

                    {/* Arrow */}
                    <td className="px-4 py-4 pr-6 text-right">
                      <ChevronRight size={15} className="text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all ml-auto" />
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile Staff Card
───────────────────────────────────────────── */
function MobileStaffCard({ s, onSelect, index }: { s: TenagaMedis; onSelect: (s: TenagaMedis) => void; index: number }) {
  const st = STATUS_CFG[s.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onSelect(s)}
      className="bg-surface-card border border-neutral-200 rounded-2xl p-4 space-y-3 cursor-pointer hover:border-primary-200 hover:shadow-md transition-all duration-300"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <TableAvatar nama={s.nama} grade={s.grade} />
          <div>
            <p className="text-sm font-semibold text-neutral-800">{s.nama}</p>
            <p className="text-xs text-neutral-400">{s.profesi}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold", GRADE_CFG[s.grade].bg, GRADE_CFG[s.grade].text)}
            style={{ fontFamily: "var(--font-sans)" }}>{s.grade}</div>
          <span className={cn("badge gap-1 text-xs", st.bg, st.text)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
            {s.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 rounded-lg bg-neutral-50">
          <p className="font-bold text-neutral-800 text-sm">{s.jumlahPasien}</p>
          <p className="text-neutral-400">Pasien</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-neutral-50">
          <p className="font-bold text-neutral-800 text-sm">{s.durasiRataRata} mnt</p>
          <p className="text-neutral-400">Durasi</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-neutral-50">
          <p className="font-bold text-sm" style={{ color: s.kepuasan >= 95 ? "var(--color-success)" : "var(--color-primary-600)" }}>
            {s.kepuasan}%
          </p>
          <p className="text-neutral-400">Kepuasan</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-primary-500 font-medium pt-1">
        <span>{s.poli}</span>
        <div className="flex items-center gap-1">
          Lihat Detail <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   EvaluasiView — Main Export
───────────────────────────────────────────── */
export function EvaluasiView() {
  const [selectedStaff, setSelectedStaff] = useState<TenagaMedis | null>(null);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState<PerformanceGrade | "Semua">("Semua");

  const filtered = TENAGA_MEDIS.filter((s) => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.poli.toLowerCase().includes(search.toLowerCase());
    const matchGrade = filterGrade === "Semua" || s.grade === filterGrade;
    return matchSearch && matchGrade;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
            style={{
              background: "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-400))",
              boxShadow: "0 4px 12px rgb(217 100 48 / 0.25)",
            }}>
            <Users size={21} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-sans)" }}>
              Evaluasi Tenaga Medis
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Pantau performa dokter dan tenaga kesehatan.
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

      {/* ── KPI Summary ───────────────────── */}
      <StaffKPIs />

      {/* ── Search + Filter ───────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            id="search-staff"
            placeholder="Cari nama dokter atau poli..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-surface-card border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl flex-shrink-0">
          <Filter size={13} className="text-neutral-400 ml-2" />
          {(["Semua", "A", "B", "C"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setFilterGrade(g)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                filterGrade === g
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {g === "Semua" ? "Semua" : `Grade ${g}`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Table (desktop) ───────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="hidden md:block">
        <StaffTable staff={filtered} onSelect={setSelectedStaff} />
      </motion.div>

      {/* ── Cards (mobile) ────────────────── */}
      <div className="block md:hidden space-y-4">
        {filtered.map((s, i) => (
          <MobileStaffCard key={s.id} s={s} onSelect={setSelectedStaff} index={i} />
        ))}
      </div>

      {/* ── Insight Cards ─────────────────── */}
      <StaffInsightCards items={STAFF_INSIGHTS} />

      {/* ── Detail Modal ──────────────────── */}
      <AnimatePresence>
        {selectedStaff && (
          <StaffModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
