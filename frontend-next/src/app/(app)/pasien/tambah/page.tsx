"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  User,
  CreditCard,
  Calendar,
  Phone,
  MapPin,
  PhoneCall,
  Droplets,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { usePatientStore } from "@/lib/patient-store";
import type { NewPatientInput } from "@/lib/patient-store";

/* ─────────────────────────────────────────────
   Zod Schema
───────────────────────────────────────────── */
const tambahPasienSchema = z.object({
  namaLengkap: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama terlalu panjang"),

  nik: z
    .string()
    .length(16, "NIK harus tepat 16 digit")
    .regex(/^\d{16}$/, "NIK hanya boleh berisi angka"),

  tanggalLahir: z
    .string()
    .min(1, "Tanggal lahir wajib diisi")
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime()) && d < new Date();
    }, "Tanggal lahir tidak valid"),

  jenisKelamin: z.enum(["Laki-laki", "Perempuan"] as const, {
    error: "Pilih jenis kelamin",
  }),

  golonganDarah: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-","Tidak diketahui"] as const, {
    error: "Pilih golongan darah",
  }),

  noTelp: z
    .string()
    .min(9, "Nomor telepon minimal 9 digit")
    .max(15, "Nomor telepon terlalu panjang")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid"),

  alamat: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(250, "Alamat terlalu panjang"),

  kontakDaruratNama: z
    .string()
    .min(3, "Nama kontak darurat minimal 3 karakter"),

  kontakDaruratHubungan: z
    .string()
    .min(1, "Hubungan wajib diisi"),

  kontakDaruratNoTelp: z
    .string()
    .min(9, "Nomor telepon kontak darurat minimal 9 digit")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid"),
});

type TambahPasienFormData = z.infer<typeof tambahPasienSchema>;

/* ─────────────────────────────────────────────
   Field wrapper component
───────────────────────────────────────────── */
interface FormFieldWrapProps {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ElementType;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, error, icon: Icon, hint, children }: FormFieldWrapProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
        {Icon && <Icon size={13} className="text-neutral-400" />}
        {label}
        {required && <span className="text-danger text-xs ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs text-danger font-medium"
        >
          <AlertCircle size={11} />
          {error}
        </motion.p>
      )}
    </div>
  );
}

const inputBase = cn(
  "w-full px-3.5 py-2.5 rounded-xl text-sm",
  "bg-neutral-50 border border-neutral-200",
  "text-neutral-800 placeholder:text-neutral-400",
  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
  "focus:bg-white transition-all duration-200"
);

const inputError = cn(
  "w-full px-3.5 py-2.5 rounded-xl text-sm",
  "bg-danger/5 border border-danger/40",
  "text-neutral-800 placeholder:text-neutral-400",
  "focus:outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger",
  "focus:bg-white transition-all duration-200"
);

/* ─────────────────────────────────────────────
   Section Header
───────────────────────────────────────────── */
function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-neutral-100">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-neutral-800" style={{ fontFamily: "var(--font-sans)" }}>
          {title}
        </h3>
        {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tambah Pasien Form Page
───────────────────────────────────────────── */
export default function TambahPasienPage() {
  const router = useRouter();
  const { addPatient } = usePatientStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [newPatientId, setNewPatientId] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TambahPasienFormData>({
    resolver: zodResolver(tambahPasienSchema),
    defaultValues: {
      jenisKelamin:   "Laki-laki",
      golonganDarah:  "Tidak diketahui",
    },
  });

  const onSubmit = async (data: TambahPasienFormData) => {
    // Simulate async processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const input: NewPatientInput = {
      namaLengkap:            data.namaLengkap,
      nik:                    data.nik,
      tanggalLahir:           data.tanggalLahir,
      jenisKelamin:           data.jenisKelamin,
      golonganDarah:          data.golonganDarah,
      noTelp:                 data.noTelp,
      alamat:                 data.alamat,
      kontakDaruratNama:      data.kontakDaruratNama,
      kontakDaruratHubungan:  data.kontakDaruratHubungan,
      kontakDaruratNoTelp:    data.kontakDaruratNoTelp,
    };

    const newId = addPatient(input);
    setNewPatientId(newId);
    setIsSuccess(true);

    toast.success("Pasien berhasil didaftarkan!", {
      description: `${data.namaLengkap} telah ditambahkan ke sistem.`,
    });
  };

  /* ── Success Screen ───────────────────── */
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "var(--color-success-light)" }}
        >
          <CheckCircle2 size={48} style={{ color: "var(--color-success)" }} />
        </motion.div>

        <h2 className="text-2xl font-extrabold text-neutral-900 mb-2"
          style={{ fontFamily: "var(--font-sans)" }}>
          Pasien Berhasil Didaftarkan!
        </h2>
        <p className="text-neutral-500 max-w-sm mb-8">
          Data pasien telah tersimpan dan langsung muncul pada daftar pasien.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={`/pasien/${newPatientId}`}
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
          <button
            onClick={() => {
              setIsSuccess(false);
              setNewPatientId("");
            }}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
          >
            Tambah Pasien Lain
          </button>
        </div>
      </motion.div>
    );
  }

  /* ── Form ─────────────────────────────── */
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* ── Header ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/pasien"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-4 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Daftar Pasien
        </Link>

        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))",
          }}
        >
          {/* Decorative diamond motif */}
          <div className="absolute bottom-4 right-6 flex gap-2 opacity-20">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 rotate-45"
                style={{ background: i === 1 ? "var(--color-earth-300)" : "rgba(255,255,255,0.6)" }} />
            ))}
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <UserPlus size={21} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--font-sans)" }}>
                Daftarkan Pasien Baru
              </h1>
              <p className="text-primary-200 text-sm mt-0.5">
                Lengkapi semua data yang diperlukan dengan benar.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Form ────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          {/* ── Data Identitas ────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <SectionHeader
              title="Data Identitas"
              subtitle="Informasi utama pasien"
              icon={User}
              color="var(--color-primary-600)"
              bg="var(--color-primary-50)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div className="sm:col-span-2">
                <FormField label="Nama Lengkap" required icon={User} error={errors.namaLengkap?.message}>
                  <input
                    type="text"
                    id="field-nama"
                    placeholder="Masukkan nama lengkap sesuai KTP"
                    {...register("namaLengkap")}
                    className={errors.namaLengkap ? inputError : inputBase}
                  />
                </FormField>
              </div>

              {/* NIK */}
              <FormField label="NIK" required icon={CreditCard} error={errors.nik?.message}
                hint="16 digit nomor induk kependudukan">
                <input
                  type="text"
                  id="field-nik"
                  inputMode="numeric"
                  maxLength={16}
                  placeholder="16 digit NIK"
                  {...register("nik")}
                  className={cn(errors.nik ? inputError : inputBase, "font-mono")}
                />
              </FormField>

              {/* Tanggal Lahir */}
              <FormField label="Tanggal Lahir" required icon={Calendar} error={errors.tanggalLahir?.message}>
                <input
                  type="date"
                  id="field-tanggal-lahir"
                  max={new Date().toISOString().slice(0, 10)}
                  {...register("tanggalLahir")}
                  className={errors.tanggalLahir ? inputError : inputBase}
                />
              </FormField>

              {/* Jenis Kelamin */}
              <FormField label="Jenis Kelamin" required icon={User} error={errors.jenisKelamin?.message}>
                <Controller
                  name="jenisKelamin"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {(["Laki-laki", "Perempuan"] as const).map((jk) => (
                        <label
                          key={jk}
                          className={cn(
                            "flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200",
                            field.value === jk
                              ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                              : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-primary-300 hover:bg-primary-50"
                          )}
                        >
                          <input
                            type="radio"
                            value={jk}
                            checked={field.value === jk}
                            onChange={() => field.onChange(jk)}
                            className="sr-only"
                          />
                          {jk === "Laki-laki" ? "♂" : "♀"} {jk}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </FormField>

              {/* Golongan Darah */}
              <FormField label="Golongan Darah" required icon={Droplets} error={errors.golonganDarah?.message}>
                <Controller
                  name="golonganDarah"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="field-golongan-darah"
                      {...field}
                      className={cn(errors.golonganDarah ? inputError : inputBase, "cursor-pointer")}
                    >
                      {["A+","A-","B+","B-","AB+","AB-","O+","O-","Tidak diketahui"].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  )}
                />
              </FormField>
            </div>
          </motion.div>

          {/* ── Kontak & Alamat ───────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <SectionHeader
              title="Kontak & Alamat"
              icon={Phone}
              color="var(--color-success)"
              bg="var(--color-success-light)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nomor Telepon */}
              <FormField label="Nomor Telepon" required icon={Phone} error={errors.noTelp?.message}
                hint="Format: 0812-xxxx-xxxx">
                <input
                  type="tel"
                  id="field-notelp"
                  inputMode="tel"
                  placeholder="0812-xxxx-xxxx"
                  {...register("noTelp")}
                  className={errors.noTelp ? inputError : inputBase}
                />
              </FormField>

              {/* Spacer on mobile */}
              <div className="hidden sm:block" />

              {/* Alamat */}
              <div className="sm:col-span-2">
                <FormField label="Alamat Lengkap" required icon={MapPin} error={errors.alamat?.message}>
                  <textarea
                    id="field-alamat"
                    rows={3}
                    placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kecamatan, Kota"
                    {...register("alamat")}
                    className={cn(errors.alamat ? inputError : inputBase, "resize-none")}
                  />
                </FormField>
              </div>
            </div>
          </motion.div>

          {/* ── Kontak Darurat ────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="rounded-2xl bg-surface-card border border-neutral-200 p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <SectionHeader
              title="Kontak Darurat"
              subtitle="Orang yang dapat dihubungi saat kondisi darurat"
              icon={PhoneCall}
              color="var(--color-warning)"
              bg="var(--color-warning-light)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nama Kontak */}
              <FormField label="Nama Lengkap" required icon={User} error={errors.kontakDaruratNama?.message}>
                <input
                  type="text"
                  id="field-kontak-nama"
                  placeholder="Nama kontak darurat"
                  {...register("kontakDaruratNama")}
                  className={errors.kontakDaruratNama ? inputError : inputBase}
                />
              </FormField>

              {/* Hubungan */}
              <FormField label="Hubungan" required icon={Heart} error={errors.kontakDaruratHubungan?.message}>
                <Controller
                  name="kontakDaruratHubungan"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <select
                      id="field-kontak-hubungan"
                      {...field}
                      className={cn(errors.kontakDaruratHubungan ? inputError : inputBase, "cursor-pointer")}
                    >
                      <option value="">-- Pilih --</option>
                      {["Suami","Istri","Orang Tua","Anak","Saudara","Kerabat","Lainnya"].map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  )}
                />
              </FormField>

              {/* No Telp Kontak */}
              <FormField label="Nomor Telepon" required icon={Phone} error={errors.kontakDaruratNoTelp?.message}>
                <input
                  type="tel"
                  id="field-kontak-notelp"
                  inputMode="tel"
                  placeholder="0812-xxxx-xxxx"
                  {...register("kontakDaruratNoTelp")}
                  className={errors.kontakDaruratNoTelp ? inputError : inputBase}
                />
              </FormField>
            </div>
          </motion.div>

          {/* ── Submit Bar ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2"
          >
            <Link
              href="/pasien"
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft size={14} />
              Batal, kembali ke daftar
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-submit-pasien"
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
                  <UserPlus size={16} />
                  Daftarkan Pasien
                </>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
