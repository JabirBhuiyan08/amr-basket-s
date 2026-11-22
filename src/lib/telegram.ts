type NewOrderTelegramNotification = {
    orderNumber: string;
    customerName: string;
    totalAmount: string;
    paymentMethod: string;
    items: Array<{ name: string; quantity: number; price: string }>;
};

type TelegramResponse = {
    ok: boolean;
    description?: string;
};

const TELEGRAM_API = "https://api.telegram.org";

export const sendNewOrderTelegramNotification = async (order: NewOrderTelegramNotification) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_STAFF_CHAT_ID;

    if (!token || !chatId) {
        console.warn("Telegram order notification not sent: bot token or staff chat ID is not configured.");
        return { sent: false as const, reason: "not-configured" as const };
    }

    const itemLines = order.items.slice(0, 20).map((item) =>
        `• ${item.name} × ${item.quantity} — ৳${(Number(item.price) * item.quantity).toFixed(2)}`,
    );
    if (order.items.length > itemLines.length) {
        itemLines.push(`• And ${order.items.length - itemLines.length} more item(s)`);
    }

    const message = [
        "🛍 New order received",
        `Order: ${order.orderNumber}`,
        `Customer: ${order.customerName}`,
        `Payment: ${order.paymentMethod}`,
        "",
        ...itemLines,
        "",
        `Total: ৳${Number(order.totalAmount).toFixed(2)}`,
    ].join("\n").slice(0, 4096);

    const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
        signal: AbortSignal.timeout(10_000),
    });

    const result = await response.json() as TelegramResponse;
    if (!response.ok || !result.ok) {
        throw new Error(`Telegram Bot API rejected the order notification: ${result.description || response.statusText}`);
    }

    return { sent: true as const };
};
