import { createErrorEvent } from "../events/ErrorEvent";
import {
  EnrichedPayrollRunInput,
  EnrichedPayrollRunInputTuple,
  PayrollRunInput,
  PayrollRunInputTuple,
} from "../types/PayrollRunInput";

export const handler = async (event: PayrollRunInput) => {
  console.log("INPUT = " + JSON.stringify(event));

  const enrichedEvent = <EnrichedPayrollRunInput>{ ...event };

  // Metadata
  const metaData = { version: "0.1" };
  enrichedEvent.metadata = metaData;

  // Other static fields fields
  enrichedEvent.createdAt = new Date();
  enrichedEvent.createdBy = `XXX${+new Date()}`;
  enrichedEvent.runId = `${enrichedEvent.createdAt}-${enrichedEvent.company}-${enrichedEvent.createdBy}`;

  // HERE WE DO THE QUERYES FOR THE DATA
  console.log(`Querying for import_id`);
  console.log(`Querying for roster_id`);

  // Fields per tuple
  enrichedEvent.payrollRunData = enrichedEvent.payrollRunData.map(
    (tuple: PayrollRunInputTuple) => {
      const enrichedTuple = <EnrichedPayrollRunInputTuple>{
        employeeId: tuple.employeeId,
        payrollPeriod: tuple.payrollPeriod,
        import_id: Math.random() >= 0.1 ? `import-${tuple.employeeId}` : "",
        roster_id: Math.random() >= 0.1 ? `roster-${tuple.employeeId}` : "",
      };

      return enrichedTuple;
    }
  );

  try {
    const response = <EnrichedPayrollRunInput>enrichedEvent;

    console.log("Returning response " + JSON.stringify(response));

    return response;
  } catch (error) {
    throw createErrorEvent("Unknown Error");
  }
};
