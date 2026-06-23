/**
 * dashboard/data.ts
 * Semua dummy data untuk Dashboard.
 * Struktur sesuai dengan tipe yang akan dipakai di API nanti.
 */

/* ─────────────────────────────────────────────
   Stat Cards
───────────────────────────────────────────── */
export interface StatCard {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: number;       // persen, positif = naik
  trendLabel: string;
  color: string;       // CSS var token
  bgColor: string;
  iconName: "users" | "calendar-check" | "clock" | "stethoscope";
}

export const STAT_CARDS: StatCard[] = [
  {
    id: "total-pasien",
    label: "Total Pasien",
    value: 3_842,
    trend: 4.2,
    trendLabel: "dari bulan lalu",
    color: "var(--color-primary-600)",
    bgColor: "var(--color-primary-50)",
    iconName: "users",
  },
  {
    id: "kunjungan-hari-ini",
    label: "Kunjungan Hari Ini",
    value: 127,
    trend: 12.5,
    trendLabel: "dari kemarin",
    color: "var(--color-success)",
    bgColor: "var(--color-success-light)",
    iconName: "calendar-check",
  },
  {
    id: "antrian-aktif",
    label: "Antrian Aktif",
    value: 34,
    trend: -8.3,
    trendLabel: "dari rata-rata",
    color: "var(--color-warning)",
    bgColor: "var(--color-warning-light)",
    iconName: "clock",
  },
  {
    id: "dokter-bertugas",
    label: "Dokter Bertugas",
    value: 18,
    trend: 0,
    trendLabel: "jadwal normal",
    color: "var(--color-earth-500)",
    bgColor: "var(--color-earth-100)",
    iconName: "stethoscope",
  },
];

/* ─────────────────────────────────────────────
   Kunjungan Chart — 7 hari terakhir
───────────────────────────────────────────── */
export interface ChartDataPoint {
  hari: string;
  rawatJalan: number;
  rawatInap: number;
  ugd: number;
}

export const KUNJUNGAN_7_HARI: ChartDataPoint[] = [
  { hari: "Sen", rawatJalan: 98,  rawatInap: 12, ugd: 18 },
  { hari: "Sel", rawatJalan: 115, rawatInap: 15, ugd: 22 },
  { hari: "Rab", rawatJalan: 87,  rawatInap: 10, ugd: 14 },
  { hari: "Kam", rawatJalan: 132, rawatInap: 18, ugd: 25 },
  { hari: "Jum", rawatJalan: 120, rawatInap: 16, ugd: 20 },
  { hari: "Sab", rawatJalan: 75,  rawatInap: 8,  ugd: 30 },
  { hari: "Min", rawatJalan: 60,  rawatInap: 6,  ugd: 35 },
];

/* ─────────────────────────────────────────────
   Aktivitas Terbaru
───────────────────────────────────────────── */
export type AktivitasType = "pasien-baru" | "rekam-medis" | "konsultasi" | "lab" | "resep";

export interface Aktivitas {
  id: string;
  type: AktivitasType;
  deskripsi: string;
  subjek: string;
  waktu: string;       // relative label
  timestamp: string;
  aktor: string;
}

export const AKTIVITAS_TERBARU: Aktivitas[] = [
  {
    id: "a1",
    type: "pasien-baru",
    deskripsi: "Pasien baru didaftarkan",
    subjek: "Siti Rahayu",
    waktu: "2 menit lalu",
    timestamp: "13:44",
    aktor: "Admin Pendaftaran",
  },
  {
    id: "a2",
    type: "rekam-medis",
    deskripsi: "Rekam medis diperbarui",
    subjek: "Bapak Wahyudi Priyatno",
    waktu: "8 menit lalu",
    timestamp: "13:38",
    aktor: "dr. Anisa Dewi",
  },
  {
    id: "a3",
    type: "konsultasi",
    deskripsi: "Konsultasi selesai",
    subjek: "Ibu Sumarni",
    waktu: "15 menit lalu",
    timestamp: "13:31",
    aktor: "dr. Budi Santoso",
  },
  {
    id: "a4",
    type: "lab",
    deskripsi: "Hasil laboratorium tersedia",
    subjek: "Eko Prasetyo",
    waktu: "32 menit lalu",
    timestamp: "13:14",
    aktor: "Lab RSUD Ngawi",
  },
  {
    id: "a5",
    type: "resep",
    deskripsi: "Resep obat diterbitkan",
    subjek: "Dewi Kartika",
    waktu: "45 menit lalu",
    timestamp: "13:01",
    aktor: "dr. Hendra Kusuma",
  },
  {
    id: "a6",
    type: "pasien-baru",
    deskripsi: "Pasien baru didaftarkan",
    subjek: "Ahmad Fauzan",
    waktu: "1 jam lalu",
    timestamp: "12:46",
    aktor: "Admin Pendaftaran",
  },
];

/* ─────────────────────────────────────────────
   Ringkasan Operasional
───────────────────────────────────────────── */
export interface RingkasanItem {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export const RINGKASAN_OPERASIONAL: RingkasanItem[] = [
  {
    label: "Poli Tersibuk",
    value: "Poli Umum",
    sub: "48 pasien hari ini",
    color: "var(--color-primary-600)",
  },
  {
    label: "Diagnosa Terbanyak",
    value: "ISPA",
    sub: "J06.9 — 23 kasus",
    color: "var(--color-earth-500)",
  },
  {
    label: "Rata-rata Waktu Tunggu",
    value: "18 menit",
    sub: "Target ≤ 30 menit ✓",
    color: "var(--color-success)",
  },
  {
    label: "Tingkat Kepadatan",
    value: "74%",
    sub: "Kapasitas normal",
    color: "var(--color-warning)",
  },
];
