/**
 * types/patient.ts — Tipe data untuk entitas Pasien.
 */

export type JenisKelamin = "L" | "P";
export type GolonganDarah = "A" | "B" | "AB" | "O" | "A+" | "B+" | "AB+" | "O+" | "A-" | "B-" | "AB-" | "O-";
export type StatusPernikahan = "belum_menikah" | "menikah" | "cerai_hidup" | "cerai_mati";
export type StatusPasien = "aktif" | "nonaktif" | "meninggal";

export interface Pasien {
  id: number;
  nomorRekamMedis: string;   // e.g. "RM-000123"
  nik: string;               // 16 digit NIK
  namaLengkap: string;
  tanggalLahir: string;      // ISO date "YYYY-MM-DD"
  jenisKelamin: JenisKelamin;
  golonganDarah?: GolonganDarah;
  agama?: string;
  statusPernikahan?: StatusPernikahan;

  // Kontak
  noTelepon?: string;
  email?: string;

  // Alamat
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kabupatenKota?: string;
  provinsi?: string;
  kodePos?: string;

  // Asuransi / BPJS
  nomorBpjs?: string;
  nomorAsuransi?: string;
  jenisAsuransi?: string;

  // Status
  status: StatusPasien;
  createdAt: string;
  updatedAt: string;
}

export interface PasienFormData
  extends Omit<Pasien, "id" | "nomorRekamMedis" | "createdAt" | "updatedAt"> {}

export interface PasienListItem {
  id: number;
  nomorRekamMedis: string;
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: JenisKelamin;
  noTelepon?: string;
  status: StatusPasien;
  kunjunganTerakhir?: string;
}
