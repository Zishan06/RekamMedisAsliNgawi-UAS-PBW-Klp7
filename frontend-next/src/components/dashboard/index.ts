/**
 * components/dashboard/index.ts
 * Barrel export untuk semua Dashboard components.
 */

export { WelcomeHeader }        from "./WelcomeHeader";
export { StatsGrid }            from "./StatsGrid";
export { KunjunganChart }       from "./KunjunganChart";
export { AktivitasTerbaru }     from "./AktivitasTerbaru";
export { QuickActions }         from "./QuickActions";
export { RingkasanOperasional } from "./RingkasanOperasional";

// Data
export {
  STAT_CARDS,
  KUNJUNGAN_7_HARI,
  AKTIVITAS_TERBARU,
  RINGKASAN_OPERASIONAL,
} from "./data";
