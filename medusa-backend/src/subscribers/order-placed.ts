import { EventBusService } from "@medusajs/medusa";

/**
 * Subscriber for order.placed event
 * Handles actions when an order is successfully placed
 */
export default async function orderPlacedHandler({ data, eventName, container }) {
  const orderService = container.resolve("orderService");
  const eventBusService: EventBusService = container.resolve("eventBusService");

  try {
    const order = await orderService.retrieve(data.id, {
      relations: ["customer", "items", "items.variant", "items.variant.product"],
    });

    console.log(`Order placed: ${order.id}`);

    // Check if order contains digital products
    const hasDigitalProducts = order.items.some(
      (item) => item.variant?.product?.metadata?.isDigital === true
    );

    if (hasDigitalProducts) {
      // Emit event to fulfill digital products
      await eventBusService.emit("order.digital_fulfillment_required", {
        id: order.id,
      });
    }

    // Send order confirmation email
    // This will be handled by the email plugin
    console.log(`Order confirmation email should be sent to: ${order.customer.email}`);
  } catch (error) {
    console.error("Error in order.placed subscriber:", error);
  }
}

export const config = {
  event: "order.placed",
  context: {
    subscriberId: "order-placed-handler",
  },
};

