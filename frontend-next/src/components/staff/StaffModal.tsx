"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X, User, Briefcase, Calendar, Clock, Star,
  TrendingUp, ClipboardList, CheckCircle2, AlertTriangle,
  Phone, Award,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid,
} from "recharts";
import { cn } from "@/lib/cn";
import type { TenagaMedis, PerformanceGrade } from "./data";

/* ─────────────────────────────────────────────
   Grade config
───────────────────────────────────────────── */
const GRADE_CFG: Record<PerformanceGrade, {
  ring: string; bg: string; text: string; label: string;
}> = {
  A: { ring: "ring-success",     bg: "bg-success-light",     text: "text-success-dark",   label: "Sangat Baik" },
  B: { ring: "ring-primary-400", bg: "bg-primary-100",       text: "text-primary-700",    label: "Baik" },
  C: { ring: "ring-warning",     bg: "bg-warning-light",     text: "text-warning-dark",   label: "Cukup" },
  D: { ring: "ring-danger",      bg: "bg-danger-light",      text: "text-danger-dark",    label: "Perlu Perbaikan" },
};

const STATUS_CFG = {
  Aktif:        { cls: "bg-success-light text-success-dark", dot: "bg-success" },
  Cuti:         { cls: "bg-warning-light text-warning-dark", dot: "bg-warning" },
  "Tidak Aktif":{ cls: "bg-neutral-100 text-neutral-500",   dot: "bg-neutral-400" },
};

/* ─────────────────────────────────────────────
   Avatar Initials
───────────────────────────────────────────── */
function StaffAvatar({ nama, grade, size = "lg" }: { nama: string; grade: PerformanceGrade; size?: "lg" | "sm" }) {
  const initials = nama
    .replace(/^(dr\.|Sp\.\w+|S\.\w+|A\.Md\.\w+)\s*/gi, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const sizeClasses = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";
  const g = GRADE_CFG[grade];

  return (
    <div className={cn(
      sizeClasses,
      "rounded-2xl flex items-center justify-center font-extrabold text-white flex-shrink-0 ring-2",
      g.ring,
    )}
      style={{
        background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
        fontFamily: "var(--font-sans)",
      }}>
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Score Ring
───────────────────────────────────────────── */
function ScoreRing({ score, grade }: { score: number; grade: PerformanceGrade }) {
  const g = GRADE_CFG[grade];
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none"
            stroke={grade === "A" ? "var(--color-success)" : grade === "B" ? "var(--color-primary-500)" : grade === "C" ? "var(--color-warning)" : "var(--color-danger)"}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold leading-none"
            style={{ color: grade === "A" ? "var(--color-success)" : grade === "B" ? "var(--color-primary-600)" : grade === "C" ? "var(--color-warning)" : "var(--color-danger)", fontFamily: "var(--font-sans)" }}>
            {score}
          </span>
          <span className="text-xs text-neutral-400 font-medium">/100</span>
        </div>
      </div>
      <div className={cn("px-3 py-1 rounded-full text-sm font-bold", g.bg, g.text)}>
        Grade {grade} — {g.label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   StaffModal
───────────────────────────────────────────── */
interface StaffModalProps {
  staff: TenagaMedis;
  onClose: () => void;
}

export function StaffModal({ staff, onClose }: StaffModalProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const status = STATUS_CFG[staff.status];
  const grade  = GRADE_CFG[staff.grade];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-surface-card flex flex-col overflow-hidden pointer-events-auto"
          style={{ boxShadow: "var(--shadow-xl)" }}>

          {/* ── Modal Header ───────────────── */}
          <div className="relative flex-shrink-0 px-6 py-5 overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))" }}>
            {/* close */}
            <button onClick={onClose} id="btn-staff-modal-close"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all z-10">
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <StaffAvatar nama={staff.nama} grade={staff.grade} size="lg" />
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-white leading-tight pr-10"
                  style={{ fontFamily: "var(--font-sans)" }}>{staff.nama}</h2>
                <p className="text-primary-200 text-sm mt-0.5">
                  {staff.profesi}{staff.spesialisasi ? ` · ${staff.spesialisasi}` : ""}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn("badge gap-1.5 bg-white/15 text-white border border-white/20 backdrop-blur-sm")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                    {staff.status}
                  </span>
                  <span className={cn("badge gap-1.5", grade.bg, grade.text, "text-xs font-bold")}>
                    Grade {staff.grade}
                  </span>
                </div>
              </div>
            </div>

            {/* NIP */}
            <p className="text-primary-300 text-xs font-mono mt-3">NIP: {staff.nip}</p>
          </div>

          {/* ── Scrollable Body ────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Score + quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Jumlah Pasien",  value: staff.jumlahPasien.toString(), icon: User,  color: "var(--color-primary-600)", bg: "var(--color-primary-50)" },
                { label: "Durasi Rata-rata", value: `${staff.durasiRataRata} mnt`, icon: Clock, color: "var(--color-warning)",     bg: "var(--color-warning-light)" },
                { label: "Kepuasan",        value: `${staff.kepuasan}%`,           icon: Star,  color: "var(--color-success)",     bg: "var(--color-success-light)" },
                { label: "Pengalaman",      value: `${staff.pengalaman} th`,       icon: Award, color: "var(--color-earth-500)",   bg: "var(--color-earth-100)" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 border border-neutral-100 bg-neutral-50 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                    <s.icon size={15} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">{s.label}</p>
                    <p className="text-sm font-bold text-neutral-800" style={{ fontFamily: "var(--font-sans)" }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Score ring + target */}
            <div className="rounded-xl border border-neutral-200 p-5 bg-neutral-50">
              <p className="section-label mb-4">Performance Score</p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreRing score={staff.performanceScore} grade={staff.grade} />
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Target vs Actual */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-500">Target Pasien</span>
                      <span className="font-semibold text-neutral-700">{staff.jumlahPasien} / {staff.targetPasien}</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (staff.jumlahPasien / staff.targetPasien) * 100)}%` }}
                        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
                        className="h-full rounded-full"
                        style={{ background: "var(--color-primary-500)" }}
                      />
                    </div>
                  </div>
                  {/* Kepuasan */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-500">Kepuasan Pasien</span>
                      <span className="font-semibold text-neutral-700">{staff.kepuasan}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${staff.kepuasan}%` }}
                        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ background: "var(--color-success)" }}
                      />
                    </div>
                  </div>
                  {/* Score */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-500">Skor Total</span>
                      <span className="font-semibold text-neutral-700">{staff.performanceScore}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${staff.performanceScore}%` }}
                        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
                        className="h-full rounded-full"
                        style={{
                          background: staff.grade === "A" ? "var(--color-success)"
                            : staff.grade === "B" ? "var(--color-primary-500)"
                            : "var(--color-warning)"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Pasien Mini Chart */}
            <div className="rounded-xl border border-neutral-200 p-5">
              <p className="section-label mb-3">Tren Pasien (6 Bulan)</p>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={staff.pasienDitangani} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id={`gStaff${staff.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [v, "Pasien"]} />
                  <Area type="monotone" dataKey="nilai" name="Pasien" stroke="#2563eb" strokeWidth={2}
                    fill={`url(#gStaff${staff.id})`} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Jadwal */}
            <div className="rounded-xl border border-neutral-200 p-5">
              <p className="section-label mb-3">Jadwal Praktik</p>
              <div className="space-y-2">
                {staff.jadwal.map((j, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-primary-50)" }}>
                      <Calendar size={13} style={{ color: "var(--color-primary-600)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-700">{j.hari}</p>
                      <p className="text-xs text-neutral-400">{j.poli}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                      {j.jam}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan Evaluasi */}
            <div className="rounded-xl border border-neutral-200 p-5">
              <p className="section-label mb-3">Catatan Evaluasi</p>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-earth-100)" }}>
                  <ClipboardList size={14} style={{ color: "var(--color-earth-500)" }} />
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed italic">
                  &ldquo;{staff.catatanEvaluasi}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* ── Footer ─────────────────────── */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-neutral-100 flex justify-end">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
