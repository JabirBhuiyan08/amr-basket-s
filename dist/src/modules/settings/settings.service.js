import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
const getAllSettings = async () => {
    return prisma.setting.findMany({
        orderBy: { key: "asc" },
    });
};
const getSettingByKey = async (key) => {
    return prisma.setting.findUnique({ where: { key } });
};
const setSetting = async (key, value, description) => {
    if (!key || !key.trim()) {
        throw new AppError(400, "Setting key is required");
    }
    const normalizedKey = key.trim();
    const existing = await prisma.setting.findUnique({ where: { key: normalizedKey } });
    if (existing) {
        return prisma.setting.update({
            where: { key: normalizedKey },
            data: {
                value: value,
                description: description ?? existing.description ?? null,
            },
        });
    }
    return prisma.setting.create({
        data: {
            key: normalizedKey,
            value: value,
            description: description ?? null,
        },
    });
};
const deleteSetting = async (key) => {
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
//# sourceMappingURL=settings.service.js.map