"use client";

import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { JenisKelamin, StatusPasien } from "./data";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export interface FilterState {
  query: string;
  jenisKelamin: JenisKelamin | "";
  status: StatusPasien | "";
  umurMin: string;
  umurMax: string;
}

interface PatientSearchFilterProps {
  filter: FilterState;
  onFilterChange: (next: FilterState) => void;
}

/* ─────────────────────────────────────────────
   SelectField helper
───────────────────────────────────────────── */
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm",
            "bg-neutral-50 border border-neutral-200",
            "text-neutral-800",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
            "focus:bg-surface-card transition-all duration-200",
            "cursor-pointer",
            value === "" && "text-neutral-400"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PatientSearchFilter
───────────────────────────────────────────── */
export function PatientSearchFilter({
  filter,
  onFilterChange,
}: PatientSearchFilterProps) {
  const setField =
    <K extends keyof FilterState>(key: K) =>
    (value: FilterState[K]) =>
      onFilterChange({ ...filter, [key]: value });

  const hasActiveFilters =
    filter.jenisKelamin !== "" ||
    filter.status !== "" ||
    filter.umurMin !== "" ||
    filter.umurMax !== "";

  const resetFilters = () =>
    onFilterChange({
      query: filter.query,
      jenisKelamin: "",
      status: "",
      umurMin: "",
      umurMax: "",
    });

  return (
    <div
      className="rounded-2xl bg-surface-card border border-neutral-200 p-5 space-y-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* ── Search ────────────────────────────── */}
      <div className="relative group">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors"
        />
        <input
          type="text"
          id="patient-search"
          value={filter.query}
          onChange={(e) => setField("query")(e.target.value)}
          placeholder="Cari nama, No. RM, atau NIK pasien..."
          className={cn(
            "w-full pl-10 pr-10 py-2.5 rounded-xl text-sm",
            "bg-neutral-50 border border-neutral-200",
            "text-neutral-800 placeholder:text-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
            "focus:bg-surface-card transition-all duration-200"
          )}
        />
        {filter.query && (
          <button
            onClick={() => setField("query")("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Hapus pencarian"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Filters Row ────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* Filter label */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 mb-0.5 self-end pb-2.5">
          <SlidersHorizontal size={14} />
          <span className="uppercase tracking-wider">Filter</span>
        </div>

        {/* Jenis Kelamin */}
        <div className="min-w-[160px] flex-1">
          <SelectField
            label="Jenis Kelamin"
            value={filter.jenisKelamin}
            onChange={(v) => setField("jenisKelamin")(v as JenisKelamin | "")}
            placeholder="Semua"
            options={[
              { value: "Laki-laki", label: "Laki-laki" },
              { value: "Perempuan", label: "Perempuan" },
            ]}
          />
        </div>

        {/* Status */}
        <div className="min-w-[160px] flex-1">
          <SelectField
            label="Status Pasien"
            value={filter.status}
            onChange={(v) => setField("status")(v as StatusPasien | "")}
            placeholder="Semua Status"
            options={[
              { value: "Aktif", label: "Aktif" },
              { value: "Rawat Jalan", label: "Rawat Jalan" },
              { value: "Rawat Inap", label: "Rawat Inap" },
            ]}
          />
        </div>

        {/* Rentang Umur */}
        <div className="min-w-[200px] flex-1">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Rentang Umur
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={120}
              placeholder="Min"
              value={filter.umurMin}
              onChange={(e) => setField("umurMin")(e.target.value)}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-sm text-center",
                "bg-neutral-50 border border-neutral-200",
                "text-neutral-800 placeholder:text-neutral-400",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
                "focus:bg-surface-card transition-all duration-200 [appearance:textfield]",
                "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
            />
            <span className="text-neutral-400 text-sm flex-shrink-0">–</span>
            <input
              type="number"
              min={0}
              max={120}
              placeholder="Max"
              value={filter.umurMax}
              onChange={(e) => setField("umurMax")(e.target.value)}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-sm text-center",
                "bg-neutral-50 border border-neutral-200",
                "text-neutral-800 placeholder:text-neutral-400",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400",
                "focus:bg-surface-card transition-all duration-200 [appearance:textfield]",
                "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
            />
          </div>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium self-end",
              "bg-danger-light text-danger border border-danger-light/60",
              "hover:bg-danger hover:text-white transition-all duration-200"
            )}
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
