"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, FileText, Phone, Calendar, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import type { Pasien, StatusPasien } from "./data";

/* ─────────────────────────────────────────────
   Status Badge (same as table, inline)
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: StatusPasien }) {
  const map: Record<StatusPasien, { cls: string; dot: string }> = {
    Aktif:          { cls: "bg-success-light text-success-dark", dot: "bg-success" },
    "Rawat Jalan":  { cls: "bg-primary-100 text-primary-700", dot: "bg-primary-500" },
    "Rawat Inap":   { cls: "bg-warning-light text-warning-dark", dot: "bg-warning" },
  };
  const { cls, dot } = map[status];
  return (
    <span className={cn("badge gap-1.5", cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
      {status}
    </span>
  );
}

/* ─────────────────────────────────────────────
   PatientMobileCard — Mobile Fallback
───────────────────────────────────────────── */
interface PatientMobileCardListProps {
  patients: Pasien[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}

function PatientCardItem({ pasien, index }: { pasien: Pasien; index: number }) {
  const initials = pasien.nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const avatarColors: Record<string, { bg: string; text: string }> = {
    Aktif:         { bg: "var(--color-success-light)", text: "var(--color-success-dark)" },
    "Rawat Jalan": { bg: "var(--color-primary-100)", text: "var(--color-primary-700)" },
    "Rawat Inap":  { bg: "var(--color-warning-light)", text: "var(--color-warning-dark)" },
  };
  const { bg, text } = avatarColors[pasien.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-surface-card border border-neutral-200 rounded-2xl p-4 space-y-3 hover:border-primary-200 hover:shadow-md transition-all duration-300"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* ── Header row ──────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: bg, color: text }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800 leading-tight">
              {pasien.nama}
            </p>
            <p
              className="text-xs font-mono font-semibold mt-0.5"
              style={{ color: "var(--color-primary-700)" }}
            >
              {pasien.noRM}
            </p>
          </div>
        </div>
        <StatusBadge status={pasien.status} />
      </div>

      {/* ── Info grid ─────────────────────── */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-500">
          <UserCircle2 size={12} className="flex-shrink-0" />
          <span>
            {pasien.jenisKelamin === "Laki-laki" ? "♂" : "♀"}{" "}
            {pasien.umur} th
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500">
          <Phone size={12} className="flex-shrink-0" />
          <span className="font-mono">{pasien.noTelp}</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500 col-span-2">
          <Calendar size={12} className="flex-shrink-0" />
          <span>
            Kunjungan:{" "}
            <span className="font-medium text-neutral-700">
              {format(parseISO(pasien.kunjunganTerakhir), "d MMM yyyy", {
                locale: localeId,
              })}
            </span>
            <span className="mx-1 text-neutral-300">·</span>
            {pasien.poli}
          </span>
        </div>
      </div>

      {/* ── Actions ───────────────────────── */}
      <div className="flex gap-2 pt-1">
        <Link
          href={`/pasien/${pasien.id}`}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold",
            "bg-primary-50 text-primary-700 border border-primary-100",
            "hover:bg-primary-600 hover:text-white hover:border-primary-600",
            "transition-all duration-200"
          )}
        >
          <Eye size={13} />
          Lihat Detail
        </Link>
        <Link
          href={`/pasien/${pasien.id}`}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold",
            "border transition-all duration-200"
          )}
          style={{
            background: "var(--color-earth-50)",
            color: "var(--color-earth-700)",
            borderColor: "var(--color-earth-100)",
          }}
        >
          <FileText size={13} />
          Rekam Medis
        </Link>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Mobile Card List with Pagination
───────────────────────────────────────────── */
export function PatientMobileCardList({
  patients,
  currentPage,
  totalPages,
  pageSize,
  totalRows,
  onPageChange,
}: PatientMobileCardListProps) {
  const from = Math.min((currentPage - 1) * pageSize + 1, totalRows);
  const to   = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className="space-y-4">
      {/* Cards */}
      {patients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-neutral-400">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
            <FileText size={28} className="opacity-40" />
          </div>
          <p className="text-sm font-medium">Tidak ada pasien ditemukan</p>
          <p className="text-xs">Coba ubah kata kunci atau filter</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {patients.map((p, i) => (
            <PatientCardItem key={p.id} pasien={p} index={i} />
          ))}
        </AnimatePresence>
      )}

      {/* Pagination */}
      {patients.length > 0 && (
        <div
          className="rounded-2xl bg-surface-card border border-neutral-200 p-4 flex items-center justify-between gap-3"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <p className="text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">{from}–{to}</span>{" "}
            dari{" "}
            <span className="font-semibold text-neutral-700">{totalRows}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                currentPage === 1
                  ? "text-neutral-300 cursor-not-allowed"
                  : "bg-neutral-100 text-neutral-700 hover:bg-primary-600 hover:text-white"
              )}
            >
              ‹ Prev
            </button>
            <span className="text-xs font-semibold text-neutral-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                currentPage === totalPages
                  ? "text-neutral-300 cursor-not-allowed"
                  : "bg-neutral-100 text-neutral-700 hover:bg-primary-600 hover:text-white"
              )}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
