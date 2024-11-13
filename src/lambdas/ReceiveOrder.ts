import { createErrorEvent } from "../events/ErrorEvent";
import { OrderEvent } from "../events/OrderEvent";
import {
  ReceiveOrderEvent,
  isReceiveOrderEvent,
} from "../events/ReceiveOrderEvent";

export const handler = async (event: ReceiveOrderEvent) => {
  console.log("INPUT = " + JSON.stringify(event));

  if (!isReceiveOrderEvent(event)) {
    return createErrorEvent("Invalid Event");
  }

  try {
    const response = <OrderEvent>{
      order: event.orderID,
      message: `Order ${event.orderID} has been received ...`,
    };

    console.log("Returning response " + JSON.stringify(response));

    return response;
  } catch (error) {
    return createErrorEvent("Error creating response");
  }
};
