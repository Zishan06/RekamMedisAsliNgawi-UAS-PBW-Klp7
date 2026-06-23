"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Building2,
  MessageSquare,
  Eye,
  Brain,
  FileText,
  Pill,
  Scissors,
  StickyNote,
  Thermometer,
  Heart,
  Wind,
  Gauge,
  Activity,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/cn";
import type { RekamMedis, StatusKunjungan } from "./data";

/* ─────────────────────────────────────────────
   Status config
───────────────────────────────────────────── */
const STATUS_CFG: Record<StatusKunjungan, { cls: string; dot: string }> = {
  "Selesai":            { cls: "bg-success-light text-success-dark", dot: "bg-success" },
  "Sedang Berlangsung": { cls: "bg-primary-100 text-primary-700", dot: "bg-primary-500" },
  "Dirujuk":            { cls: "bg-warning-light text-warning-dark", dot: "bg-warning" },
  "Rawat Inap":         { cls: "bg-earth-100 text-earth-700", dot: "bg-earth-500" },
};

/* ─────────────────────────────────────────────
   SOAP Section
───────────────────────────────────────────── */
function SOAPSection({
  icon: Icon,
  title,
  letter,
  content,
  color,
  bgColor,
}: {
  icon: React.ElementType;
  title: string;
  letter: string;
  content: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: bgColor }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0"
          style={{ background: color, fontFamily: "var(--font-sans)" }}
        >
          {letter}
        </div>
        <div className="flex items-center gap-2">
          <Icon size={15} style={{ color }} />
          <span className="text-sm font-bold" style={{ color, fontFamily: "var(--font-sans)" }}>
            {title}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="px-4 py-3.5 bg-surface-card">
        <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Vital Sign Item
───────────────────────────────────────────── */
function VitalItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: color + "20" }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-neutral-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-neutral-800 font-mono">{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOAPModal
───────────────────────────────────────────── */
interface SOAPModalProps {
  record: RekamMedis;
  onClose: () => void;
}

export function SOAPModal({ record, onClose }: SOAPModalProps) {
  const { cls, dot } = STATUS_CFG[record.status];

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const vs = record.soap.vitalSign;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-surface-card overflow-hidden flex flex-col pointer-events-auto"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          {/* ── Modal Header ──────────────────── */}
          <div
            className="relative px-6 py-5 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              id="btn-modal-close"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all duration-200"
              aria-label="Tutup modal"
            >
              <X size={18} />
            </button>

            {/* Title info */}
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-primary-300" />
              <span className="text-primary-200 text-xs font-medium uppercase tracking-wider">
                Detail Kunjungan
              </span>
            </div>
            <h2
              className="text-lg font-extrabold text-white leading-tight pr-10"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {record.diagnosa}
            </h2>
            {record.soap.icdCode && (
              <span className="inline-block mt-1 text-xs font-mono text-primary-300">
                ICD-10: {record.soap.icdCode}
              </span>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-primary-200">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} />
                <span>
                  {format(parseISO(record.tanggal), "d MMMM yyyy", { locale: localeId })}
                </span>
              </div>
              <span className="text-primary-400">·</span>
              <div className="flex items-center gap-1.5">
                <Building2 size={11} />
                <span>{record.poli}</span>
              </div>
              <span className="text-primary-400">·</span>
              <div className="flex items-center gap-1.5">
                <User size={11} />
                <span>{record.dokter}</span>
              </div>
              <span className={cn("badge gap-1.5 ml-auto", cls, "text-xs")}>
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
                {record.status}
              </span>
            </div>
          </div>

          {/* ── Modal Body (Scrollable) ────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Vital Signs */}
            <div>
              <p className="section-label mb-2">Tanda Vital</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <VitalItem icon={Gauge} label="Tekanan Darah" value={vs.tekananDarah} color="var(--color-danger)" />
                <VitalItem icon={Thermometer} label="Suhu Tubuh" value={vs.suhu} color="var(--color-warning)" />
                <VitalItem icon={Activity} label="Berat Badan" value={vs.beratBadan} color="var(--color-success)" />
                {vs.tinggiBadan && (
                  <VitalItem icon={Activity} label="Tinggi Badan" value={vs.tinggiBadan} color="var(--color-primary-600)" />
                )}
                {vs.nadiPerMenit && (
                  <VitalItem icon={Heart} label="Nadi" value={`${vs.nadiPerMenit} bpm`} color="var(--color-earth-500)" />
                )}
                {vs.saturasiOksigen && (
                  <VitalItem icon={Wind} label="SpO₂" value={vs.saturasiOksigen} color="var(--color-primary-500)" />
                )}
              </div>
            </div>

            {/* SOAP */}
            <SOAPSection
              letter="S"
              title="Subjective — Keluhan Pasien"
              icon={MessageSquare}
              content={record.soap.subjektif}
              color="var(--color-primary-600)"
              bgColor="var(--color-primary-50)"
            />
            <SOAPSection
              letter="O"
              title="Objective — Pemeriksaan Fisik"
              icon={Eye}
              content={record.soap.objektif}
              color="var(--color-success)"
              bgColor="var(--color-success-light)"
            />
            <SOAPSection
              letter="A"
              title="Assessment — Diagnosa"
              icon={Brain}
              content={record.soap.assessment}
              color="var(--color-warning)"
              bgColor="var(--color-warning-light)"
            />
            <SOAPSection
              letter="P"
              title="Plan — Rencana Pengobatan"
              icon={FileText}
              content={record.soap.plan}
              color="var(--color-earth-500)"
              bgColor="var(--color-earth-100)"
            />

            {/* Resep */}
            {record.soap.resep && (
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50">
                  <Pill size={15} className="text-neutral-500" />
                  <span className="text-sm font-bold text-neutral-700">Resep Obat</span>
                </div>
                <div className="px-4 py-3.5 bg-surface-card">
                  <p className="text-sm text-neutral-700 whitespace-pre-line font-mono leading-relaxed">
                    {record.soap.resep}
                  </p>
                </div>
              </div>
            )}

            {/* Tindakan */}
            {record.soap.tindakan && (
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50">
                  <Scissors size={15} className="text-neutral-500" />
                  <span className="text-sm font-bold text-neutral-700">Tindakan Medis</span>
                </div>
                <div className="px-4 py-3.5 bg-surface-card">
                  <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
                    {record.soap.tindakan}
                  </p>
                </div>
              </div>
            )}

            {/* Catatan */}
            {record.soap.catatan && (
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50">
                  <StickyNote size={15} className="text-neutral-500" />
                  <span className="text-sm font-bold text-neutral-700">Catatan Tambahan</span>
                </div>
                <div className="px-4 py-3.5 bg-surface-card">
                  <p className="text-sm text-neutral-700 italic leading-relaxed">
                    {record.soap.catatan}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Modal Footer ──────────────────── */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-neutral-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
