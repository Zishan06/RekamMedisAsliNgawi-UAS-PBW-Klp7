"use client";

import { use, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import {
  pasienApi,
  dokterApi,
  hitungUmur,
  mapJenisKelamin,
  type BackendPasien,
  type BackendRekamMedis,
  type BackendDokter,
} from "@/lib/api";
import {
  PatientDetailHeader,
  PatientInfoCard,
  MedicalTimeline,
} from "@/components/medical-record";
import type { PasienDetail, RekamMedis } from "@/components/medical-record/data";
import { DEFAULT_PATIENT_DETAIL } from "@/components/medical-record/data";
import { Loader2, ServerCrash } from "lucide-react";

/* ─────────────────────────────────────────────
   Adapter — BackendPasien → PasienDetail
───────────────────────────────────────────── */
function adaptPasienDetail(bp: BackendPasien): PasienDetail {
  return {
    id: String(bp.id),
    noRM: bp.no_rm,
    nik: bp.nik,
    nama: bp.nama,
    jenisKelamin: mapJenisKelamin(bp.jk),
    umur: hitungUmur(bp.tgl_lahir),
    tanggalLahir: bp.tgl_lahir,
    golonganDarah: (bp.gol_darah as PasienDetail["golonganDarah"]) ?? "Tidak diketahui",
    noTelp: bp.no_hp,
    alamat: bp.alamat,
    kunjunganTerakhir: bp.tgl_lahir,
    status: (bp.status as PasienDetail["status"]) ?? "Aktif",
    poli: "Poli Umum",
    dokterPJ: "Belum ditentukan",
    tanggalDaftar: bp.tgl_lahir,
    kontakDarurat: DEFAULT_PATIENT_DETAIL.kontakDarurat,
    alergi: [],
    riwayatPenyakit: [],
  };
}

/* ─────────────────────────────────────────────
   Adapter — BackendRekamMedis → RekamMedis (frontend)
───────────────────────────────────────────── */
function adaptRekamMedis(
  rm: BackendRekamMedis,
  pasienId: string,
  dokterMap: Record<number, string>
): RekamMedis {
  const namaDokter = dokterMap[rm.dokter_id] ?? "—";
  return {
    id: `rm-${rm.id}`,
    pasienId,
    tanggal: rm.tanggal,
    poli: rm.poli,
    dokter: namaDokter,
    keluhan: rm.anamnesis,
    diagnosa: rm.diagnosa,
    status: (rm.status as RekamMedis["status"]) ?? "Selesai",
    soap: {
      subjektif: rm.anamnesis,
      objektif: rm.pemeriksaan,
      vitalSign: {
        tekananDarah: "-",
        suhu: "-",
        beratBadan: "-",
      },
      assessment: `${rm.diagnosa}${rm.icd10 ? ` (${rm.icd10})` : ""}`,
      icdCode: rm.icd10 || undefined,
      plan: rm.tindakan,
      resep: rm.obat || undefined,
    },
  };
}

/* ─────────────────────────────────────────────
   Loading State
───────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 size={40} className="text-primary-400 animate-spin" />
      <p className="text-sm text-neutral-500">Memuat detail pasien…</p>
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
   Patient Detail Page — fetches real data from backend
───────────────────────────────────────────── */
export default function PasienDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pasienDetail, setPasienDetail] = useState<PasienDetail | null>(null);
  const [rekamMedis, setRekamMedis] = useState<RekamMedis[]>([]);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch pasien + riwayat + daftar dokter secara paralel
      const [{ pasien, riwayat }, dokterList] = await Promise.all([
        pasienApi.getById(id),
        dokterApi.getAll().catch(() => [] as BackendDokter[]),
      ]);

      if (!pasien) {
        setNotFoundFlag(true);
        return;
      }

      // Buat map dokter_id → nama dokter
      const dokterMap: Record<number, string> = {};
      for (const d of dokterList) {
        dokterMap[d.id] = d.nama;
      }

      setPasienDetail(adaptPasienDetail(pasien));
      setRekamMedis(riwayat.map((rm) => adaptRekamMedis(rm, id, dokterMap)));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!pasienDetail) return <LoadingState />;

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
