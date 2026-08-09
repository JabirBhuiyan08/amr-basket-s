export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string | null;
    image?: string | null;
}
export interface ListUsersParams {
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}
export declare const userService: {
    updateProfile: (userId: string, data: UpdateProfileData) => Promise<{
        name: string;
        id: string;
        image: string | null;
        email: string;
        role: string | null;
        phone: string | null;
    }>;
    listUsers: (params: ListUsersParams) => Promise<{
        users: {
            name: string;
            createdAt: Date;
            id: string;
            status: string | null;
            image: string | null;
            email: string;
            role: string | null;
            phone: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map