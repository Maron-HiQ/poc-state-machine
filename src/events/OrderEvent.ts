export type OrderEvent = {
  order: number;
  message: string;
  status?: number;
};

export const isOrderEvent = (event: any): event is OrderEvent => {
  return Number.isInteger(Number.parseInt(event?.order)) &&
    typeof event?.message === "string" &&
    event?.status
    ? Number.isInteger(event.status)
    : true;
};
