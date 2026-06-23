"use client";

import { useMemo } from "react";
import { use } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FilePlus, ArrowLeft, Shield } from "lucide-react";
import { DAFTAR_PASIEN } from "@/components/patient/data";
import { getPatientDetail } from "@/components/medical-record";
import { AddRecordForm } from "@/components/medical-record/AddRecordForm";

/* ─────────────────────────────────────────────
   Tambah Rekam Medis Page
   Route: /pasien/[id]/tambah-rekam-medis
───────────────────────────────────────────── */
export default function TambahRekamMedisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const basePasien = useMemo(
    () => DAFTAR_PASIEN.find((p) => p.id === id),
    [id]
  );

  if (!basePasien) {
    notFound();
  }

  const pasienDetail = useMemo(
    () => getPatientDetail(id, basePasien),
    [id, basePasien]
  );

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
                  {pasienDetail.nama}
                </span>
                <span className="text-primary-300 text-xs">·</span>
                <div className="flex items-center gap-1 text-primary-300 text-xs">
                  <Shield size={11} />
                  <span className="font-mono">{pasienDetail.noRM}</span>
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
                <p className="text-white text-sm font-semibold">{pasienDetail.poli}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-right">
                <p className="text-white/60 text-xs uppercase tracking-wider">Status</p>
                <p className="text-white text-sm font-semibold">{pasienDetail.status}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Form ──────────────────────────── */}
      <AddRecordForm
        pasienId={id}
        pasienNama={pasienDetail.nama}
        pasienNoRM={pasienDetail.noRM}
      />
    </div>
  );
}
