import { prisma } from "./prisma";
import { sendOrderConfirmationEmail, type OrderConfirmation } from "./order-mailer";
import { sendNewOrderTelegramNotification, type NewOrderTelegramNotification } from "./telegram";

const POLL_INTERVAL_MS = 5_000;
const BATCH_SIZE = 10;
const LOCK_DURATION_MS = 5 * 60_000;
const RETRY_BASE_MS = 30_000;
const RETRY_MAX_MS = 6 * 60 * 60_000;
const SENT_RETENTION_DAYS = 30;

let workerStarted = false;
let workerRunning = false;
let rerunRequested = false;
let lastCleanupAt = 0;

const deliver = async (channel: string, payload: unknown) => {
    if (channel === "EMAIL") {
        const result = await sendOrderConfirmationEmail(payload as OrderConfirmation);
        if (!result.sent) throw new Error(`Email was not sent: ${result.reason}`);
        return;
    }

    if (channel === "TELEGRAM") {
        const result = await sendNewOrderTelegramNotification(payload as NewOrderTelegramNotification);
        if (!result.sent) throw new Error(`Telegram message was not sent: ${result.reason}`);
        return;
    }

    throw new Error(`Unsupported notification channel: ${channel}`);
};

const processBatch = async () => {
    const now = new Date();
    const expiredLock = { status: "PROCESSING", OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }] };
    const entries = await prisma.notificationOutbox.findMany({
        where: {
            OR: [
                { status: "PENDING", nextAttemptAt: { lte: now } },
                expiredLock,
            ],
        },
        orderBy: { createdAt: "asc" },
        take: BATCH_SIZE,
    });

    for (const entry of entries) {
        const claimed = await prisma.notificationOutbox.updateMany({
            where: {
                id: entry.id,
                OR: [
                    { status: "PENDING", nextAttemptAt: { lte: new Date() } },
                    { status: "PROCESSING", OR: [{ lockedUntil: null }, { lockedUntil: { lt: new Date() } }] },
                ],
            },
            data: {
                status: "PROCESSING",
                attempts: { increment: 1 },
                lockedUntil: new Date(Date.now() + LOCK_DURATION_MS),
            },
        });
        if (!claimed.count) continue;

        const attempt = entry.attempts + 1;
        try {
            await deliver(entry.channel, entry.payload);
            await prisma.notificationOutbox.updateMany({
                where: { id: entry.id, status: "PROCESSING" },
                data: { status: "SENT", sentAt: new Date(), lockedUntil: null, lastError: null },
            });
            console.info(`Order ${entry.orderNumber}: ${entry.channel} notification delivered`);
        } catch (error) {
            const delay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * (2 ** Math.min(attempt - 1, 10)));
            const reason = error instanceof Error ? error.message : String(error);
            await prisma.notificationOutbox.updateMany({
                where: { id: entry.id, status: "PROCESSING" },
                data: {
                    status: "PENDING",
                    nextAttemptAt: new Date(Date.now() + delay),
                    lockedUntil: null,
                    lastError: reason.slice(0, 2_000),
                },
            });
            console.error(`Order ${entry.orderNumber}: ${entry.channel} notification attempt ${attempt} failed; retry scheduled.`, reason);
        }
    }

    if (Date.now() - lastCleanupAt > 60 * 60_000) {
        lastCleanupAt = Date.now();
        const retentionCutoff = new Date(Date.now() - SENT_RETENTION_DAYS * 24 * 60 * 60_000);
        await prisma.notificationOutbox.deleteMany({
            where: { status: "SENT", sentAt: { lt: retentionCutoff } },
        });
    }
};

export const processNotificationOutbox = async () => {
    if (workerRunning) {
        rerunRequested = true;
        return;
    }

    workerRunning = true;
    try {
        do {
            rerunRequested = false;
            await processBatch();
        } while (rerunRequested);
    } catch (error) {
        console.error("Notification outbox poll failed:", error);
    } finally {
        workerRunning = false;
    }
};

export const wakeNotificationOutbox = () => {
    void processNotificationOutbox();
};

export const startNotificationOutboxWorker = () => {
    if (workerStarted) return;
    workerStarted = true;
    const timer = setInterval(wakeNotificationOutbox, POLL_INTERVAL_MS);
    timer.unref();
    wakeNotificationOutbox();
};
