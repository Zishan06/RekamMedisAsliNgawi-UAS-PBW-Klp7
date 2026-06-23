"use client";

/**
 * lib/patient-store.tsx
 *
 * Global mock state untuk manajemen pasien.
 * Menggunakan React Context + useReducer.
 * Data diinisialisasi dari DAFTAR_PASIEN (dummy data),
 * sehingga pasien yang baru ditambah langsung muncul di daftar.
 *
 * Create ✓  Read ✓  Update (placeholder) ✓  Delete (placeholder) ✓
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { DAFTAR_PASIEN } from "@/components/patient/data";
import type { Pasien } from "@/components/patient/data";
import { PATIENT_DETAILS } from "@/components/medical-record/data";
import type { PasienDetail } from "@/components/medical-record/data";
import { format } from "date-fns";
import { differenceInYears, parseISO } from "date-fns";

/* ─────────────────────────────────────────────
   State Shape
───────────────────────────────────────────── */
export interface PatientState {
  patients: Pasien[];
  /** Keyed by patient id — stores extended detail for each patient */
  details: Record<string, PasienDetail>;
  totalRegistered: number; // counter for RM number generation
}

/* ─────────────────────────────────────────────
   Actions
───────────────────────────────────────────── */
export type PatientAction =
  | { type: "ADD_PATIENT"; payload: NewPatientInput }
  | { type: "UPDATE_PATIENT"; payload: Partial<Pasien> & { id: string } }
  | { type: "DELETE_PATIENT"; payload: { id: string } };

/* ─────────────────────────────────────────────
   New patient form input type
───────────────────────────────────────────── */
export interface NewPatientInput {
  namaLengkap: string;
  nik: string;
  tanggalLahir: string;     // "YYYY-MM-DD"
  jenisKelamin: "Laki-laki" | "Perempuan";
  golonganDarah: string;
  noTelp: string;
  alamat: string;
  kontakDaruratNama: string;
  kontakDaruratHubungan: string;
  kontakDaruratNoTelp: string;
}

/* ─────────────────────────────────────────────
   Helper — Generate RM Number
───────────────────────────────────────────── */
function generateRM(counter: number): string {
  const year = new Date().getFullYear();
  const seq  = String(counter).padStart(4, "0");
  return `RM-${year}-${seq}`;
}

/* ─────────────────────────────────────────────
   Initial State
───────────────────────────────────────────── */
const INITIAL_STATE: PatientState = {
  patients: [...DAFTAR_PASIEN],
  details:  { ...PATIENT_DETAILS },
  totalRegistered: DAFTAR_PASIEN.length,
};

/* ─────────────────────────────────────────────
   Reducer
───────────────────────────────────────────── */
function patientReducer(state: PatientState, action: PatientAction): PatientState {
  switch (action.type) {
    case "ADD_PATIENT": {
      const inp = action.payload;
      const newCount = state.totalRegistered + 1;
      const newId    = `p${String(newCount).padStart(3, "0")}`;
      const noRM     = generateRM(newCount);
      const today    = format(new Date(), "yyyy-MM-dd");
      const umur     = differenceInYears(new Date(), parseISO(inp.tanggalLahir));

      // Base patient (for list)
      const newPasien: Pasien = {
        id:                 newId,
        noRM,
        nik:                inp.nik,
        nama:               inp.namaLengkap,
        jenisKelamin:       inp.jenisKelamin,
        umur,
        tanggalLahir:       inp.tanggalLahir,
        noTelp:             inp.noTelp,
        alamat:             inp.alamat,
        kunjunganTerakhir:  today,
        status:             "Aktif",
        poli:               "Poli Umum",
      };

      // Extended detail (for detail page)
      const newDetail: PasienDetail = {
        id:             newId,
        noRM,
        nik:            inp.nik,
        nama:           inp.namaLengkap,
        jenisKelamin:   inp.jenisKelamin,
        umur,
        tanggalLahir:   inp.tanggalLahir,
        golonganDarah:  inp.golonganDarah as PasienDetail["golonganDarah"],
        noTelp:         inp.noTelp,
        alamat:         inp.alamat,
        kunjunganTerakhir: today,
        status:         "Aktif",
        poli:           "Poli Umum",
        dokterPJ:       "Belum ditentukan",
        tanggalDaftar:  today,
        kontakDarurat:  {
          nama:     inp.kontakDaruratNama,
          hubungan: inp.kontakDaruratHubungan,
          noTelp:   inp.kontakDaruratNoTelp,
        },
        alergi:            [],
        riwayatPenyakit:   [],
      };

      return {
        ...state,
        patients:        [newPasien, ...state.patients],
        details:         { ...state.details, [newId]: newDetail },
        totalRegistered: newCount,
      };
    }

    case "UPDATE_PATIENT": {
      const { id, ...updates } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      };
    }

    case "DELETE_PATIENT": {
      return {
        ...state,
        patients: state.patients.filter((p) => p.id !== action.payload.id),
      };
    }

    default:
      return state;
  }
}

/* ─────────────────────────────────────────────
   Context
───────────────────────────────────────────── */
interface PatientContextValue {
  patients:    Pasien[];
  details:     Record<string, PasienDetail>;
  addPatient:  (input: NewPatientInput) => string; // returns new patient id
  updatePatient: (id: string, updates: Partial<Pasien>) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Pasien | undefined;
  getDetailById:  (id: string) => PasienDetail | undefined;
}

const PatientContext = createContext<PatientContextValue | null>(null);

/* ─────────────────────────────────────────────
   Provider
───────────────────────────────────────────── */
export function PatientStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(patientReducer, INITIAL_STATE);

  const addPatient = useCallback(
    (input: NewPatientInput): string => {
      const nextCount = state.totalRegistered + 1;
      const newId     = `p${String(nextCount).padStart(3, "0")}`;
      dispatch({ type: "ADD_PATIENT", payload: input });
      return newId;
    },
    [state.totalRegistered]
  );

  const updatePatient = useCallback(
    (id: string, updates: Partial<Pasien>) =>
      dispatch({ type: "UPDATE_PATIENT", payload: { id, ...updates } }),
    []
  );

  const deletePatient = useCallback(
    (id: string) => dispatch({ type: "DELETE_PATIENT", payload: { id } }),
    []
  );

  const getPatientById = useCallback(
    (id: string) => state.patients.find((p) => p.id === id),
    [state.patients]
  );

  const getDetailById = useCallback(
    (id: string) => state.details[id],
    [state.details]
  );

  const value = useMemo<PatientContextValue>(
    () => ({
      patients: state.patients,
      details:  state.details,
      addPatient,
      updatePatient,
      deletePatient,
      getPatientById,
      getDetailById,
    }),
    [state.patients, state.details, addPatient, updatePatient, deletePatient, getPatientById, getDetailById]
  );

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

/* ─────────────────────────────────────────────
   Hook
───────────────────────────────────────────── */
export function usePatientStore(): PatientContextValue {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error("usePatientStore must be used inside <PatientStoreProvider>");
  }
  return ctx;
}
