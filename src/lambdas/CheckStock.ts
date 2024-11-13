import { createErrorEvent } from "../events/ErrorEvent";
import { OrderEvent, isOrderEvent } from "../events/OrderEvent";

export const MIN_STOCK = 0;
export const MAX_STOCK = 1;

export const handler = async (event: OrderEvent) => {
  console.log("Function loaded sucessfully");

  if (!isOrderEvent(event)) {
    return createErrorEvent("Invalid Event");
  }

  try {
    console.log("Checking stock");

    // Generate a random number to determine there is stock if the products
    const stockStatus =
      Math.floor(Math.random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;

    const response = <OrderEvent>{
      order: event.order,
      status: stockStatus,
      message: stockStatus
        ? "Products are in stock"
        : "Products are out of stock",
    };

    console.log("Returning response " + JSON.stringify(response));

    return response;
  } catch (error) {
    return createErrorEvent("Error creating response");
  }
};
