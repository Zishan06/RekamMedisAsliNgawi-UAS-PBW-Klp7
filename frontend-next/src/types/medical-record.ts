/**
 * types/medical-record.ts — Tipe data untuk Rekam Medis & Kunjungan.
 */

import type { PasienListItem } from "./patient";

export type StatusKunjungan = "menunggu" | "sedang_dilayani" | "selesai" | "dibatalkan";
export type JenisKunjungan = "rawat_jalan" | "rawat_inap" | "ugd" | "poliklinik";

/* ── Diagnosa (ICD-10) ──────────────────── */
export interface Diagnosa {
  kodeIcd: string;      // e.g. "J06.9"
  namaIcd: string;      // e.g. "Infeksi Saluran Napas Akut"
  jenis: "utama" | "sekunder" | "komplikasi";
  keterangan?: string;
}

/* ── Tanda Vital ────────────────────────── */
export interface TandaVital {
  beratBadan?: number;       // kg
  tinggiBadan?: number;      // cm
  tekananDarahSistolik?: number;
  tekananDarahDiastolik?: number;
  denyutNadi?: number;       // per menit
  suhutubuh?: number;        // Celsius
  frekuensiNapas?: number;   // per menit
  saturasi?: number;         // SpO2 %
  gds?: number;              // Gula darah sewaktu
  lingkarPerut?: number;     // cm
  recordedAt: string;
}

/* ── Resep / Obat ───────────────────────── */
export interface ItemResep {
  namaObat: string;
  dosis: string;
  frekuensi: string;        // e.g. "3x1"
  durasi: string;           // e.g. "7 hari"
  instruksi?: string;
  jumlah?: number;
}

export interface Resep {
  id: number;
  kunjunganId: number;
  items: ItemResep[];
  catatanFarmasi?: string;
  createdAt: string;
}

/* ── Catatan SOAP ───────────────────────── */
export interface CatatanSOAP {
  subjektif: string;   // Keluhan pasien
  objektif: string;    // Pemeriksaan fisik
  asesmen: string;     // Penilaian dokter
  plan: string;        // Rencana tindakan
}

/* ── Rekam Medis Kunjungan ──────────────── */
export interface RekamMedis {
  id: number;
  pasien: PasienListItem;
  dokterNama: string;
  poliklinik: string;
  jenisKunjungan: JenisKunjungan;
  statusKunjungan: StatusKunjungan;
  tanggalKunjungan: string;
  keluhanUtama: string;
  soap?: CatatanSOAP;
  tandaVital?: TandaVital;
  diagnosa: Diagnosa[];
  resep?: Resep;
  catatanTambahan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RekamMedisListItem {
  id: number;
  pasienNama: string;
  pasienNomorRM: string;
  dokterNama: string;
  poliklinik: string;
  jenisKunjungan: JenisKunjungan;
  statusKunjungan: StatusKunjungan;
  tanggalKunjungan: string;
  diagnosaUtama?: string;
}
