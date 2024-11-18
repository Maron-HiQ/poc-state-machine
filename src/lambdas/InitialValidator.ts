import { createErrorEvent } from "../events/ErrorEvent";
import {
  isValidCompany,
  isValidPayrollRunType,
  PayrollRunInput,
  PayrollRunInputTuple,
} from "../types/PayrollRunInput";

export const handler = async (event: PayrollRunInput) => {
  console.log("INPUT = " + JSON.stringify(event));

  if (!event.payrollRunData?.length) {
    throw createErrorEvent("Invalid Input - payroll run data");
  }

  if (!isValidCompany(event.company)) {
    throw createErrorEvent("Invalid Input - company");
  }

  if (!isValidPayrollRunType(event.runType)) {
    throw createErrorEvent("Invalid Input - runType");
  }

  if (
    event.payrollRunData.every(
      (tuple: PayrollRunInputTuple) => !tuple.employeeId?.length
    )
  ) {
    throw createErrorEvent("Invalid Input - payroll run data - no employeeId");
  }

  if (
    event.payrollRunData.every(
      (tuple: PayrollRunInputTuple) => !tuple.payrollPeriod?.length
    )
  ) {
    throw createErrorEvent(
      "Invalid Input - payroll run data - no payrollPeriod"
    );
  }

  try {
    const response = <PayrollRunInput>event;

    console.log("Returning response " + JSON.stringify(response));

    return event;
  } catch (error) {
    throw createErrorEvent("Unknown Error");
  }
};

// const tupple_1 = <PayrollRunInputTuple>{
//   employeeId: `XXX${+new Date()}`,
//   payrollPeriod: "2024-01",
// };

// const EMPTY_DATA = {
//   company: "FINNAIR" as any,
//   runType: "BASELINE_RUN" as any,
//   payrollRunData: [] as any[],
// };

// const INVALID_COMPANY = {
//   company: "RYANAIR" as any,
//   runType: "BASELINE_RUN" as any,
//   payrollRunData: [tupple_1] as any[],
// };

// const INVALID_RUNTYPE = {
//   company: "FINNAIR" as any,
//   runType: "UNKNOWN_RUN" as any,
//   payrollRunData: [tupple_1] as any[],
// };

// const VALID_PAYROLL_RUN = {
//   company: "FINNAIR" as any,
//   runType: "BASELINE_RUN" as any,
//   payrollRunData: [tupple_1] as any[],
// };

// (async () => {
//   console.debug("----- EMPTY DATA (FAIL)\n");
//   console.debug(
//     "\nRESULT: " + JSON.stringify(await handler(EMPTY_DATA), null, 4)
//   );

//   console.debug("\n----- INVALID COMPANY (FAIL)\n");
//   console.debug(
//     "\nRESULT: " + JSON.stringify(await handler(INVALID_COMPANY), null, 4)
//   );

//   console.debug("\n----- INVALID RUNTYPE (FAIL)\n");
//   console.debug(
//     "\nRESULT: " + JSON.stringify(await handler(INVALID_RUNTYPE), null, 4)
//   );

//   console.debug("\n----- VALID PAYROLL RUN (SUCCESS)\n");
//   console.debug(
//     "\nRESULT: " + JSON.stringify(await handler(VALID_PAYROLL_RUN), null, 4)
//   );
// })();
