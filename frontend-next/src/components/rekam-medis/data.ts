/**
 * components/rekam-medis/data.ts
 * Dummy data untuk halaman Kunjungan dan Riwayat Rekam Medis.
 */

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export type StatusKunjunganRM = "Menunggu" | "Diproses" | "Selesai" | "Dibatalkan";

export interface Kunjungan {
  id: string;
  noRM: string;
  namaPasien: string;
  pasienId: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  umur: number;
  poli: string;
  dokter: string;
  jamDaftar: string;    // "HH:MM"
  jamMulai?: string;    // "HH:MM" — saat dipanggil
  jamSelesai?: string;  // "HH:MM"
  status: StatusKunjunganRM;
  keluhan: string;
  diagnosa?: string;
  noAntrian: number;
}

export interface RiwayatEntry {
  id: string;
  pasienId: string;
  noRM: string;
  namaPasien: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  umur: number;
  tanggal: string;           // ISO date
  poli: string;
  dokter: string;
  keluhan: string;
  diagnosa: string;
  icdCode?: string;
  status: StatusKunjunganRM;
  soap: {
    subjektif: string;
    objektif: string;
    assessment: string;
    plan: string;
    resep?: string;
    tindakan?: string;
    catatan?: string;
    vitalSign: {
      tekananDarah: string;
      suhu: string;
      beratBadan: string;
      nadiPerMenit?: number;
      saturasiOksigen?: string;
    };
  };
}

/* ─────────────────────────────────────────────
   Kunjungan Hari Ini — 17 Juni 2026
───────────────────────────────────────────── */
export const KUNJUNGAN_HARI_INI: Kunjungan[] = [
  {
    id: "k001",
    noRM: "RM-2024-0001",
    namaPasien: "Siti Rahayu Wulandari",
    pasienId: "p001",
    jenisKelamin: "Perempuan",
    umur: 44,
    poli: "Poli Umum",
    dokter: "dr. Budi Santoso",
    jamDaftar: "07:15",
    jamMulai: "08:02",
    jamSelesai: "08:22",
    status: "Selesai",
    keluhan: "Pusing kepala, tekanan darah tinggi",
    diagnosa: "Hipertensi Tidak Terkontrol",
    noAntrian: 1,
  },
  {
    id: "k002",
    noRM: "RM-2024-0006",
    namaPasien: "Eko Prasetyo Utomo",
    pasienId: "p006",
    jenisKelamin: "Laki-laki",
    umur: 34,
    poli: "Poli Umum",
    dokter: "dr. Budi Santoso",
    jamDaftar: "07:20",
    jamMulai: "08:25",
    jamSelesai: "08:38",
    status: "Selesai",
    keluhan: "Batuk pilek 3 hari, demam ringan",
    diagnosa: "ISPA",
    noAntrian: 2,
  },
  {
    id: "k003",
    noRM: "RM-2025-0009",
    namaPasien: "Rizky Amalia Putri",
    pasienId: "p009",
    jenisKelamin: "Perempuan",
    umur: 31,
    poli: "Poli Umum",
    dokter: "dr. Budi Santoso",
    jamDaftar: "07:45",
    jamMulai: "08:40",
    jamSelesai: "08:55",
    status: "Selesai",
    keluhan: "Nyeri perut kiri bawah",
    diagnosa: "Gastritis",
    noAntrian: 3,
  },
  {
    id: "k004",
    noRM: "RM-2026-0013",
    namaPasien: "Yuni Astuti Rahayu",
    pasienId: "p013",
    jenisKelamin: "Perempuan",
    umur: 29,
    poli: "Poli Kandungan",
    dokter: "dr. Yuni Astuti, Sp.OG",
    jamDaftar: "07:30",
    jamMulai: "09:00",
    jamSelesai: "09:20",
    status: "Selesai",
    keluhan: "Kontrol kehamilan trimester 2",
    diagnosa: "Kehamilan Normal G2P1A0",
    noAntrian: 1,
  },
  {
    id: "k005",
    noRM: "RM-2026-0015",
    namaPasien: "Lestari Puspitawati",
    pasienId: "p015",
    jenisKelamin: "Perempuan",
    umur: 23,
    poli: "Poli Umum",
    dokter: "dr. Anisa Dewi Ratnasari",
    jamDaftar: "08:00",
    jamMulai: "09:05",
    status: "Diproses",
    keluhan: "Gatal-gatal seluruh tubuh sejak kemarin",
    noAntrian: 4,
  },
  {
    id: "k006",
    noRM: "RM-2024-0008",
    namaPasien: "Budi Santoso",
    pasienId: "p008",
    jenisKelamin: "Laki-laki",
    umur: 44,
    poli: "Poli Jantung",
    dokter: "dr. Hendra Kusuma, Sp.JP",
    jamDaftar: "08:10",
    jamMulai: "09:30",
    status: "Diproses",
    keluhan: "Sesak napas saat beraktivitas, jantung berdebar",
    noAntrian: 1,
  },
  {
    id: "k007",
    noRM: "RM-2025-0011",
    namaPasien: "Anisa Dewi Ratnasari",
    pasienId: "p011",
    jenisKelamin: "Perempuan",
    umur: 26,
    poli: "Poli Gigi",
    dokter: "drg. Sari Kusuma",
    jamDaftar: "08:30",
    status: "Menunggu",
    keluhan: "Gigi berlubang, nyeri saat makan",
    noAntrian: 1,
  },
  {
    id: "k008",
    noRM: "RM-2025-0012",
    namaPasien: "Hendra Kusuma Jaya",
    pasienId: "p012",
    jenisKelamin: "Laki-laki",
    umur: 38,
    poli: "Poli Umum",
    dokter: "dr. Anisa Dewi Ratnasari",
    jamDaftar: "08:45",
    status: "Menunggu",
    keluhan: "Pusing, mual, tidak nafsu makan",
    noAntrian: 5,
  },
  {
    id: "k009",
    noRM: "RM-2024-0003",
    namaPasien: "Dewi Kartika Sari",
    pasienId: "p003",
    jenisKelamin: "Perempuan",
    umur: 36,
    poli: "Poli Kandungan",
    dokter: "dr. Yuni Astuti, Sp.OG",
    jamDaftar: "08:50",
    status: "Menunggu",
    keluhan: "Nyeri panggul, keputihan",
    noAntrian: 2,
  },
  {
    id: "k010",
    noRM: "RM-2024-0005",
    namaPasien: "Sumarni",
    pasienId: "p005",
    jenisKelamin: "Perempuan",
    umur: 58,
    poli: "Poli Penyakit Dalam",
    dokter: "dr. Budi Santoso, Sp.PD",
    jamDaftar: "09:00",
    status: "Menunggu",
    keluhan: "Kontrol DM, gula darah naik",
    noAntrian: 1,
  },
];

/* ─────────────────────────────────────────────
   Stat Cards Kunjungan
───────────────────────────────────────────── */
export const KUNJUNGAN_STATS = {
  totalHariIni: KUNJUNGAN_HARI_INI.length,
  menunggu: KUNJUNGAN_HARI_INI.filter((k) => k.status === "Menunggu").length,
  diproses: KUNJUNGAN_HARI_INI.filter((k) => k.status === "Diproses").length,
  selesai:  KUNJUNGAN_HARI_INI.filter((k) => k.status === "Selesai").length,
};

/* ─────────────────────────────────────────────
   Daftar Poli & Dokter (untuk filter)
───────────────────────────────────────────── */
export const POLI_LIST = [
  "Poli Umum",
  "Poli Kandungan",
  "Poli Penyakit Dalam",
  "Poli Jantung",
  "Poli Gigi",
  "Poli Bedah",
  "Poli Anak",
  "Poli Saraf",
  "Poli Paru",
];

export const DOKTER_LIST = [
  "dr. Budi Santoso",
  "dr. Budi Santoso, Sp.PD",
  "dr. Anisa Dewi Ratnasari",
  "dr. Hendra Kusuma, Sp.JP",
  "dr. Yuni Astuti, Sp.OG",
  "drg. Sari Kusuma",
];

/* ─────────────────────────────────────────────
   Riwayat Rekam Medis (Multi-pasien, 30 hari)
───────────────────────────────────────────── */
export const RIWAYAT_REKAM_MEDIS: RiwayatEntry[] = [
  {
    id: "rw001",
    pasienId: "p001",
    noRM: "RM-2024-0001",
    namaPasien: "Siti Rahayu Wulandari",
    jenisKelamin: "Perempuan",
    umur: 44,
    tanggal: "2026-06-17",
    poli: "Poli Umum",
    dokter: "dr. Budi Santoso",
    keluhan: "Pusing kepala, tekanan darah tinggi, susah tidur",
    diagnosa: "Hipertensi Tidak Terkontrol",
    icdCode: "I10",
    status: "Selesai",
    soap: {
      subjektif: "Pasien datang dengan keluhan pusing kepala sejak 3 hari terakhir. Tekanan darah sering dirasakan tinggi. Obat antihipertensi sering terlewat.",
      objektif: "KU: Sakit sedang, Compos Mentis. TD: 165/100 mmHg. Jantung: S1S2 reguler, tidak ada murmur.",
      vitalSign: { tekananDarah: "165/100 mmHg", suhu: "36.8°C", beratBadan: "62 kg", nadiPerMenit: 88, saturasiOksigen: "98%" },
      assessment: "Hipertensi Tidak Terkontrol (I10) — terkait ketidakpatuhan minum obat.",
      plan: "1. Edukasi kepatuhan obat.\n2. Amlodipine 10mg 1x1 lanjut.\n3. Tambah Lisinopril 5mg.\n4. Diet rendah garam.\n5. Kontrol 2 minggu.",
      resep: "• Amlodipine 10mg — 1x1 (30 hari)\n• Lisinopril 5mg — 1x1 (30 hari)",
      tindakan: "Pemeriksaan EKG — normal sinus rhythm",
      catatan: "Pasien diminta monitoring TD mandiri di rumah.",
    },
  },
  {
    id: "rw002",
    pasienId: "p006",
    noRM: "RM-2024-0006",
    namaPasien: "Eko Prasetyo Utomo",
    jenisKelamin: "Laki-laki",
    umur: 34,
    tanggal: "2026-06-17",
    poli: "Poli Umum",
    dokter: "dr. Budi Santoso",
    keluhan: "Batuk pilek 3 hari, demam ringan",
    diagnosa: "ISPA",
    icdCode: "J06.9",
    status: "Selesai",
    soap: {
      subjektif: "Batuk berdahak, pilek, demam ringan sejak 3 hari. Tidak ada sesak napas.",
      objektif: "KU: Sakit ringan. Faring hiperemis. Suhu 38.1°C. SpO2 97%.",
      vitalSign: { tekananDarah: "118/76 mmHg", suhu: "38.1°C", beratBadan: "71 kg", nadiPerMenit: 90, saturasiOksigen: "97%" },
      assessment: "ISPA (J06.9) — faringitis akut",
      plan: "1. Parasetamol 500mg prn.\n2. Ambroxol 30mg 3x1.\n3. Cetirizine 10mg malam.\n4. Istirahat, minum banyak.",
      resep: "• Paracetamol 500mg — 3x1 (5 hari)\n• Ambroxol 30mg — 3x1 (5 hari)\n• Cetirizine 10mg — 1x1 malam (5 hari)",
    },
  },
  {
    id: "rw003",
    pasienId: "p013",
    noRM: "RM-2026-0013",
    namaPasien: "Yuni Astuti Rahayu",
    jenisKelamin: "Perempuan",
    umur: 29,
    tanggal: "2026-06-17",
    poli: "Poli Kandungan",
    dokter: "dr. Yuni Astuti, Sp.OG",
    keluhan: "Kontrol kehamilan trimester 2",
    diagnosa: "Kehamilan Normal G2P1A0",
    icdCode: "Z34",
    status: "Selesai",
    soap: {
      subjektif: "Kontrol rutin kehamilan 20 minggu. Tidak ada keluhan berarti. Gerakan janin aktif.",
      objektif: "USG: janin tunggal hidup, presentasi kepala, TBJ 340gr, plasenta anterior grade 0. DJJ 148x/mnt.",
      vitalSign: { tekananDarah: "112/72 mmHg", suhu: "36.6°C", beratBadan: "62 kg", nadiPerMenit: 82 },
      assessment: "Kehamilan Normal G2P1A0 usia 20 minggu (Z34)",
      plan: "1. Lanjut FE 60mg 1x1.\n2. Kalsium 500mg 2x1.\n3. Asam folat 400mcg 1x1.\n4. Kontrol 4 minggu.",
      resep: "• Ferrous Sulfate 60mg — 1x1 (30 hari)\n• Kalsium 500mg — 2x1 (30 hari)\n• Asam Folat 400mcg — 1x1 (30 hari)",
      catatan: "Hasil USG normal. Edukasi tanda bahaya kehamilan.",
    },
  },
  {
    id: "rw004",
    pasienId: "p002",
    noRM: "RM-2024-0002",
    namaPasien: "Wahyudi Priyatno",
    jenisKelamin: "Laki-laki",
    umur: 51,
    tanggal: "2026-06-16",
    poli: "Poli Dalam",
    dokter: "dr. Anisa Dewi, Sp.PD",
    keluhan: "Gula darah tidak terkontrol, lemas, sering haus",
    diagnosa: "DM Tipe 2 — Hiperglikemia",
    icdCode: "E11.65",
    status: "Selesai",
    soap: {
      subjektif: "Pasien lemas, sering haus, sering BAK. GDS semalam 350 mg/dL. Insulin sering terlewat.",
      objektif: "KU: Lemah. Turgor kulit menurun. Mukosa kering. GDS: 348 mg/dL.",
      vitalSign: { tekananDarah: "140/90 mmHg", suhu: "37.1°C", beratBadan: "78 kg", nadiPerMenit: 96, saturasiOksigen: "97%" },
      assessment: "DM Tipe 2 dengan Hiperglikemia (E11.65). GDS: 348 mg/dL.",
      plan: "1. Rawat inap untuk stabilisasi GD.\n2. Insulin reguler per sliding scale.\n3. Infus NaCl 0.9%.\n4. Metformin 500mg 2x1 lanjut.\n5. Monitoring GDS tiap 6 jam.",
      resep: "• Insulin Novorapid — sliding scale\n• Metformin 500mg — 2x1 (30 hari)",
      tindakan: "IV Line, Cek HbA1c, Fungsi Ginjal",
      catatan: "Target GDS 140–180. Edukasi kepatuhan insulin.",
    },
  },
  {
    id: "rw005",
    pasienId: "p011",
    noRM: "RM-2025-0011",
    namaPasien: "Anisa Dewi Ratnasari",
    jenisKelamin: "Perempuan",
    umur: 26,
    tanggal: "2026-06-16",
    poli: "Poli Gigi",
    dokter: "drg. Sari Kusuma",
    keluhan: "Gigi geraham bawah kiri berlubang, nyeri berdenyut",
    diagnosa: "Karies Profunda Gigi 36",
    icdCode: "K02.1",
    status: "Selesai",
    soap: {
      subjektif: "Nyeri gigi geraham bawah kiri sejak 5 hari, memburuk malam hari. Tidak ada bengkak di pipi.",
      objektif: "Gigi 36: karies profunda mencapai kamar pulpa. Perkusi +, palpasi -. Foto rontgen: karies profunda.",
      vitalSign: { tekananDarah: "110/70 mmHg", suhu: "36.5°C", beratBadan: "54 kg" },
      assessment: "Karies Profunda Gigi 36 dengan Pulpitis Irreversibel (K02.1)",
      plan: "1. Konseling PSA (Perawatan Saluran Akar).\n2. Amoksisilin 500mg 3x1 (5 hari).\n3. Asam Mefenamat 500mg 3x1 prn.\n4. Jadwal PSA sesi 1 minggu depan.",
      resep: "• Amoksisilin 500mg — 3x1 (5 hari)\n• Asam Mefenamat 500mg — 3x1 (5 hari, prn)",
      tindakan: "Foto rontgen periapikal gigi 36",
    },
  },
  {
    id: "rw006",
    pasienId: "p004",
    noRM: "RM-2024-0004",
    namaPasien: "Ahmad Fauzan Hidayat",
    jenisKelamin: "Laki-laki",
    umur: 41,
    tanggal: "2026-06-14",
    poli: "Poli Bedah",
    dokter: "dr. Wahyudi, Sp.B",
    keluhan: "Benjolan di perut kanan bawah, nyeri tekan",
    diagnosa: "Hernia Inguinalis Lateralis Dextra",
    icdCode: "K40.9",
    status: "Selesai",
    soap: {
      subjektif: "Benjolan di selangkangan kanan sejak 6 bulan, bertambah besar dan nyeri saat beraktivitas.",
      objektif: "Teraba benjolan di regio inguinal dextra 4x3 cm, lunak, dapat direposisi. Finger test: impuls positif di ujung jari.",
      vitalSign: { tekananDarah: "128/82 mmHg", suhu: "36.7°C", beratBadan: "75 kg", nadiPerMenit: 78 },
      assessment: "Hernia Inguinalis Lateralis Dextra (K40.9) — operabel",
      plan: "1. Rencana herniorafi elektif.\n2. Pre-op: lab darah, EKG, Rontgen thorak.\n3. Konsul anestesi.\n4. Jadwal operasi 2 minggu.",
      catatan: "Pasien setuju rencana operasi. Diminta puasa 8 jam sebelum tindakan.",
    },
  },
  {
    id: "rw007",
    pasienId: "p005",
    noRM: "RM-2024-0005",
    namaPasien: "Sumarni",
    jenisKelamin: "Perempuan",
    umur: 58,
    tanggal: "2026-06-13",
    poli: "Poli Penyakit Dalam",
    dokter: "dr. Budi Santoso, Sp.PD",
    keluhan: "Kontrol DM, keluhan baal di kaki",
    diagnosa: "DM Tipe 2 — Neuropati Perifer",
    icdCode: "E11.40",
    status: "Selesai",
    soap: {
      subjektif: "Kontrol rutin DM. Keluhan baal di kedua kaki sejak 3 bulan. GDS rata-rata 200 mg/dL.",
      objektif: "Monofilamen: gangguan sensasi proteksi di plantar bilateral. Reflex fisiologis menurun.",
      vitalSign: { tekananDarah: "136/86 mmHg", suhu: "36.6°C", beratBadan: "68 kg", nadiPerMenit: 80 },
      assessment: "DM Tipe 2 dengan Neuropati Perifer (E11.40)",
      plan: "1. Lanjut Metformin 500mg 2x1.\n2. Tambah Mecobalamin 500mcg 3x1.\n3. Edukasi perawatan kaki.\n4. HbA1c check.\n5. Kontrol 1 bulan.",
      resep: "• Metformin 500mg — 2x1 (30 hari)\n• Mecobalamin 500mcg — 3x1 (30 hari)",
    },
  },
  {
    id: "rw008",
    pasienId: "p008",
    noRM: "RM-2024-0008",
    namaPasien: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    umur: 44,
    tanggal: "2026-06-11",
    poli: "Poli Jantung",
    dokter: "dr. Hendra Kusuma, Sp.JP",
    keluhan: "Sesak napas, jantung berdebar, kaki bengkak",
    diagnosa: "Gagal Jantung Kongestif",
    icdCode: "I50.9",
    status: "Selesai",
    soap: {
      subjektif: "Sesak napas saat beraktivitas ringan, memburuk 1 minggu ini. Kaki bengkak bilateral. Jantung berdebar-debar.",
      objektif: "JVP meningkat 5+3 cmH2O. Ronki basah di basal paru bilateral. Edema pitting bilateral grade 2.",
      vitalSign: { tekananDarah: "150/95 mmHg", suhu: "36.9°C", beratBadan: "82 kg", nadiPerMenit: 102, saturasiOksigen: "94%" },
      assessment: "Gagal Jantung Kongestif NYHA III (I50.9) — eksaserbasi akut",
      plan: "1. Rawat inap.\n2. Furosemide 40mg IV.\n3. Oksigen 3L/mnt.\n4. Restriksi cairan 1L/hari.\n5. Spironolakton 25mg 1x1.\n6. Evaluasi BNP dan Echocardiography.",
      resep: "• Furosemide 40mg — 2x1 (7 hari)\n• Spironolakton 25mg — 1x1 (30 hari)\n• Bisoprolol 2.5mg — 1x1 (30 hari)",
      tindakan: "EKG, Foto Thoraks, Echocardiography",
      catatan: "Pasien dirawat di Bangsal Jantung. Target BB turun 1kg/hari.",
    },
  },
  {
    id: "rw009",
    pasienId: "p003",
    noRM: "RM-2024-0003",
    namaPasien: "Dewi Kartika Sari",
    jenisKelamin: "Perempuan",
    umur: 36,
    tanggal: "2026-06-15",
    poli: "Poli Kandungan",
    dokter: "dr. Yuni Astuti, Sp.OG",
    keluhan: "Nyeri panggul, keputihan berbau",
    diagnosa: "Vaginitis Bakterial",
    icdCode: "N76.0",
    status: "Selesai",
    soap: {
      subjektif: "Keputihan berbau amis sejak 1 minggu, disertai gatal dan nyeri panggul ringan. Tidak ada demam.",
      objektif: "Inspeksi vagina: discharge grayish, Whiff test positif. pH >4.5.",
      vitalSign: { tekananDarah: "115/75 mmHg", suhu: "36.7°C", beratBadan: "58 kg" },
      assessment: "Bacterial Vaginosis (N76.0)",
      plan: "1. Metronidazole 500mg 2x1 per oral (7 hari).\n2. Clindamycin krim intravaginal (7 hari).\n3. Edukasi higiene genitalia.\n4. Kontrol 2 minggu.",
      resep: "• Metronidazole 500mg — 2x1 (7 hari)\n• Clindamycin krim — 1x1 malam (7 hari)",
    },
  },
  {
    id: "rw010",
    pasienId: "p012",
    noRM: "RM-2025-0012",
    namaPasien: "Hendra Kusuma Jaya",
    jenisKelamin: "Laki-laki",
    umur: 38,
    tanggal: "2026-06-15",
    poli: "Poli Umum",
    dokter: "dr. Anisa Dewi Ratnasari",
    keluhan: "Pusing, mual, tidak nafsu makan",
    diagnosa: "Dispepsia Fungsional",
    icdCode: "K30",
    status: "Selesai",
    soap: {
      subjektif: "Pusing dan mual sejak 4 hari. Tidak nafsu makan. Nyeri ulu hati ringan. Tidak ada riwayat maag.",
      objektif: "Nyeri tekan epigastrium ringan. Bising usus normal.",
      vitalSign: { tekananDarah: "122/78 mmHg", suhu: "36.6°C", beratBadan: "73 kg", nadiPerMenit: 82 },
      assessment: "Dispepsia Fungsional (K30)",
      plan: "1. Omeprazole 20mg 2x1 AC.\n2. Domperidone 10mg 3x1.\n3. Diet: hindari pedas, kopi, alkohol.\n4. Makan teratur.",
      resep: "• Omeprazole 20mg — 2x1 AC (7 hari)\n• Domperidone 10mg — 3x1 (7 hari)",
    },
  },
  {
    id: "rw011",
    pasienId: "p007",
    noRM: "RM-2024-0007",
    namaPasien: "Mujiati",
    jenisKelamin: "Perempuan",
    umur: 48,
    tanggal: "2026-06-12",
    poli: "Poli Bedah",
    dokter: "dr. Wahyudi, Sp.B",
    keluhan: "Nyeri perut kanan bawah mendadak, demam",
    diagnosa: "Appendisitis Akut",
    icdCode: "K35.80",
    status: "Selesai",
    soap: {
      subjektif: "Nyeri perut kanan bawah mendadak sejak 12 jam, disertai demam. Mual dan muntah. Tidak bisa kentut.",
      objektif: "Nyeri tekan titik McBurney +. Blumberg sign +. Rovsing sign +. Suhu 38.6°C. Leukosit 18.000/µL.",
      vitalSign: { tekananDarah: "130/85 mmHg", suhu: "38.6°C", beratBadan: "60 kg", nadiPerMenit: 98 },
      assessment: "Appendisitis Akut (K35.80) — Indikasi operasi emergensi",
      plan: "1. Appendektomi laparoskopik emergensi.\n2. Puasa segera.\n3. IV Ceftriaxone 2g.\n4. IV Metronidazole 500mg.\n5. Konsul anestesi cito.",
      tindakan: "Appendektomi laparoskopik — durasi 45 menit, komplikasi (–)",
      catatan: "Operasi berjalan lancar. Rawat inap 3 hari post-op.",
    },
  },
  {
    id: "rw012",
    pasienId: "p009",
    noRM: "RM-2025-0009",
    namaPasien: "Rizky Amalia Putri",
    jenisKelamin: "Perempuan",
    umur: 31,
    tanggal: "2026-06-17",
    poli: "Poli Umum",
    dokter: "dr. Budi Santoso",
    keluhan: "Nyeri perut kiri bawah",
    diagnosa: "Gastritis",
    icdCode: "K29.7",
    status: "Selesai",
    soap: {
      subjektif: "Nyeri ulu hati sejak pagi, disertai mual. Tidak ada demam. Telat makan.",
      objektif: "Nyeri tekan epigastrium ringan. Tidak ada defens muskular.",
      vitalSign: { tekananDarah: "108/68 mmHg", suhu: "36.4°C", beratBadan: "52 kg", nadiPerMenit: 78 },
      assessment: "Gastritis Akut (K29.7)",
      plan: "1. Antasida 3x1 AC.\n2. Omeprazole 20mg 1x1.\n3. Makan teratur, hindari pedas dan asam.",
      resep: "• Antasida — 3x1 AC (5 hari)\n• Omeprazole 20mg — 1x1 (5 hari)",
    },
  },
];
