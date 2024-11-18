import { createErrorEvent } from "../events/ErrorEvent";
import {
  EnrichedPayrollRunInput,
  EnrichedPayrollRunInputTuple,
  isCorrectionRun,
  PayrollRunInputTuple,
  SlicedPayrollRunInput,
} from "../types/PayrollRunInput";

export const handler = async (event: EnrichedPayrollRunInput) => {
  console.log("INPUT = " + JSON.stringify(event));

  const payrollPeriods = new Array(
    ...new Set(
      event.payrollRunData.map(
        (tuple: EnrichedPayrollRunInputTuple) => tuple.payrollPeriod
      )
    )
  );
  payrollPeriods.sort();

  const payrollRunData = event.payrollRunData.slice(
    0
  ) as EnrichedPayrollRunInputTuple[];

  const slicedPayrolldata = payrollPeriods.map((payrollPeriod: string) =>
    payrollRunData.filter(
      (tuple: EnrichedPayrollRunInputTuple) =>
        tuple.payrollPeriod === payrollPeriod
    )
  );

  try {
    const response = <SlicedPayrollRunInput>{
      ...event,
      payrollRunData: slicedPayrolldata,
    };

    console.log("Returning response " + JSON.stringify(response));

    return response;
  } catch (error) {
    throw createErrorEvent("Unknown Error");
  }
};

// const ID_1 = `XXX${+new Date()}`;

// const tuple_1 = <EnrichedPayrollRunInputTuple>{
//   employeeId: ID_1,
//   payrollPeriod: "2024-01",
// };

// const tuple_2 = <EnrichedPayrollRunInputTuple>{
//   employeeId: `ID_1 + 2`,
//   payrollPeriod: "2024-01",
// };

// const tuple_3 = <EnrichedPayrollRunInputTuple>{
//   employeeId: `ID_1 + 3`,
//   payrollPeriod: "2024-02",
// };

// const tuple_4 = <EnrichedPayrollRunInputTuple>{
//   employeeId: `ID_1 + 4`,
//   payrollPeriod: "",
// };

// const VALID_SIMPLE_PAYROLL_RUN = {
//   company: "FINNAIR" as any,
//   runType: "BASELINE_RUN" as any,
//   createdAt: new Date(),
//   createdBy: ID_1,
//   runId: "RUN_ID",
//   metadata: {
//     VERSION: "0.1",
//   },
//   payrollRunData: [tuple_1] as any[],
// };

// const VALID_COMPLEX_PAYROLL_RUN = {
//   company: "FINNAIR" as any,
//   runType: "BASELINE_RUN" as any,
//   createdAt: new Date(),
//   createdBy: ID_1,
//   runId: "RUN_ID",
//   metadata: {
//     VERSION: "0.1",
//   },
//   payrollRunData: [tuple_1, tuple_2, tuple_3, tuple_4] as any[],
// };

// (async () => {
//   console.debug("\n----- VALID SIMPLE PAYROLL RUN (SUCCESS)\n");
//   console.debug(
//     "\nRESULT: " +
//       JSON.stringify(await handler(VALID_SIMPLE_PAYROLL_RUN), null, 4)
//   );

//   console.debug("\n----- VALID COMPLEX PAYROLL RUN (SUCCESS)\n");
//   console.debug(
//     "\nRESULT: " +
//       JSON.stringify(await handler(VALID_COMPLEX_PAYROLL_RUN), null, 4)
//   );
// })();
