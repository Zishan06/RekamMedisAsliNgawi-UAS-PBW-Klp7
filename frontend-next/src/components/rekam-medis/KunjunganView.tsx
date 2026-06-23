"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck, Users, Clock, CheckCircle2,
  ClipboardList, Search, Filter, ChevronRight,
  Stethoscope, FileText, Eye, X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  KUNJUNGAN_HARI_INI, KUNJUNGAN_STATS, POLI_LIST, DOKTER_LIST,
  RIWAYAT_REKAM_MEDIS,
} from "./data";
import { SOAPDetailModal } from "./SOAPDetailModal";
import type { Kunjungan, StatusKunjunganRM, RiwayatEntry } from "./data";

/* ─────────────────────────────────────────────
   Status config
───────────────────────────────────────────── */
const STATUS_CFG: Record<StatusKunjunganRM, {
  cls: string; dot: string; label: string; priority: number;
}> = {
  Menunggu:   { cls: "bg-neutral-100 text-neutral-600",    dot: "bg-neutral-400",  label: "Menunggu",   priority: 1 },
  Diproses:   { cls: "bg-warning-light text-warning-dark", dot: "bg-warning",      label: "Diproses",   priority: 0 },
  Selesai:    { cls: "bg-success-light text-success-dark", dot: "bg-success",      label: "Selesai",    priority: 2 },
  Dibatalkan: { cls: "bg-danger-light text-danger-dark",   dot: "bg-danger",       label: "Dibatalkan", priority: 3 },
};

/* ─────────────────────────────────────────────
   Stat Cards
───────────────────────────────────────────── */
interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function StatCardItem({ card, index }: { card: StatCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="relative overflow-hidden rounded-2xl bg-surface-card border border-neutral-200 p-5 group hover:-translate-y-0.5 transition-all duration-300"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity"
        style={{ background: card.color }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: card.bg }}>
          <card.icon size={19} style={{ color: card.color }} />
        </div>
      </div>
      <p className="text-3xl font-extrabold leading-none mb-1"
        style={{ color: card.color, fontFamily: "var(--font-sans)" }}>
        {card.value}
      </p>
      <p className="text-sm font-medium text-neutral-600">{card.label}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Kunjungan Table Row
───────────────────────────────────────────── */
function KunjunganRow({ k, index, onDetail }: {
  k: Kunjungan;
  index: number;
  onDetail: (k: Kunjungan) => void;
}) {
  const st = STATUS_CFG[k.status];
  const initials = k.namaPasien.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group hover:bg-primary-50/40 transition-colors duration-150"
    >
      {/* No Antrian + No RM */}
      <td className="px-4 py-4 pl-6 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "var(--color-primary-600)" }}>
            {k.noAntrian}
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-1 rounded-lg"
            style={{ background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}>
            {k.noRM}
          </span>
        </div>
      </td>

      {/* Nama Pasien */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))" }}>
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors">
              {k.namaPasien}
            </p>
            <p className="text-xs text-neutral-400">{k.umur} th · {k.jenisKelamin === "Laki-laki" ? "L" : "P"}</p>
          </div>
        </div>
      </td>

      {/* Poli */}
      <td className="px-4 py-4 whitespace-nowrap">
        <p className="text-sm text-neutral-700 font-medium">{k.poli}</p>
      </td>

      {/* Dokter */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Stethoscope size={12} className="text-neutral-400 flex-shrink-0" />
          <p className="text-sm text-neutral-600">{k.dokter}</p>
        </div>
      </td>

      {/* Jam */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-neutral-700">
            Daftar: <span className="font-mono">{k.jamDaftar}</span>
          </p>
          {k.jamMulai && (
            <p className="text-xs text-neutral-400">
              Mulai: <span className="font-mono">{k.jamMulai}</span>
            </p>
          )}
          {k.jamSelesai && (
            <p className="text-xs text-neutral-400">
              Selesai: <span className="font-mono">{k.jamSelesai}</span>
            </p>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={cn("badge gap-1.5", st.cls)}>
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", st.dot)} />
          {st.label}
        </span>
      </td>

      {/* Aksi */}
      <td className="px-4 py-4 pr-6 whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onDetail(k)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
          >
            <Eye size={12} />
            <span className="hidden lg:inline">Detail</span>
          </button>
          <Link
            href={`/pasien/${k.pasienId}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
            style={{ background: "var(--color-earth-50)", color: "var(--color-earth-700)", borderColor: "var(--color-earth-100)" }}
          >
            <FileText size={12} />
            <span className="hidden lg:inline">Rekam Medis</span>
          </Link>
        </div>
      </td>
    </motion.tr>
  );
}

/* ─────────────────────────────────────────────
   Mobile Kunjungan Card
───────────────────────────────────────────── */
function KunjunganCard({ k, index, onDetail }: {
  k: Kunjungan;
  index: number;
  onDetail: (k: Kunjungan) => void;
}) {
  const st = STATUS_CFG[k.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-surface-card border border-neutral-200 rounded-2xl p-4 space-y-3"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))" }}>
            {k.namaPasien.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800">{k.namaPasien}</p>
            <p className="text-xs font-mono text-primary-600">{k.noRM}</p>
          </div>
        </div>
        <span className={cn("badge gap-1 text-xs flex-shrink-0", st.cls)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
          {st.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-neutral-400">Poli</p>
          <p className="font-medium text-neutral-700">{k.poli}</p>
        </div>
        <div>
          <p className="text-neutral-400">Jam Daftar</p>
          <p className="font-mono font-medium text-neutral-700">{k.jamDaftar}</p>
        </div>
        <div className="col-span-2">
          <p className="text-neutral-400">Dokter</p>
          <p className="font-medium text-neutral-700">{k.dokter}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onDetail(k)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
        >
          <Eye size={12} /> Lihat Detail
        </button>
        <Link
          href={`/pasien/${k.pasienId}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
          style={{ background: "var(--color-earth-50)", color: "var(--color-earth-700)", borderColor: "var(--color-earth-100)" }}
        >
          <FileText size={12} /> Rekam Medis
        </Link>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Kunjungan Detail Mini-Modal (no SOAP)
   Shows when clicking "Detail" on a visit that 
   doesn't have a full RiwayatEntry yet.
───────────────────────────────────────────── */
function KunjunganDetailModal({ k, onClose }: { k: Kunjungan; onClose: () => void }) {
  const st = STATUS_CFG[k.status];
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-md rounded-2xl bg-surface-card pointer-events-auto overflow-hidden"
          style={{ boxShadow: "var(--shadow-xl)" }}>
          {/* Header */}
          <div className="px-6 py-5 relative"
            style={{ background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))" }}>
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all">
              <X size={17} />
            </button>
            <p className="text-primary-200 text-xs mb-1 font-mono">{k.noRM} · Antrian #{k.noAntrian}</p>
            <h3 className="text-lg font-extrabold text-white"
              style={{ fontFamily: "var(--font-sans)" }}>{k.namaPasien}</h3>
            <span className={cn("badge gap-1 text-xs mt-2", st.cls)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
              {st.label}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Poli", value: k.poli },
                { label: "Dokter", value: k.dokter },
                { label: "Jam Daftar", value: k.jamDaftar },
                { label: "Jam Mulai", value: k.jamMulai ?? "—" },
                { label: "Jam Selesai", value: k.jamSelesai ?? "—" },
                { label: "No. Antrian", value: `#${k.noAntrian}` },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-neutral-400">{item.label}</p>
                  <p className="font-semibold text-neutral-800">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3">
              <p className="text-xs text-neutral-400 mb-1">Keluhan</p>
              <p className="text-sm text-neutral-700 italic">&ldquo;{k.keluhan}&rdquo;</p>
            </div>
            {k.diagnosa && (
              <div className="rounded-xl border-l-4 border-primary-500 pl-3 py-2 bg-primary-50/50">
                <p className="text-xs text-primary-600 mb-0.5">Diagnosa</p>
                <p className="text-sm font-semibold text-neutral-800">{k.diagnosa}</p>
              </div>
            )}
          </div>

          <div className="px-6 pb-5 flex gap-2">
            <Link
              href={`/pasien/${k.pasienId}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))" }}
              onClick={onClose}
            >
              <ChevronRight size={14} /> Buka Rekam Medis
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────
   KunjunganView — Main Export
───────────────────────────────────────────── */
export function KunjunganView() {
  const [search, setSearch]         = useState("");
  const [filterPoli, setFilterPoli] = useState("");
  const [filterDokter, setFilterDokter] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusKunjunganRM | "">("");
  const [selectedK, setSelectedK]   = useState<Kunjungan | null>(null);
  const [soapEntry, setSoapEntry]   = useState<RiwayatEntry | null>(null);

  const handleDetail = (k: Kunjungan) => {
    // Check if there's a full SOAP entry for this visit
    const riwayat = RIWAYAT_REKAM_MEDIS.find((r) => r.pasienId === k.pasienId && r.tanggal === "2026-06-17");
    if (riwayat) {
      setSoapEntry(riwayat);
    } else {
      setSelectedK(k);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return KUNJUNGAN_HARI_INI.filter((k) => {
      if (q && !k.namaPasien.toLowerCase().includes(q) && !k.noRM.toLowerCase().includes(q)) return false;
      if (filterPoli    && k.poli    !== filterPoli)    return false;
      if (filterDokter  && k.dokter  !== filterDokter)  return false;
      if (filterStatus  && k.status  !== filterStatus)  return false;
      return true;
    });
  }, [search, filterPoli, filterDokter, filterStatus]);

  const STAT_CARDS: StatCard[] = [
    { label: "Total Kunjungan",   value: KUNJUNGAN_STATS.totalHariIni, icon: CalendarCheck, color: "var(--color-primary-600)", bg: "var(--color-primary-50)"   },
    { label: "Pasien Menunggu",   value: KUNJUNGAN_STATS.menunggu,     icon: Users,         color: "var(--color-neutral-600)", bg: "var(--color-neutral-100)"  },
    { label: "Sedang Dilayani",   value: KUNJUNGAN_STATS.diproses,     icon: Clock,         color: "var(--color-warning)",     bg: "var(--color-warning-light)" },
    { label: "Selesai",           value: KUNJUNGAN_STATS.selesai,      icon: CheckCircle2,  color: "var(--color-success)",     bg: "var(--color-success-light)" },
  ];


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
            style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))", boxShadow: "0 4px 12px rgb(37 99 235 / 0.25)" }}>
            <CalendarCheck size={21} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-sans)" }}>
              Kunjungan Pasien
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Pantau aktivitas pelayanan pasien.</p>
          </div>
        </div>

        {/* Date badge */}
        <div className="flex-shrink-0 px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-600 flex items-center gap-2">
          <CalendarCheck size={14} className="text-primary-500" />
          Rabu, 17 Juni 2026
        </div>
      </motion.div>

      {/* ── Stat Cards ────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((c, i) => <StatCardItem key={c.label} card={c} index={i} />)}
      </div>

      {/* ── Search & Filter ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3 flex-wrap"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari nama pasien atau No. RM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-surface-card border border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>

        {/* Poli filter */}
        <select
          value={filterPoli}
          onChange={(e) => setFilterPoli(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm bg-surface-card border border-neutral-200 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all cursor-pointer"
        >
          <option value="">Semua Poli</option>
          {POLI_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Dokter filter */}
        <select
          value={filterDokter}
          onChange={(e) => setFilterDokter(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm bg-surface-card border border-neutral-200 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all cursor-pointer"
        >
          <option value="">Semua Dokter</option>
          {DOKTER_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
          <Filter size={13} className="text-neutral-400 ml-1.5" />
          {(["", "Menunggu", "Diproses", "Selesai"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as StatusKunjunganRM | "")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                filterStatus === s
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {s === "" ? "Semua" : s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Result count ──────────────────── */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-sm text-neutral-500">
        Menampilkan <span className="font-semibold text-neutral-800">{filtered.length}</span> kunjungan
      </motion.p>

      {/* ── Table (desktop) ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="hidden md:block rounded-2xl bg-surface-card border border-neutral-200 overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                {["No. RM / Antrian", "Nama Pasien", "Poli", "Dokter", "Jam Kunjungan", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap first:pl-6 last:pr-6 last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3 text-neutral-400">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                          <ClipboardList size={28} className="opacity-40" />
                        </div>
                        <p className="text-sm font-medium">Tidak ada kunjungan ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((k, i) => (
                    <KunjunganRow key={k.id} k={k} index={i} onDetail={handleDetail} />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Cards (mobile) ────────────────── */}
      <div className="block md:hidden space-y-4">
        {filtered.map((k, i) => (
          <KunjunganCard key={k.id} k={k} index={i} onDetail={handleDetail} />
        ))}
      </div>

      {/* ── Modals ────────────────────────── */}
      <AnimatePresence>
        {soapEntry && (
          <SOAPDetailModal entry={soapEntry} onClose={() => setSoapEntry(null)} />
        )}
        {selectedK && !soapEntry && (
          <KunjunganDetailModal k={selectedK} onClose={() => setSelectedK(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
