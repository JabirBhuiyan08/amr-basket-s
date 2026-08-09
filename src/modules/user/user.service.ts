import { prisma } from '../../lib/prisma';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string | null;
  image?: string | null;
}

const updateProfile = async (userId: string, data: UpdateProfileData) => {
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

const updateUser = async (userId: string, data: UpdateProfileData) => {
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
      status: true,
    },
  });
};

export interface ListUsersParams {
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

const listUsers = async (params: ListUsersParams) => {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
  const skip = (page - 1) * limit;
  const search = (params.search || '').trim();

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
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
  updateUser,
  listUsers,
};
