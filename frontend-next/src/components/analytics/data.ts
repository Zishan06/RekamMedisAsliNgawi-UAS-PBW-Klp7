/**
 * components/analytics/data.ts
 * Dummy data untuk halaman Statistik Rumah Sakit.
 */

/* ─────────────────────────────────────────────
   KPI Cards
───────────────────────────────────────────── */
export interface KPICard {
  id: string;
  label: string;
  value: string;
  numValue: number;
  unit?: string;
  trend: number;         // persen
  trendLabel: string;
  color: string;
  bgColor: string;
  iconName: "calendar-check" | "user-plus" | "clock" | "smile";
}

export const KPI_CARDS: KPICard[] = [
  {
    id: "kunjungan-bulan-ini",
    label: "Kunjungan Bulan Ini",
    value: "3.421",
    numValue: 3421,
    trend: 8.4,
    trendLabel: "vs bulan lalu",
    color: "var(--color-primary-600)",
    bgColor: "var(--color-primary-50)",
    iconName: "calendar-check",
  },
  {
    id: "pasien-baru",
    label: "Pasien Baru",
    value: "214",
    numValue: 214,
    trend: 12.3,
    trendLabel: "vs bulan lalu",
    color: "var(--color-success)",
    bgColor: "var(--color-success-light)",
    iconName: "user-plus",
  },
  {
    id: "rata-tunggu",
    label: "Rata-rata Tunggu",
    value: "18",
    numValue: 18,
    unit: "mnt",
    trend: -14.2,
    trendLabel: "vs bulan lalu",
    color: "var(--color-warning)",
    bgColor: "var(--color-warning-light)",
    iconName: "clock",
  },
  {
    id: "kepuasan",
    label: "Tingkat Kepuasan",
    value: "94.2",
    numValue: 94.2,
    unit: "%",
    trend: 2.1,
    trendLabel: "vs bulan lalu",
    color: "var(--color-earth-500)",
    bgColor: "var(--color-earth-100)",
    iconName: "smile",
  },
];

/* ─────────────────────────────────────────────
   Kunjungan Chart Data
───────────────────────────────────────────── */
export interface DayPoint  { label: string; rawatJalan: number; rawatInap: number; ugd: number; }
export interface WeekPoint { label: string; rawatJalan: number; rawatInap: number; ugd: number; }
export interface MonthPoint{ label: string; rawatJalan: number; rawatInap: number; ugd: number; }

export const KUNJUNGAN_HARIAN: DayPoint[] = [
  { label: "Sen 9", rawatJalan: 98,  rawatInap: 12, ugd: 18 },
  { label: "Sel 10", rawatJalan: 115, rawatInap: 15, ugd: 22 },
  { label: "Rab 11", rawatJalan: 87,  rawatInap: 10, ugd: 14 },
  { label: "Kam 12", rawatJalan: 132, rawatInap: 18, ugd: 25 },
  { label: "Jum 13", rawatJalan: 120, rawatInap: 16, ugd: 20 },
  { label: "Sab 14", rawatJalan: 75,  rawatInap: 8,  ugd: 30 },
  { label: "Min 15", rawatJalan: 60,  rawatInap: 6,  ugd: 35 },
  { label: "Sen 16", rawatJalan: 110, rawatInap: 14, ugd: 19 },
  { label: "Sel 17", rawatJalan: 127, rawatInap: 17, ugd: 21 },
];

export const KUNJUNGAN_MINGGUAN: WeekPoint[] = [
  { label: "Mgg 1", rawatJalan: 520, rawatInap: 65, ugd: 110 },
  { label: "Mgg 2", rawatJalan: 590, rawatInap: 72, ugd: 95  },
  { label: "Mgg 3", rawatJalan: 480, rawatInap: 58, ugd: 120 },
  { label: "Mgg 4", rawatJalan: 620, rawatInap: 80, ugd: 88  },
];

export const KUNJUNGAN_BULANAN: MonthPoint[] = [
  { label: "Jan", rawatJalan: 2100, rawatInap: 280, ugd: 420 },
  { label: "Feb", rawatJalan: 1900, rawatInap: 260, ugd: 390 },
  { label: "Mar", rawatJalan: 2400, rawatInap: 310, ugd: 450 },
  { label: "Apr", rawatJalan: 2200, rawatInap: 290, ugd: 410 },
  { label: "Mei", rawatJalan: 2600, rawatInap: 330, ugd: 480 },
  { label: "Jun", rawatJalan: 2800, rawatInap: 355, ugd: 510 },
];

/* ─────────────────────────────────────────────
   Demografi — Umur
───────────────────────────────────────────── */
export interface UmurData { name: string; value: number; color: string; }

export const DEMOGRAFI_UMUR: UmurData[] = [
  { name: "0–12 th",  value: 18, color: "#3b82f6" },
  { name: "13–25 th", value: 14, color: "#059669" },
  { name: "26–40 th", value: 24, color: "#d96430" },
  { name: "41–60 th", value: 30, color: "#d97706" },
  { name: "> 60 th",  value: 14, color: "#7c3aed" },
];

export const DEMOGRAFI_GENDER: UmurData[] = [
  { name: "Laki-laki", value: 54, color: "#2563eb" },
  { name: "Perempuan", value: 46, color: "#d96430" },
];

/* ─────────────────────────────────────────────
   Poli Terpadat
───────────────────────────────────────────── */
export interface PoliData {
  rank: number;
  nama: string;
  jumlah: number;
  persentase: number;
  color: string;
  bgColor: string;
}

export const POLI_TERPADAT: PoliData[] = [
  { rank: 1, nama: "Poli Umum",          jumlah: 1240, persentase: 100, color: "var(--color-primary-600)", bgColor: "var(--color-primary-50)" },
  { rank: 2, nama: "Poli Anak",          jumlah: 890,  persentase: 72,  color: "var(--color-success)",     bgColor: "var(--color-success-light)" },
  { rank: 3, nama: "Poli Penyakit Dalam",jumlah: 720,  persentase: 58,  color: "var(--color-earth-500)",   bgColor: "var(--color-earth-100)" },
  { rank: 4, nama: "Poli Gigi",          jumlah: 580,  persentase: 47,  color: "var(--color-warning)",     bgColor: "var(--color-warning-light)" },
  { rank: 5, nama: "Poli Jantung",       jumlah: 420,  persentase: 34,  color: "#7c3aed",                  bgColor: "#ede9fe" },
  { rank: 6, nama: "Poli Kandungan",     jumlah: 380,  persentase: 31,  color: "#db2777",                  bgColor: "#fce7f3" },
];

/* ─────────────────────────────────────────────
   Top 5 Diagnosa
───────────────────────────────────────────── */
export interface DiagnosaData {
  rank: number;
  nama: string;
  icd: string;
  jumlah: number;
  persentase: number;
  color: string;
}

export const TOP_DIAGNOSA: DiagnosaData[] = [
  { rank: 1, nama: "ISPA",                         icd: "J06.9", jumlah: 423, persentase: 100, color: "#2563eb" },
  { rank: 2, nama: "Hipertensi",                   icd: "I10",   jumlah: 312, persentase: 74,  color: "#dc2626" },
  { rank: 3, nama: "Diabetes Melitus Tipe 2",       icd: "E11",   jumlah: 218, persentase: 52,  color: "#d97706" },
  { rank: 4, nama: "Gastroenteritis",              icd: "A09",   jumlah: 187, persentase: 44,  color: "#059669" },
  { rank: 5, nama: "Low Back Pain",                icd: "M54.5", jumlah: 145, persentase: 34,  color: "#7c3aed" },
];

/* ─────────────────────────────────────────────
   Insight Cards
───────────────────────────────────────────── */
export interface InsightItem {
  id: string;
  icon: "trending-up" | "trending-down" | "alert" | "star" | "clock";
  title: string;
  body: string;
  type: "positive" | "warning" | "info" | "negative";
}

export const INSIGHT_ITEMS: InsightItem[] = [
  {
    id: "i1",
    icon: "trending-up",
    title: "Lonjakan Kunjungan Poli Umum",
    body: "Poli Umum mengalami peningkatan kunjungan 18% dibanding bulan lalu. Pertimbangkan penambahan slot dokter.",
    type: "info",
  },
  {
    id: "i2",
    icon: "clock",
    title: "Waktu Tunggu Membaik",
    body: "Rata-rata waktu tunggu turun 12 menit menjadi 18 menit. Target ≤ 30 menit berhasil dipertahankan.",
    type: "positive",
  },
  {
    id: "i3",
    icon: "star",
    title: "Kepuasan Pasien Tinggi",
    body: "Tingkat kepuasan pasien mencapai 94.2%, meningkat 2.1% dari bulan sebelumnya.",
    type: "positive",
  },
  {
    id: "i4",
    icon: "alert",
    title: "Kapasitas Rawat Inap 87%",
    body: "Kapasitas rawat inap mendekati batas. Pertimbangkan manajemen bed lebih aktif.",
    type: "warning",
  },
];
