"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History, Search, CalendarDays, Stethoscope,
  ChevronRight, ClipboardList, User, Activity,
  FileText, X,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/cn";
import { RIWAYAT_REKAM_MEDIS } from "./data";
import { SOAPDetailModal } from "./SOAPDetailModal";
import type { RiwayatEntry, StatusKunjunganRM } from "./data";

/* ─────────────────────────────────────────────
   Status Config
───────────────────────────────────────────── */
const STATUS_CFG: Record<StatusKunjunganRM, { cls: string; dot: string }> = {
  Menunggu:   { cls: "bg-neutral-100 text-neutral-600",    dot: "bg-neutral-400" },
  Diproses:   { cls: "bg-warning-light text-warning-dark", dot: "bg-warning"     },
  Selesai:    { cls: "bg-success-light text-success-dark", dot: "bg-success"     },
  Dibatalkan: { cls: "bg-danger-light text-danger-dark",   dot: "bg-danger"      },
};

/* ─────────────────────────────────────────────
   Timeline Item
───────────────────────────────────────────── */
function TimelineItem({
  entry,
  index,
  isLast,
  onSelect,
}: {
  entry: RiwayatEntry;
  index: number;
  isLast: boolean;
  onSelect: (e: RiwayatEntry) => void;
}) {
  const st  = STATUS_CFG[entry.status];
  const rel = formatDistanceToNow(parseISO(entry.tanggal), { addSuffix: true, locale: localeId });
  const dateStr = new Date(entry.tanggal).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  const initials = entry.namaPasien
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative flex gap-4 group"
    >
      {/* ── Timeline Track ──────────────── */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div className="w-3 h-3 rounded-full border-2 border-primary-500 bg-white flex-shrink-0 mt-5 z-10 group-hover:bg-primary-500 transition-colors duration-200" />
        {/* Line */}
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 bg-gradient-to-b from-primary-200 to-transparent" />
        )}
      </div>

      {/* ── Card ────────────────────────── */}
      <div
        onClick={() => onSelect(entry)}
        className="flex-1 mb-6 rounded-2xl bg-surface-card border border-neutral-200 p-4 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))" }}>
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800 group-hover:text-primary-700 transition-colors">
                {entry.namaPasien}
              </p>
              <p className="text-xs font-mono text-primary-600">{entry.noRM}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn("badge gap-1.5 text-xs", st.cls)}>
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", st.dot)} />
              {entry.status}
            </span>
            <ChevronRight size={14} className="text-neutral-300 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <CalendarDays size={11} />
            {dateStr}
            <span className="text-neutral-300 mx-1">·</span>
            <span className="text-neutral-400 italic">{rel}</span>
          </span>
          <span className="flex items-center gap-1">
            <Activity size={11} /> {entry.poli}
          </span>
          <span className="flex items-center gap-1">
            <Stethoscope size={11} /> {entry.dokter}
          </span>
        </div>

        {/* Keluhan → Diagnosa */}
        <div className="space-y-2">
          <div className="rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2">
            <p className="text-xs text-neutral-400 mb-0.5">Keluhan</p>
            <p className="text-xs font-medium text-neutral-700 line-clamp-2">{entry.keluhan}</p>
          </div>
          <div className="rounded-lg border-l-4 border-primary-400 pl-3 py-1.5 bg-primary-50/40">
            <p className="text-xs text-primary-600 mb-0.5">Diagnosa</p>
            <p className="text-xs font-bold text-neutral-800">
              {entry.diagnosa}
              {entry.icdCode && (
                <span className="ml-2 font-mono text-neutral-400">{entry.icdCode}</span>
              )}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <p className="text-xs text-primary-600 font-medium flex items-center gap-1">
            <FileText size={11} /> Klik untuk lihat detail SOAP
          </p>
          <Link
            href={`/pasien/${entry.pasienId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1"
          >
            <User size={11} /> Profil Pasien
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-neutral-400"
    >
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <ClipboardList size={32} className="opacity-40" />
      </div>
      <p className="text-sm font-medium mb-1">Tidak ada rekam medis ditemukan</p>
      <p className="text-xs">Coba ubah kata kunci pencarian</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   RiwayatView — Main Export
───────────────────────────────────────────── */
export function RiwayatView() {
  const [search, setSearch]         = useState("");
  const [selectedEntry, setSelectedEntry] = useState<RiwayatEntry | null>(null);

  /* ── Filtered data ────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return RIWAYAT_REKAM_MEDIS;
    return RIWAYAT_REKAM_MEDIS.filter((r) =>
      r.namaPasien.toLowerCase().includes(q) ||
      r.noRM.toLowerCase().includes(q) ||
      r.diagnosa.toLowerCase().includes(q) ||
      r.keluhan.toLowerCase().includes(q)
    );
  }, [search]);

  /* ── Group by date ────────────────────── */
  const grouped = useMemo(() => {
    const map = new Map<string, RiwayatEntry[]>();
    filtered.forEach((r) => {
      const existing = map.get(r.tanggal) ?? [];
      map.set(r.tanggal, [...existing, r]);
    });
    // Sort descending by date
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const totalEntries = filtered.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
            style={{
              background: "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-400))",
              boxShadow: "0 4px 12px rgb(217 100 48 / 0.25)",
            }}>
            <History size={21} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-sans)" }}>
              Riwayat Rekam Medis
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Telusuri seluruh rekam medis pasien.</p>
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

      {/* ── Search ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="relative"
      >
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Cari nama pasien, diagnosa, nomor RM..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-surface-card border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          style={{ boxShadow: "var(--shadow-sm)" }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
          >
            <X size={13} />
          </button>
        )}
      </motion.div>

      {/* ── Result count ──────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-800">{totalEntries}</span> rekam medis ditemukan
          {search && <span className="ml-1 text-primary-600 font-medium">untuk &ldquo;{search}&rdquo;</span>}
        </p>
        <p className="text-xs text-neutral-400 hidden sm:block">
          {grouped.length} hari kunjungan
        </p>
      </motion.div>

      {/* ── Timeline ──────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, entries]) => {
            const dateLabel = new Date(date).toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            });
            const isToday = date === "2026-06-17";

            return (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold",
                      isToday
                        ? "text-white"
                        : "text-neutral-600 bg-neutral-100"
                    )}
                    style={isToday ? {
                      background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))"
                    } : {}}
                  >
                    <CalendarDays size={12} />
                    {dateLabel}
                    {isToday && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-white text-2xs">
                        HARI INI
                      </span>
                    )}
                  </div>
                  <div className="flex-1 h-px bg-neutral-100" />
                  <span className="text-xs text-neutral-400 flex-shrink-0">{entries.length} kunjungan</span>
                </div>

                {/* Timeline items for this date */}
                <div className="pl-2">
                  {entries.map((entry, i) => (
                    <TimelineItem
                      key={entry.id}
                      entry={entry}
                      index={i}
                      isLast={i === entries.length - 1}
                      onSelect={setSelectedEntry}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SOAP Detail Modal ─────────────── */}
      <AnimatePresence>
        {selectedEntry && (
          <SOAPDetailModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
