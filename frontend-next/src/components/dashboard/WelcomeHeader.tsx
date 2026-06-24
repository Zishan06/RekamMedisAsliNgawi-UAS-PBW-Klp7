"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

/* ─────────────────────────────────────────────
   Helper: greeting dinamis
───────────────────────────────────────────── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

/* ─────────────────────────────────────────────
   Welcome Header Component
───────────────────────────────────────────── */
const USER_NAME = "dr. Budi Santoso";
const USER_ROLE = "Dokter Umum · RSUD Ngawi";

export function WelcomeHeader() {
  const now   = useMemo(() => new Date(), []);
  const hari  = format(now, "EEEE", { locale: localeId });      // "Senin"
  const tanggal = format(now, "d MMMM yyyy", { locale: localeId }); // "16 Juni 2026"
  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 lg:p-8"
      style={{
        background: "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-600) 60%, #3b82f6 100%)",
      }}
    >
      {/* Decorative geometric pattern — Javanese-inspired subtle motif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Branding SVG Background Pattern — screen blend on blue background shows pattern as lighter texture */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            backgroundImage: "url('/patterns/bg-pattern.svg')", 
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            opacity: 0.12,
            mixBlendMode: 'screen'
          }}
        />

        {/* Fine geometric diagonal lines */}
        <div 
          className="absolute top-0 right-[30%] w-px h-full bg-white opacity-[0.06] rotate-12"
        />
        <div 
          className="absolute top-0 right-[25%] w-px h-full bg-white opacity-[0.03] rotate-12"
        />

        {/* Diamond motif row — bottom right */}
        <div className="absolute bottom-5 right-8 flex gap-2 opacity-30">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rotate-45"
              style={{
                background: i === 1 
                  ? "var(--color-earth-300)" 
                  : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
        
        {/* Terracotta accent strip */}
        <div
          className="absolute top-0 right-0 w-2 h-full opacity-80"
          style={{ background: "linear-gradient(to bottom, var(--color-earth-500), var(--color-earth-300))" }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-primary-200 text-sm font-medium mb-1">
            {greeting} 👋
          </p>
          <h1
            className="text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {USER_NAME}
          </h1>
          <p className="text-primary-200 text-sm mt-1">{USER_ROLE}</p>
        </div>

        {/* Date card */}
        <div
          className="flex-shrink-0 self-start sm:self-auto px-5 py-3 rounded-xl text-right"
          style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
        >
          <p className="text-white text-xs font-medium opacity-70 uppercase tracking-widest mb-1">
            {hari}
          </p>
          <p className="text-white text-base font-bold leading-tight">
            {tanggal}
          </p>
          <p className="text-primary-200 text-xs mt-1 opacity-80">
            Ringkasan operasional hari ini
          </p>
        </div>
      </div>
    </motion.div>
  );
}
