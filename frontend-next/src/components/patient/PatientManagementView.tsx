"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Loader2, ServerCrash, PackageOpen } from "lucide-react";
import Link from "next/link";
import { pasienApi, hitungUmur, mapJenisKelamin, type BackendPasien } from "@/lib/api";
import { PATIENT_STATS } from "./data";
import type { Pasien, PatientStat } from "./data";
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
   Adapter — BackendPasien → Pasien (frontend shape)
───────────────────────────────────────────── */
function adaptPasien(bp: BackendPasien): Pasien {
  return {
    id: String(bp.id),
    noRM: bp.no_rm,
    nik: bp.nik,
    nama: bp.nama,
    jenisKelamin: mapJenisKelamin(bp.jk),
    umur: hitungUmur(bp.tgl_lahir),
    tanggalLahir: bp.tgl_lahir,
    noTelp: bp.no_hp,
    alamat: bp.alamat,
    kunjunganTerakhir: "—",  // tidak ada field kunjungan_terakhir di DB
    status: (bp.status as Pasien["status"]) ?? "Aktif",
    poli: "Poli Umum",         // tidak ada field poli di tabel pasien backend
  };
}

/* ─────────────────────────────────────────────
   Build Stats dari data real
───────────────────────────────────────────── */
function buildStats(pasienList: Pasien[]): PatientStat[] {
  const total = pasienList.length;
  const aktif = pasienList.filter(
    (p) => p.status === "Aktif" || p.status === "Rawat Jalan"
  ).length;
  const rawatInap = pasienList.filter((p) => p.status === "Rawat Inap").length;

  return [
    {
      id: "total-pasien",
      label: "Total Pasien",
      value: total,
      subLabel: "Terdaftar di sistem",
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-50)",
      iconName: "users",
    },
    {
      id: "pasien-aktif",
      label: "Pasien Aktif",
      value: aktif,
      subLabel: "Aktif & rawat jalan",
      color: "var(--color-success)",
      bgColor: "var(--color-success-light)",
      iconName: "user-check",
    },
    {
      id: "rawat-inap",
      label: "Rawat Inap",
      value: rawatInap,
      subLabel: "Sedang dirawat inap",
      color: "var(--color-warning)",
      bgColor: "var(--color-warning-light)",
      iconName: "user-plus",
    },
    {
      id: "kunjungan-hari-ini",
      label: "Total Terdaftar",
      value: total,
      subLabel: "Seluruh data pasien",
      color: "var(--color-earth-500)",
      bgColor: "var(--color-earth-100)",
      iconName: "calendar-check",
    },
  ];
}

/* ─────────────────────────────────────────────
   Loading State
───────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 size={40} className="text-primary-400 animate-spin" />
      <p className="text-sm text-neutral-500">Memuat data pasien dari server…</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center">
        <ServerCrash size={28} className="text-danger" />
      </div>
      <div>
        <p className="font-semibold text-neutral-800">Gagal memuat data pasien</p>
        <p className="text-sm text-neutral-500 mt-1 max-w-xs">{message}</p>
        <p className="text-xs text-neutral-400 mt-1">
          Pastikan backend berjalan di{" "}
          <code className="bg-neutral-100 px-1 rounded">localhost:8080</code>
        </p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
        }}
      >
        Coba Lagi
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center">
        <PackageOpen size={28} className="text-neutral-400" />
      </div>
      <div>
        <p className="font-semibold text-neutral-700">Belum ada data pasien</p>
        <p className="text-sm text-neutral-400 mt-1">
          Tambahkan pasien baru untuk memulai.
        </p>
      </div>
      <Link
        href="/pasien/tambah"
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
        }}
      >
        + Tambah Pasien
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PatientManagementView
   Reads from real backend API — /api/pasien
───────────────────────────────────────────── */
export function PatientManagementView() {
  /* ── Fetch state ───────────────────────── */
  const [patients, setPatients] = useState<Pasien[]>([]);
  const [stats, setStats] = useState<PatientStat[]>(PATIENT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const backendList = await pasienApi.getAll();
      const adapted = backendList.map(adaptPasien);
      setPatients(adapted);
      setStats(buildStats(adapted));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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
      <PatientStatsBar stats={stats} />

      {/* ── Search & Filter ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <PatientSearchFilter filter={filter} onFilterChange={handleFilterChange} />
      </motion.div>

      {/* ── States: Loading / Error / Empty / Data ── */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPatients} />
      ) : patients.length === 0 ? (
        <EmptyState />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
