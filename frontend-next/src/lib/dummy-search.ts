/**
 * dummy-search.ts — Dummy Data & Mock API untuk Global Search
 * Diperkaya dengan lebih banyak data, kategori, dan full-text search.
 */

export type SearchResultType =
  | "pasien"
  | "dokter"
  | "perawat"
  | "rekam-medis"
  | "diagnosa";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  href: string;
  meta?: string; // Extra info untuk highlight
}

// ── Data Simulasi ─────────────────────────────────────────────────
const DUMMY_DATA: SearchResult[] = [
  // Pasien
  {
    id: "P-001",
    title: "Budi Santoso",
    subtitle: "Pasien • RM-2026-001",
    type: "pasien",
    href: "/pasien",
    meta: "Poli Umum • Laki-laki • 34 th",
  },
  {
    id: "P-002",
    title: "Siti Aminah",
    subtitle: "Pasien • RM-2026-002",
    type: "pasien",
    href: "/pasien",
    meta: "Poli Penyakit Dalam • Perempuan • 52 th",
  },
  {
    id: "P-003",
    title: "Andi Saputra",
    subtitle: "Pasien • RM-2026-003",
    type: "pasien",
    href: "/pasien",
    meta: "Poli Gigi • Laki-laki • 27 th",
  },
  {
    id: "P-004",
    title: "Dewi Rahayu",
    subtitle: "Pasien • RM-2026-004",
    type: "pasien",
    href: "/pasien",
    meta: "Poli KIA • Perempuan • 31 th",
  },
  {
    id: "P-005",
    title: "Rudi Hartono",
    subtitle: "Pasien • RM-2026-005",
    type: "pasien",
    href: "/pasien",
    meta: "Poli Umum • Laki-laki • 61 th",
  },
  {
    id: "P-006",
    title: "Eko Widodo",
    subtitle: "Pasien • RM-2026-006",
    type: "pasien",
    href: "/pasien",
    meta: "Poli Bedah • Laki-laki • 45 th",
  },
  {
    id: "P-007",
    title: "Fitri Handayani",
    subtitle: "Pasien • RM-2026-007",
    type: "pasien",
    href: "/pasien",
    meta: "Poli Mata • Perempuan • 38 th",
  },

  // Dokter
  {
    id: "D-001",
    title: "dr. Andi Pratama",
    subtitle: "Dokter • Poli Umum",
    type: "dokter",
    href: "/tenaga-medis/dokter",
    meta: "SIP: 123/SIP/2024",
  },
  {
    id: "D-002",
    title: "dr. Ratna Mutiara, Sp.PD",
    subtitle: "Dokter • Penyakit Dalam",
    type: "dokter",
    href: "/tenaga-medis/dokter",
    meta: "SIP: 456/SIP/2024",
  },
  {
    id: "D-003",
    title: "drg. Hendra Wijaya",
    subtitle: "Dokter Gigi • Poli Gigi",
    type: "dokter",
    href: "/tenaga-medis/dokter",
    meta: "SIP: 789/SIP/2024",
  },
  {
    id: "D-004",
    title: "dr. Sri Wahyuni, Sp.OG",
    subtitle: "Dokter • Kandungan & KIA",
    type: "dokter",
    href: "/tenaga-medis/dokter",
    meta: "SIP: 321/SIP/2024",
  },

  // Perawat
  {
    id: "N-001",
    title: "Suster Maria Ulfa",
    subtitle: "Perawat • Poli Umum",
    type: "perawat",
    href: "/tenaga-medis/perawat",
    meta: "SIPP: 001/SIPP/2024",
  },
  {
    id: "N-002",
    title: "Perawat Bintang Sejati",
    subtitle: "Perawat • Penyakit Dalam",
    type: "perawat",
    href: "/tenaga-medis/perawat",
    meta: "SIPP: 002/SIPP/2024",
  },
  {
    id: "N-003",
    title: "Perawat Ananda Kusuma",
    subtitle: "Perawat • Bedah",
    type: "perawat",
    href: "/tenaga-medis/perawat",
    meta: "SIPP: 003/SIPP/2024",
  },

  // Rekam Medis
  {
    id: "RM-001",
    title: "Kunjungan Budi Santoso",
    subtitle: "Rekam Medis • RM-2026-001 • 12 Jun 2026",
    type: "rekam-medis",
    href: "/rekam-medis/kunjungan",
    meta: "Poli Umum",
  },
  {
    id: "RM-002",
    title: "Kunjungan Siti Aminah",
    subtitle: "Rekam Medis • RM-2026-002 • 15 Jun 2026",
    type: "rekam-medis",
    href: "/rekam-medis/kunjungan",
    meta: "Poli Penyakit Dalam",
  },
  {
    id: "RM-003",
    title: "Riwayat RM-2026-003",
    subtitle: "Rekam Medis • Andi Saputra • 10 Jun 2026",
    type: "rekam-medis",
    href: "/rekam-medis/riwayat",
    meta: "Poli Gigi",
  },

  // Diagnosa
  {
    id: "DG-001",
    title: "Hipertensi Esensial",
    subtitle: "Diagnosa • ICD-10: I10",
    type: "diagnosa",
    href: "/rekam-medis/riwayat",
    meta: "5 pasien terdiagnosa",
  },
  {
    id: "DG-002",
    title: "Diabetes Mellitus Tipe 2",
    subtitle: "Diagnosa • ICD-10: E11",
    type: "diagnosa",
    href: "/rekam-medis/riwayat",
    meta: "3 pasien terdiagnosa",
  },
  {
    id: "DG-003",
    title: "ISPA (Infeksi Saluran Pernapasan)",
    subtitle: "Diagnosa • ICD-10: J06",
    type: "diagnosa",
    href: "/rekam-medis/riwayat",
    meta: "8 pasien terdiagnosa",
  },
  {
    id: "DG-004",
    title: "Gastritis Akut",
    subtitle: "Diagnosa • ICD-10: K29",
    type: "diagnosa",
    href: "/rekam-medis/riwayat",
    meta: "2 pasien terdiagnosa",
  },
  {
    id: "DG-005",
    title: "Demam Berdarah Dengue",
    subtitle: "Diagnosa • ICD-10: A91",
    type: "diagnosa",
    href: "/rekam-medis/riwayat",
    meta: "1 pasien terdiagnosa",
  },
];

/**
 * Mock API untuk pencarian dengan delay simulasi
 */
export async function mockSearch(query: string): Promise<SearchResult[]> {
  // Simulasi network delay (200–500ms)
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 300 + 200)
  );

  if (!query || query.trim() === "") {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return DUMMY_DATA.filter((item) => {
    return (
      item.title.toLowerCase().includes(lowerQuery) ||
      item.subtitle.toLowerCase().includes(lowerQuery) ||
      (item.meta && item.meta.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Label dan urutan kategori untuk grouping
 */
export const TYPE_CONFIG: Record<
  SearchResultType,
  { label: string; order: number }
> = {
  pasien: { label: "Pasien", order: 1 },
  dokter: { label: "Dokter", order: 2 },
  perawat: { label: "Perawat", order: 3 },
  "rekam-medis": { label: "Rekam Medis", order: 4 },
  diagnosa: { label: "Diagnosa", order: 5 },
};
