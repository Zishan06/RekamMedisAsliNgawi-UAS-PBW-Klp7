/**
 * components/medical-record/index.ts
 * Barrel export untuk semua Medical Record components.
 */

export { PatientDetailHeader } from "./PatientDetailHeader";
export { PatientInfoCard }     from "./PatientInfoCard";
export { MedicalTimeline }     from "./MedicalTimeline";
export { SOAPModal }           from "./SOAPModal";
export { AddRecordForm }       from "./AddRecordForm";

// Data
export {
  PATIENT_DETAILS,
  REKAM_MEDIS,
  DEFAULT_PATIENT_DETAIL,
  getPatientDetail,
  getRekamMedis,
} from "./data";
