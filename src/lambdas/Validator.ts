import { createErrorEvent } from "../events/ErrorEvent";
import {
  EnrichedPayrollRunInput,
  EnrichedPayrollRunInputTuple,
  isCorrectionRun,
} from "../types/PayrollRunInput";

export const handler = async (event: EnrichedPayrollRunInput) => {
  console.log("INPUT = " + JSON.stringify(event));

  if (
    event.payrollRunData.every(
      (tuple: EnrichedPayrollRunInputTuple) => !tuple.import_id?.length
    )
  ) {
    throw createErrorEvent("Invalid Input - import_id");
  }

  if (
    event.payrollRunData.every((tuple: EnrichedPayrollRunInputTuple) =>
      isCorrectionRun(event.runType)
        ? !tuple.roster_id?.length
        : tuple.roster_id?.length
    )
  ) {
    throw createErrorEvent(
      `Invalid Input - roster_id for runType = ${event.runType}`
    );
  }

  try {
    const response = <EnrichedPayrollRunInput>event;

    console.log("Returning response " + JSON.stringify(response));

    return response;
  } catch (error) {
    throw createErrorEvent("Unknown Error");
  }
};
