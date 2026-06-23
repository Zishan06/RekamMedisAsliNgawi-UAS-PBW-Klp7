"use client";

import { use, useMemo } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { usePatientStore } from "@/lib/patient-store";
import { getRekamMedis } from "@/components/medical-record";
import {
  PatientDetailHeader,
  PatientInfoCard,
  MedicalTimeline,
} from "@/components/medical-record";
import type { PasienDetail } from "@/components/medical-record/data";
import { DEFAULT_PATIENT_DETAIL } from "@/components/medical-record/data";

/* ─────────────────────────────────────────────
   Patient Detail Page — reads from global store.
   Newly added patients appear here immediately.
───────────────────────────────────────────── */
export default function PasienDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getPatientById, getDetailById } = usePatientStore();

  // Base patient from store
  const basePasien = useMemo(() => getPatientById(id), [id, getPatientById]);

  if (!basePasien) {
    notFound();
  }

  // Detail from store (includes newly-added patient details)
  const pasienDetail = useMemo((): PasienDetail => {
    const stored = getDetailById(id);
    if (stored) return stored;

    // Fallback: build PasienDetail from base Pasien
    return {
      ...basePasien,
      ...DEFAULT_PATIENT_DETAIL,
    };
  }, [id, basePasien, getDetailById]);

  // Medical records (not in store yet, use static dummy)
  const rekamMedis = useMemo(() => getRekamMedis(id), [id]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ────────────────────────── */}
      <PatientDetailHeader pasien={pasienDetail} />

      {/* ── Main Content Grid ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Timeline (2/3) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="lg:col-span-2 rounded-2xl bg-surface-card border border-neutral-200 p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <MedicalTimeline records={rekamMedis} pasienId={id} />
        </motion.div>

        {/* Right column — Patient Info (1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <PatientInfoCard pasien={pasienDetail} rekamMedis={rekamMedis} />
        </motion.div>
      </div>
    </div>
  );
}
