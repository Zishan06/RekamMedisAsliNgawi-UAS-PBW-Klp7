/**
 * components/medical-record/data.ts
 * Dummy data kaya untuk halaman Detail Pasien & Rekam Medis.
 */

import type { StatusPasien, JenisKelamin } from "@/components/patient/data";

/* ─────────────────────────────────────────────
   Extended Patient Detail
───────────────────────────────────────────── */
export type GolonganDarah = "A" | "B" | "AB" | "O" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Tidak diketahui";

export interface KontakDarurat {
  nama: string;
  hubungan: string;
  noTelp: string;
}

export interface PasienDetail {
  id: string;
  noRM: string;
  nik: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  umur: number;
  tanggalLahir: string;
  golonganDarah: GolonganDarah;
  noTelp: string;
  alamat: string;
  kunjunganTerakhir: string;
  status: StatusPasien;
  poli: string;
  kontakDarurat: KontakDarurat;
  dokterPJ: string; // dokter penanggung jawab
  tanggalDaftar: string;
  alergi?: string[];
  riwayatPenyakit?: string[];
}

/* ─────────────────────────────────────────────
   Medical Record / Kunjungan
───────────────────────────────────────────── */
export type StatusKunjungan = "Selesai" | "Sedang Berlangsung" | "Dirujuk" | "Rawat Inap";

export interface VitalSign {
  tekananDarah: string;       // "120/80 mmHg"
  suhu: string;               // "36.7°C"
  beratBadan: string;         // "65 kg"
  tinggiBadan?: string;       // "168 cm"
  nadiPerMenit?: number;      // 80
  saturasiOksigen?: string;   // "98%"
}

export interface SOAPData {
  subjektif: string;
  objektif: string;
  vitalSign: VitalSign;
  assessment: string;          // Diagnosa utama
  icdCode?: string;            // ICD-10 code
  plan: string;                // Rencana pengobatan
  resep?: string;              // Resep obat
  tindakan?: string;           // Tindakan medis
  catatan?: string;            // Catatan tambahan
}

export interface RekamMedis {
  id: string;
  pasienId: string;
  tanggal: string;             // ISO date
  poli: string;
  dokter: string;
  dokterSpesialis?: string;
  keluhan: string;
  diagnosa: string;            // Singkat untuk timeline
  status: StatusKunjungan;
  soap: SOAPData;
}

/* ─────────────────────────────────────────────
   Dummy Patient Detail Data
───────────────────────────────────────────── */
export const PATIENT_DETAILS: Record<string, PasienDetail> = {
  p001: {
    id: "p001",
    noRM: "RM-2024-0001",
    nik: "3521010101800001",
    nama: "Siti Rahayu Wulandari",
    jenisKelamin: "Perempuan",
    umur: 44,
    tanggalLahir: "1980-01-01",
    golonganDarah: "O+",
    noTelp: "0812-3456-7890",
    alamat: "Jl. Diponegoro No. 12, Ngawi, Jawa Timur 63211",
    kunjunganTerakhir: "2026-06-17",
    status: "Aktif",
    poli: "Poli Umum",
    dokterPJ: "dr. Budi Santoso, Sp.PD",
    tanggalDaftar: "2024-03-15",
    kontakDarurat: {
      nama: "Hendra Wulandari",
      hubungan: "Suami",
      noTelp: "0821-5678-9012",
    },
    alergi: ["Penisilin", "Ibuprofen"],
    riwayatPenyakit: ["Hipertensi (2022)", "ISPA berulang"],
  },
  p002: {
    id: "p002",
    noRM: "RM-2024-0002",
    nik: "3521011505750002",
    nama: "Wahyudi Priyatno",
    jenisKelamin: "Laki-laki",
    umur: 51,
    tanggalLahir: "1975-05-15",
    golonganDarah: "B+",
    noTelp: "0821-9876-5432",
    alamat: "Jl. Ahmad Yani No. 45, Ngawi, Jawa Timur 63211",
    kunjunganTerakhir: "2026-06-16",
    status: "Rawat Inap",
    poli: "Poli Dalam",
    dokterPJ: "dr. Anisa Dewi, Sp.PD",
    tanggalDaftar: "2024-01-08",
    kontakDarurat: {
      nama: "Sri Wahyudi",
      hubungan: "Istri",
      noTelp: "0856-1234-5678",
    },
    alergi: [],
    riwayatPenyakit: ["Diabetes Melitus Tipe 2", "Dislipidemia"],
  },
  p008: {
    id: "p008",
    noRM: "RM-2024-0008",
    nik: "3521011407820008",
    nama: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    umur: 44,
    tanggalLahir: "1982-07-14",
    golonganDarah: "A+",
    noTelp: "0819-3344-5566",
    alamat: "Jl. Pemuda No. 31, Ngawi, Jawa Timur 63211",
    kunjunganTerakhir: "2026-06-11",
    status: "Rawat Jalan",
    poli: "Poli Jantung",
    dokterPJ: "dr. Hendra Kusuma, Sp.JP",
    tanggalDaftar: "2024-06-20",
    kontakDarurat: {
      nama: "Dewi Santoso",
      hubungan: "Istri",
      noTelp: "0878-9900-1122",
    },
    alergi: ["Aspirin"],
    riwayatPenyakit: ["Hipertensi", "Gagal Jantung Kongestif (2025)"],
  },
};

/* ─────────────────────────────────────────────
   Fallback detail (untuk pasien lain yang belum ada detailnya)
───────────────────────────────────────────── */
export const DEFAULT_PATIENT_DETAIL: Omit<PasienDetail, "id" | "noRM" | "nik" | "nama" | "jenisKelamin" | "umur" | "tanggalLahir" | "noTelp" | "alamat" | "kunjunganTerakhir" | "status" | "poli"> = {
  golonganDarah: "Tidak diketahui",
  dokterPJ: "dr. Budi Santoso, Sp.PD",
  tanggalDaftar: "2025-01-01",
  kontakDarurat: {
    nama: "-",
    hubungan: "-",
    noTelp: "-",
  },
  alergi: [],
  riwayatPenyakit: [],
};

/* ─────────────────────────────────────────────
   Dummy Medical Records per Patient
───────────────────────────────────────────── */
export const REKAM_MEDIS: Record<string, RekamMedis[]> = {
  p001: [
    {
      id: "rm-p001-006",
      pasienId: "p001",
      tanggal: "2026-06-17",
      poli: "Poli Umum",
      dokter: "dr. Budi Santoso",
      dokterSpesialis: "Dokter Umum",
      keluhan: "Pusing kepala, tekanan darah tinggi, susah tidur sejak 3 hari lalu",
      diagnosa: "Hipertensi Tidak Terkontrol",
      status: "Selesai",
      soap: {
        subjektif:
          "Pasien datang dengan keluhan pusing kepala yang dirasakan sejak 3 hari terakhir. Tekanan darah sering dirasakan tinggi. Pasien juga mengeluhkan susah tidur dan merasa gelisah. Riwayat hipertensi sejak 2022. Obat antihipertensi rutin dikonsumsi namun akhir-akhir ini sering terlewat.",
        objektif:
          "Keadaan umum: Sakit sedang, Kesadaran: Compos Mentis. Kulit turgor baik. Kepala normocepal, tidak ada tanda trauma.",
        vitalSign: {
          tekananDarah: "165/100 mmHg",
          suhu: "36.8°C",
          beratBadan: "62 kg",
          tinggiBadan: "158 cm",
          nadiPerMenit: 88,
          saturasiOksigen: "98%",
        },
        assessment:
          "Hipertensi Tidak Terkontrol (I10) — Kemungkinan terkait ketidakpatuhan minum obat dan faktor stres.",
        icdCode: "I10",
        plan:
          "1. Edukasi pentingnya kepatuhan minum obat antihipertensi.\n2. Amlodipine 10mg 1x1 (lanjut).\n3. Lisinopril 5mg ditambahkan.\n4. Diet rendah garam dan rendah lemak.\n5. Kontrol kembali 2 minggu kemudian.\n6. Rujuk ke Poli Kardio jika tidak membaik.",
        resep:
          "• Amlodipine 10mg — 1x1 tab (30 hari)\n• Lisinopril 5mg — 1x1 tab (30 hari)\n• Alprazolam 0.5mg — 1x1 tab malam hari (10 hari, prn)",
        tindakan: "Pemeriksaan EKG — normal sinus rhythm",
        catatan: "Pasien dianjurkan untuk monitoring tekanan darah mandiri di rumah.",
      },
    },
    {
      id: "rm-p001-005",
      pasienId: "p001",
      tanggal: "2026-04-10",
      poli: "Poli Umum",
      dokter: "dr. Budi Santoso",
      dokterSpesialis: "Dokter Umum",
      keluhan: "Batuk, pilek, demam selama 2 hari",
      diagnosa: "ISPA (Infeksi Saluran Pernapasan Atas)",
      status: "Selesai",
      soap: {
        subjektif:
          "Pasien mengeluh batuk berdahak, pilek, dan demam sejak 2 hari lalu. Tidak ada sesak napas. Tidak ada anggota keluarga yang sakit serupa.",
        objektif:
          "KU: Sakit ringan, Compos Mentis. Faring hiperemis, tonsil T1/T1 tidak hiperemis. Suara napas vesikuler, tidak ada ronki.",
        vitalSign: {
          tekananDarah: "130/85 mmHg",
          suhu: "38.2°C",
          beratBadan: "62 kg",
          nadiPerMenit: 92,
          saturasiOksigen: "97%",
        },
        assessment: "ISPA (Infeksi Saluran Pernapasan Atas) (J06.9)",
        icdCode: "J06.9",
        plan: "1. Paracetamol 500mg jika demam.\n2. Ambroxol 30mg 3x1.\n3. Cetirizine 10mg 1x1 malam hari.\n4. Istirahat cukup, minum air putih banyak.\n5. Kembali jika demam > 3 hari atau sesak napas.",
        resep: "• Paracetamol 500mg — 3x1 tab (5 hari, prn)\n• Ambroxol 30mg — 3x1 tab (5 hari)\n• Cetirizine 10mg — 1x1 tab malam (5 hari)",
        catatan: "Pasien diminta istirahat 2 hari.",
      },
    },
    {
      id: "rm-p001-004",
      pasienId: "p001",
      tanggal: "2026-01-22",
      poli: "Poli Umum",
      dokter: "dr. Rina Hartati",
      dokterSpesialis: "Dokter Umum",
      keluhan: "Kontrol rutin hipertensi, keluhan tidak ada",
      diagnosa: "Hipertensi — Terkontrol Baik",
      status: "Selesai",
      soap: {
        subjektif:
          "Pasien datang untuk kontrol rutin hipertensi. Tidak ada keluhan saat ini. Obat dikonsumsi rutin, tidak ada efek samping.",
        objektif:
          "KU: Sehat, Compos Mentis. Jantung S1S2 reguler, tidak ada murmur. Paru vesikular.",
        vitalSign: {
          tekananDarah: "130/85 mmHg",
          suhu: "36.5°C",
          beratBadan: "61 kg",
          tinggiBadan: "158 cm",
          nadiPerMenit: 78,
          saturasiOksigen: "99%",
        },
        assessment: "Hipertensi Terkontrol (I10) — respon baik terhadap Amlodipine.",
        icdCode: "I10",
        plan: "1. Lanjutkan Amlodipine 10mg 1x1.\n2. Diet rendah garam.\n3. Olahraga ringan minimal 30 menit/hari.\n4. Kontrol 1 bulan kemudian.",
        resep: "• Amlodipine 10mg — 1x1 tab (30 hari)",
      },
    },
    {
      id: "rm-p001-003",
      pasienId: "p001",
      tanggal: "2025-10-05",
      poli: "Laboratorium",
      dokter: "dr. Budi Santoso",
      dokterSpesialis: "Dokter Umum",
      keluhan: "Kontrol lab — evaluasi gula darah dan kolesterol",
      diagnosa: "Profil Lab Normal — Dislipidemia Ringan",
      status: "Selesai",
      soap: {
        subjektif: "Pasien datang untuk pemeriksaan laboratorium rutin. Tidak ada keluhan.",
        objektif: "Lab: GDP 98 mg/dL, Kolesterol Total 215 mg/dL, LDL 140 mg/dL, HDL 48 mg/dL, Trigliserida 180 mg/dL.",
        vitalSign: {
          tekananDarah: "128/82 mmHg",
          suhu: "36.6°C",
          beratBadan: "62 kg",
          nadiPerMenit: 80,
        },
        assessment: "Dislipidemia Ringan (E78.5) — Gula darah normal.",
        icdCode: "E78.5",
        plan: "1. Diet rendah lemak jenuh.\n2. Olahraga aerobik 30 menit, 5x seminggu.\n3. Pertimbangkan Simvastatin jika tidak membaik dalam 3 bulan.\n4. Cek lab ulang 3 bulan kemudian.",
      },
    },
    {
      id: "rm-p001-002",
      pasienId: "p001",
      tanggal: "2025-06-18",
      poli: "Poli Umum",
      dokter: "dr. Rina Hartati",
      dokterSpesialis: "Dokter Umum",
      keluhan: "Nyeri pinggang, sulit berdiri lama",
      diagnosa: "Low Back Pain",
      status: "Selesai",
      soap: {
        subjektif: "Pasien mengeluh nyeri pinggang kanan sejak 1 minggu lalu, memburuk saat bekerja lama berdiri. Tidak ada penjalaran ke tungkai.",
        objektif: "Nyeri tekan lumbal L4-L5. Range of motion terbatas saat fleksi dan ekstensi. Lasegue test negatif bilateral.",
        vitalSign: {
          tekananDarah: "132/84 mmHg",
          suhu: "36.7°C",
          beratBadan: "62 kg",
        },
        assessment: "Low Back Pain Non-Spesifik (M54.5)",
        icdCode: "M54.5",
        plan: "1. Na-Diklofenak 50mg 2x1 setelah makan (7 hari).\n2. Methocarbamol 500mg 3x1 (5 hari).\n3. Kompres hangat 2x sehari.\n4. Hindari posisi membungkuk lama.\n5. Fisioterapi jika tidak membaik.",
        resep: "• Na-Diklofenak 50mg — 2x1 (7 hari)\n• Methocarbamol 500mg — 3x1 (5 hari)",
      },
    },
    {
      id: "rm-p001-001",
      pasienId: "p001",
      tanggal: "2024-03-15",
      poli: "Poli Umum",
      dokter: "dr. Budi Santoso",
      dokterSpesialis: "Dokter Umum",
      keluhan: "Pendaftaran pertama — Tekanan darah tinggi saat pemeriksaan rutin",
      diagnosa: "Hipertensi Grade II",
      status: "Selesai",
      soap: {
        subjektif: "Pasien baru pertama kali mendaftar. Keluhan tekanan darah tinggi pertama kali terdeteksi saat pemeriksaan di puskesmas sebulan lalu. Tidak ada riwayat penyakit sebelumnya yang signifikan.",
        objektif: "KU: Sehat, Compos Mentis. Jantung dan paru dalam batas normal.",
        vitalSign: {
          tekananDarah: "160/95 mmHg",
          suhu: "36.5°C",
          beratBadan: "63 kg",
          tinggiBadan: "158 cm",
          nadiPerMenit: 84,
          saturasiOksigen: "98%",
        },
        assessment: "Hipertensi Grade II (I10) — baru terdiagnosis.",
        icdCode: "I10",
        plan: "1. Amlodipine 5mg 1x1 (trial 2 minggu).\n2. Diet rendah garam < 2g/hari.\n3. Monitoring tekanan darah mandiri.\n4. Kontrol 2 minggu kemudian untuk evaluasi respon obat.",
        resep: "• Amlodipine 5mg — 1x1 tab (14 hari)",
        catatan: "Pasien baru. Diedukasi mengenai hipertensi dan gaya hidup sehat.",
      },
    },
  ],

  p002: [
    {
      id: "rm-p002-003",
      pasienId: "p002",
      tanggal: "2026-06-16",
      poli: "Poli Dalam",
      dokter: "dr. Anisa Dewi",
      dokterSpesialis: "Sp.PD",
      keluhan: "Gula darah tidak terkontrol, lemas, sering haus",
      diagnosa: "Diabetes Melitus Tipe 2 — Hiperglikemia",
      status: "Rawat Inap",
      soap: {
        subjektif: "Pasien mengeluh lemas, sering haus dan sering buang air kecil. Gula darah semalam 350 mg/dL. Mual ringan. Insulin sering terlewat karena sibuk bekerja.",
        objektif: "KU: Lemah, Compos Mentis. Turgor kulit sedikit menurun. Mukosa kering.",
        vitalSign: {
          tekananDarah: "140/90 mmHg",
          suhu: "37.1°C",
          beratBadan: "78 kg",
          tinggiBadan: "170 cm",
          nadiPerMenit: 96,
          saturasiOksigen: "97%",
        },
        assessment: "Diabetes Melitus Tipe 2 dengan Hiperglikemia (E11.65). GDS: 348 mg/dL.",
        icdCode: "E11.65",
        plan: "1. Rawat inap untuk stabilisasi gula darah.\n2. Insulin reguler per sliding scale.\n3. Infus NaCl 0.9% 1000cc/8jam.\n4. Metformin 500mg 2x1 lanjut.\n5. Monitoring GDS setiap 6 jam.\n6. Konsul ahli gizi untuk diet DM.",
        resep: "• Insulin Novorapid — per sliding scale\n• Metformin 500mg — 2x1 (30 hari)\n• Glimepiride 1mg — 1x1 pagi (30 hari)",
        tindakan: "Pemasangan IV Line, Pemeriksaan HbA1c, Cek fungsi ginjal",
        catatan: "Target GDS 140-180 mg/dL. Edukasi kepatuhan insulin.",
      },
    },
    {
      id: "rm-p002-002",
      pasienId: "p002",
      tanggal: "2026-03-20",
      poli: "Poli Dalam",
      dokter: "dr. Anisa Dewi",
      dokterSpesialis: "Sp.PD",
      keluhan: "Kontrol DM rutin, kaki terasa kesemutan",
      diagnosa: "DM Tipe 2 — Neuropati Perifer",
      status: "Selesai",
      soap: {
        subjektif: "Pasien kontrol rutin DM. Tambahan keluhan kesemutan di kedua kaki sejak 2 bulan terakhir. GDS di rumah rata-rata 200-250 mg/dL.",
        objektif: "Pemeriksaan monofilamen: gangguan sensasi proteksi di plantar bilateral. Reflex fisiologis menurun.",
        vitalSign: {
          tekananDarah: "138/88 mmHg",
          suhu: "36.7°C",
          beratBadan: "79 kg",
          nadiPerMenit: 82,
          saturasiOksigen: "98%",
        },
        assessment: "DM Tipe 2 dengan Neuropati Perifer (E11.40)",
        icdCode: "E11.40",
        plan: "1. Lanjutkan Metformin 500mg 2x1.\n2. Tambah Mecobalamin 500mcg 3x1.\n3. Edukasi perawatan kaki diabetik.\n4. Cek HbA1c.\n5. Kontrol 1 bulan.",
        resep: "• Metformin 500mg — 2x1 (30 hari)\n• Glimepiride 1mg — 1x1 pagi (30 hari)\n• Mecobalamin 500mcg — 3x1 (30 hari)",
      },
    },
  ],
};

/* ─────────────────────────────────────────────
   Helper: get patient detail with fallback
───────────────────────────────────────────── */
export function getPatientDetail(
  id: string,
  fallback: import("@/components/patient/data").Pasien
): PasienDetail {
  if (PATIENT_DETAILS[id]) return PATIENT_DETAILS[id];
  return {
    ...fallback,
    ...DEFAULT_PATIENT_DETAIL,
  };
}

export function getRekamMedis(pasienId: string): RekamMedis[] {
  return REKAM_MEDIS[pasienId] ?? [];
}
