import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

const getAllSettings = async () => {
    return prisma.setting.findMany({
        orderBy: { key: "asc" },
    });
};

const getSettingByKey = async (key: string) => {
    return prisma.setting.findUnique({ where: { key } });
};

const setSetting = async (key: string, value: unknown, description?: string) => {
    if (!key || !key.trim()) {
        throw new AppError(400, "Setting key is required");
    }

    const normalizedKey = key.trim();

    const existing = await prisma.setting.findUnique({ where: { key: normalizedKey } });

    if (existing) {
        return prisma.setting.update({
            where: { key: normalizedKey },
            data: {
                value: value as any,
                description: description ?? existing.description ?? null,
            },
        });
    }

    return prisma.setting.create({
        data: {
            key: normalizedKey,
            value: value as any,
            description: description ?? null,
        },
    });
};

const deleteSetting = async (key: string) => {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (!existing) {
        return false;
    }

    await prisma.setting.delete({ where: { key } });
    return true;
};

export const settingsService = {
    getAllSettings,
    getSettingByKey,
    setSetting,
    deleteSetting,
};
