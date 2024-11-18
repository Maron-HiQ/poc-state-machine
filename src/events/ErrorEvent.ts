export const UNKNOWN_ERROR_MESSAGE = "Unknown Error";

export class ErrorEvent extends Error {}

export const isOrderEvent = (event: any): event is ErrorEvent => {
  return typeof event?.message === "string";
};

export const createErrorEvent = (
  message: string,
  log: boolean = true
): ErrorEvent => {
  if (log) {
    console.error(message ?? UNKNOWN_ERROR_MESSAGE);
  }

  return new ErrorEvent(message);
};
