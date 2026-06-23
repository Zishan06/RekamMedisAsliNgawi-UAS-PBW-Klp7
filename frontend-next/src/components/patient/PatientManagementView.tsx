"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { usePatientStore } from "@/lib/patient-store";
import { PATIENT_STATS } from "./data";
import { PatientStatsBar } from "./PatientStatsBar";
import { PatientSearchFilter } from "./PatientSearchFilter";
import { PatientTable } from "./PatientTable";
import { PatientMobileCardList } from "./PatientMobileCard";
import type { FilterState } from "./PatientSearchFilter";
import type { SortKey, SortDir } from "./PatientTable";

/* ─────────────────────────────────────────────
   Config
───────────────────────────────────────────── */
const PAGE_SIZE = 10;

/* ─────────────────────────────────────────────
   PatientManagementView
   Reads from PatientStoreProvider — all adds
   instantly appear here without page refresh.
───────────────────────────────────────────── */
export function PatientManagementView() {
  /* ── Global patient store ──────────────── */
  const { patients } = usePatientStore();

  /* ── Filter state ─────────────────────── */
  const [filter, setFilter] = useState<FilterState>({
    query:       "",
    jenisKelamin:"",
    status:      "",
    umurMin:     "",
    umurMax:     "",
  });

  /* ── Sort state ───────────────────────── */
  const [sortKey, setSortKey] = useState<SortKey>("noRM");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  /* ── Pagination state ─────────────────── */
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Handle sort ──────────────────────── */
  const handleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setCurrentPage(1);
    },
    [sortKey]
  );

  /* ── Handle filter change ─────────────── */
  const handleFilterChange = useCallback((next: FilterState) => {
    setFilter(next);
    setCurrentPage(1);
  }, []);

  /* ── Filtered + sorted data ───────────── */
  const filtered = useMemo(() => {
    const q = filter.query.toLowerCase().trim();
    const umurMin = filter.umurMin !== "" ? parseInt(filter.umurMin, 10) : null;
    const umurMax = filter.umurMax !== "" ? parseInt(filter.umurMax, 10) : null;

    return patients.filter((p) => {
      if (q && !p.nama.toLowerCase().includes(q) && !p.noRM.toLowerCase().includes(q) && !p.nik.includes(q))
        return false;
      if (filter.jenisKelamin && p.jenisKelamin !== filter.jenisKelamin) return false;
      if (filter.status       && p.status       !== filter.status)       return false;
      if (umurMin !== null && p.umur < umurMin) return false;
      if (umurMax !== null && p.umur > umurMax) return false;
      return true;
    }).sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "noRM":              cmp = a.noRM.localeCompare(b.noRM);                              break;
        case "nama":              cmp = a.nama.localeCompare(b.nama, "id");                        break;
        case "umur":              cmp = a.umur - b.umur;                                           break;
        case "kunjunganTerakhir": cmp = a.kunjunganTerakhir.localeCompare(b.kunjunganTerakhir);   break;
        case "status":            cmp = a.status.localeCompare(b.status);                          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [patients, filter, sortKey, sortDir]);

  /* ── Paginated data ───────────────────── */
  const totalRows  = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        {/* Title block */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
            style={{
              background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
              boxShadow: "0 4px 12px rgb(37 99 235 / 0.25)",
            }}
          >
            <Users size={21} className="text-white" />
          </div>
          <div>
            <h1
              className="text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Manajemen Pasien
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Kelola data pasien dan akses riwayat medis dengan cepat.
            </p>
          </div>
        </div>

        {/* CTA Button — navigates to /pasien/tambah */}
        <Link
          href="/pasien/tambah"
          id="btn-tambah-pasien"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
            boxShadow: "0 4px 12px rgb(37 99 235 / 0.25)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <Plus size={17} />
          Tambah Pasien
        </Link>
      </motion.div>

      {/* ── Stats Bar ─────────────────────── */}
      <PatientStatsBar stats={PATIENT_STATS} />

      {/* ── Search & Filter ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <PatientSearchFilter filter={filter} onFilterChange={handleFilterChange} />
      </motion.div>

      {/* ── Result count label ────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <p className="text-sm text-neutral-500">
            Menampilkan{" "}
            <span className="font-semibold text-neutral-800">{totalRows}</span>{" "}
            pasien
            {(filter.query || filter.jenisKelamin || filter.status || filter.umurMin || filter.umurMax) && (
              <span className="ml-1 text-primary-600 font-medium">(hasil filter)</span>
            )}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-earth-200" />
          <div className="w-1 h-1 rotate-45 bg-earth-300 flex-shrink-0" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-200" />
        </div>
      </motion.div>

      {/* ── Table (desktop / tablet) ─────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:block"
      >
        <PatientTable
          patients={paginatedData}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          totalRows={totalRows}
          onPageChange={setCurrentPage}
        />
      </motion.div>

      {/* ── Card list (mobile) ───────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="block md:hidden"
      >
        <PatientMobileCardList
          patients={paginatedData}
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          totalRows={totalRows}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </div>
  );
}
