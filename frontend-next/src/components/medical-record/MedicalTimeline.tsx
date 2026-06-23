"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Calendar,
  User,
  Building2,
  ChevronRight,
  FilePlus,
  ClipboardList,
  Activity,
} from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/cn";
import type { RekamMedis, StatusKunjungan } from "./data";
import { SOAPModal } from "./SOAPModal";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Status config
───────────────────────────────────────────── */
const STATUS_CFG: Record<StatusKunjungan, { cls: string; dot: string }> = {
  "Selesai":              { cls: "bg-success-light text-success-dark", dot: "bg-success" },
  "Sedang Berlangsung":   { cls: "bg-primary-100 text-primary-700", dot: "bg-primary-500 animate-pulse" },
  "Dirujuk":              { cls: "bg-warning-light text-warning-dark", dot: "bg-warning" },
  "Rawat Inap":           { cls: "bg-earth-100 text-earth-700", dot: "bg-earth-500" },
};

/* ─────────────────────────────────────────────
   Single Timeline Item
───────────────────────────────────────────── */
interface TimelineItemProps {
  record: RekamMedis;
  index: number;
  isLast: boolean;
  onSelect: (r: RekamMedis) => void;
}

function TimelineItem({ record, index, isLast, onSelect }: TimelineItemProps) {
  const { cls, dot } = STATUS_CFG[record.status];
  const tanggal = parseISO(record.tanggal);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="flex gap-4 group"
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div
          className="relative w-10 h-10 rounded-xl flex items-center justify-center z-10 flex-shrink-0 border-2 border-white shadow-md"
          style={{
            background: record.status === "Sedang Berlangsung"
              ? "var(--color-primary-600)"
              : "var(--color-primary-50)",
            borderColor: "var(--color-primary-200)",
          }}
        >
          <Stethoscope
            size={16}
            style={{
              color: record.status === "Sedang Berlangsung"
                ? "white"
                : "var(--color-primary-600)",
            }}
          />
        </div>

        {/* Vertical line */}
        {!isLast && (
          <div
            className="w-0.5 flex-1 my-1 min-h-[2rem]"
            style={{ background: "linear-gradient(to bottom, var(--color-primary-200), transparent)" }}
          />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-6 min-w-0">
        <button
          onClick={() => onSelect(record)}
          className={cn(
            "w-full text-left rounded-2xl p-5 border border-neutral-200 bg-surface-card",
            "transition-all duration-300 cursor-pointer group/card",
            "hover:border-primary-200 hover:shadow-lg hover:-translate-y-0.5"
          )}
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          {/* ── Header row ──────────────────── */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Calendar size={12} />
                <span className="font-semibold text-neutral-700">
                  {format(tanggal, "d MMMM yyyy", { locale: localeId })}
                </span>
                <span className="text-neutral-300">·</span>
                <span className="italic">
                  {formatDistanceToNow(tanggal, { addSuffix: true, locale: localeId })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Status badge */}
              <span className={cn("badge gap-1.5", cls)}>
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
                {record.status}
              </span>
              {/* Arrow hint */}
              <ChevronRight
                size={15}
                className="text-neutral-300 group-hover/card:text-primary-500 group-hover/card:translate-x-0.5 transition-all duration-200"
              />
            </div>
          </div>

          {/* ── Poli + Dokter ────────────────── */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Building2 size={12} />
              <span className="font-medium text-neutral-700">{record.poli}</span>
            </div>
            <span className="text-neutral-200">·</span>
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>{record.dokter}</span>
              {record.dokterSpesialis && (
                <span className="text-neutral-400 italic">{record.dokterSpesialis}</span>
              )}
            </div>
          </div>

          {/* ── Keluhan ──────────────────────── */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Keluhan
            </p>
            <p className="text-sm text-neutral-700 line-clamp-2 leading-relaxed">
              {record.keluhan}
            </p>
          </div>

          {/* ── Diagnosa ─────────────────────── */}
          <div className="flex items-start gap-2">
            <div
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: "var(--color-primary-50)",
                color: "var(--color-primary-700)",
              }}
            >
              <span className="text-neutral-400 mr-1">Dx:</span>
              {record.diagnosa}
            </div>
            {record.soap.icdCode && (
              <span
                className="px-2 py-1.5 rounded-lg text-xs font-mono font-semibold"
                style={{
                  background: "var(--color-earth-50)",
                  color: "var(--color-earth-600)",
                }}
              >
                {record.soap.icdCode}
              </span>
            )}
          </div>

          {/* ── CTA hint ─────────────────────── */}
          <p className="text-xs text-primary-400 mt-3 font-medium group-hover/card:text-primary-600 transition-colors">
            Klik untuk melihat detail SOAP →
          </p>
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MedicalTimeline
───────────────────────────────────────────── */
interface MedicalTimelineProps {
  records: RekamMedis[];
  pasienId: string;
}

export function MedicalTimeline({ records, pasienId }: MedicalTimelineProps) {
  const [selectedRecord, setSelectedRecord] = useState<RekamMedis | null>(null);

  return (
    <>
      {/* ── Header ────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--color-primary-50)" }}
          >
            <ClipboardList size={18} style={{ color: "var(--color-primary-600)" }} />
          </div>
          <div>
            <h2
              className="text-lg font-bold text-neutral-900"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Riwayat Rekam Medis
            </h2>
            <p className="text-xs text-neutral-400">
              {records.length} kunjungan tercatat
            </p>
          </div>
        </div>

        <Link
          href={`/pasien/${pasienId}/tambah-rekam-medis`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
            fontFamily: "var(--font-sans)",
          }}
          id="btn-timeline-tambah"
        >
          <FilePlus size={15} />
          <span className="hidden sm:inline">Tambah</span>
        </Link>
      </div>

      {/* ── Timeline ──────────────────────── */}
      {records.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--color-neutral-100)" }}
          >
            <Activity size={32} className="text-neutral-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-600">
              Belum ada rekam medis
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Klik &quot;Tambah Rekam Medis&quot; untuk memulai
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="relative">
          {records.map((record, i) => (
            <TimelineItem
              key={record.id}
              record={record}
              index={i}
              isLast={i === records.length - 1}
              onSelect={setSelectedRecord}
            />
          ))}
        </div>
      )}

      {/* ── SOAP Modal ────────────────────── */}
      <AnimatePresence>
        {selectedRecord && (
          <SOAPModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
