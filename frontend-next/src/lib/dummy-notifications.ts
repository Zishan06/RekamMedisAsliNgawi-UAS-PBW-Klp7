/**
 * dummy-notifications.ts — Dummy Data untuk Notifikasi
 * Diperkaya dengan lebih banyak data, kategori, dan metadata.
 */

export type NotificationType = "info" | "success" | "warning" | "alert";
export type NotificationCategory =
  | "pasien"
  | "rekam-medis"
  | "jadwal"
  | "evaluasi"
  | "kunjungan"
  | "sistem";

export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  timestamp: string; // ISO format
  isRead: boolean;
  type: NotificationType;
  category: NotificationCategory;
  href?: string;
  actor?: string; // Siapa yang melakukan aksi
}

const now = Date.now();

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // ── Belum Dibaca ─────────────────────────────────────────────────
  {
    id: "notif-001",
    title: "Pasien Baru Terdaftar",
    summary:
      "Pasien bernama Budi Santoso (RM-2026-001) baru saja terdaftar di Poli Umum.",
    timestamp: new Date(now - 1000 * 60 * 3).toISOString(), // 3 menit
    isRead: false,
    type: "info",
    category: "pasien",
    href: "/pasien",
    actor: "Resepsionis",
  },
  {
    id: "notif-002",
    title: "Rekam Medis Diperbarui",
    summary:
      "dr. Andi Pratama memperbarui diagnosa untuk RM-2026-002 menjadi Hipertensi Esensial (I10).",
    timestamp: new Date(now - 1000 * 60 * 28).toISOString(), // 28 menit
    isRead: false,
    type: "success",
    category: "rekam-medis",
    href: "/rekam-medis/riwayat",
    actor: "dr. Andi Pratama",
  },
  {
    id: "notif-003",
    title: "Jadwal Dokter Berubah",
    summary:
      "Jadwal praktek dr. Ratna Mutiara, Sp.PD diundur 30 menit menjadi pukul 09.30 hari ini.",
    timestamp: new Date(now - 1000 * 60 * 45).toISOString(), // 45 menit
    isRead: false,
    type: "warning",
    category: "jadwal",
    href: "/tenaga-medis/dokter",
    actor: "Sistem Jadwal",
  },
  {
    id: "notif-006",
    title: "Kunjungan Baru Masuk",
    summary:
      "Pasien Siti Aminah (RM-2026-002) telah check-in di Poli Penyakit Dalam. Antrean nomor B-03.",
    timestamp: new Date(now - 1000 * 60 * 90).toISOString(), // 1.5 jam
    isRead: false,
    type: "info",
    category: "kunjungan",
    href: "/rekam-medis/kunjungan",
    actor: "Sistem Antrean",
  },
  {
    id: "notif-007",
    title: "Laporan Bulanan Tersedia",
    summary:
      "Laporan statistik kunjungan bulan Mei 2026 telah selesai digenerate dan siap diunduh.",
    timestamp: new Date(now - 1000 * 60 * 60 * 3).toISOString(), // 3 jam
    isRead: false,
    type: "success",
    category: "sistem",
    href: "/laporan/statistik",
    actor: "Sistem Laporan",
  },
  // ── Sudah Dibaca ─────────────────────────────────────────────────
  {
    id: "notif-004",
    title: "Antrean Dipanggil",
    summary:
      "Antrean nomor A-05 atas nama Andi Saputra telah dipanggil ke Ruang Periksa 1.",
    timestamp: new Date(now - 1000 * 60 * 60 * 6).toISOString(), // 6 jam
    isRead: true,
    type: "info",
    category: "kunjungan",
    href: "/rekam-medis/kunjungan",
    actor: "Sistem Antrean",
  },
  {
    id: "notif-005",
    title: "Evaluasi Tenaga Medis",
    summary:
      "Mohon segera melengkapi form evaluasi kinerja perawat periode Juni 2026. Batas waktu: 30 Juni 2026.",
    timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(), // 1 hari
    isRead: true,
    type: "alert",
    category: "evaluasi",
    href: "/laporan/evaluasi",
    actor: "Manajemen",
  },
  {
    id: "notif-008",
    title: "Perawat Baru Terdaftar",
    summary:
      "Perawat baru atas nama Maria Ulfa, Amd.Kep telah terdaftar dalam sistem dan ditugaskan ke Poli Umum.",
    timestamp: new Date(now - 1000 * 60 * 60 * 36).toISOString(), // 1.5 hari
    isRead: true,
    type: "success",
    category: "pasien",
    href: "/tenaga-medis/perawat",
    actor: "Admin",
  },
  {
    id: "notif-009",
    title: "Pemeliharaan Sistem",
    summary:
      "Sistem akan mengalami maintenance terjadwal pada Minggu, 29 Juni 2026 pukul 02.00–04.00 WIB.",
    timestamp: new Date(now - 1000 * 60 * 60 * 48).toISOString(), // 2 hari
    isRead: true,
    type: "warning",
    category: "sistem",
    href: undefined,
    actor: "Tim IT",
  },
  {
    id: "notif-010",
    title: "Data Pasien Dilengkapi",
    summary:
      "Data rekam medis Budi Santoso (RM-2026-001) telah dilengkapi dengan foto dan identitas terbaru.",
    timestamp: new Date(now - 1000 * 60 * 60 * 72).toISOString(), // 3 hari
    isRead: true,
    type: "success",
    category: "rekam-medis",
    href: "/pasien",
    actor: "Petugas Rekam Medis",
  },
];
