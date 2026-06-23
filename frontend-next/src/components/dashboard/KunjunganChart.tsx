"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { ChartDataPoint } from "./data";

/* ─────────────────────────────────────────────
   Custom Tooltip
───────────────────────────────────────────── */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-neutral-200 p-3 shadow-lg"
      style={{
        background: "var(--color-surface-card)",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
      }}
    >
      <p className="font-semibold text-neutral-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-neutral-500">{p.name}</span>
          </div>
          <span className="font-semibold text-neutral-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Kunjungan Chart Component
───────────────────────────────────────────── */
export function KunjunganChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6 shadow-[0_2px_8px_0_rgb(0_0_0/0.05)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <div 
            className="absolute -left-4 -top-4 w-20 h-20 pointer-events-none opacity-[0.03]"
            style={{ 
              backgroundImage: "url('/patterns/gemini-pattern.svg')", 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10">
            <h2
              className="text-base font-bold text-neutral-900"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Tren Kunjungan Pasien
            </h2>
            <div className="flex items-center gap-1.5 mt-1 mb-1.5 opacity-80">
              <span className="text-[10px] leading-none text-primary-600">◇</span>
              <div className="h-[1px] w-12 bg-neutral-200" />
            </div>
            <p className="text-xs text-neutral-400">7 hari terakhir</p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="hidden sm:flex items-center gap-3">
          {[
            { label: "Rawat Jalan", color: "#2563eb" },
            { label: "Rawat Inap",  color: "#d96430" },
            { label: "UGD",         color: "#059669" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-neutral-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gradRawatJalan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradRawatInap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#d96430" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#d96430" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradUGD" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#059669" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="hari"
            tick={{ fill: "#9ca3af", fontSize: 12, fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12, fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="rawatJalan"
            name="Rawat Jalan"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="url(#gradRawatJalan)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="rawatInap"
            name="Rawat Inap"
            stroke="#d96430"
            strokeWidth={2.5}
            fill="url(#gradRawatInap)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="ugd"
            name="UGD"
            stroke="#059669"
            strokeWidth={2.5}
            fill="url(#gradUGD)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
