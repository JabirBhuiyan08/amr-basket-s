import { prisma } from '../../lib/prisma';
const updateProfile = async (userId, data) => {
    return prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
        },
    });
};
const listUsers = async (params) => {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
    const skip = (page - 1) * limit;
    const search = (params.search || '').trim();
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {};
    const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
                status: true,
                createdAt: true,
            },
        }),
    ]);
    return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
export const userService = {
    updateProfile,
    listUsers,
};
//# sourceMappingURL=user.service.js.map