"use client";

import { use, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FilePlus, ArrowLeft, Shield, Loader2, ServerCrash } from "lucide-react";
import { pasienApi, hitungUmur, mapJenisKelamin, type BackendPasien } from "@/lib/api";
import { AddRecordForm } from "@/components/medical-record/AddRecordForm";

/* ─────────────────────────────────────────────
   Loading State
───────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 size={40} className="text-primary-400 animate-spin" />
      <p className="text-sm text-neutral-500">Memuat data pasien…</p>
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
        <p className="font-semibold text-neutral-800">Gagal memuat data pasien</p>
        <p className="text-sm text-neutral-500 mt-1 max-w-xs">{message}</p>
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
   Tambah Rekam Medis Page
   Route: /pasien/[id]/tambah-rekam-medis
   Mengambil data pasien dari API real.
───────────────────────────────────────────── */
export default function TambahRekamMedisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pasien, setPasien] = useState<BackendPasien | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const fetchPasien = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { pasien: data } = await pasienApi.getById(id);
      if (!data) {
        setNotFoundFlag(true);
        return;
      }
      setPasien(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPasien();
  }, [fetchPasien]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchPasien} />;
  if (!pasien) return <LoadingState />;

  const namaDisplay = pasien.nama;
  const noRMDisplay = pasien.no_rm;
  const poliDisplay = "Poli Umum";
  const statusDisplay = pasien.status;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Back link */}
        <Link
          href={`/pasien/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-4 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Detail Pasien
        </Link>

        {/* Patient context bar */}
        <div
          className="rounded-2xl p-5 mb-1"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <FilePlus size={16} className="text-white" />
                </div>
                <h1
                  className="text-lg font-extrabold text-white"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Tambah Rekam Medis
                </h1>
              </div>
              <p className="text-primary-200 text-sm">
                Mencatat kunjungan baru untuk pasien:
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white font-bold text-base">
                  {namaDisplay}
                </span>
                <span className="text-primary-300 text-xs">·</span>
                <div className="flex items-center gap-1 text-primary-300 text-xs">
                  <Shield size={11} />
                  <span className="font-mono">{noRMDisplay}</span>
                </div>
              </div>
            </div>

            {/* Patient mini info */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-right">
                <p className="text-white/60 text-xs uppercase tracking-wider">Poli</p>
                <p className="text-white text-sm font-semibold">{poliDisplay}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-right">
                <p className="text-white/60 text-xs uppercase tracking-wider">Status</p>
                <p className="text-white text-sm font-semibold">{statusDisplay}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Form ──────────────────────────── */}
      <AddRecordForm
        pasienId={id}
        pasienNama={namaDisplay}
        pasienNoRM={noRMDisplay}
      />
    </div>
  );
}
