import { createErrorEvent } from "../events/ErrorEvent";
import { EnrichedPayrollRunInputTuple } from "../types/PayrollRunInput";

export const handler = async (event: EnrichedPayrollRunInputTuple[]) => {
  let SUCCESSES = 0;

  event.forEach((tuple: EnrichedPayrollRunInputTuple) => {
    if (!tuple.payrollPeriod?.length) {
      console.error("NO PAYROLL PERIOD");
      return;
    }

    if (!tuple.import_id?.length) {
      console.error("NO IMPORT_ID");
      return;
    }

    // Pricing logic
    SUCCESSES = SUCCESSES + (Math.random() <= 0.25 ? 0 : 1);
  });

  if (!SUCCESSES) {
    console.error("NO SUCESSES");
    return [];
  }

  try {
    const response = <EnrichedPayrollRunInputTuple[]>event;

    return response;
  } catch (error) {
    throw createErrorEvent("Unknown Error");
  }
};
