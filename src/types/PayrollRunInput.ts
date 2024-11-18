import { MetadataEntry } from "constructs";

export enum COMPANY {
  FINNAIR = "FINNAIR",
  NORRA = "NORRA",
}

export const isValidCompany = (data: string): data is COMPANY => {
  return Object.keys(COMPANY).includes(data);
};

export enum PAYROLL_RUN_TYPE {
  INITIAL_RUN = "INITIAL_RUN",
  CORRECTION_RUN = "CORRECTION_RUN",
  SIMULATED_INITIAL_RUN = "SIMULATED_INITIAL_RUN",
  SIMULATED_CORRECTION_RUN = "SIMULATED_CORRECTION_RUN",
  BASELINE_RUN = "BASELINE_RUN",
}

export const isValidPayrollRunType = (
  data: string
): data is PAYROLL_RUN_TYPE => {
  return Object.keys(PAYROLL_RUN_TYPE).includes(data);
};

export const isCorrectionRun = (runType: PAYROLL_RUN_TYPE): boolean => {
  return (
    runType === PAYROLL_RUN_TYPE.CORRECTION_RUN ||
    runType === PAYROLL_RUN_TYPE.SIMULATED_CORRECTION_RUN
  );
};

export type PayrollRunInputTuple = {
  payrollPeriod: string;
  employeeId: string;
};

export type EnrichedPayrollRunInputTuple = PayrollRunInputTuple & {
  import_id: string;
  roster_id: string;
};

export type PayrollRunInput = {
  runType: PAYROLL_RUN_TYPE;
  company: COMPANY;
  payrollRunData?: PayrollRunInputTuple[];
};

export type EnrichedPayrollRunInput = PayrollRunInput & {
  payrollRunData: EnrichedPayrollRunInputTuple[];
  createdBy: string;
  createdAt: Date;
  runId: string;
  metadata: object;
};

export type SlicedPayrollRunInput = PayrollRunInput & {
  payrollRunData: EnrichedPayrollRunInputTuple[][];
  createdBy: string;
  createdAt: Date;
  runId: string;
  metadata: object;
};
