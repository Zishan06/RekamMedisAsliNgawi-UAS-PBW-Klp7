/**
 * components/patient/data.ts
 * Semua dummy data untuk halaman Manajemen Pasien.
 * Struktur sesuai dengan tipe yang akan dipakai di API nanti.
 */

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export type StatusPasien = "Aktif" | "Rawat Jalan" | "Rawat Inap";
export type JenisKelamin = "Laki-laki" | "Perempuan";

export interface Pasien {
  id: string;
  noRM: string;
  nik: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  umur: number;
  tanggalLahir: string;
  noTelp: string;
  alamat: string;
  kunjunganTerakhir: string; // ISO date string
  status: StatusPasien;
  poli: string;
}

/* ─────────────────────────────────────────────
   Dummy Patients (15 pasien)
───────────────────────────────────────────── */
export const DAFTAR_PASIEN: Pasien[] = [
  {
    id: "p001",
    noRM: "RM-2024-0001",
    nik: "3521010101800001",
    nama: "Siti Rahayu Wulandari",
    jenisKelamin: "Perempuan",
    umur: 44,
    tanggalLahir: "1980-01-01",
    noTelp: "0812-3456-7890",
    alamat: "Jl. Diponegoro No. 12, Ngawi",
    kunjunganTerakhir: "2026-06-17",
    status: "Aktif",
    poli: "Poli Umum",
  },
  {
    id: "p002",
    noRM: "RM-2024-0002",
    nik: "3521011505750002",
    nama: "Wahyudi Priyatno",
    jenisKelamin: "Laki-laki",
    umur: 51,
    tanggalLahir: "1975-05-15",
    noTelp: "0821-9876-5432",
    alamat: "Jl. Ahmad Yani No. 45, Ngawi",
    kunjunganTerakhir: "2026-06-16",
    status: "Rawat Inap",
    poli: "Poli Dalam",
  },
  {
    id: "p003",
    noRM: "RM-2024-0003",
    nik: "3521012003900003",
    nama: "Dewi Kartika Sari",
    jenisKelamin: "Perempuan",
    umur: 36,
    tanggalLahir: "1990-03-20",
    noTelp: "0857-1122-3344",
    alamat: "Jl. Pangeran Antasari No. 8, Ngawi",
    kunjunganTerakhir: "2026-06-15",
    status: "Rawat Jalan",
    poli: "Poli Kandungan",
  },
  {
    id: "p004",
    noRM: "RM-2024-0004",
    nik: "3521010807850004",
    nama: "Ahmad Fauzan Hidayat",
    jenisKelamin: "Laki-laki",
    umur: 41,
    tanggalLahir: "1985-07-08",
    noTelp: "0878-5566-7788",
    alamat: "Jl. Soekarno Hatta No. 23, Ngawi",
    kunjunganTerakhir: "2026-06-14",
    status: "Aktif",
    poli: "Poli Bedah",
  },
  {
    id: "p005",
    noRM: "RM-2024-0005",
    nik: "3521012512680005",
    nama: "Sumarni",
    jenisKelamin: "Perempuan",
    umur: 58,
    tanggalLahir: "1968-12-25",
    noTelp: "0813-4455-6677",
    alamat: "Jl. Kartini No. 5, Paron, Ngawi",
    kunjunganTerakhir: "2026-06-13",
    status: "Rawat Jalan",
    poli: "Poli Penyakit Dalam",
  },
  {
    id: "p006",
    noRM: "RM-2024-0006",
    nik: "3521011003920006",
    nama: "Eko Prasetyo Utomo",
    jenisKelamin: "Laki-laki",
    umur: 34,
    tanggalLahir: "1992-03-10",
    noTelp: "0896-2233-4455",
    alamat: "Jl. Gatot Subroto No. 17, Ngawi",
    kunjunganTerakhir: "2026-06-17",
    status: "Aktif",
    poli: "Poli Umum",
  },
  {
    id: "p007",
    noRM: "RM-2024-0007",
    nik: "3521010205780007",
    nama: "Mujiati",
    jenisKelamin: "Perempuan",
    umur: 48,
    tanggalLahir: "1978-05-02",
    noTelp: "0852-7788-9900",
    alamat: "Desa Tempursari, Ngawi",
    kunjunganTerakhir: "2026-06-12",
    status: "Rawat Inap",
    poli: "Poli Bedah",
  },
  {
    id: "p008",
    noRM: "RM-2024-0008",
    nik: "3521011407820008",
    nama: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    umur: 44,
    tanggalLahir: "1982-07-14",
    noTelp: "0819-3344-5566",
    alamat: "Jl. Pemuda No. 31, Ngawi",
    kunjunganTerakhir: "2026-06-11",
    status: "Rawat Jalan",
    poli: "Poli Jantung",
  },
  {
    id: "p009",
    noRM: "RM-2025-0009",
    nik: "3521012809950009",
    nama: "Rizky Amalia Putri",
    jenisKelamin: "Perempuan",
    umur: 31,
    tanggalLahir: "1995-09-28",
    noTelp: "0838-6677-8899",
    alamat: "Jl. Merdeka No. 4, Ngawi",
    kunjunganTerakhir: "2026-06-17",
    status: "Aktif",
    poli: "Poli Umum",
  },
  {
    id: "p010",
    noRM: "RM-2025-0010",
    nik: "3521011206700010",
    nama: "Sarimin",
    jenisKelamin: "Laki-laki",
    umur: 56,
    tanggalLahir: "1970-06-12",
    noTelp: "0822-1122-3344",
    alamat: "Desa Karanganyar, Ngawi",
    kunjunganTerakhir: "2026-06-10",
    status: "Rawat Inap",
    poli: "Poli Paru",
  },
  {
    id: "p011",
    noRM: "RM-2025-0011",
    nik: "3521010305000011",
    nama: "Anisa Dewi Ratnasari",
    jenisKelamin: "Perempuan",
    umur: 26,
    tanggalLahir: "2000-05-03",
    noTelp: "0877-9988-7766",
    alamat: "Jl. Imam Bonjol No. 9, Ngawi",
    kunjunganTerakhir: "2026-06-16",
    status: "Rawat Jalan",
    poli: "Poli Gigi",
  },
  {
    id: "p012",
    noRM: "RM-2025-0012",
    nik: "3521011811880012",
    nama: "Hendra Kusuma Jaya",
    jenisKelamin: "Laki-laki",
    umur: 38,
    tanggalLahir: "1988-11-18",
    noTelp: "0866-5544-3322",
    alamat: "Jl. Cut Nyak Dien No. 3, Ngawi",
    kunjunganTerakhir: "2026-06-15",
    status: "Aktif",
    poli: "Poli Umum",
  },
  {
    id: "p013",
    noRM: "RM-2026-0013",
    nik: "3521010101010013",
    nama: "Yuni Astuti Rahayu",
    jenisKelamin: "Perempuan",
    umur: 29,
    tanggalLahir: "1997-01-01",
    noTelp: "0812-0011-2233",
    alamat: "Jl. Veteran No. 21, Ngawi",
    kunjunganTerakhir: "2026-06-17",
    status: "Aktif",
    poli: "Poli Kandungan",
  },
  {
    id: "p014",
    noRM: "RM-2026-0014",
    nik: "3521011504600014",
    nama: "Parijo",
    jenisKelamin: "Laki-laki",
    umur: 66,
    tanggalLahir: "1960-04-15",
    noTelp: "0857-3322-1100",
    alamat: "Desa Bringin, Ngawi",
    kunjunganTerakhir: "2026-06-09",
    status: "Rawat Inap",
    poli: "Poli Saraf",
  },
  {
    id: "p015",
    noRM: "RM-2026-0015",
    nik: "3521012202030015",
    nama: "Lestari Puspitawati",
    jenisKelamin: "Perempuan",
    umur: 23,
    tanggalLahir: "2003-02-22",
    noTelp: "0895-4455-6677",
    alamat: "Jl. Diponegoro No. 88, Ngawi",
    kunjunganTerakhir: "2026-06-17",
    status: "Rawat Jalan",
    poli: "Poli Umum",
  },
];

/* ─────────────────────────────────────────────
   Stats Ringkas
───────────────────────────────────────────── */
export interface PatientStat {
  id: string;
  label: string;
  value: number;
  subLabel: string;
  color: string;
  bgColor: string;
  iconName: "users" | "user-check" | "user-plus" | "calendar-check";
}

export const PATIENT_STATS: PatientStat[] = [
  {
    id: "total-pasien",
    label: "Total Pasien",
    value: 3_842,
    subLabel: "Terdaftar di sistem",
    color: "var(--color-primary-600)",
    bgColor: "var(--color-primary-50)",
    iconName: "users",
  },
  {
    id: "pasien-aktif",
    label: "Pasien Aktif",
    value: 2_156,
    subLabel: "Dalam penanganan",
    color: "var(--color-success)",
    bgColor: "var(--color-success-light)",
    iconName: "user-check",
  },
  {
    id: "pasien-baru",
    label: "Pasien Baru Bulan Ini",
    value: 214,
    subLabel: "Juni 2026",
    color: "var(--color-earth-500)",
    bgColor: "var(--color-earth-100)",
    iconName: "user-plus",
  },
  {
    id: "kunjungan-hari-ini",
    label: "Kunjungan Hari Ini",
    value: 127,
    subLabel: "17 Juni 2026",
    color: "var(--color-warning)",
    bgColor: "var(--color-warning-light)",
    iconName: "calendar-check",
  },
];
