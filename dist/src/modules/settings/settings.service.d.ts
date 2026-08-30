export declare const settingsService: {
    getAllSettings: () => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getSettingByKey: (key: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    } | null>;
    setSetting: (key: string, value: unknown, description?: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }>;
    deleteSetting: (key: string) => Promise<boolean>;
};
//# sourceMappingURL=settings.service.d.ts.map