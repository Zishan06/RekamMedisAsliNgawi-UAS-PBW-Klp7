"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Loader2, ServerCrash, PackageOpen, Phone, IdCard } from "lucide-react";
import { dokterApi, type BackendDokter } from "@/lib/api";

/* ─────────────────────────────────────────────
   Loading State
───────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 size={40} className="text-primary-400 animate-spin" />
      <p className="text-sm text-neutral-500">Memuat data dokter…</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center">
        <ServerCrash size={28} className="text-danger" />
      </div>
      <div>
        <p className="font-semibold text-neutral-800">Gagal memuat data dokter</p>
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
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center">
        <PackageOpen size={28} className="text-neutral-400" />
      </div>
      <div>
        <p className="font-semibold text-neutral-700">Belum ada data dokter</p>
        <p className="text-sm text-neutral-400 mt-1">
          Data dokter belum tersedia di database.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Dokter Card
───────────────────────────────────────────── */
function DokterCard({ dokter, index }: { dokter: BackendDokter; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl bg-surface-card border border-neutral-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300"
        style={{ background: "var(--color-primary-600)" }}
      />

      {/* Avatar initials */}
      <div className="flex items-start gap-4">
        <div
          className="relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-base font-extrabold text-white"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))",
          }}
        >
          {dokter.nama
            .replace(/^dr\.\s*/i, "")
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase() ?? "")
            .join("")}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="font-bold text-neutral-900 truncate"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {dokter.nama}
          </p>
          <span
            className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: "var(--color-primary-50)",
              color: "var(--color-primary-700)",
            }}
          >
            {dokter.spesialisasi}
          </span>
        </div>
      </div>

      {/* Info rows */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <IdCard size={14} className="text-neutral-400 flex-shrink-0" />
          <span className="font-mono text-xs text-neutral-500 truncate">{dokter.no_sip}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Phone size={14} className="text-neutral-400 flex-shrink-0" />
          <span>{dokter.telp}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Dokter Page
───────────────────────────────────────────── */
export default function DokterPage() {
  const [dokterList, setDokterList] = useState<BackendDokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDokter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dokterApi.getAll();
      setDokterList(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDokter();
  }, [fetchDokter]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-start gap-3"
      >
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
            boxShadow: "0 4px 12px rgb(37 99 235 / 0.25)",
          }}
        >
          <Stethoscope size={21} className="text-white" />
        </div>
        <div>
          <h1
            className="text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Daftar Dokter
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading
              ? "Memuat data…"
              : error
              ? "Gagal memuat data"
              : `${dokterList.length} dokter terdaftar di RSUD Ngawi`}
          </p>
        </div>
      </motion.div>

      {/* ── Content ───────────────────────── */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDokter} />
      ) : dokterList.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dokterList.map((d, i) => (
            <DokterCard key={d.id} dokter={d} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
