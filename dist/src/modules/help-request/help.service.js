import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { emitAdminNotification } from "../../socket/socketManager";
const createPublicHelpRequest = async (input) => {
    if (!input.subject?.trim()) {
        throw new AppError(400, "Subject is required");
    }
    if (!input.message?.trim()) {
        throw new AppError(400, "Message is required");
    }
    const created = await prisma.helpRequest.create({
        data: {
            subject: input.subject.trim(),
            message: input.message.trim(),
            phoneNumber: input.phoneNumber?.trim() || null,
            status: "OPEN",
        },
    });
    emitAdminNotification({
        id: created.id,
        title: "New Help Request",
        message: `New help request: ${created.subject}`,
        type: "info",
    });
    return created;
};
const createHelpRequest = async (input) => {
    if (!input.subject?.trim()) {
        throw new AppError(400, "Subject is required");
    }
    if (!input.message?.trim()) {
        throw new AppError(400, "Message is required");
    }
    if (!input.userId) {
        throw new AppError(400, "User is required");
    }
    const created = await prisma.helpRequest.create({
        data: {
            userId: input.userId,
            subject: input.subject.trim(),
            message: input.message.trim(),
            phoneNumber: input.phoneNumber?.trim() || null,
            status: "OPEN",
        },
    });
    emitAdminNotification({
        id: created.id,
        title: "New Help Request",
        message: `New help request from user: ${created.subject}`,
        type: "info",
    });
    return created;
};
const getAllHelpRequests = async () => {
    return prisma.helpRequest.findMany({
        orderBy: { createdAt: "desc" },
    });
};
const getHelpRequestById = async (id) => {
    return prisma.helpRequest.findUnique({ where: { id } });
};
const updateHelpRequestStatus = async (id, status) => {
    const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
    if (!validStatuses.includes(status)) {
        throw new AppError(400, "Invalid help request status");
    }
    const existing = await prisma.helpRequest.findUnique({ where: { id } });
    if (!existing) {
        throw new AppError(404, "Help request not found");
    }
    const updated = await prisma.helpRequest.update({
        where: { id },
        data: {
            status: status,
            resolvedAt: status === "RESOLVED" || status === "CLOSED" ? new Date() : null,
        },
    });
    emitAdminNotification({
        id: updated.id,
        title: "Help Request Updated",
        message: `Help request status changed to ${status}`,
        type: "success",
    });
    return updated;
};
export const helpService = {
    createPublicHelpRequest,
    createHelpRequest,
    getAllHelpRequests,
    getHelpRequestById,
    updateHelpRequestStatus,
};
//# sourceMappingURL=help.service.js.map