/**
 * components/staff/data.ts
 * Dummy data untuk halaman Evaluasi Tenaga Medis.
 */

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export type Profesi = "Dokter Umum" | "Dokter Spesialis" | "Perawat" | "Bidan" | "Apoteker";
export type StatusTenaga = "Aktif" | "Cuti" | "Tidak Aktif";
export type PerformanceGrade = "A" | "B" | "C" | "D";

export interface Jadwal {
  hari: string;
  jam: string;
  poli: string;
}

export interface TenagaMedis {
  id: string;
  nama: string;
  profesi: Profesi;
  spesialisasi?: string;
  nip: string;
  poli: string;
  jumlahPasien: number;       // bulan ini
  durasiRataRata: number;     // menit
  kepuasan: number;           // persen 0-100
  performanceScore: number;   // 0-100
  grade: PerformanceGrade;
  status: StatusTenaga;
  avatar?: string;
  pengalaman: number;         // tahun
  jadwal: Jadwal[];
  catatanEvaluasi: string;
  targetPasien: number;
  pasienDitangani: {
    label: string;
    nilai: number;
  }[];
}

/* ─────────────────────────────────────────────
   Dummy Staff Data
───────────────────────────────────────────── */
export const TENAGA_MEDIS: TenagaMedis[] = [
  {
    id: "tm001",
    nama: "dr. Budi Santoso, Sp.PD",
    profesi: "Dokter Spesialis",
    spesialisasi: "Penyakit Dalam",
    nip: "19820714 200903 1 002",
    poli: "Poli Penyakit Dalam",
    jumlahPasien: 248,
    durasiRataRata: 15,
    kepuasan: 96.4,
    performanceScore: 94,
    grade: "A",
    status: "Aktif",
    pengalaman: 14,
    jadwal: [
      { hari: "Senin", jam: "08:00–12:00", poli: "Poli Penyakit Dalam" },
      { hari: "Rabu",  jam: "08:00–12:00", poli: "Poli Penyakit Dalam" },
      { hari: "Jumat", jam: "08:00–11:00", poli: "Poli Penyakit Dalam" },
    ],
    catatanEvaluasi: "Konsisten memberikan pelayanan prima. Komunikasi dengan pasien sangat baik. Disarankan untuk menjadi supervisor residen.",
    targetPasien: 200,
    pasienDitangani: [
      { label: "Jan", nilai: 210 },
      { label: "Feb", nilai: 195 },
      { label: "Mar", nilai: 230 },
      { label: "Apr", nilai: 215 },
      { label: "Mei", nilai: 240 },
      { label: "Jun", nilai: 248 },
    ],
  },
  {
    id: "tm002",
    nama: "dr. Anisa Dewi Ratnasari",
    profesi: "Dokter Umum",
    nip: "19950503 202003 2 005",
    poli: "Poli Umum",
    jumlahPasien: 312,
    durasiRataRata: 10,
    kepuasan: 98.2,
    performanceScore: 97,
    grade: "A",
    status: "Aktif",
    pengalaman: 4,
    jadwal: [
      { hari: "Senin",  jam: "07:00–14:00", poli: "Poli Umum" },
      { hari: "Selasa", jam: "07:00–14:00", poli: "Poli Umum" },
      { hari: "Kamis",  jam: "07:00–14:00", poli: "Poli Umum" },
      { hari: "Sabtu",  jam: "07:00–12:00", poli: "Poli Umum" },
    ],
    catatanEvaluasi: "Dokter berprestasi bulan ini. Waktu pelayanan efisien, tingkat kepuasan tertinggi. Kandidat kuat untuk pelatihan lanjutan.",
    targetPasien: 280,
    pasienDitangani: [
      { label: "Jan", nilai: 290 },
      { label: "Feb", nilai: 270 },
      { label: "Mar", nilai: 305 },
      { label: "Apr", nilai: 295 },
      { label: "Mei", nilai: 318 },
      { label: "Jun", nilai: 312 },
    ],
  },
  {
    id: "tm003",
    nama: "dr. Hendra Kusuma, Sp.JP",
    profesi: "Dokter Spesialis",
    spesialisasi: "Jantung & Pembuluh Darah",
    nip: "19881118 201803 1 008",
    poli: "Poli Jantung",
    jumlahPasien: 184,
    durasiRataRata: 22,
    kepuasan: 92.8,
    performanceScore: 88,
    grade: "B",
    status: "Aktif",
    pengalaman: 8,
    jadwal: [
      { hari: "Selasa", jam: "08:00–12:00", poli: "Poli Jantung" },
      { hari: "Kamis",  jam: "08:00–12:00", poli: "Poli Jantung" },
      { hari: "Sabtu",  jam: "08:00–11:00", poli: "Poli Jantung" },
    ],
    catatanEvaluasi: "Kompetensi klinis sangat baik. Perlu peningkatan kecepatan penanganan administrasi rekam medis. Aktif dalam penelitian.",
    targetPasien: 180,
    pasienDitangani: [
      { label: "Jan", nilai: 165 },
      { label: "Feb", nilai: 170 },
      { label: "Mar", nilai: 180 },
      { label: "Apr", nilai: 175 },
      { label: "Mei", nilai: 182 },
      { label: "Jun", nilai: 184 },
    ],
  },
  {
    id: "tm004",
    nama: "Sri Mulyani, S.Kep",
    profesi: "Perawat",
    nip: "19900215 201503 2 003",
    poli: "Poli Umum",
    jumlahPasien: 425,
    durasiRataRata: 8,
    kepuasan: 94.5,
    performanceScore: 91,
    grade: "A",
    status: "Aktif",
    pengalaman: 11,
    jadwal: [
      { hari: "Senin",  jam: "07:00–14:00", poli: "Poli Umum" },
      { hari: "Selasa", jam: "07:00–14:00", poli: "Poli Umum" },
      { hari: "Rabu",   jam: "07:00–14:00", poli: "Poli Umum" },
      { hari: "Jumat",  jam: "07:00–14:00", poli: "Poli Umum" },
    ],
    catatanEvaluasi: "Teladan perawat bulan ini. Sangat responsif terhadap kebutuhan pasien. Koordinasi antar tim sangat baik.",
    targetPasien: 400,
    pasienDitangani: [
      { label: "Jan", nilai: 390 },
      { label: "Feb", nilai: 380 },
      { label: "Mar", nilai: 410 },
      { label: "Apr", nilai: 420 },
      { label: "Mei", nilai: 430 },
      { label: "Jun", nilai: 425 },
    ],
  },
  {
    id: "tm005",
    nama: "dr. Yuni Astuti, Sp.OG",
    profesi: "Dokter Spesialis",
    spesialisasi: "Kandungan",
    nip: "19970101 202303 2 001",
    poli: "Poli Kandungan",
    jumlahPasien: 156,
    durasiRataRata: 20,
    kepuasan: 89.3,
    performanceScore: 82,
    grade: "B",
    status: "Aktif",
    pengalaman: 3,
    jadwal: [
      { hari: "Senin",  jam: "09:00–13:00", poli: "Poli Kandungan" },
      { hari: "Rabu",   jam: "09:00–13:00", poli: "Poli Kandungan" },
      { hari: "Jumat",  jam: "09:00–12:00", poli: "Poli Kandungan" },
    ],
    catatanEvaluasi: "Dokter muda dengan potensi tinggi. Perlu peningkatan kecepatan keputusan klinis. Komitmen tinggi terhadap pasien.",
    targetPasien: 150,
    pasienDitangani: [
      { label: "Jan", nilai: 140 },
      { label: "Feb", nilai: 142 },
      { label: "Mar", nilai: 148 },
      { label: "Apr", nilai: 150 },
      { label: "Mei", nilai: 152 },
      { label: "Jun", nilai: 156 },
    ],
  },
  {
    id: "tm006",
    nama: "Siti Rahayu, A.Md.Keb",
    profesi: "Bidan",
    nip: "19931225 201803 2 006",
    poli: "Poli Kandungan",
    jumlahPasien: 98,
    durasiRataRata: 18,
    kepuasan: 85.7,
    performanceScore: 76,
    grade: "C",
    status: "Aktif",
    pengalaman: 8,
    jadwal: [
      { hari: "Selasa", jam: "07:00–14:00", poli: "Poli Kandungan" },
      { hari: "Kamis",  jam: "07:00–14:00", poli: "Poli Kandungan" },
    ],
    catatanEvaluasi: "Perlu peningkatan di area dokumentasi rekam medis. Kecepatan pelayanan perlu ditingkatkan. Disarankan mengikuti pelatihan.",
    targetPasien: 120,
    pasienDitangani: [
      { label: "Jan", nilai: 110 },
      { label: "Feb", nilai: 105 },
      { label: "Mar", nilai: 100 },
      { label: "Apr", nilai: 95 },
      { label: "Mei", nilai: 100 },
      { label: "Jun", nilai: 98 },
    ],
  },
  {
    id: "tm007",
    nama: "Parijo, S.Farm, Apt",
    profesi: "Apoteker",
    nip: "19800415 200603 1 004",
    poli: "Farmasi",
    jumlahPasien: 580,
    durasiRataRata: 5,
    kepuasan: 91.2,
    performanceScore: 85,
    grade: "B",
    status: "Aktif",
    pengalaman: 20,
    jadwal: [
      { hari: "Senin",  jam: "07:00–14:00", poli: "Farmasi" },
      { hari: "Selasa", jam: "07:00–14:00", poli: "Farmasi" },
      { hari: "Rabu",   jam: "07:00–14:00", poli: "Farmasi" },
      { hari: "Kamis",  jam: "07:00–14:00", poli: "Farmasi" },
      { hari: "Jumat",  jam: "07:00–14:00", poli: "Farmasi" },
    ],
    catatanEvaluasi: "Sangat berpengalaman dan handal. Teliti dalam pengeluaran obat. Senior yang menjadi panutan di unit farmasi.",
    targetPasien: 500,
    pasienDitangani: [
      { label: "Jan", nilai: 520 },
      { label: "Feb", nilai: 510 },
      { label: "Mar", nilai: 545 },
      { label: "Apr", nilai: 560 },
      { label: "Mei", nilai: 575 },
      { label: "Jun", nilai: 580 },
    ],
  },
  {
    id: "tm008",
    nama: "dr. Wahyudi, Sp.B",
    profesi: "Dokter Spesialis",
    spesialisasi: "Bedah Umum",
    nip: "19750515 200303 1 007",
    poli: "Poli Bedah",
    jumlahPasien: 95,
    durasiRataRata: 30,
    kepuasan: 88.5,
    performanceScore: 79,
    grade: "C",
    status: "Cuti",
    pengalaman: 23,
    jadwal: [
      { hari: "Rabu",  jam: "08:00–12:00", poli: "Poli Bedah" },
      { hari: "Sabtu", jam: "08:00–11:00", poli: "Poli Bedah" },
    ],
    catatanEvaluasi: "Sedang menjalani cuti tahunan. Kompetensi bedah sangat tinggi. Perlu peningkatan dokumentasi catatan SOAP.",
    targetPasien: 100,
    pasienDitangani: [
      { label: "Jan", nilai: 105 },
      { label: "Feb", nilai: 98 },
      { label: "Mar", nilai: 102 },
      { label: "Apr", nilai: 100 },
      { label: "Mei", nilai: 99 },
      { label: "Jun", nilai: 95 },
    ],
  },
];

/* ─────────────────────────────────────────────
   Staff Insight Cards
───────────────────────────────────────────── */
export interface StaffInsight {
  id: string;
  icon: "star" | "trending-up" | "trending-down" | "alert" | "clock";
  title: string;
  body: string;
  type: "positive" | "warning" | "info" | "negative";
}

export const STAFF_INSIGHTS: StaffInsight[] = [
  {
    id: "si1",
    icon: "star",
    title: "Dokter Terbaik Bulan Ini",
    body: "dr. Anisa Dewi Ratnasari meraih kepuasan pasien tertinggi (98.2%) dengan efisiensi waktu pelayanan terbaik.",
    type: "positive",
  },
  {
    id: "si2",
    icon: "trending-up",
    title: "Peningkatan Performa Poli Jantung",
    body: "Jumlah pasien Poli Jantung meningkat 11% — dr. Hendra Kusuma memerlukan dukungan tenaga asisten.",
    type: "info",
  },
  {
    id: "si3",
    icon: "clock",
    title: "Waktu Pelayanan Rata-rata Membaik",
    body: "Rata-rata durasi pelayanan turun dari 22 menit menjadi 17 menit. Efisiensi meningkat secara keseluruhan.",
    type: "positive",
  },
  {
    id: "si4",
    icon: "alert",
    title: "Tenaga Farmasi Mendekati Batas Kapasitas",
    body: "Apoteker menangani 580 pasien bulan ini. Pertimbangkan penambahan tenaga farmasi untuk bulan berikutnya.",
    type: "warning",
  },
];
