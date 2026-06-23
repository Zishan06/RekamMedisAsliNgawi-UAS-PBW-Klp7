"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Phone,
  AlertTriangle,
  Printer,
  FilePlus,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { PasienDetail } from "./data";
import type { StatusPasien } from "@/components/patient/data";

/* ─────────────────────────────────────────────
   Status badge config
───────────────────────────────────────────── */
const STATUS_CFG: Record<StatusPasien, { cls: string; dot: string }> = {
  Aktif:         { cls: "bg-success-light text-success-dark border-success/20", dot: "bg-success" },
  "Rawat Jalan": { cls: "bg-primary-100 text-primary-700 border-primary-200", dot: "bg-primary-500" },
  "Rawat Inap":  { cls: "bg-warning-light text-warning-dark border-warning/20", dot: "bg-warning" },
};

/* ─────────────────────────────────────────────
   Avatar — inisial nama
───────────────────────────────────────────── */
function PatientAvatar({
  nama,
  jenisKelamin,
  size = "lg",
}: {
  nama: string;
  jenisKelamin: string;
  size?: "sm" | "lg";
}) {
  const initials = nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const isFemale = jenisKelamin === "Perempuan";
  const sizeClasses = size === "lg" ? "w-20 h-20 text-2xl" : "w-14 h-14 text-lg";

  return (
    <div
      className={cn(
        sizeClasses,
        "rounded-2xl flex items-center justify-center font-extrabold text-white flex-shrink-0 ring-4 ring-white shadow-lg"
      )}
      style={{
        background: isFemale
          ? "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-400))"
          : "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
        fontFamily: "var(--font-sans)",
      }}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PatientDetailHeader
───────────────────────────────────────────── */
interface PatientDetailHeaderProps {
  pasien: PasienDetail;
}

export function PatientDetailHeader({ pasien }: PatientDetailHeaderProps) {
  const { cls, dot } = STATUS_CFG[pasien.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-600) 55%, #3b82f6 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/patterns/gemini-pattern.svg')",
            backgroundSize: "cover",
            backgroundPosition: "right center",
            opacity: 0.10,
            mixBlendMode: "screen",
          }}
        />
        {/* Terracotta strip */}
        <div
          className="absolute top-0 right-0 w-2 h-full opacity-80"
          style={{ background: "linear-gradient(to bottom, var(--color-earth-500), var(--color-earth-300))" }}
        />
        {/* Diamond motif */}
        <div className="absolute bottom-5 right-6 flex gap-2 opacity-25">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rotate-45"
              style={{ background: i === 1 ? "var(--color-earth-300)" : "rgba(255,255,255,0.6)" }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 lg:p-8">
        {/* Back button */}
        <Link
          href="/pasien"
          className="inline-flex items-center gap-2 text-primary-200 hover:text-white text-sm font-medium mb-6 transition-colors duration-150 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Daftar Pasien
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <PatientAvatar nama={pasien.nama} jenisKelamin={pasien.jenisKelamin} size="lg" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1
                className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {pasien.nama}
              </h1>
              {/* Status badge */}
              <span
                className={cn(
                  "badge border",
                  cls,
                  "bg-white/15 text-white border-white/25 backdrop-blur-sm"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white")} />
                {pasien.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-primary-200">
              {/* RM Number */}
              <div className="flex items-center gap-1.5">
                <Shield size={13} />
                <span className="text-sm font-mono font-semibold">{pasien.noRM}</span>
              </div>
              <span className="text-primary-400 text-xs">·</span>
              {/* Jenis kelamin & umur */}
              <span className="text-sm">
                {pasien.jenisKelamin} · {pasien.umur} Tahun
              </span>
              <span className="text-primary-400 text-xs">·</span>
              {/* Poli */}
              <span className="text-sm">{pasien.poli}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-primary-300">
              <Phone size={12} />
              <span className="text-xs font-mono">{pasien.noTelp}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end flex-shrink-0">
            <Link
              href={`/pasien/${pasien.id}/tambah-rekam-medis`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/25 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-200"
              id="btn-tambah-rekam-medis"
            >
              <FilePlus size={15} />
              Tambah Rekam Medis
            </Link>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-primary-200 border border-white/15 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-200"
              id="btn-cetak"
            >
              <Printer size={15} />
              Cetak
            </button>
          </div>
        </div>

        {/* Alergi warning */}
        {pasien.alergi && pasien.alergi.length > 0 && (
          <div className="mt-5 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-warning/20 border border-warning/30 backdrop-blur-sm">
            <AlertTriangle size={15} className="text-warning flex-shrink-0" />
            <p className="text-sm text-warning font-medium">
              <span className="font-semibold">Alergi:</span>{" "}
              {pasien.alergi.join(", ")}
            </p>
          </div>
        )}

        {/* Vital activity strip */}
        <div className="mt-4 flex items-center gap-1.5 text-primary-300/60">
          <Activity size={11} />
          <p className="text-2xs font-medium uppercase tracking-widest">
            RSUD dr. Soeroto Ngawi · Sistem Rekam Medis Elektronik
          </p>
        </div>
      </div>
    </motion.div>
  );
}
