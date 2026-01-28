/**
 * Email Utility for Faroo E-commerce
 * For professional handover, integrate a service like Resend or SendGrid here.
 * Currently, this logs to the console as a placeholder.
 */

interface OrderNotification {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    trackingNumber?: string;
    courierName?: string;
}

export async function sendOrderConfirmationEmail(order: OrderNotification) {
    console.log(`[EMAIL] Sending Order Confirmation to ${order.customerEmail}`);
    console.log(`Subject: Your order ${order.orderNumber} is confirmed!`);
    console.log(`Body: Hello ${order.customerName}, Thank you for shopping with Faroo. Your order total is ৳${order.total.toLocaleString()}.`);

    // INTEGRATION HINT:
    // await resend.emails.send({
    //   from: 'Faroo <orders@faroo.com>',
    //   to: order.customerEmail,
    //   subject: `Order Confirmed: ${order.orderNumber}`,
    //   react: <OrderConfirmationEmail order={order} />,
    // });
}

export async function sendShippingUpdateEmail(order: OrderNotification) {
    console.log(`[EMAIL] Sending Shipping Update to ${order.customerEmail}`);
    console.log(`Subject: Your order ${order.orderNumber} has been shipped!`);
    console.log(`Body: Hello ${order.customerName}, Your order is on its way via ${order.courierName}. Tracking ID: ${order.trackingNumber}`);
}
