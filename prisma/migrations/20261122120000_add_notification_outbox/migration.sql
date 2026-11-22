CREATE TABLE "notification_outbox" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedUntil" TIMESTAMP(3),
    "lastError" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notification_outbox_status_nextAttemptAt_idx"
ON "notification_outbox"("status", "nextAttemptAt");

CREATE INDEX "notification_outbox_status_lockedUntil_idx"
ON "notification_outbox"("status", "lockedUntil");

CREATE INDEX "notification_outbox_sentAt_idx"
ON "notification_outbox"("sentAt");
