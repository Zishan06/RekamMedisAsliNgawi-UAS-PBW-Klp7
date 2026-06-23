"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  User,
  Droplets,
  Phone,
  MapPin,
  PhoneCall,
  Heart,
  Activity,
  Stethoscope,
  Clock,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/cn";
import type { PasienDetail, RekamMedis } from "./data";

/* ─────────────────────────────────────────────
   Info Row — single field
───────────────────────────────────────────── */
function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
        style={{ background: "var(--color-primary-50)" }}
      >
        <Icon size={14} style={{ color: "var(--color-primary-600)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-semibold text-neutral-800 break-words",
            mono && "font-mono",
            accent && "text-primary-700"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Quick Stat Card
───────────────────────────────────────────── */
function QuickStatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl p-4 flex items-center gap-3 border border-neutral-200 bg-surface-card group hover:border-primary-200 hover:shadow-md transition-all duration-300"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bgColor }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-neutral-500 font-medium">{label}</p>
        <p className="text-sm font-bold text-neutral-800 truncate" style={{ fontFamily: "var(--font-sans)" }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PatientInfoCard
───────────────────────────────────────────── */
interface PatientInfoCardProps {
  pasien: PasienDetail;
  rekamMedis: RekamMedis[];
}

export function PatientInfoCard({ pasien, rekamMedis }: PatientInfoCardProps) {
  // Compute quick stats
  const totalKunjungan = rekamMedis.length;
  const semuaDiagnosa = new Set(rekamMedis.map((r) => r.diagnosa));
  const totalDiagnosa = semuaDiagnosa.size;
  const kunjunganTerakhir = rekamMedis[0]
    ? format(parseISO(rekamMedis[0].tanggal), "d MMM yyyy", { locale: localeId })
    : "-";
  const dokterPJ = pasien.dokterPJ;

  const quickStats = [
    {
      icon: Activity,
      label: "Total Kunjungan",
      value: `${totalKunjungan} kunjungan`,
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-50)",
    },
    {
      icon: Stethoscope,
      label: "Total Diagnosa",
      value: `${totalDiagnosa} diagnosa`,
      color: "var(--color-earth-500)",
      bgColor: "var(--color-earth-100)",
    },
    {
      icon: Clock,
      label: "Kunjungan Terakhir",
      value: kunjunganTerakhir,
      color: "var(--color-success)",
      bgColor: "var(--color-success-light)",
    },
    {
      icon: Heart,
      label: "Dokter PJ",
      value: dokterPJ,
      color: "var(--color-warning)",
      bgColor: "var(--color-warning-light)",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ── Quick Stats ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className="section-label mb-3">Ringkasan Cepat</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickStats.map((s, i) => (
            <QuickStatCard key={s.label} {...s} delay={0.1 + i * 0.07} />
          ))}
        </div>
      </motion.div>

      {/* ── Patient Info ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl bg-surface-card border border-neutral-200 p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <p className="section-label mb-2">Data Pribadi</p>
        <div>
          <InfoRow
            icon={CreditCard}
            label="NIK"
            value={pasien.nik}
            mono
          />
          <InfoRow
            icon={Calendar}
            label="Tanggal Lahir"
            value={`${format(parseISO(pasien.tanggalLahir), "d MMMM yyyy", { locale: localeId })} (${pasien.umur} tahun)`}
          />
          <InfoRow
            icon={User}
            label="Jenis Kelamin"
            value={pasien.jenisKelamin}
          />
          <InfoRow
            icon={Droplets}
            label="Golongan Darah"
            value={pasien.golonganDarah}
            accent
          />
          <InfoRow
            icon={Phone}
            label="Nomor Telepon"
            value={pasien.noTelp}
            mono
          />
          <InfoRow
            icon={MapPin}
            label="Alamat"
            value={pasien.alamat}
          />
          <InfoRow
            icon={Calendar}
            label="Tanggal Daftar"
            value={format(parseISO(pasien.tanggalDaftar), "d MMMM yyyy", { locale: localeId })}
          />
        </div>
      </motion.div>

      {/* ── Kontak Darurat ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl bg-surface-card border border-neutral-200 p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <p className="section-label mb-2">Kontak Darurat</p>
        <div>
          <InfoRow icon={User} label="Nama" value={pasien.kontakDarurat.nama} />
          <InfoRow icon={Heart} label="Hubungan" value={pasien.kontakDarurat.hubungan} />
          <InfoRow icon={PhoneCall} label="Nomor Telepon" value={pasien.kontakDarurat.noTelp} mono />
        </div>
      </motion.div>

      {/* ── Riwayat Penyakit ───────────────── */}
      {pasien.riwayatPenyakit && pasien.riwayatPenyakit.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="rounded-2xl bg-surface-card border border-neutral-200 p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p className="section-label mb-3">Riwayat Penyakit</p>
          <ul className="space-y-2">
            {pasien.riwayatPenyakit.map((rp, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-neutral-700">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "var(--color-earth-400)" }}
                />
                {rp}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
