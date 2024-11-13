export const UNKNOWN_ERROR_MESSAGE = "Unknown Error";

export type ErrorEvent = {
  error: string;
};

export const isOrderEvent = (event: any): event is ErrorEvent => {
  return typeof event?.error === "string";
};

export const createErrorEvent = (
  message: string,
  log: boolean = true
): ErrorEvent => {
  if (log) {
    console.error(message ?? UNKNOWN_ERROR_MESSAGE);
  }

  return <ErrorEvent>{
    error: message ?? UNKNOWN_ERROR_MESSAGE,
  };
};
