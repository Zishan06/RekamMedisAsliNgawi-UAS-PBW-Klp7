"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  X, User, Stethoscope, Clock, ClipboardList,
  Pill, Scissors, StickyNote, AlertCircle,
  Activity, Heart,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { RiwayatEntry } from "./data";

/* ─────────────────────────────────────────────
   Section block inside modal
───────────────────────────────────────────── */
interface SOAPSectionProps {
  label: string;
  color: string;
  bg: string;
  icon: React.ElementType;
  content: string;
  prefix?: string;
}

function SOAPSection({ label, color, bg, icon: Icon, content, prefix }: SOAPSectionProps) {
  return (
    <div className="rounded-xl border border-neutral-100 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: bg }}>
        <Icon size={14} style={{ color }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
          {prefix && <span className="font-mono mr-1">[{prefix}]</span>}
          {label}
        </span>
      </div>
      <div className="px-4 py-3 bg-surface-card">
        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Vital Sign Badge
───────────────────────────────────────────── */
function VitalBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-center min-w-[70px]">
      <span className="text-xs text-neutral-400 mb-1 leading-none">{label}</span>
      <span className="text-sm font-bold text-neutral-800 leading-tight">{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOAP Detail Modal
───────────────────────────────────────────── */
interface SOAPDetailModalProps {
  entry: RiwayatEntry;
  onClose: () => void;
}

export function SOAPDetailModal({ entry, onClose }: SOAPDetailModalProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const { soap } = entry;

  const STATUS_CFG = {
    Menunggu:   { cls: "bg-neutral-100 text-neutral-600",     dot: "bg-neutral-400" },
    Diproses:   { cls: "bg-warning-light text-warning-dark",  dot: "bg-warning" },
    Selesai:    { cls: "bg-success-light text-success-dark",  dot: "bg-success" },
    Dibatalkan: { cls: "bg-danger-light text-danger-dark",    dot: "bg-danger" },
  };
  const st = STATUS_CFG[entry.status];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer — slides from right on desktop, bottom on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 48 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[520px] max-w-full bg-surface-card flex flex-col"
        style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}
      >
        {/* ── Drawer Header ─────────────── */}
        <div
          className="flex-shrink-0 relative px-6 py-5 overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))" }}
        >
          {/* Decorative */}
          <div className="absolute bottom-3 right-6 flex gap-1.5 opacity-20">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2.5 h-2.5 rotate-45"
                style={{ background: i === 1 ? "var(--color-earth-300)" : "rgba(255,255,255,0.6)" }} />
            ))}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all"
          >
            <X size={17} />
          </button>

          {/* Patient info */}
          <div className="flex items-start gap-3 pr-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              {entry.namaPasien.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight"
                style={{ fontFamily: "var(--font-sans)" }}>
                {entry.namaPasien}
              </h2>
              <p className="text-primary-200 text-xs mt-0.5 font-mono">{entry.noRM}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn("badge gap-1 text-xs", st.cls)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                  {entry.status}
                </span>
                {entry.icdCode && (
                  <span className="badge bg-white/15 text-white border border-white/20 font-mono text-xs">
                    ICD: {entry.icdCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-primary-200">
            <span className="flex items-center gap-1">
              <ClipboardList size={11} /> {entry.poli}
            </span>
            <span className="flex items-center gap-1">
              <Stethoscope size={11} /> {entry.dokter}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />{" "}
              {new Date(entry.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* ── Scrollable body ───────────── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Keluhan */}
          <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Keluhan Utama</p>
            <p className="text-sm font-medium text-neutral-800 italic">&ldquo;{entry.keluhan}&rdquo;</p>
          </div>

          {/* Diagnosa */}
          <div className="rounded-xl border-l-4 border-primary-500 pl-4 py-3 bg-primary-50/50">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-0.5">Diagnosa</p>
            <p className="text-sm font-bold text-neutral-800">{entry.diagnosa}</p>
          </div>

          {/* Vital Signs */}
          <div>
            <p className="section-label mb-2">Tanda Vital</p>
            <div className="flex flex-wrap gap-2">
              <VitalBadge label="Tekanan Darah" value={soap.vitalSign.tekananDarah} />
              <VitalBadge label="Suhu" value={soap.vitalSign.suhu} />
              <VitalBadge label="Berat Badan" value={soap.vitalSign.beratBadan} />
              {soap.vitalSign.nadiPerMenit && (
                <VitalBadge label="Nadi" value={`${soap.vitalSign.nadiPerMenit}x/mnt`} />
              )}
              {soap.vitalSign.saturasiOksigen && (
                <VitalBadge label="SpO₂" value={soap.vitalSign.saturasiOksigen} />
              )}
            </div>
          </div>

          {/* SOAP */}
          <div className="space-y-2.5">
            <p className="section-label">Catatan SOAP</p>

            <SOAPSection
              label="Subjektif" prefix="S"
              icon={User}
              color="var(--color-primary-600)" bg="var(--color-primary-50)"
              content={soap.subjektif}
            />
            <SOAPSection
              label="Objektif" prefix="O"
              icon={Activity}
              color="var(--color-success)" bg="var(--color-success-light)"
              content={soap.objektif}
            />
            <SOAPSection
              label="Assessment / Diagnosa" prefix="A"
              icon={AlertCircle}
              color="var(--color-warning)" bg="var(--color-warning-light)"
              content={soap.assessment}
            />
            <SOAPSection
              label="Plan / Rencana" prefix="P"
              icon={ClipboardList}
              color="var(--color-earth-500)" bg="var(--color-earth-100)"
              content={soap.plan}
            />

            {soap.resep && (
              <SOAPSection
                label="Resep Obat"
                icon={Pill}
                color="#7c3aed" bg="#ede9fe"
                content={soap.resep}
              />
            )}

            {soap.tindakan && (
              <SOAPSection
                label="Tindakan Medis"
                icon={Scissors}
                color="#db2777" bg="#fce7f3"
                content={soap.tindakan}
              />
            )}

            {soap.catatan && (
              <SOAPSection
                label="Catatan Tambahan"
                icon={StickyNote}
                color="var(--color-neutral-600)" bg="var(--color-neutral-50)"
                content={soap.catatan}
              />
            )}
          </div>
        </div>

        {/* ── Footer ────────────────────── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </>
  );
}
