const CALLMEBOT_ENDPOINT = "https://api.callmebot.com/whatsapp.php";

export const sendNewOrderWhatsAppNotification = async () => {
    const phone = process.env.CALLMEBOT_PHONE;
    const apiKey = process.env.CALLMEBOT_API_KEY;

    if (!phone || !apiKey) {
        console.warn("WhatsApp order notification not sent: CallMeBot is not configured.");
        return { sent: false, reason: "not-configured" as const };
    }

    const url = new URL(CALLMEBOT_ENDPOINT);
    url.searchParams.set("phone", phone);
    url.searchParams.set("text", "You have new Order-check the admin panel.");
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
        throw new Error(`CallMeBot responded with HTTP ${response.status}`);
    }

    return { sent: true as const };
};
