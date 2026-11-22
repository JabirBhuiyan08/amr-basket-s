import nodemailer from "nodemailer";

export type OrderEmailItem = {
    name: string;
    quantity: number;
    price: number | string;
};

export type OrderConfirmation = {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    totalAmount: number | string;
    paymentMethod?: string | null;
    items: OrderEmailItem[];
};

const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const money = (value: number | string) => `৳${Number(value).toFixed(2)}`;

const getMailConfig = () => {
    const user = process.env.SMTP_USER || process.env.APP_USER;
    const pass = process.env.SMTP_PASS || process.env.APP_PASS;

    if (!user || !pass || user === "your_email@gmail.com" || pass === "your_app_password") {
        return null;
    }

    const port = Number(process.env.SMTP_PORT || 587);
    return {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port,
        secure: process.env.SMTP_SECURE === "true" || port === 465,
        auth: { user, pass },
        from: process.env.MAIL_FROM || `CommerceHub <${user}>`,
    };
};

export const sendOrderConfirmationEmail = async (order: OrderConfirmation) => {
    const config = getMailConfig();
    if (!config) {
        console.warn("Order confirmation email not sent: SMTP credentials are not configured.");
        return { sent: false, reason: "not-configured" as const };
    }

    const itemRows = order.items.map((item) => `
        <tr>
            <td style="padding:8px 0">${escapeHtml(item.name)} × ${item.quantity}</td>
            <td style="padding:8px 0;text-align:right">${money(Number(item.price) * item.quantity)}</td>
        </tr>`).join("");

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
        connectionTimeout: 5_000,
        greetingTimeout: 5_000,
        socketTimeout: 10_000,
    });

    await transporter.sendMail({
        from: config.from,
        to: order.customerEmail,
        cc: process.env.ORDER_NOTIFICATION_EMAIL || undefined,
        subject: `Order received: ${order.orderNumber}`,
        text: `Hi ${order.customerName}, we received your order ${order.orderNumber}. Total: ${money(order.totalAmount)}.`,
        html: `
            <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:600px;margin:auto">
                <h2>Thanks for your order, ${escapeHtml(order.customerName)}!</h2>
                <p>We've received order <strong>${escapeHtml(order.orderNumber)}</strong> and will notify you as it progresses.</p>
                <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb">
                    <tbody>${itemRows}</tbody>
                </table>
                <p style="text-align:right"><strong>Total: ${money(order.totalAmount)}</strong></p>
                <p>Payment method: ${escapeHtml(order.paymentMethod || "COD")}</p>
            </div>`,
    });

    return { sent: true as const };
};
