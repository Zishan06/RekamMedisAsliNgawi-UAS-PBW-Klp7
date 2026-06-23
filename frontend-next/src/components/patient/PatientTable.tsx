"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, FileText, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import type { Pasien, StatusPasien } from "./data";

/* ─────────────────────────────────────────────
   Status Badge
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: StatusPasien }) {
  const map: Record<
    StatusPasien,
    { cls: string; dot: string; label: string }
  > = {
    Aktif: {
      cls: "bg-success-light text-success-dark",
      dot: "bg-success",
      label: "Aktif",
    },
    "Rawat Jalan": {
      cls: "bg-primary-100 text-primary-700",
      dot: "bg-primary-500",
      label: "Rawat Jalan",
    },
    "Rawat Inap": {
      cls: "bg-warning-light text-warning-dark",
      dot: "bg-warning",
      label: "Rawat Inap",
    },
  };

  const { cls, dot, label } = map[status];

  return (
    <span
      className={cn(
        "badge",
        cls,
        "gap-1.5"
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Sort types
───────────────────────────────────────────── */
export type SortKey = "noRM" | "nama" | "umur" | "kunjunganTerakhir" | "status";
export type SortDir = "asc" | "desc";

interface PatientTableProps {
  patients: Pasien[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}

/* ─────────────────────────────────────────────
   Column Header
───────────────────────────────────────────── */
function Th({
  label,
  sortKey,
  activeSortKey,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  sortKey?: SortKey;
  activeSortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const isActive = sortKey === activeSortKey;

  if (!sortKey) {
    return (
      <th
        className={cn(
          "px-4 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap",
          className
        )}
      >
        {label}
      </th>
    );
  }

  return (
    <th
      className={cn(
        "px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap",
        "cursor-pointer select-none group transition-colors duration-150",
        isActive ? "text-primary-600" : "text-neutral-500 hover:text-neutral-800",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <span className={cn("transition-opacity", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50")}>
          {isActive && sortDir === "asc" ? (
            <ChevronUp size={13} />
          ) : isActive && sortDir === "desc" ? (
            <ChevronDown size={13} />
          ) : (
            <Minus size={13} />
          )}
        </span>
      </div>
    </th>
  );
}

/* ─────────────────────────────────────────────
   Pagination
───────────────────────────────────────────── */
function Pagination({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const from = Math.min((currentPage - 1) * pageSize + 1, totalRows);
  const to   = Math.min(currentPage * pageSize, totalRows);

  // Build page numbers with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end   = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-4 border-t border-neutral-100">
      {/* Info */}
      <p className="text-sm text-neutral-500">
        Menampilkan{" "}
        <span className="font-semibold text-neutral-700">{from}–{to}</span>{" "}
        dari{" "}
        <span className="font-semibold text-neutral-700">{totalRows}</span>{" "}
        pasien
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            currentPage === 1
              ? "text-neutral-300 cursor-not-allowed"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          )}
        >
          ‹ Prev
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-neutral-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200",
                p === currentPage
                  ? "bg-primary-600 text-white shadow-sm shadow-primary-600/20"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            currentPage === totalPages
              ? "text-neutral-300 cursor-not-allowed"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          )}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PatientTable — Desktop
───────────────────────────────────────────── */
export function PatientTable({
  patients,
  sortKey,
  sortDir,
  onSort,
  currentPage,
  totalPages,
  pageSize,
  totalRows,
  onPageChange,
}: PatientTableProps) {
  return (
    <div
      className="rounded-2xl bg-surface-card border border-neutral-200 overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          {/* ── Head ────────────────────────────── */}
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/60">
              <Th
                label="No. RM"
                sortKey="noRM"
                activeSortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
                className="pl-6"
              />
              <Th
                label="Nama Pasien"
                sortKey="nama"
                activeSortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                label="J/K"
                activeSortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                label="Umur"
                sortKey="umur"
                activeSortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                label="No. Telepon"
                activeSortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                label="Kunjungan Terakhir"
                sortKey="kunjunganTerakhir"
                activeSortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                label="Status"
                sortKey="status"
                activeSortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th className="px-4 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap pr-6">
                Aksi
              </th>
            </tr>
          </thead>

          {/* ── Body ────────────────────────────── */}
          <tbody className="divide-y divide-neutral-100">
            <AnimatePresence mode="wait">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-neutral-400">
                      <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                        <FileText size={28} className="opacity-40" />
                      </div>
                      <p className="text-sm font-medium">Tidak ada pasien ditemukan</p>
                      <p className="text-xs">Coba ubah kata kunci atau filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="group hover:bg-primary-50/40 transition-colors duration-150"
                  >
                    {/* No. RM */}
                    <td className="px-4 py-4 pl-6 whitespace-nowrap">
                      <span
                        className="text-xs font-mono font-semibold px-2 py-1 rounded-lg"
                        style={{
                          background: "var(--color-primary-50)",
                          color: "var(--color-primary-700)",
                        }}
                      >
                        {p.noRM}
                      </span>
                    </td>

                    {/* Nama */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors">
                          {p.nama}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                          NIK: {p.nik}
                        </p>
                      </div>
                    </td>

                    {/* JK */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "badge",
                          p.jenisKelamin === "Laki-laki"
                            ? "badge-primary"
                            : "badge-earth"
                        )}
                      >
                        {p.jenisKelamin === "Laki-laki" ? "L" : "P"}
                      </span>
                    </td>

                    {/* Umur */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-700 font-medium">
                        {p.umur}{" "}
                        <span className="text-neutral-400 font-normal">th</span>
                      </span>
                    </td>

                    {/* Telepon */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600 font-mono text-xs">
                        {p.noTelp}
                      </span>
                    </td>

                    {/* Kunjungan Terakhir */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-neutral-700 font-medium">
                          {format(parseISO(p.kunjunganTerakhir), "d MMM yyyy", {
                            locale: localeId,
                          })}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {p.poli}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-4 pr-6 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/pasien/${p.id}`}
                          title="Lihat Detail Pasien"
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                            "bg-primary-50 text-primary-700 border border-primary-100",
                            "hover:bg-primary-600 hover:text-white hover:border-primary-600",
                            "transition-all duration-200"
                          )}
                        >
                          <Eye size={13} />
                          <span className="hidden lg:inline">Detail</span>
                        </Link>
                        <Link
                          href={`/pasien/${p.id}`}
                          title="Lihat Rekam Medis"
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                            "border transition-all duration-200"
                          )}
                          style={{
                            background: "var(--color-earth-50)",
                            color: "var(--color-earth-700)",
                            borderColor: "var(--color-earth-100)",
                          }}
                        >
                          <FileText size={13} />
                          <span className="hidden lg:inline">Rekam Medis</span>
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────── */}
      {patients.length > 0 && (
        <div className="px-6 pb-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRows={totalRows}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
