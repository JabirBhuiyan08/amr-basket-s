export declare const helpService: {
    createHelpRequest: (input: {
        userId: string;
        subject: string;
        message: string;
        phoneNumber?: string | undefined;
        productName?: string | undefined;
        productId?: string | undefined;
        userName?: string | undefined;
        address?: string | undefined;
    }) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").HelpStatus;
        subject: string;
        message: string;
        phoneNumber: string | null;
        assignedTo: string | null;
        resolvedAt: Date | null;
    }>;
    getAllHelpRequests: () => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").HelpStatus;
        subject: string;
        message: string;
        phoneNumber: string | null;
        assignedTo: string | null;
        resolvedAt: Date | null;
    }[]>;
    getHelpRequestById: (id: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").HelpStatus;
        subject: string;
        message: string;
        phoneNumber: string | null;
        assignedTo: string | null;
        resolvedAt: Date | null;
    } | null>;
    updateHelpRequestStatus: (id: string, status: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        userId: string;
        status: import("../../../generated/prisma/enums").HelpStatus;
        subject: string;
        message: string;
        phoneNumber: string | null;
        assignedTo: string | null;
        resolvedAt: Date | null;
    }>;
};
//# sourceMappingURL=help.service.d.ts.map