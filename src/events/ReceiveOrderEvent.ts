export type ReceiveOrderEvent = {
  orderID: number;
};

export const isReceiveOrderEvent = (event: any): event is ReceiveOrderEvent => {
  return Number.isInteger(Number.parseInt(event?.orderID));
};
