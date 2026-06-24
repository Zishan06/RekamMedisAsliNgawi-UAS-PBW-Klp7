"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  FilePlus,
  Calendar,
  User,
  Building2,
  MessageSquare,
  Gauge,
  Thermometer,
  Weight,
  Brain,
  Scissors,
  Pill,
  StickyNote,
  Loader2,
  CheckCircle2,
  Ruler,
  Heart,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────
   Zod Schema
───────────────────────────────────────────── */
const rekamMedisSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  dokter: z.string().min(2, "Nama dokter minimal 2 karakter"),
  poli: z.string().min(1, "Poli wajib dipilih"),

  // Keluhan
  keluhan: z.string().min(10, "Keluhan minimal 10 karakter"),

  // Vital Signs
  tekananDarah: z.string().min(1, "Tekanan darah wajib diisi"),
  suhu: z.string().min(1, "Suhu wajib diisi"),
  beratBadan: z.string().min(1, "Berat badan wajib diisi"),
  tinggiBadan: z.string().optional(),
  nadi: z.string().optional(),
  saturasi: z.string().optional(),

  // SOAP
  subjektif: z.string().min(10, "Subjektif minimal 10 karakter"),
  objektif: z.string().min(10, "Objektif minimal 10 karakter"),
  diagnosa: z.string().min(3, "Diagnosa minimal 3 karakter"),
  icdCode: z.string().optional(),
  plan: z.string().min(10, "Plan minimal 10 karakter"),
  tindakan: z.string().optional(),
  resep: z.string().optional(),
  catatan: z.string().optional(),
  status: z.enum(["Selesai", "Sedang Berlangsung", "Dirujuk", "Rawat Inap"]),
});

type RekamMedisFormData = z.infer<typeof rekamMedisSchema>;

/* ─────────────────────────────────────────────
   POLI Options
───────────────────────────────────────────── */
const POLI_OPTIONS = [
  "Poli Umum",
  "Poli Dalam",
  "Poli Anak",
  "Poli Kandungan",
  "Poli Bedah",
  "Poli Jantung",
  "Poli Saraf",
  "Poli Paru",
  "Poli Gigi",
  "Poli Mata",
  "Poli THT",
  "Poli Kulit",
  "IGD",
  "Laboratorium",
  "Radiologi",
];

/* ─────────────────────────────────────────────
   Form field components
───────────────────────────────────────────── */
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ElementType;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, error, icon: Icon, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
        {Icon && <Icon size={13} className="text-neutral-400" />}
        {label}
        {required && <span className="text-danger text-xs">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-neutral-400">{hint}</p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-danger font-medium flex items-center gap-1"
        >
          ⚠ {error}
        </motion.p>
      )}
    </div>
  );
}

const inputClasses = cn(
  "w-full px-3.5 py-2.5 rounded-xl text-sm",
  "bg-neutral-50 border border-neutral-200",
  "text-neutral-800 placeholder:text-neutral-400",
  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
  "focus:bg-surface-card transition-all duration-200"
);

const errorInputClasses = cn(
  "w-full px-3.5 py-2.5 rounded-xl text-sm",
  "bg-danger-light/30 border border-danger/40",
  "text-neutral-800 placeholder:text-neutral-400",
  "focus:outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger",
  "focus:bg-surface-card transition-all duration-200"
);

/* ─────────────────────────────────────────────
   Section Title
───────────────────────────────────────────── */
function SectionTitle({
  title,
  subtitle,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bgColor }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <h3
          className="text-sm font-bold text-neutral-800"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {title}
        </h3>
        {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AddRecordForm
───────────────────────────────────────────── */
interface AddRecordFormProps {
  pasienId: string;
  pasienNama: string;
  pasienNoRM: string;
}

export function AddRecordForm({ pasienId, pasienNama, pasienNoRM }: AddRecordFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RekamMedisFormData>({
    resolver: zodResolver(rekamMedisSchema),
    defaultValues: {
      tanggal: new Date().toISOString().slice(0, 10),
      status: "Selesai",
    },
  });

  const onSubmit = async (data: RekamMedisFormData) => {
    try {
      // API call sesungguhnya
      // Hardcode dokter_id ke 1 karena form saat ini cuma punya string nama, bisa diupgrade ke depan
      await fetch("http://localhost:8080/api/rekam-medis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pasien_id: parseInt(pasienId),
          dokter_id: 1, 
          tanggal: data.tanggal,
          poli: data.poli,
          diagnosa: data.diagnosa,
          icd10: data.icdCode,
          anamnesis: `S: ${data.subjektif}\nO: ${data.objektif}`,
          pemeriksaan: `TD: ${data.tekananDarah}, Suhu: ${data.suhu}, BB: ${data.beratBadan}`,
          obat: data.resep,
          tindakan: data.plan,
          status: data.status,
        }),
      });

      console.log("Form submitted to API:", data);
      setIsSubmitted(true);
      toast.success("Rekam medis berhasil disimpan!", {
        description: `Kunjungan ${pasienNama} pada ${data.tanggal} telah dicatat.`,
      });
    } catch (err) {
      toast.error("Gagal menyimpan rekam medis");
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: "var(--color-success-light)" }}
        >
          <CheckCircle2 size={40} style={{ color: "var(--color-success)" }} />
        </motion.div>
        <h2 className="text-2xl font-extrabold text-neutral-900 mb-2" style={{ fontFamily: "var(--font-sans)" }}>
          Berhasil Disimpan!
        </h2>
        <p className="text-neutral-500 mb-8">
          Rekam medis pasien <strong>{pasienNama}</strong> telah berhasil ditambahkan.
        </p>
        <div className="flex gap-3">
          <Link
            href={`/pasien/${pasienId}`}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))" }}
          >
            Lihat Detail Pasien
          </Link>
          <Link
            href="/pasien"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        {/* ── Informasi Kunjungan ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <SectionTitle
            title="Informasi Kunjungan"
            subtitle="Data dasar kunjungan pasien"
            icon={Calendar}
            color="var(--color-primary-600)"
            bgColor="var(--color-primary-50)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Tanggal Kunjungan" required icon={Calendar} error={errors.tanggal?.message}>
              <input
                type="date"
                id="field-tanggal"
                {...register("tanggal")}
                className={errors.tanggal ? errorInputClasses : inputClasses}
              />
            </FormField>

            <FormField label="Dokter" required icon={User} error={errors.dokter?.message}>
              <input
                type="text"
                id="field-dokter"
                placeholder="dr. Nama Dokter"
                {...register("dokter")}
                className={errors.dokter ? errorInputClasses : inputClasses}
              />
            </FormField>

            <FormField label="Poli / Unit" required icon={Building2} error={errors.poli?.message}>
              <Controller
                name="poli"
                control={control}
                render={({ field }) => (
                  <select
                    id="field-poli"
                    {...field}
                    className={cn(errors.poli ? errorInputClasses : inputClasses, "cursor-pointer")}
                  >
                    <option value="">-- Pilih Poli --</option>
                    {POLI_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                )}
              />
            </FormField>

            <FormField label="Status Kunjungan" required icon={FilePlus} error={errors.status?.message}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    id="field-status"
                    {...field}
                    className={cn(errors.status ? errorInputClasses : inputClasses, "cursor-pointer")}
                  >
                    <option value="Selesai">Selesai</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Dirujuk">Dirujuk</option>
                    <option value="Rawat Inap">Rawat Inap</option>
                  </select>
                )}
              />
            </FormField>
          </div>
        </motion.div>

        {/* ── Keluhan ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <SectionTitle
            title="Keluhan Utama"
            icon={MessageSquare}
            color="var(--color-info)"
            bgColor="var(--color-info-light)"
          />
          <FormField label="Keluhan Pasien" required error={errors.keluhan?.message}>
            <textarea
              id="field-keluhan"
              rows={3}
              placeholder="Deskripsikan keluhan pasien secara lengkap..."
              {...register("keluhan")}
              className={cn(errors.keluhan ? errorInputClasses : inputClasses, "resize-none")}
            />
          </FormField>
        </motion.div>

        {/* ── Tanda Vital ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <SectionTitle
            title="Tanda Vital"
            subtitle="Hasil pengukuran vital sign"
            icon={Gauge}
            color="var(--color-danger)"
            bgColor="var(--color-danger-light)"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FormField label="Tekanan Darah" required icon={Gauge} error={errors.tekananDarah?.message}>
              <input
                type="text"
                id="field-tekanan-darah"
                placeholder="120/80 mmHg"
                {...register("tekananDarah")}
                className={errors.tekananDarah ? errorInputClasses : inputClasses}
              />
            </FormField>
            <FormField label="Suhu Tubuh" required icon={Thermometer} error={errors.suhu?.message}>
              <input
                type="text"
                id="field-suhu"
                placeholder="36.5°C"
                {...register("suhu")}
                className={errors.suhu ? errorInputClasses : inputClasses}
              />
            </FormField>
            <FormField label="Berat Badan" required icon={Weight} error={errors.beratBadan?.message}>
              <input
                type="text"
                id="field-berat-badan"
                placeholder="65 kg"
                {...register("beratBadan")}
                className={errors.beratBadan ? errorInputClasses : inputClasses}
              />
            </FormField>
            <FormField label="Tinggi Badan" icon={Ruler} error={errors.tinggiBadan?.message}>
              <input
                type="text"
                id="field-tinggi-badan"
                placeholder="168 cm"
                {...register("tinggiBadan")}
                className={errors.tinggiBadan ? errorInputClasses : inputClasses}
              />
            </FormField>
            <FormField label="Nadi (bpm)" icon={Heart} error={errors.nadi?.message}>
              <input
                type="text"
                id="field-nadi"
                placeholder="80 bpm"
                {...register("nadi")}
                className={errors.nadi ? errorInputClasses : inputClasses}
              />
            </FormField>
            <FormField label="Saturasi O₂" icon={Wind} error={errors.saturasi?.message}>
              <input
                type="text"
                id="field-saturasi"
                placeholder="98%"
                {...register("saturasi")}
                className={errors.saturasi ? errorInputClasses : inputClasses}
              />
            </FormField>
          </div>
        </motion.div>

        {/* ── SOAP ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <SectionTitle
            title="Catatan SOAP"
            subtitle="Subjective · Objective · Assessment · Plan"
            icon={Brain}
            color="var(--color-warning)"
            bgColor="var(--color-warning-light)"
          />

          <div className="space-y-4">
            {/* S */}
            <div className="rounded-xl border border-primary-100 overflow-hidden">
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "var(--color-primary-50)" }}>
                <span className="w-6 h-6 rounded-md bg-primary-600 text-white text-xs font-bold flex items-center justify-center" style={{ fontFamily: "var(--font-sans)" }}>S</span>
                <span className="text-sm font-semibold text-primary-700">Subjective</span>
              </div>
              <div className="p-4">
                <FormField label="" required error={errors.subjektif?.message}>
                  <textarea
                    id="field-subjektif"
                    rows={3}
                    placeholder="Deskripsi keluhan subjektif berdasarkan anamnesis..."
                    {...register("subjektif")}
                    className={cn(errors.subjektif ? errorInputClasses : inputClasses, "resize-none")}
                  />
                </FormField>
              </div>
            </div>

            {/* O */}
            <div className="rounded-xl border border-success/20 overflow-hidden">
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "var(--color-success-light)" }}>
                <span className="w-6 h-6 rounded-md text-white text-xs font-bold flex items-center justify-center" style={{ background: "var(--color-success)", fontFamily: "var(--font-sans)" }}>O</span>
                <span className="text-sm font-semibold" style={{ color: "var(--color-success-dark)" }}>Objective</span>
              </div>
              <div className="p-4">
                <FormField label="" required error={errors.objektif?.message}>
                  <textarea
                    id="field-objektif"
                    rows={3}
                    placeholder="Hasil pemeriksaan fisik dan penunjang..."
                    {...register("objektif")}
                    className={cn(errors.objektif ? errorInputClasses : inputClasses, "resize-none")}
                  />
                </FormField>
              </div>
            </div>

            {/* A */}
            <div className="rounded-xl border border-warning/20 overflow-hidden">
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "var(--color-warning-light)" }}>
                <span className="w-6 h-6 rounded-md text-white text-xs font-bold flex items-center justify-center" style={{ background: "var(--color-warning)", fontFamily: "var(--font-sans)" }}>A</span>
                <span className="text-sm font-semibold" style={{ color: "var(--color-warning-dark)" }}>Assessment / Diagnosa</span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <FormField label="" required error={errors.diagnosa?.message}>
                      <textarea
                        id="field-diagnosa"
                        rows={2}
                        placeholder="Diagnosa kerja..."
                        {...register("diagnosa")}
                        className={cn(errors.diagnosa ? errorInputClasses : inputClasses, "resize-none")}
                      />
                    </FormField>
                  </div>
                  <FormField label="Kode ICD-10" error={errors.icdCode?.message}>
                    <input
                      type="text"
                      id="field-icd-code"
                      placeholder="J06.9"
                      {...register("icdCode")}
                      className={cn(errors.icdCode ? errorInputClasses : inputClasses, "font-mono")}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* P */}
            <div className="rounded-xl border border-earth-200 overflow-hidden"
              style={{ borderColor: "var(--color-earth-200)" }}>
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "var(--color-earth-100)" }}>
                <span className="w-6 h-6 rounded-md text-white text-xs font-bold flex items-center justify-center" style={{ background: "var(--color-earth-500)", fontFamily: "var(--font-sans)" }}>P</span>
                <span className="text-sm font-semibold" style={{ color: "var(--color-earth-700)" }}>Plan / Rencana Pengobatan</span>
              </div>
              <div className="p-4">
                <FormField label="" required error={errors.plan?.message}>
                  <textarea
                    id="field-plan"
                    rows={4}
                    placeholder="Rencana pengobatan, saran, tindak lanjut..."
                    {...register("plan")}
                    className={cn(errors.plan ? errorInputClasses : inputClasses, "resize-none")}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Tindakan, Resep, Catatan ─────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <SectionTitle
            title="Tindakan, Resep & Catatan"
            icon={Pill}
            color="var(--color-earth-500)"
            bgColor="var(--color-earth-100)"
          />

          <div className="space-y-4">
            <FormField label="Tindakan Medis" icon={Scissors} hint="Opsional — tindakan yang dilakukan">
              <textarea
                id="field-tindakan"
                rows={2}
                placeholder="Contoh: Injeksi ketorolac 30mg, pemasangan infus..."
                {...register("tindakan")}
                className={cn(inputClasses, "resize-none")}
              />
            </FormField>

            <FormField label="Resep Obat" icon={Pill} hint="Opsional — satu baris per obat">
              <textarea
                id="field-resep"
                rows={4}
                placeholder={"• Amoxicillin 500mg — 3x1 tab (5 hari)\n• Paracetamol 500mg — 3x1 tab (prn)"}
                {...register("resep")}
                className={cn(inputClasses, "resize-none font-mono text-xs")}
              />
            </FormField>

            <FormField label="Catatan Tambahan" icon={StickyNote} hint="Opsional — informasi tambahan">
              <textarea
                id="field-catatan"
                rows={2}
                placeholder="Catatan atau pesan khusus..."
                {...register("catatan")}
                className={cn(inputClasses, "resize-none")}
              />
            </FormField>
          </div>
        </motion.div>

        {/* ── Submit ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2"
        >
          <Link
            href={`/pasien/${pasienId}`}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Batal, kembali ke detail pasien
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            id="btn-submit-rekam-medis"
            className={cn(
              "flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-semibold text-white",
              "transition-all duration-200",
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            )}
            style={{
              background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
              boxShadow: "0 4px 14px rgb(37 99 235 / 0.3)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <FilePlus size={16} />
                Simpan Rekam Medis
              </>
            )}
          </button>
        </motion.div>
      </div>
    </form>
  );
}
